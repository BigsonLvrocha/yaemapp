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
    ADD_CONSTELLATION(state, constellation) {
      state.data.push(constellation);
      state.data.sort((a, b) => a.constellation_id - b.constellation_id);
    },
  },
  actions: {
    async fetchConstellationData({ commit, state }, { constellationId }) {
      const inData = state.data.find(a => a.constellation_id === constellationId);
      if (inData) {
        return inData;
      }
      try {
        commit('SET_IS_LOADING');
        const { data } = await api.get(`universe/constellation/${constellationId}`);
        commit('ADD_CONSTELLATION', data);
        return data;
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        return null;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
    async fetchConstellationsData({ dispatch, commit }, { constellationIds }) {
      try {
        commit('SET_IS_LOADING');
        const totalFetches = Math.floor((constellationIds.length - 1) / 100) + 1;
        for (let i = 0; i < totalFetches; i += 1) {
          const roundTypes = constellationIds.slice(i * 100, ((i + 1) * 100));
          const requests = roundTypes.map(constellationId => dispatch('fetchConstellationData', {
            constellationId,
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
