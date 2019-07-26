import * as AsyncMixins from './mixin/Async';
import { fetchRegionData } from '@/services/esi';

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
    async fetchData({ dispatch, commit }) {
      const data = await dispatch('sendRequest', { callback: fetchRegionData });
      commit('SET_DATA', { data });
    },
  },
};
