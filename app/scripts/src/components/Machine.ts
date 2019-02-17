import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop} from 'vue-property-decorator';
import {bucco, functions} from '../includes/util';
import Normal from './machineType/Normal';
import Hanahana from './machineType/Hanahana';
import Cheerio = require('cheerio');
import AjaxParams = bucco.AjaxParams;
import ajax = functions.ajax;

@Component({
  template: require('./Machine.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Normal,
    Hanahana,
  },
})
export default class Machine extends Vue {
  @Prop() params: AjaxParams; // onClickの値がテキストで入っている
  promise: Promise<any>     = Promise.resolve();
  private ch: CheerioStatic = Cheerio.load('');

  get ok(): boolean {
    // @ts-ignore
    return !!this.ch.text();
  }

  /**
   * 機種名
   * @example ニューキングハナハナ
   */
  get name(): string {
    return this.ch('#machine_name a').text();
  }

  // ライフサイクル
  @Emit() created() {
    if (this.params) {
      ajax(this.params).then(($html: CheerioStatic) => {
        this.ch = $html;
      });
    } else {
      this.ch = Cheerio.load(document.documentElement.innerHTML);
    }
  }

  isHanahan(): boolean {
    if (this.ok) {
      return 0 < this.name.indexOf('ハナハナ');
    }
    return false;
  }

  isOkidoki(): boolean {
    if (this.ok) {
      return this.name === '沖ドキ!';
    }
    return false;
  }

  isTriple(): boolean {
    if (this.ok) {
      return 0 < this.name.indexOf('トリプル');
    }
    return false;
  }
}
