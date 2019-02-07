import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import Equipment from './Equipment';
import * as $ from 'jquery';
import {bucco, functions} from '../lib/Includes/Util';
import Cheerio = require('cheerio');
import getBaseUrl = functions.getBaseUrl;
import AjaxParams = bucco.AjaxParams;

@Component({
  template: require('./Hall.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Equipment,
  },
})
export default class Hall extends Vue {
  @Prop() params: string;
  equipmentParams: AjaxParams[] = [];
  private ch: CheerioStatic  = Cheerio.load('');
  static promise: Promise<any> = Promise.resolve();

  get name(): string {
    if (this.ch) {
      return this.ch('#hall_name').text();
    }
    return '';
  }

  // methods
  start(event: Event) {
    if (event) event.preventDefault();

    this.ch = Cheerio.load(document.documentElement.innerHTML);
  }

  @Watch('ch') onLoadHtml(ch: CheerioStatic, oldValue: CheerioStatic) {
    this.equipmentParams = [];
    if (ch) {
      ch('#20slot').closest('table').find('tr:nth-child(n + 2)').first().each((index, element) => {
        const elem    = Cheerio(element);
        const onClick = elem.find('[name=select]').attr('onclick') || '';
        // this.$dom.find('.ultraHall__equipments').append(equipment.$dom);
        //
        const listClick          = this.getParams.bind(null, ch);
        const params: AjaxParams = eval(onClick); // listClick() を実行している。

        this.equipmentParams.push(params);
      });
      console.log(this.equipmentParams);
    }

    return $;
  }

  // ライフサイクル
  @Emit() created() {
    // if (this.html) {
    //   this.$ = Cheerio.load(this.html);
    // }
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
