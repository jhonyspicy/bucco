import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop} from 'vue-property-decorator';
import {bucco, functions} from '../includes/util';
import Cheerio = require('cheerio');
import AjaxParams = bucco.AjaxParams;
import ajax = functions.ajax;
import Normal from './machineType/Normal'

@Component({
  template: require('./Machine.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Normal,
  },
})
export default class Machine extends Vue {
  @Prop() params: AjaxParams; // onClickの値がテキストで入っている
  promise: Promise<any> = Promise.resolve();
  private ch: CheerioStatic    = Cheerio.load('');

  get ok(): boolean {
    // @ts-ignore
    return !!this.ch.text();
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
    return false;
  }

  isOkidoki(): boolean {
    return false;
  }

  isTriple(): boolean {
    return false;
  }
}
