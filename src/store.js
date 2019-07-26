import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Error from './store/Error';
import Regions from './store/Regions';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Error,
    Regions,
  },
  state: {

  },
  mutations: {

  },
  actions: {
    async init({ dispatch, getters }) {
      if (getters['Regions/isEmpty']) {
        dispatch('Regions/fetchData');
      }
    },
  },
  plugins: [createPersistedState()],
});
