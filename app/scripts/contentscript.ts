"use strict";
// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import * as $ from "jquery";

let promise:Promise<any> = Promise.resolve();

start();

$('#ata0 .ind .det a').first().each((i, elem) => {
  const $elem = $(elem);
  let href = $elem.attr('href') || '';
  eval(href);
});

promise.then((value) => {
  console.log('done');
});

end();

function start() {
  let $form = getForm();

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
      setTimeout(()=> {
        console.log(data);
        resolve();
      }, Math.random() * 3000);
    }));
  });
}

function end() {
  let $form = getForm();

  $form.off('submit');

  console.log('end');
}

function getForm() {
  return $('form[name=TableSelectActionForm]');
}

function openDedamaDetail(cd,num) {
  let $form = getForm();
  const tableSelectActionForm = document.querySelector('[name=TableSelectActionForm]');
  tableSelectActionForm.tablenum.value=num;
  tableSelectActionForm.forward.value = "KAKIN_TABLESELECT";

  if (cd == 1){
    tableSelectActionForm.actiontype.value="12";
  }else{
    tableSelectActionForm.actiontype.value="14";
  }

  $form.trigger('submit');
}
