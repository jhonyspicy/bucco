import Vue from 'vue';
import Vuex from 'vuex';
import Counter from './modules/Counter';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 1
  },
  getters: {},
  mutations: {
    increment(state) {
      // 状態を変更する
      state.count++;
    }
  },
  modules: {
    Counter,
  }
});
