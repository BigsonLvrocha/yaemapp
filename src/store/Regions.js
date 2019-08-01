import * as AsyncMixins from './mixin/Async';
import EsiService from '@/services/api';

export default {
  namespaced: true,
  state() {
    return {
      ...AsyncMixins.initState(),
      data: [],
    };
  },
  getters: {
    ...AsyncMixins.Getters,
    isEmpty({ data }) {
      return data.length === 0;
    },
  },
  mutations: {
    ...AsyncMixins.Mutations,
    SET_DATA(state, { data }) {
      state.data = data;
    },
    CLEAR_DATA(state) {
      state.data = [];
    },
  },
  actions: {
    ...AsyncMixins.Actions,
    async fetchRegionIds({ commit }) {
      try {
        commit('SET_IS_LOADING');
        const { data: ids } = await EsiService.get('/universe/regions');
        return ids;
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
    async fetchRegionData({ dispatch, commit }) {
      try {
        commit('SET_IS_LOADING');
        const ids = await dispatch('fetchRegionIds');
        const responses = await Promise.all(ids.map(id => EsiService.get(`/universe/regions/${id}`)));
        const data = responses.map(item => item.data);
        commit('SET_DATA', { data });
        commit('SAVE_STORE', null, { root: true });
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
  },
};
