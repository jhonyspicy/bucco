'use strict';

import * as $ from 'jquery';
import Hall from './lib/Hall/Hall';
import Machine from './lib/Machine/Machine';

let hall: Hall;

if ($('#dedama_table').length) {
  hall = new Hall();
  hall.$dom.insertAfter('#pankuzu');
  run();
}

function run() {
  /*
  台数分実行
   */
  $('#ata0 .ind').each((i, elem) => {
    const $elem   = $(elem);
    const datHref = $elem.find('.det a').attr('href') || '';
    const hisHref = $elem.find('.his a').attr('href') || '';
    const machine = hall.make('machine');
    const openDedamaDetail = loadDetail.bind(null, machine);
    const tableHistoryClick = loadHistory.bind(null, machine);

    eval(datHref); // openDedamaDetail() を実行している。
    eval(hisHref); // tableHistoryClick() を実行している。
  });
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

/**
 * ベースのURLを取得する
 */
function getBaseUrl(): string {
  return location.href.replace(/\/[^\/]*$/, '/');
}

function getForm(name: string): JQuery {
  const formName = getFormName(name);
  return $(`form[name=${formName}]`);
}

function loadDetail (machine: Machine, cd: any, num: any) {
  const $form    = getForm('dat');
  const method  = $form.attr('method') || '';
  const url     = $form.attr('action') || '';
  const action  = getBaseUrl() + url;
  const data    = {} as any;

  $form.find('[name]').each((i, elem) => {
    const $elem = $(elem);
    const name  = $elem.attr('name') || '';
    data[name] =  $elem.attr('value') || '';
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
}

function loadHistory(machine: Machine, num: any) {
  const $form     = getForm('his');
  const method  = $form.attr('method') || '';
  const url     = $form.attr('action') || '';
  const data    = {} as any;
  const action  = getBaseUrl() + url;

  $form.find('[name]').each((i, elem) => {
    const $elem = $(elem);
    const name  = $elem.attr('name') || '';
    const value = $elem.attr('value') || '';

    data[name] = value;
  });

  data.tablenum = num;
}

