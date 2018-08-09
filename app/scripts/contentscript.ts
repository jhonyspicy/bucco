"use strict";
// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import * as $ from "jquery";

let promise:Promise<any> = Promise.resolve();
const $content = $('<div id="allMachineDataList">');
const $dataElems = {} as any;
if ($('#dedama_table').length) {
  $content.insertAfter('#machine_name');

  start();

  $('#ata0 .ind').each((i, elem) => {
    const $elem = $(elem);
    const datHref = $elem.find('.det a').attr('href') || '';
    const hisHref = $elem.find('.his a').attr('href') || '';

    eval(datHref);
    eval(hisHref);
  });

  promise.then((value) => {
    console.log('done');
  });

  end();
}

function start() {
  console.log('start');

  const addQue = (method:string, url:string, data:any, callback:(html:JQuery)=>void) => {
    promise = promise.then(value => new Promise((resolve, reject) => {
      const doGet = () => {
        $.ajax({
          method,
          url,
          data,
          dataType: 'html',
          success: (html) => {
            const $html = $(html);
            if (!$html.find('#machine_name').length) {
              setTimeout(()=> {
                console.log('Too many request wait a moment');
                doGet();
              }, 60000);
              return;
            }

            callback($html);
            setTimeout(()=> {
              resolve();
            }, Math.random() * 5000);
          },
          error: () => {
            setTimeout(()=> {
              doGet();
            }, 60000);
          },
        });
      }
      doGet();
    }));
  };

  getForm('dat').on('submit', (e) => {
    const $form = $(e.currentTarget);
    const method = $form.attr('method') || '';
    const url = $form.attr('action') || '';
    const data = {} as any;
    e.preventDefault();

    $form.find('[name]').each((i, elem)=> {
      const $elem = $(elem);
      const name = $elem.attr('name') || '';
      const value = $elem.attr('value') || '';

      data[name] = value;
    });

    addQue(method, url, data, ($html:JQuery) => {
      const $dataElem = getDataElem(data.tablenum);
      // const imgWeekSrc = $html.find('#dedama_8days a').attr('href');
      const imgWeekSrc = $html.find('#dedama_8days img').attr('src');
      $dataElem.find('.bigGraph').append(`<img src="${imgWeekSrc}">`);
      console.log($html);
    });
  });
  getForm('his').on('submit', (e) => {
    const $form = $(e.currentTarget);
    const method = $form.attr('method') || '';
    const url = $form.attr('action') || '';
    const data = {} as any;
    e.preventDefault();

    $form.find('[name]').each((i, elem)=> {
      const $elem = $(elem);
      const name = $elem.attr('name') || '';
      const value = $elem.attr('value') || '';

      data[name] = value;
    });

    addQue(method, url, data, ($html:JQuery) => {
      const $dataElem = getDataElem(data.tablenum);
      console.log($html);
    });
  });
}

function end():void {
  getForm('dat').off('submit');
  getForm('his').off('submit');

  console.log('end');
}

function getDataElem(tablenum:string):JQuery {
  let $dataElem = $dataElems[tablenum];
  if (!$dataElem) {
    $dataElem = $(`
<div class="machineData">
  <h3 class="machineNumber"></h3>
  <div class="wrap">
    <div class="bigGraph"></div>
    <ul class="smallGraphs"></ul>
  </div>
</div>
`);
    $dataElems[tablenum] = $dataElem;
    $content.append($dataElem);
  }

  return $dataElem;
}

function getFormName(name:string):string {
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

function getForm(name:string):JQuery {
  const formName = getFormName(name);
  return $(`form[name=${formName}]`);
}

function openDedamaDetail(cd:any,num:any) {
  const formName = getFormName('dat');
  const $form = getForm('dat');
  const form = document.querySelector(`[name=${formName}]`) as any;

  form.tablenum.value=num;
  form.forward.value = 'K' +
    'AK' +
    'IN_' +
    'TABLE' +
    'SELECT';

  if (cd == 1){
    form.actiontype.value='12';
  }else{
    form.actiontype.value='14';
  }

  $form.trigger('submit');
}

function tableHistoryClick(num:any) {
  const tableName = 'his';
  const formName = getFormName(tableName);
  const $form = getForm(tableName);
  const form = document.querySelector(`[name=${formName}]`) as any;

  form.tablenum.value = num;
  $form.trigger('submit');
}

