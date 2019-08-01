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
      blacklist: state.Types.blacklist,
    },
    Constellation: {
      data: state.Constellation.data,
    },
    SolarSystem: {
      data: state.SolarSystem.data,
    },
    Station: {
      data: state.Station.data,
    },
  }),
  filter: ({ type }) => type === 'SAVE_STORE',
  asyncStorage: true,
  strictMode: true,
});
