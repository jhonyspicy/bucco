import Component from 'vue-class-component';
import Normal from './Normal';
import Cheerio = require('cheerio');
import * as _ from 'lodash';

@Component({
  template: require('./Hanahana.html') // html-loaderを使うと外部のhtmlファイルを読み込める
})
export default class Hanahana extends Normal {
  getCoinRateClasses(coinRate: number): string[] {
    console.log('a');
    const result = [];
    if (coinRate > 35) {
      result.push('yes');
    }
    return result;
  }

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
        coinRate: 0,
        classes: [],
      });
    });
  }

  onGraphLoad(imgData: any, dayData: any) {
    dayData.nowCoin    = imgData.nowCoin;
    dayData.operation  = imgData.operation;
    dayData.max        = imgData.max;
    dayData.min        = imgData.min;
    dayData.rangePlus  = imgData.rangePlus;
    dayData.rangeMinus = imgData.rangeMinus;

    const spendCoin  = dayData.big * 312 + dayData.reg * 130 - dayData.nowCoin
    const coinRate   = (dayData.total / spendCoin) * 50;
    dayData.coinRate = _.round(coinRate, 2);

    dayData.classes = ['shrimpUp']; // とりあえず適当にクラスをつけるテスト。

    this.$store.dispatch('machineData', {data: dayData});
  }
}
