import Vue from 'vue';
import Vuex from 'vuex';
import { merge } from 'lodash';
import EventBus from '@/components/EventBus';
import Persistence from '@/plugins/VuexPersist';
import Error from './store/Error';
import Regions from './store/Regions';
import RegionHistory from './store/RegionHistory';
import Types from './store/Types';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Error,
    Regions,
    RegionHistory,
    Types,
  },
  state: {
    storeReady: false,
  },
  mutations: {
    RESTORE_MUTATION(state, savedState) {
      const mergedState = merge({}, state, savedState || {});
      // eslint-disable-next-line
      for (const propertyName of Object.keys(mergedState)) {
        state[propertyName] = mergedState[propertyName];
      }
      if (!state.storeReady) {
        state.storeReady = false;
        EventBus.$emit('storage-ready');
      }
    },
  },
  actions: {
    async init({ dispatch }) {
      EventBus.$on('storage-ready', () => {
        EventBus.$off('storage-ready');
        dispatch('storeReady');
      });
    },
    async storeReady({ dispatch, getters }) {
      if (getters['Regions/isEmpty']) {
        dispatch('Regions/fetchRegionData');
      }
    },
  },
  plugins: [Persistence.plugin],
});
