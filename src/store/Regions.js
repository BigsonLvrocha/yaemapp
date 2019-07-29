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
      } catch (err) {
        commit('ADD_ERROR', err, { root: true });
        throw err;
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
      } catch (err) {
        commit('ADD_ERROR', err, { root: true });
        throw err;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
  },
};
