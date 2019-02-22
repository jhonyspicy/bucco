import Component from 'vue-class-component';
import {Emit, Prop} from 'vue-property-decorator';
import {bucco, functions} from '../../includes/util';
import Normal from './Normal';
import Cheerio = require('cheerio');
import AjaxParams = bucco.AjaxParams;
import GraphSrc = bucco.GraphSrc;
import getBaseUrl = functions.getBaseUrl;

@Component({
  template: require('./Hanahana.html') // html-loaderを使うと外部のhtmlファイルを読み込める
})
export default class Hanahana extends Normal {
}
