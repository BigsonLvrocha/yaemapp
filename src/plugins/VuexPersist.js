import localforage from 'localforage';
import VuexPersist from 'vuex-persist';

export default new VuexPersist({
  storage: localforage,
  reducer: state => ({
    Regions: {
      data: state.Regions.data,
    },
    RegionHistory: {
      data: state.RegionHistory.data,
    },
    Types: {
      data: state.Types.data,
    },
  }),
  filter: ({ type }) => {
    if (type.match(/IS_LOADING$/)) {
      return false;
    }
    return true;
  },
  asyncStorage: true,
  strictMode: true,
});
