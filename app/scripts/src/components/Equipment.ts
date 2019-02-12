import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import Machine from './Machine';
import {bucco, functions} from '../includes/util';
import Cheerio = require('cheerio');
import AjaxParams = bucco.AjaxParams;
import ajax = functions.ajax;
import getBaseUrl = functions.getBaseUrl;

@Component({
  template: require('./Equipment.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Machine,
  },
})
export default class Equipment extends Vue {
  @Prop() params: AjaxParams; // onClickの値がテキストで入っている
  paramsList: AjaxParams[]     = [];
  promise: Promise<any> = Promise.resolve();
  private ch: CheerioStatic    = Cheerio.load('');
  private finish = () => {};

  get name(): string {
    return this.ch('#machine_name a').text();
  }

  get hallName(): string {
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
      ch('#ata0 .ind').each((index, element) => {
        const $elem             = Cheerio(element);
        const datHref           = $elem.find('.det a').attr('href') || '';
        const hisHref           = $elem.find('.his a').attr('href') || '';
        const openDedamaDetail  = this.getParams.bind(this);
        const tableHistoryClick = this.getParams.bind(this);

        const detailParams: AjaxParams  = eval(datHref); // openDedamaDetail() を実行している。
        const historyParams: AjaxParams = eval(hisHref); // tableHistoryClick() を実行している。

        this.paramsList.push(detailParams);
      });

      this.finish();
    }
  }

  // ライフサイクル
  @Emit() created() {
    if (this.params) {
      this.$parent.$data.promise = this.$parent.$data.promise.then(() => {
        return new Promise((resolve, reject) => {
          this.finish = resolve;
          ajax(this.params).then(($html: CheerioStatic) => {
            this.ch = $html;
          });
        });
      });
    }
  }

  private getParams(
    cd: any,
    num: any
  ) {
    const formName =  'Table' + 'Select' + 'Action' + 'Form';
    const $form    = this.ch(`form[name=${formName}]`);
    const method   = $form.attr('method') || '';
    const action   = $form.attr('action') || '';
    const url      = getBaseUrl() + action;
    const data     = {} as any;

    $form.find('[name]').each((i, elem) => {
      const $elem = Cheerio(elem);
      const name  = $elem.attr('name') || '';
      data[name]  = $elem.attr('value') || '';
    });

    data.tablenum = num;
    data.forward  = 'K' +
      'AK' +
      'IN_' +
      'TABLE' +
      'SELECT';

    if (cd === 1) {
      data.actiontype = '12';
    } else {
      data.actiontype = '14';
    }

    return {
      method,
      url,
      data,
    };
  }
}
