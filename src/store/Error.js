export default {
  state() {
    return {
      errors: [],
    };
  },
  mutations: {
    ADD_ERROR(state, { error }) {
      state.errors.push(error);
    },
  },
};
