import Vue from 'vue';
import Vuex from 'vuex';
import Counter from './modules/Counter';
import MsNewPort from './modules/MsNewPort';
import {bucco, functions} from '../includes/util';
import Side = bucco.Side;
import * as _ from 'lodash';

Vue.use(Vuex);

/**
 * @url https://vuex.vuejs.org/ja/guide/getters.html
 * 店舗ごとに違う座席番号をどうさせるか検討中・・・
 *
 * 基礎から学ぶVue.js(P263)を参考に
 * 混乱しないように下記のルールで実装します。
 * ●値を更新するときは
 * 呼び出しはdispatchに統一する。
 * (本当はcommitからでも呼べる。)
 * なので下記の流れで処理がリレーしていきます。
 * dispatch -> action -> commit -> mutation -> stateを更新！
 *
 * ●値を取得するときは
 * getterに統一する。
 * (直接stateを参照することも出来る)
 */
export default new Vuex.Store({
  state: {
    hallName: '',
    supportHalls: [
      {
        hallName: 'Ｍ’ｓニューポート',
        className: 'MsNewPort',
      }
    ],
    machineData: [],
  },
  getters: {
    byMachineName: (state, getters) => (name: string) => {
      return state.machineData.find((machine: any) => machine.name === name);
    },
    /**
     * 表示中のホールの名前を取得
     * @param state
     */
    hallModuleName: (state, getters): string => {
      const filtered = state.supportHalls.filter((hall: any) => {
        return hall.hallName === state.hallName;
      });

      if (0 < filtered.length) {
        return filtered.shift().className;
      } else {
        return '';
      }
    },
    /**
     * 表示中のホールがサポート対象か
     * @param state
     * @param getters
     */
    isSupportHall: (state, getters, rootState, rootGetters): boolean => {
      return !!getters.hallModuleName;
    },
    /**
     * 台がどの島の何番目にあるのか。
     * @param state
     * @param getters
     */
    position: (state, getters) => (id: number) => {
      if (!getters.isSupportHall) {
        return {
          island: 0,
          side: Side.Left,
          order: 0,
        };
      }

      const hallModuleName = getters.hallModuleName;
      const islandInfos = state[hallModuleName].islandInfos;

      for (let index in islandInfos) {
        const islandInfo = islandInfos[index];
        for (let key in Side) {
          const side = Side[key]; // left or right
          const order = islandInfo[side].indexOf(id);
          if (order !== -1) {
            return {
              island: index,
              side: side,
              order: order,
            };
          }
        }
      }

      return {
        island: 0,
        side: Side.Left,
        order: 0,
      };
    },

    /**
     * 台番号のリストを元に獲得枚数の合計を算出
     *
     * @param state
     * @param getters
     */
    totalInfo: (state, getters) => (machineIdList: number[] = []): any => {
      if (_.isEmpty(state.machineData)) {
        return [
          {nowCoin  : 0, operation: 0,},
          {nowCoin  : 0, operation: 0,},
          {nowCoin  : 0, operation: 0,},
          {nowCoin  : 0, operation: 0,},
          {nowCoin  : 0, operation: 0,},
          {nowCoin  : 0, operation: 0,},
          {nowCoin  : 0, operation: 0,},
          {nowCoin  : 0, operation: 0,},
        ];
      }

      let machineData: any[];

      if (_.isEmpty(machineIdList)) {
        machineData = state.machineData.slice();
      } else {
        machineData = state.machineData.filter((data: any, index: number) => {
          return -1 !== machineIdList.indexOf(index)
        });
      }

      return machineData.reduce((data: any[], currentValue: any[]): any[] => {
        const result: any[] = [];

        data.forEach((value, index, array) => {
          result.push({
            nowCoin  : currentValue[index].nowCoin + value.nowCoin,
            operation: currentValue[index].operation + value.operation
          });
        });

        return result;
      });
    }
  },
  /**
   * @url https://vuex.vuejs.org/ja/guide/mutations.html
   * @example store.commit('foo', payload)
   */
  mutations: {
    /**
     * 現在表示中のホール名を更新する
     * @param state
     * @param payload
     */
    hallName(state, payload) {
      state.hallName = payload.hallName;
    },
    /**
     * 日別の台の情報を追加していく
     * @param state
     * @param payload
     */
    machineData(state, payload) {
      state.machineData[payload.id] = payload.data;
      state.machineData = state.machineData.slice(); // 複製
    }
  },
  actions: {
    hallName({commit}, payload) {
      return new Promise(((resolve, reject) => {
        commit('hallName', payload);
        resolve();
      }));
    },
    machineData({commit}, payload) {
      return new Promise(((resolve, reject) => {
        commit('machineData', payload);
        resolve();
      }));
    }
  },
  modules: {
    // 店舗別の席番号とかモジュールに分けたほうがやりやすいか・・・？ 検討中
    Counter,
    MsNewPort,
  }
});
