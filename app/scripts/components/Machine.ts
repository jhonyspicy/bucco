import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import {bucco, functions} from '../lib/Includes/Util';
import AjaxParams = bucco.AjaxParams;
import * as Cheerio from 'cheerio';
import ajax = functions.ajax;

@Component({
  template: require('./Machine.html') // html-loaderを使うと外部のhtmlファイルを読み込める
})
export default class Machine extends Vue {
  @Prop() params: AjaxParams; // onClickの値がテキストで入っている
  private ch: CheerioStatic    = Cheerio.load('');
  static promise: Promise<any> = Promise.resolve();

  // methods
  start(event: Event) {
    event.preventDefault();
    this.ch = Cheerio.load(document.documentElement.innerHTML);
  }

  @Watch('ch') onLoadHtml(ch: CheerioStatic) {
    if (ch) {
    }
  }

  // ライフサイクル
  @Emit() created() {
    if (this.params) {
      ajax(this.params).then(($html: CheerioStatic) => {
        this.ch = $html;
      });
    }
  }

  get number(): number {
    return parseInt(this.ch('#dedama_detail_table .left h4').text());
  }

  get name(): string {
    return this.ch('#machine_name a').text();
  }

  get hallName(): string {
    return this.ch('#hall_name').text();
  }
}
