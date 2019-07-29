import _ from 'lodash';
import EsiService from '@/services/api';
import * as AsyncMixins from './mixin/Async';

export default {
  namespaced: true,
  state() {
    return {
      ...AsyncMixins.initState(),
      data: [],
    };
  },
  getters: {
    ...AsyncMixins.Getters,
    isEmpty({ data }) {
      return data.length === 0;
    },
  },
  mutations: {
    ...AsyncMixins.Mutations,
    SET_REGION_TYPES(state, { types, regionId }) {
      const regionTypes = state.data.find(item => item.regionId === regionId);
      if (!regionTypes) {
        state.data.push({
          regionId,
          types,
          updatedAt: Date.now(),
        });
        return;
      }
      regionTypes.types = types;
      regionTypes.updatedAt = Date.now();
    },
    CLEAR_DATA(state) {
      state.data = [];
    },
  },
  actions: {
    ...AsyncMixins.Actions,
    async fetchRegionHistoryTypes({ commit }, { regionId }) {
      try {
        commit('SET_IS_LOADING');
        const response = await EsiService.get(`/markets/${regionId}/types`);
        const types = response.data.slice();
        const totalPages = Number.parseInt(response.headers['x-pages'], 10);
        if (!totalPages || totalPages < 2) {
          commit('SET_REGION_TYPES', { regionId, types });
          return;
        }
        const pages = _.range(2, totalPages + 1);
        const requests = pages.map(page => EsiService.get(`/markets/${regionId}/types`, {
          params: {
            page,
          },
        }));
        const responses = await Promise.all(requests);
        commit('SET_REGION_TYPES', {
          regionId,
          types: types.concat(...responses.map(resp => resp.data)),
        });
      } catch (err) {
        commit('ADD_ERROR', err, { root: true });
        throw err;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
  },
};
