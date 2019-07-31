import * as AsyncMixin from '@/store/mixin/Async';
import api from '@/services/api';

export default {
  namespaced: true,
  state() {
    return {
      ...AsyncMixin.initState(),
      data: [],
    };
  },
  getters: {
    ...AsyncMixin.Getters,
  },
  mutations: {
    ...AsyncMixin.Mutations,
    ADD_CONSTELATION(state, constelation) {
      state.data.push(constelation);
      state.data.sort((a, b) => a.constelation_id - b.constelation_id);
    },
  },
  actions: {
    async fetchConstelationData({ commit, state }, { constelationId }) {
      const inData = state.data.find(a => a.constelation_id === constelationId);
      if (inData) {
        return inData;
      }
      try {
        commit('SET_IS_LOADING');
        const { data } = await api.get(`universe/constelation/${constelationId}`);
        commit('ADD_CONSTELATION', data);
        return data;
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        return null;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
    async fetchConstelationsData({ dispatch, commit }, { constelationIds }) {
      try {
        commit('SET_IS_LOADING');
        const totalFetches = Math.floor((constelationIds.length - 1) / 100) + 1;
        for (let i = 0; i < totalFetches; i += 1) {
          const roundTypes = constelationIds.slice(i * 100, ((i + 1) * 100));
          const requests = roundTypes.map(constelationId => dispatch('fetchConstelationData', {
            constelationId,
          }));
          // eslint-disable-next-line no-await-in-loop
          await Promise.all(requests);
        }
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
  },
};
