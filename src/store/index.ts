import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const plugins = [
  createPersistedState({
    key: 'do_not_forget_to_define_your_own_key',
    paths: [],
    filter: () => true,
  }),
];

export const store = createStore({
  plugins,

  state: {},
  mutations: {},
  actions: {},
  modules: {},
});
