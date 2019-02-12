import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import Equipment from './Equipment';
import {bucco, functions} from '../includes/util';
import Cheerio = require('cheerio');
import getBaseUrl = functions.getBaseUrl;
import AjaxParams = bucco.AjaxParams;
// import { counterModule } from '../store/modules/Store';
import Counter from '../store/modules/Counter';

@Component({
  template: require('./Hall.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Equipment,
  },
})
export default class Hall extends Vue {
  @Prop() params: string;
  paramsList: AjaxParams[]     = [];
  promise: Promise<any> = Promise.resolve();
  private ch: CheerioStatic    = Cheerio.load('');

  get name(): string {
    // counterModule.incr();
    this.$store;
    this.$store.commit('increment');
/*
    this.$store.state.Counter.count;
    this.$store.commit('Counter/INCREMENT',13);
    this.$store.commit({
  type: 'Counter/INCREMENT',
  amount: 13
});
*/
    return this.ch('#hall_name').text();
  }

  get ok(): boolean {
    // @ts-ignore
    return !!this.ch.text();
  }

  // methods
  start(event: Event) {
    event.preventDefault();
    this.ch = Cheerio.load(document.documentElement.innerHTML);
  }

  @Watch('ch') onLoadHtml(ch: CheerioStatic) {
    this.paramsList = [];
    if (this.ok) {
      // ch('#20slot').closest('table').find('tr:nth-child(n + 2)').first().each((index, element) => {
      ch('#20slot').closest('table').find('tr:nth-child(2), tr:nth-child(3)').each((index, element) => {
        const $elem              = Cheerio(element);
        const onClick            = $elem.find('[name=select]').attr('onclick') || '';
        const listClick          = this.getParams.bind(this, ch);
        const params: AjaxParams = eval(onClick); // listClick() を実行している。

        this.paramsList.push(params);
      });
    }
  }

  // ライフサイクル
  @Emit() created() {
  }


  /**
   * 台一覧ページの取得に必要なパラメーターをセットする
   *
   * @param ch
   * @param kindCode
   * @param modelCode
   * @param edaNo
   * @param actionType
   * @param uritanka
   */
  private getParams(
    ch: CheerioStatic,
    kindCode: string,
    modelCode: string,
    edaNo: string,
    actionType: string,
    uritanka: string
  ): AjaxParams {
    const formName = 'Hall' +
      'Ded' +
      'ama' +
      'Action' +
      'Form';
    const $form    = ch(`form[name=${formName}]`);
    const method   = $form.attr('method') || '';
    const action   = $form.attr('action') || '';
    const url      = getBaseUrl() + action;
    const data     = {} as any;

    $form.find('[name]').each((i, elem) => {
      const $elem = Cheerio(elem);
      const name  = $elem.attr('name') || '';
      data[name]  = $elem.attr('value') || '';
    });

    data['kindcode']   = kindCode;
    data['modelcode']  = modelCode;
    data['edano']      = edaNo;
    data['actiontype'] = actionType;
    data['forward']    = 'K' +
      'AK' +
      'IN_' +
      'LIST';
    data['uritanka']   = uritanka;

    return {
      method,
      url,
      data,
    };
  }
}
