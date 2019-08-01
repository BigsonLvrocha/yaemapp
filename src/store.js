import Vue from 'vue';
import Vuex from 'vuex';
import { merge } from 'lodash';
import EventBus from '@/components/EventBus';
import Persistence from '@/plugins/VuexPersist';
import modules from './store/index';

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
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
        state.storeReady = true;
        EventBus.$emit('storage-ready');
      }
    },
    SAVE_STORE() {
      // this should be called to save the store
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
