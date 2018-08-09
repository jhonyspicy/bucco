"use strict";
// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import * as $ from "jquery";

let promise:Promise<any> = Promise.resolve();

start();

$('#ata0 .ind .det a').each((i, elem) => {
  const $elem = $(elem);
  let href = $elem.attr('href') || '';
  eval(href);
});

promise.then((value) => {
  console.log('done');
});

end();

function start() {
  const $form = getForm();
  const type = $form.attr('method') || '';
  const url = $form.attr('action') || '';

  console.log('start');

  $form.on('submit', (e) => {
    e.preventDefault();

    const data = {} as any;
    $form.find('[name]').each((i, elem)=> {
      const $elem = $(elem);
      const name = $elem.attr('name') || '';
      const value = $elem.attr('value') || '';

      data[name] = value;
    });

    promise = promise.then(value => new Promise((resolve, reject) => {
      const doGet = () => {
        $.ajax({
          type,
          url,
          data,
          dataType: 'html',
          success: (html) => {
            const $html = $(html);
            const imgSrcWeek = $html.find('#dedama_8days img').attr('src');
            if (!imgSrcWeek) {
              setTimeout(()=> {
                doGet();
              }, 60000);
              return;
            }
            console.log(imgSrcWeek);

            setTimeout(()=> {
              resolve();
            }, Math.random() * 3000);
          },
          error: () => {
            setTimeout(()=> {
              doGet();
            }, 60000);
            console.log('error');
          },
        });
      };

      doGet();
    }));
  });
}

function end() {
  const $form = getForm();

  $form.off('submit');

  console.log('end');
}

function getForm() {
  return $('form[name=TableSelectActionForm]');
}

function openDedamaDetail(cd:any,num:any) {
  const $form = getForm();
  const tableSelectActionForm = document.querySelector('[name=TableSelectActionForm]') as any;
  tableSelectActionForm.tablenum.value=num;
  tableSelectActionForm.forward.value = "KAKIN_TABLESELECT";

  if (cd == 1){
    tableSelectActionForm.actiontype.value="12";
  }else{
    tableSelectActionForm.actiontype.value="14";
  }

  $form.trigger('submit');
}
