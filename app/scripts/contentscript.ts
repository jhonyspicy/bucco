'use strict';

import * as $ from 'jquery';
import Hall from './lib/Hall/Hall';
import PtimeOmoro from './lib/Hall/PtimeOmoro';
import Machine from './lib/Machine/Machine';

run();

function run() {
  const hall: Hall = makeHall();

  if ($('#dedama_table').length === 0) {
    // ページが違う
    return;
  } else if (hall.isPachinko()) {
    // パチンコは何もしない
    return;
  }

  hall.$dom.insertAfter('#pankuzu');

  /*
  台数分実行
   */
  $('#ata0 .ind').each((i, elem) => {
    const $elem   = $(elem);
    const datHref = $elem.find('.det a').attr('href') || '';
    const hisHref = $elem.find('.his a').attr('href') || '';
    const number = parseInt($elem.find('.num').text());
    const machine = hall.makeMachine(number);
    const openDedamaDetail = setDetailParams.bind(null, machine);
    const tableHistoryClick = setHistoryParams.bind(null, machine);

    eval(datHref); // openDedamaDetail() を実行している。
    eval(hisHref); // tableHistoryClick() を実行している。

    machine.loadDetail();
  });
}

/**
 * Hall オブジェクトを作る
 */
function makeHall(): Hall {
  const hallName = $('#hall_name').text();

  if (PtimeOmoro.amI(hallName)) {
    return new PtimeOmoro();
  } else {
    return new Hall();
  }
}

/**
 * form の名前を取得する
 *
 * @param name
 */
function getFormName(name: string): string {
  if (name === 'dat') {
    return 'Table' +
      'Select' +
      'Action' +
      'Form';
  } else {
    return 'Table' +
      'History' +
      'Action' +
      'Form';
  }
}

function getForm(name: string): JQuery {
  const formName = getFormName(name);
  return $(`form[name=${formName}]`);
}

/**
 * ベースのURLを取得する
 */
function getBaseUrl(): string {
  return location.href.replace(/\/[^\/]*$/, '/');
}

/**
 * Ajaxで詳細を取得するためのパラメーターを作る
 *
 * @param machine
 * @param cd
 * @param num
 */
function setDetailParams(machine: Machine, cd: any, num: any) {
  const $form  = getForm('dat');
  const method = $form.attr('method') || '';
  const action = $form.attr('action') || '';
  const url    = getBaseUrl() + action;
  const data   = {} as any;

  $form.find('[name]').each((i, elem) => {
    const $elem = $(elem);
    const name  = $elem.attr('name') || '';
    data[name]  = $elem.attr('value') || '';
  });

  data.tablenum = num;
  data.forward  = 'K' +
    'AK' +
    'IN_' +
    'TABLE' +
    'SELECT';

  if (cd === 1) {
    data.actiontype = '12';
  } else {
    data.actiontype = '14';
  }

  machine.setDetailParams(method, url, data)
}

/**
 * Ajaxで履歴を取得するためのパラメーターを作る
 *
 * @param machine
 * @param num
 */
function setHistoryParams(machine: Machine, num: any) {
  const $form  = getForm('his');
  const method = $form.attr('method') || '';
  const action = $form.attr('action') || '';
  const url    = getBaseUrl() + action;
  const data   = {} as any;

  $form.find('[name]').each((i, elem) => {
    const $elem = $(elem);
    const name  = $elem.attr('name') || '';
    data[name]  = $elem.attr('value') || '';
  });

  data.tablenum = num;

  machine.setHistoryParams(method, url, data)
}

