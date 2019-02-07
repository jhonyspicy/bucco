import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import Machine from './Machine';
import {bucco} from '../lib/Includes/Util';
import Cheerio = require('cheerio');
import AjaxParams = bucco.AjaxParams;
import API = bucco.API;

@Component({
  template: require('./Equipment.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Machine,
  },
})
export default class Equipment extends Vue {
  @Prop() params: AjaxParams; // onClickの値がテキストで入っている
  machineParams: string[]  = [];
  private ch: CheerioStatic = Cheerio.load('');
  static promise: Promise<any> = Promise.resolve();

  get name(): string {
    return this.ch('#machine_name a').text();
  }

  get hallName(): string {
    return this.ch('#hall_name').text();
  }

  // methods
  start(event: Event) {
    if (event) event.preventDefault();

    this.ch = Cheerio.load(document.documentElement.innerHTML);
  }

  @Watch('ch') onLoadHtml(newValue: CheerioStatic, oldValue: CheerioStatic) {
    this.machineParams = [];
    if (newValue) {
      newValue('#20slot').closest('table').find('tr:nth-child(n + 2)').each((index, element) => {
        const elem    = newValue(element);
        const onClick = elem.find('[name=select]').attr('onclick') || '';
        this.machineParams.push(onClick);
      });
    }

    return newValue;
  }

  // ライフサイクル
  @Emit() created() {
    if (this.params) {
      API.send(this.params);
    }
  }
}
