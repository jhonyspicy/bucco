'use strict';

import * as $ from 'jquery';
import Hall from './lib/Hall/Hall';
import Machine from './lib/Machine/Machine';
import Equipment from "./lib/Equipment/Equipment";
import {Base} from "./lib/Includes/Util";

run()

function run () {
  const $html = $('html');
  let model: Base;

  if (0 < $('[alt="パチンコ設置機種一覧"]').length) {
    // ホールの機種一覧のページ
    model = new Hall();
  } else if (true) {
    // 特定機種の台番号一覧ページ
    model = new Equipment();
  } else if (true) {
    // 機種の詳細ページ
    model = new Machine();
  }

  if (model) {
    model.append();
    model.convertHtml($html);
  }
}

