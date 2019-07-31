export default {
  namespaced: true,
  state() {
    return {
      regionId: null,
      constellationId: null,
      systemId: null,
      stationId: null,
    };
  },
  getters: {
    region(state, getters, rootState) {
      return rootState.Regions.data.find(region => region.region_id === state.regionId);
    },
    regionConstellations(state, getters, rootState) {
      return rootState.Constellation.data.filter(
        constellation => constellation.region_id === state.regionId,
      );
    },
    constellation(state, getters, rootState) {
      return rootState.Constellation.data.find(
        constellation => constellation.constellation_id === state.constellationId,
      );
    },
    constellationSystems(state, getters, rootState) {
      return rootState.SolarSystem.data.filter(
        system => system.constellation_id === state.constellationId,
      );
    },
  },
  mutations: {
    SET_REGION(state, regionId) {
      state.regionId = regionId;
      state.constellationId = null;
      state.solarSystemId = null;
      state.stationId = null;
    },
    SET_CONSTELLATION(state, constellationId) {
      state.constellationId = constellationId;
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
      state.constellationId = null;
      state.solarSystemId = null;
      state.stationId = null;
    },
  },
  actions: {
    async setRegionId({ dispatch, commit, rootState }, { regionId }) {
      const regionData = rootState.Regions.data.find(region => region.region_id === regionId);
      if (!regionData) {
        const error = new Error('region not found');
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      }
      commit('SET_REGION', regionId);
      dispatch('Constellation/fetchConstellationsData', {
        constellationIds: regionData.constellations,
      }, {
        root: true,
      });
    },
    async setConstellationId({ dispatch, commit, rootState }, { constellationId }) {
      const constellationData = rootState.Constellation.data.find(
        constellation => constellation.constellation_id === constellationId,
      );
      if (!constellationData) {
        const error = new Error('region not found');
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      }
      commit('SET_CONSTELLATION', constellationId);
      dispatch('SolarSystem/fetchSystemsData', {
        systemIds: constellationData.systems,
      }, {
        root: true,
      });
    },
  },
};
