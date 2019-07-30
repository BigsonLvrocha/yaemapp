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
    ADD_TYPE(state, { type }) {
      state.data.push(type);
    },
  },
  actions: {
    ...AsyncMixin.Actions,
    async fetchTypeIdData({ commit, state }, { typeId }) {
      const typeInState = state.data.find(item => item.type_id === typeId);
      if (typeInState !== undefined) {
        return typeInState;
      }
      try {
        commit('SET_IS_LOADING');
        const { data: type } = await api.get(`/universe/types/${typeId}`);
        commit('ADD_TYPE', { type });
        return type;
      } catch (e) {
        commit('ADD_ERROR', e, { root: true });
        return null;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
    async fetchTypeIdArrayData({ commit, dispatch }, { typeIds }) {
      try {
        console.log(`fetching data for ${typeIds.length} types`);
        if (typeIds.length > 0) {
          return;
        }
        const totalFetches = Math.floor((typeIds.length - 1) / 200) + 1;
        for (let i = 0; i < totalFetches; i += 1) {
          const roundTypes = typeIds.slice(i * 200, ((i + 1) * 200));
          const requests = roundTypes.map(typeId => dispatch('fetchTypeIdData', {
            typeId,
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
