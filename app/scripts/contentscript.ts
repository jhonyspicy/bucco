'use strict';

import Vue from 'vue';
import Hall from './src/components/Hall';
import Equipment from './src/components/Equipment';
import Machine from './src/components/Machine';
import {functions} from './src/includes/util';
import store from './src/store';
import isHallPage = functions.isHallPage;
import isEquipmentPage = functions.isEquipmentPage;
import isMachinePage = functions.isMachinePage;

const $app = document.createElement('div');
$app.setAttribute('id', 'app');
let template = '';

/*
#app 要素をDOMに追加する
 */
if (isHallPage()) {
  /*
  設置機種一覧
   */
  const $landmark = document.getElementById('20slot');
  const $target   = $landmark && $landmark.closest('table.slot');
  if ($target && $target.parentElement !== null) {
    $target.parentElement.insertBefore($app, $target);
  }

  template = '<div id="ultra7"><Hall /></div>';
} else if (isEquipmentPage()) {
  /*
  大当り一覧
   */
  const $target = document.getElementById('dedama_table');
  if ($target && $target.parentElement !== null) {
    $target.parentElement.insertBefore($app, $target);
  }

  template = '<div id="ultra7"><Equipment /></div>';
} else if (isMachinePage()) {
  /*
  出玉詳細
   */
  const $target = document.getElementById('dedama_detail_table');
  if ($target && $target.parentElement !== null) {
    $target.parentElement.insertBefore($app, $target);
  }

  template = '<div id="ultra7"><Machine /></div>';
}

if (isHallPage() || isEquipmentPage() || isMachinePage()) {
  /*
  対象ページじゃなかったら何もしない
   */
  new Vue({
    store,
    el: '#app',
    template,
    data: {},
    components: {
      Hall,
      Equipment,
      Machine,
    },
    methods: {}
  });
}
