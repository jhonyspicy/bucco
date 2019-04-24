import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop} from 'vue-property-decorator';
import {bucco, functions} from '../../includes/util';
import Graph from "../Graph";
import Cheerio = require('cheerio');
import AjaxParams = bucco.AjaxParams;
import GraphSrc = bucco.GraphSrc;
import getBaseUrl = functions.getBaseUrl;
import * as _ from "lodash";

@Component({
  template: require('./Normal.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Graph,
  },
})
export default class Normal extends Vue {
  @Prop() ch: CheerioStatic;
  @Prop() id: number;
  promise: Promise<any> = Promise.resolve();
  dayDataList: any[] = [];
  protected dispatchMachineData: any; // 遅延実行させたい。

  /**
   * 台番号
   * @example 100
   */
  get number(): number {
    return parseInt(this.ch('#dedama_detail_table .left h4').text());
  }

  /**
   * 一週間の獲得枚数
   * @example 100
   */
  get totalCoin(): number {
    const result = this.dayDataList.reduce(function (a, b) {
      return {nowCoin: a.nowCoin + b.nowCoin}
    });
    return result.nowCoin;
  }

  /**
   * 機種名
   * @example ニューキングハナハナ
   */
  get name(): string {
    return this.ch('#machine_name a').text();
  }

  /**
   * 店舗名
   * @example モナコ
   */
  get hallName(): string {
    return this.ch('#hall_name').text();
  }

  /**
   * 週間グラフ
   */
  get totalGraph(): GraphSrc {
    return {
      original: this.ch('#dedama_8days a').attr('href') || '',
      thumbnail: this.ch('#dedama_8days img').attr('src') || '',
    };
  }

  // ライフサイクル
  @Emit() created() {
    this.generateDayDataList();

    this.dispatchMachineData = _.debounce(() => {
      this.$store.dispatch(
        'machineData',
        {
          data: this.dayDataList,
          id  : this.id
        }
      );
    }, 1000);
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
        rotate: $tr.find('td').eq(1).text(),
        nowCoin: 0,
        operation: 0,
        max: 0,
        min: 0,
        rangePlus: 0,
        rangeMinus: 0,
        nowCoinClasses: [],
        icons: [],
      });
    });
  }

  protected getParams(day: number = 0): AjaxParams {
    const formName = 'Table' + 'History' + 'Action' + 'Form';
    const $form    = this.ch(`form[name=${formName}]`);
    // const method   = $form.attr('method') || '';
    const method   = 'get';
    const action   = $form.attr('action') || '';
    const url      = getBaseUrl() + action;
    const data     = {} as any;

    $form.find('[name]').each((i, elem) => {
      const $elem = Cheerio(elem);
      const name  = $elem.attr('name') || '';
      data[name]  = $elem.attr('value') || '';
    });

    data.day = day;

    return {
      method,
      url,
      data,
    };
  }

  onGraphLoad(imgData: any, dayData: any) {
    dayData.nowCoin    = imgData.nowCoin;
    dayData.operation  = imgData.operation;
    dayData.max        = imgData.max;
    dayData.min        = imgData.min;
    dayData.rangePlus  = imgData.rangePlus;
    dayData.rangeMinus = imgData.rangeMinus;

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

    this.dispatchMachineData();
  }
}
