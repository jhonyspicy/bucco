import Vue from 'vue';
import Vuex from 'vuex';
import Counter from './modules/Counter';

Vue.use(Vuex);

/**
 * @url: https://vuex.vuejs.org/ja/guide/getters.html
 * 店舗ごとに違う座席番号をどうさせるか検討中・・・
 */
export default new Vuex.Store({
  state: {
    count: 1,
    machineData: [],
  },
  getters: {
    getByMachineName: (state, getters) => (name: string) => {
      return state.machineData.find((machine: any) => machine.name === name);
    }
  },
  mutations: {
    increment(state) {
      // 状態を変更する
      state.count++;
    }
  },
  modules: {
    // 店舗別の席番号とかモジュールに分けたほうがやりやすいか・・・？ 検討中
    Counter,
  }
});
