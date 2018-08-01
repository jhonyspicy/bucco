"use strict";
// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import * as $ from "jquery";

console.log(`'Allo 'Allo! Content script s`);

let $hallDedamaActionForm = $('form[name=HallDedamaActionForm]');
console.log($hallDedamaActionForm);
