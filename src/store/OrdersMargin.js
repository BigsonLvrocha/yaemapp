import * as AsyncMixin from '@/store/mixin/Async';
import api from '@/services/api';

export default {
  namespaced: true,
  state() {
    return {
      ...AsyncMixin.initState(),
      data: [],
      idsLoading: [],
    };
  },
  getters: {
    ...AsyncMixin.Getters,
  },
  mutations: {
    ...AsyncMixin.Mutations,
    ADD_MARGIN(state, marginData) {
      const index = state.data.findIndex(
        item => item.typeId === marginData.typeId && item.stationId === marginData.stationId,
      );
      if (index === -1) {
        state.data.push(marginData);
      }
      state.data.splice(index, 1, marginData);
    },
    ADD_IDS_LOADING(state, loading) {
      state.idsLoading.push(...loading);
    },
    REMOVE_IDS_LOADING(state, loading) {
      state.idsLoading = state.idsLoading.filter(item => loading.findIndex(a => a === item) === -1);
    },
    CLEAR_MARGINS_TO_LOAD(state) {
      state.data = [];
      state.loading = [];
    },
  },
  actions: {
    ...AsyncMixin.Actions,
    async fetchMarginData({ commit }, { typeId, stationId, regionId }) {
      try {
        const { data } = await api.get(`/markets/${regionId}/orders`, {
          params: {
            type_id: typeId,
          },
        });
        const stationOrders = data.filter(order => order.location_id === stationId);
        const buyOrders = stationOrders.filter(order => order.is_buy_order);
        const sellOrders = stationOrders.filter(order => !order.is_buy_order);
        const maxBuyOrder = Math.max(...buyOrders.map(order => order.price));
        const minSellOrder = Math.min(...sellOrders.map(order => order.price));
        const margin = minSellOrder - maxBuyOrder;
        const marginPct = margin / maxBuyOrder;
        const marginData = {
          typeId,
          stationId,
          maxBuyOrder,
          minSellOrder,
          margin,
          marginPct,
        };
        commit('ADD_MARGIN', marginData);
        return marginData;
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        return null;
      }
    },
    async fetchMarginsData({ dispatch, commit }, {
      typeIds, stationId, regionId,
    }) {
      const newTypesIds = await dispatch('addIdsLoading', { typeIds });
      if (newTypesIds.length === 0) {
        return;
      }
      try {
        const requests = newTypesIds.map(typeId => dispatch('fetchMarginData', {
          typeId,
          stationId,
          regionId,
        }));
        await Promise.all(requests);
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      } finally {
        commit('REMOVE_IDS_LOADING', newTypesIds);
      }
    },
    async setMarginsToLoad({ dispatch }, { typeIds }) {
      await dispatch('addIdsLoading', { typeIds });
    },
    async resolveMarginsToLoad({ commit, state, dispatch }, { stationId, regionId }) {
      if (state.idsLoading === 0) {
        return;
      }
      try {
        const requests = state.idsLoading.map(typeId => dispatch('fetchMarginData', {
          typeId,
          stationId,
          regionId,
        }));
        await Promise.all(requests);
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      } finally {
        commit('REMOVE_IDS_LOADING', state.idsLoading);
      }
    },
    async clearMarginsToLoad({ commit }) {
      commit('CLEAR_MARGINS_TO_LOAD');
    },
    async addIdsLoading({ commit, state }, { typeIds }) {
      const newTypesIds = typeIds.filter(
        typeId => state.idsLoading.findIndex(id => id === typeId) === -1,
      );
      commit('ADD_IDS_LOADING', newTypesIds);
      return newTypesIds;
    },
  },
};
