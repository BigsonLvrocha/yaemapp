export function initState() {
  return {
    loading: 0,
  };
}

export const Mutations = {
  SET_IS_LOADING(state) {
    state.loading += 1;
  },
  CLEAR_IS_LOADING(state) {
    state.loading -= 1;
  },
};


export const Getters = {
  isLoading({ loading }) {
    return loading > 0;
  },
};


export const Actions = {
  async sendRequest({ commit }, {
    callback,
    errorCallback = (err) => { throw err; },
  }) {
    try {
      commit('SET_IS_LOADING');
      const response = await callback();
      return response;
    } catch (err) {
      commit('Error/ADD_ERROR', { root: true }, err);
      return errorCallback(err);
    } finally {
      commit('CLEAR_IS_LOADING');
    }
  },
};
