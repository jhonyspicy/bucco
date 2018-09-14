'use strict';
// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import * as $ from 'jquery';
import Hall from './lib/Hall';
import Machine from './lib/Machine';

let promise: Promise<any> = Promise.resolve();
const hall                = new Hall();
if ($('#dedama_table').length) {
  hall.name = $('#hall_name').text();
  hall.date = $('#hall_date').text().split('|')[1].trim().split('：')[1];
  hall.$dom.insertAfter('#pankuzu');

  start();

  $('#ata0 .ind').each((i, elem) => {
    const $elem   = $(elem);
    const datHref = $elem.find('.det a').attr('href') || '';
    const hisHref = $elem.find('.his a').attr('href') || '';

    eval(datHref);
    eval(hisHref);
  });

  promise.then((value) => {
    hall.pickup();
    hall.status = '終了';
  });

  end();
}

function start() {
  hall.status = '開始';

  const addQue = (method: string, url: string, data: any, callback: ($html: JQuery) => void) => {
    promise = promise.then(value => new Promise((resolve, reject) => {
      const doGet = () => {
        hall.status = '読み込み中...';
        $.ajax({
          method,
          url,
          data,
          dataType: 'html',
          success: (html) => {
            const $html = $(html);
            if (!$html.find('#machine_name').length) {
              console.log('Too many request wait a moment');
              hall.status = '待機中...(リミット)';
              setTimeout(() => {
                doGet();
              }, 60000);
              return;
            }

            callback($html);
            setTimeout(() => {
              resolve();
            }, 3000 + Math.random() * 3000);
          },
          error: (e) => {
            console.log('something wrong', e);
            hall.status = '待機中...(通信エラー)';
            setTimeout(() => {
              doGet();
            }, 60000);
          },
        });
      };
      doGet();
    }));
  };

  /**
   * 詳細の取得
   */
  getForm('dat').on('submit', (e) => {
    const $form   = $(e.currentTarget);
    const method  = $form.attr('method') || '';
    const url     = $form.attr('action') || '';
    const data    = {} as any;
    const baseUrl = location.href.replace(/\/[^\/]*$/, '/');
    e.preventDefault();

    $form.find('[name]').each((i, elem) => {
      const $elem = $(elem);
      const name  = $elem.attr('name') || '';
      const value = $elem.attr('value') || '';

      data[name] = value;
    });

    addQue(method, baseUrl + url, data, ($html: JQuery) => {
      // const machine = new Machine($html);
      const machine = hall.getMachine(data.tablenum);
      machine.convertDetailHtml($html);
    });
  });

  /**
   * 履歴の取得
   */
  getForm('his').on('submit', (e) => {
    const $form   = $(e.currentTarget);
    const method  = $form.attr('method') || '';
    const url     = $form.attr('action') || '';
    const data    = {} as any;
    const baseUrl = location.href.replace(/\/[^\/]*$/, '/');
    e.preventDefault();

    $form.find('[name]').each((i, elem) => {
      const $elem = $(elem);
      const name  = $elem.attr('name') || '';
      const value = $elem.attr('value') || '';

      data[name] = value;
    });

    // addQue(method, baseUrl + url, data, ($html: JQuery) => {
    //   // const machine = new Machine($html);
    //   const machine = hall.getMachine(data.tablenum);
    //   machine.convertHistoryHtml($html);
    // });
  });
}

function end(): void {
  getForm('dat').off('submit');
  getForm('his').off('submit');

  hall.status = 'キュー追加終了';

}

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

function openDedamaDetail(cd: any, num: any) {
  const formName = getFormName('dat');
  const $form    = getForm('dat');
  const form     = document.querySelector(`[name=${formName}]`) as any;

  form.tablenum.value = num;
  form.forward.value  = 'K' +
    'AK' +
    'IN_' +
    'TABLE' +
    'SELECT';

  if (cd == 1) {
    form.actiontype.value = '12';
  } else {
    form.actiontype.value = '14';
  }

  $form.trigger('submit');
}

function tableHistoryClick(num: any) {
  const tableName = 'his';
  const formName  = getFormName(tableName);
  const $form     = getForm(tableName);
  const form      = document.querySelector(`[name=${formName}]`) as any;

  form.tablenum.value = num;
  $form.trigger('submit');
}

