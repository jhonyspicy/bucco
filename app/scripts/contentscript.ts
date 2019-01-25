'use strict';

import * as $ from 'jquery';
import Hall from './lib/Hall/Hall';
import Machine from './lib/Machine/Machine';
import Equipment from "./lib/Equipment/Equipment";
import {interfaces} from "./lib/Includes/Util";
import Base = interfaces.Base;

run()

function run () {
  const $html = $('html');
  let model: Base;

  if (0 < $('[alt="パ' + 'チ' + 'ン' + 'コ設' + '置' + '機' + '種' + '一覧"]').length) {
    // ホールの機種一覧のページ
    model = new Hall();
  } else if (0 < $('ded' + 'ama' + '_table').length) {
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

