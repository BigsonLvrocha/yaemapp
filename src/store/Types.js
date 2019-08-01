import * as AsyncMixin from '@/store/mixin/Async';
import api from '@/services/api';

export default {
  namespaced: true,
  state() {
    return {
      ...AsyncMixin.initState(),
      data: [],
      blacklist: [],
      idsLoading: [],
    };
  },
  getters: {
    ...AsyncMixin.Getters,
  },
  mutations: {
    ...AsyncMixin.Mutations,
    ADD_TYPE(state, { type }) {
      state.data.push(type);
    },
    ADD_BLACKLIST_TYPE_ID(state, { typeId }) {
      state.blacklist.push(typeId);
    },
    ADD_IDS_LOADING(state, loading) {
      state.idsLoading.push(...loading);
    },
    REMOVE_IDS_LOADING(state, loading) {
      state.idsLoading = state.idsLoading.filter(item => loading.findIndex(a => a === item) === -1);
    },
  },
  actions: {
    ...AsyncMixin.Actions,
    async fetchTypeIdData({ commit, state }, { typeId, persist = false }) {
      const typeInState = state.data.find(item => item.type_id === typeId);
      if (typeInState !== undefined) {
        return typeInState;
      }
      try {
        commit('SET_IS_LOADING');
        const { data: type } = await api.get(`/universe/types/${typeId}`);
        commit('ADD_TYPE', { type });
        return type;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          commit('ADD_BLACKLIST_TYPE', { typeId }, { root: true });
        } else {
          commit('ADD_ERROR', { error }, { root: true });
        }
        return null;
      } finally {
        if (persist) {
          commit('SAVE_STORE', null, { root: true });
        }
        commit('CLEAR_IS_LOADING');
      }
    },
    async fetchTypeIdArrayData({ commit, dispatch, state }, { typeIds }) {
      const newTypesIds = typeIds.filter(
        typeId => state.idsLoading.findIndex(id => id === typeId) === -1,
      );
      if (newTypesIds.length === 0) {
        return;
      }
      try {
        commit('SET_IS_LOADING');
        commit('ADD_IDS_LOADING', newTypesIds);
        if (typeIds.length === 0) {
          return;
        }
        const totalFetches = Math.floor((typeIds.length - 1) / 100) + 1;
        for (let i = 0; i < totalFetches; i += 1) {
          const roundTypes = typeIds.slice(i * 100, ((i + 1) * 100));
          const requests = roundTypes.map(typeId => dispatch('fetchTypeIdData', {
            typeId,
            persist: false,
          }));
          // eslint-disable-next-line no-await-in-loop
          await Promise.all(requests);
        }
        commit('SAVE_STORE', null, { root: true });
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      } finally {
        commit('CLEAR_IS_LOADING');
        commit('REMOVE_IDS_LOADING', newTypesIds);
      }
    },
  },
};
