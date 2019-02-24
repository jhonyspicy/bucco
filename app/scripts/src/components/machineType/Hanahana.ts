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
  protected generateDayDataList() {
    this.ch('#graph_list dd').each((index, element) => {
      const $dd = Cheerio(element);
      const $tr = this.ch(`#dedama_kind_table tr:nth-child(${index + 2})`);

      this.dayDataList.push({
        id: this.id,
        dayBefore: index,
        graph: {
          original: $dd.find('a').attr('href') || '',
          thumbnail: $dd.find('img').attr('src') || ''
        },
        total: $tr.find('td').eq(1).text(),
        big: $tr.find('td').eq(2).text(),
        reg: $tr.find('td').eq(3).text(),
        nowCoin: 0,
        operation: 0,
        max: 0,
        min: 0,
        rangePlus: 0,
        rangeMinus: 0,
      });
    });
  }
}
