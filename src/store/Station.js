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
    ADD_STATION(state, station) {
      state.data.push(station);
    },
  },
  actions: {
    async fetchStationData({ commit, state }, { stationId, persist = true }) {
      const inData = state.data.find(a => a.station_id === stationId);
      if (inData) {
        return inData;
      }
      try {
        commit('SET_IS_LOADING');
        const { data } = await api.get(`universe/stations/${stationId}`);
        commit('ADD_STATION', data);
        if (persist) {
          commit('SAVE_STORE', null, { root: true });
        }
        return data;
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        return null;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
    async fetchStationsData({ dispatch, commit }, { stationIds }) {
      try {
        commit('SET_IS_LOADING');
        const totalFetches = Math.floor((stationIds.length - 1) / 100) + 1;
        for (let i = 0; i < totalFetches; i += 1) {
          const roundTypes = stationIds.slice(i * 100, ((i + 1) * 100));
          const requests = roundTypes.map(stationId => dispatch('fetchStationData', {
            stationId,
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
      }
    },
  },
};
