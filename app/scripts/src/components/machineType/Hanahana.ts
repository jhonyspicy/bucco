import Component from 'vue-class-component';
import Normal from './Normal';
import Cheerio = require('cheerio');
import * as _ from 'lodash';

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
        rotate: $tr.find('td').eq(1).text(),
        big: $tr.find('td').eq(2).text(),
        reg: $tr.find('td').eq(3).text(),
        ratio: $tr.find('td').eq(4).text(),
        nowCoin: 0,
        operation: 0,
        max: 0,
        min: 0,
        rangePlus: 0,
        rangeMinus: 0,
        coinRate: 0,
        nowCoinClasses: [],
        coinRateClasses: [],
        regClasses: [],
        icons: [],
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
    dayData.coinRate   = this.calcCoinRate(dayData);

    dayData.icons = [];

    // 獲得枚数
    if (dayData.nowCoin < -4000) {
      dayData.nowCoinClasses = ['worst'];
    } else if (dayData.nowCoin < -3000) {
      dayData.nowCoinClasses = ['worse'];
    } else if (dayData.nowCoin < -2000) {
      dayData.nowCoinClasses = ['bad'];
    } else if (4000 < dayData.nowCoin) {
      dayData.nowCoinClasses = ['good'];
    }

    // ベイビーの多さ(しっかり回っていること)
    if (0 < dayData.reg && 2000 < dayData.rotate) {
      if (0.8 < dayData.reg / dayData.big) {
        // ベイビー多め
        dayData.regClasses = ['good'];

        if (1000 < dayData.nowCoin) {
          // しかもしっかり出てる♪
          dayData.icons.push('baby');
        }
      }
    }

    // 球持ち
    if (dayData.coinRate < 34) {
      dayData.coinRateClasses = ['bad'];
    } else if (36 < dayData.coinRate) {
      dayData.coinRateClasses = ['good'];
    }

    // シュリンプアップ
    if (dayData.nowCoin < -1000 && 36 < dayData.coinRate) {
      dayData.icons.push('shrimp');
    }

    if (false) {
      // ハートマークのアルゴリズムは考え中
      dayData.icons.push('hart');
    }

    this.dispatchMachineData();
  }

  /**
   * 球持ち
   * @param dayData
   */
  private calcCoinRate(dayData: any) {
    const spendCoin  = dayData.big * 312 + dayData.reg * 130 - dayData.nowCoin;
    const coinRate   = (dayData.rotate / spendCoin) * 50;
    return _.round(coinRate, 2);
  }
}
