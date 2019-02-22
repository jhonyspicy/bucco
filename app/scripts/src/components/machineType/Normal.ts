import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop} from 'vue-property-decorator';
import {bucco, functions} from '../../includes/util';
import Graph from "../Graph";
import Cheerio = require('cheerio');
import AjaxParams = bucco.AjaxParams;
import GraphSrc = bucco.GraphSrc;
import getBaseUrl = functions.getBaseUrl;

@Component({
  template: require('./Normal.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Graph,
  },
})
export default class Normal extends Vue {
  @Prop() ch: CheerioStatic;
  historyParams: AjaxParams;
  promise: Promise<any> = Promise.resolve();
  dayDataList: any[] = [];

  /**
   * 台番号
   * @example 100
   */
  get number(): number {
    return parseInt(this.ch('#dedama_detail_table .left h4').text());
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
    // const hisHref           = this.ch('#dedama_detail_table .left p a:nth-of-type(2)').attr('href') || '';
    // const tableHistoryClick = this.getParams.bind(this);
    // this.historyParams      = eval(hisHref); // tableHistoryClick() を実行している。
    this.generateDayDataList();
  }

  protected generateDayDataList() {
    this.ch('#graph_list dd').each((index, element) => {
      const $dd = Cheerio(element);
      const $tr = this.ch(`#dedama_kind_table tr:nth-child(${index + 2})`);
      this.dayDataList.push({
        graph: {
          original: $dd.find('a').attr('href') || '',
          thumbnail: $dd.find('img').attr('src') || ''
        },
        total: $tr.find('td').eq(1).text(),
        rangePlus: 0,
        rangeMinus: 0,
      });
    });
  }

  protected getParams(day: number = 0) {
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

  sample(a: string, dayData: any, index: number) {
    console.log('aa!!', a);
    dayData.rangePlus = 999 - index;
  }
}
