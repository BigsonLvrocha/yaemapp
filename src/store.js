import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Error from './store/Error';
import Regions from './store/Regions';
import RegionHistory from './store/RegionHistory';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Error,
    Regions,
    RegionHistory,
  },
  state: {

  },
  mutations: {

  },
  actions: {
    async init({ dispatch, getters }) {
      if (getters['Regions/isEmpty']) {
        dispatch('Regions/fetchRegionData');
      }
    },
  },
  plugins: [createPersistedState()],
});
