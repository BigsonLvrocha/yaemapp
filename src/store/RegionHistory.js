import _ from 'lodash';
import EsiService from '@/services/api';
import * as AsyncMixins from './mixin/Async';
import { getItemHistoryDetail } from '@/util/ItemHistory';

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
          return types;
        }
        const pages = _.range(2, totalPages + 1);
        const requests = pages.map(page => EsiService.get(`/markets/${regionId}/types`, {
          params: {
            page,
          },
        }));
        const responses = await Promise.all(requests);
        return types.concat(...responses.map(resp => resp.data));
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
    async fetchRegionHistoryData({ dispatch, commit }, { regionId }) {
      try {
        commit('SET_IS_LOADING');
        const types = await dispatch('fetchRegionHistoryTypes', { regionId });
        if (types.length === 0) {
          return;
        }
        const regionTypesHistoryData = [];
        const totalFetches = Math.floor((types.length - 1) / 200) + 1;
        for (let i = 0; i < totalFetches; i += 1) {
          const roundTypes = types.slice(i * 200, ((i + 1) * 200));
          const requests = roundTypes.map(typeId => dispatch('fetchItemHistoryData', {
            regionId, typeId,
          }));
          // eslint-disable-next-line no-await-in-loop
          const results = await Promise.all(requests);
          regionTypesHistoryData.push(...results);
        }
        commit('SET_REGION_TYPES', { types: regionTypesHistoryData.filter(item => item !== null && item.hist7.averageIskVolume > 100000000), regionId });
      } catch (error) {
        commit('ADD_ERROR', { error }, { root: true });
        throw error;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
    async fetchItemHistoryData({ commit }, { regionId, typeId }) {
      try {
        commit('SET_IS_LOADING');
        const { data } = await EsiService.get(`/markets/${regionId}/history`, {
          params: {
            type_id: typeId,
          },
        });
        const details = getItemHistoryDetail(data);
        return {
          typeId,
          ...details,
        };
      } catch (error) {
        if (error.response.status === 404) {
          commit('Types/ADD_BLACKLIST_TYPE_ID', { typeId });
        } else {
          commit('ADD_ERROR', { error }, { root: true });
        }
        return null;
      } finally {
        commit('CLEAR_IS_LOADING');
      }
    },
  },
};
