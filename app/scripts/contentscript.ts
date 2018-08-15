"use strict";
// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import * as $ from "jquery";

let promise:Promise<any> = Promise.resolve();
const $content = $('<div id="allMachineDataList"><div class="wrap"></div><div id="allMachineDataList-status"></div></div>');
const $status = $content.find('#allMachineDataList-status');
const $dataElems = {} as any;
if ($('#dedama_table').length) {
  $content.insertAfter('#pankuzu');

  start();

  $('#ata0 .ind').first().each((i, elem) => {
    const $elem = $(elem);
    const datHref = $elem.find('.det a').attr('href') || '';
    const hisHref = $elem.find('.his a').attr('href') || '';

    eval(datHref);
    eval(hisHref);
  });

  promise.then((value) => {
    $status.text('終了。');
  });

  end();
}

function start() {
  $status.text('開始');

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
              console.log('Too many request wait a moment');
              setTimeout(()=> {
                doGet();
              }, 60000);
              return;
            }

            callback($html);
            setTimeout(()=> {
              resolve();
            }, Math.random() * 4000);
          },
          error: (e) => {
            console.log('something wrong', e);
            setTimeout(()=> {
              doGet();
            }, 60000);
          },
        });
      };
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

    addQue(method, location.href.replace(/\/[^\/]*$/, '/') + url, data, ($html:JQuery) => {
      const $dataElem = getDataElem(data.tablenum);
      // const bigGraph = $html.find('#dedama_8days a').attr('href');
      const bigGraph = $html.find('#dedama_8days img').attr('src');
      const machineNumber = $html.find('#dedama_detail_table .left h4').first().text();
      const smallGraphs = $html.find('#graph_list dd').map((i, elem)=>{
        const $elem = $(elem);
        return $elem.find('img').attr('src') || '';
      }).get();
      // const resultData = $html.find('#dedama_kind_table tr:nth-child(n + 2)').map((i, elem)=>{
      //   const $elem = $(elem);
      //   return [
      //     $elem.find('td').eq(1).text(),
      //     $elem.find('td').eq(2).text(),
      //     $elem.find('td').eq(3).text(),
      //     $elem.find('td').eq(4).text(),
      //     $elem.find('td').eq(5).text(),
      //   ];
      // }).get();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', smallGraphs[0], true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function(e) {
        // ArrayBufferで返ってくる
        console.log(this.response.byteLength);
        const dataURIFromArrayBuffer = (ab:any) => {
          return "data:image/png;base64," +
            btoa(Array.from(new Uint8Array(ab), e => String.fromCharCode(e)).join(""));
        };

        const img = new Image();
        img.onload = ()=> {
          const cv = document.createElement('canvas');
          cv.width = img.naturalWidth;
          cv.height = img.naturalHeight;

          const ct = cv.getContext('2d') as CanvasRenderingContext2D;
          ct.drawImage(img, 0, 0);

          const data = ct.getImageData(0, 0, cv.width, cv.height);
          // console.log(data);
        };

        img.src = dataURIFromArrayBuffer(this.response);
      };

      xhr.send();

      $dataElem.find('.machineNumber').text(machineNumber);
      smallGraphs.forEach((src)=>{
        $dataElem.find('.smallGraphs').append(`<li><img src="${src}"></li>`);
      });
      $dataElem.find('.bigGraph').append(`<img src="${bigGraph}">`);
      $dataElem.find('.tableWrap').append($html.find('#dedama_kind_table'));
      // console.log($html);
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
  });
}

function end():void {
  getForm('dat').off('submit');
  getForm('his').off('submit');

  $status.text('読み込み中...');
}

function getDataElem(tablenum:string):JQuery {
  let $dataElem = $dataElems[tablenum];
  if (!$dataElem) {
    $dataElem = $(`
<div class="machineData">
  <h3 class="machineNumber"></h3>
  <div class="infoWrap">
    <div class="wrap">
      <div class="bigGraph"></div>
      <div class="tableWrap"></div>
    </div>
    <ul class="smallGraphs"></ul>
  </div>
</div>
`);
    $dataElem.find('.machineNumber').on('click', (e:any)=>{
      $dataElem.find('.infoWrap').toggle();
    });
    $dataElems[tablenum] = $dataElem;
    $content.find('>.wrap').append($dataElem);
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

