'use strict';

import Vue from 'vue';
import Hall from './components/Hall';
import Equipment from './components/Equipment';
import Machine from './components/Machine';
import {functions} from './lib/Includes/Util';
import isHallPage = functions.isHallPage;
import isEquipmentPage = functions.isEquipmentPage;
import isMachinePage = functions.isMachinePage;

const $app = document.createElement('div');
$app.setAttribute('id', 'app');

/*
#app 要素をDOMに追加する
 */
if (isHallPage()) {
  /*
  設置機種一覧
   */
  const $landmark = document.getElementById('20slot') || document.createElement('div');
  const $target   = $landmark.closest('table.slot');
  if ($target !== null && $target.parentElement !== null) {
    $target.parentElement.insertBefore($app, $target);
  }
} else if (isEquipmentPage()) {
  /*
  大当り一覧
   */
  const $target = document.getElementById('dedama_table') || document.createElement('div');
  if ($target !== null && $target.parentElement !== null) {
    $target.parentElement.insertBefore($app, $target);
  }
} else if (isMachinePage()) {
  /*
  出玉詳細
   */
  const $target = document.getElementById('dedama_detail_table') || document.createElement('div');
  if ($target !== null && $target.parentElement !== null) {
    $target.parentElement.insertBefore($app, $target);
  }
}

if (isHallPage() || isEquipmentPage() || isMachinePage()) {
  /*
  対象ページじゃなかったら何もしない
   */
  new Vue({
    el: '#app',
    template: `
      <div>
        <Hall
         v-if="isHallPage()"
         v-bind:html="html"
         ></Hall>
        <Equipment v-if="isEquipmentPage()"></Equipment>
        <Machine v-if="isMachinePage()"></Machine>
      </div>
    `,
    data: {
      html: document.documentElement.innerHTML
    },
    components: {
      Hall,
      Equipment,
      Machine,
    },
    methods: {
      isHallPage,
      isEquipmentPage,
      isMachinePage,
    }
  });
}
