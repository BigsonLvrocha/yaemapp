export default {
  namespaced: true,
  state() {
    return {
      regionId: null,
      constelationId: null,
      systemId: null,
      stationId: null,
    };
  },
  getters: {
    region(state, getters, rootState) {
      return rootState.Regions.data.find(region => region.region_id === state.regionId);
    },
  },
  mutations: {
    SET_REGION(state, regionId) {
      state.regionId = regionId;
      state.constelationId = null;
      state.solarSystemId = null;
      state.stationId = null;
    },
    SET_CONSTELATION(state, constelationId) {
      state.constelationId = constelationId;
      state.solarSystemId = null;
      state.stationId = null;
    },
    SET_SOLAR_SYSTEM(state, solarSystemId) {
      state.solarSystemId = solarSystemId;
      state.stationId = null;
    },
    SET_STATION(state, stationId) {
      state.stationId = stationId;
    },
    CLEAR(state) {
      state.regionId = null;
      state.constelationId = null;
      state.solarSystemId = null;
      state.stationId = null;
    },
  },
  actions: {
    async setRegionId({ dispatch, commit, rootState }, { regionId }) {
      const regionData = rootState.Region.data.find(item => item.region_id === regionId);
      if (!regionData) {
        const error = new Error('region not found');
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      }
      commit('SET_STATION', regionId);
      dispatch('Contelation/fetchConstelationsData', { constelationsId: regionData.constelations });
    },
  },
};
