"use strict";
// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import * as $ from "jquery";

console.log(`'Allo 'Allo! Content script s`);

let $hallDedamaActionForm = $('form[name=HallDedamaActionForm]');
console.log($hallDedamaActionForm);

const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let promise:Promise<any> = Promise.resolve();

list.forEach((v, i)=> {
  promise = promise.then(value => new Promise((resolve, reject) => {
    setTimeout(()=> {
      console.log(v);
      resolve();
    }, Math.random() * 3000);
  }));
});

promise.then((value) => {
  console.log('done');
});
