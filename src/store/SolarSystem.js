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
    ADD_SYSTEM(state, system) {
      state.data.push(system);
    },
  },
  actions: {
    async fetchSystemData({ commit, state }, { systemId }) {
      const inData = state.data.find(a => a.system_id === systemId);
      if (inData) {
        return inData;
      }
      try {
        commit('SET_IS_LOADING');
        const { data } = await api.get(`universe/systems/${systemId}`);
        commit('ADD_SYSTEM', data);
        return data;
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        return null;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
    async fetchSystemsData({ dispatch, commit }, { systemIds }) {
      try {
        commit('SET_IS_LOADING');
        const totalFetches = Math.floor((systemIds.length - 1) / 100) + 1;
        for (let i = 0; i < totalFetches; i += 1) {
          const roundTypes = systemIds.slice(i * 100, ((i + 1) * 100));
          const requests = roundTypes.map(systemId => dispatch('fetchSystemData', {
            systemId,
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
