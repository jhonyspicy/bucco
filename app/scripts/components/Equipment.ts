import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import Cheerio = require('cheerio');
import Machine from './Machine';
import {bucco, functions} from '../lib/Includes/Util';
import ajax = functions.ajax;
import AjaxParams = bucco.AjaxParams;

@Component({
  template: require('./Equipment.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Machine,
  },
})
export default class Equipment extends Vue {
  @Prop({type: String})
  params: string;

  machineParams: string[] = [];
  private c: CheerioStatic = Cheerio.load('');

  get name(): string {
    if (this.c) {
      return this.c('#machine_name a').text();
    }
    return '';
  }

  get hallName(): string {
    if (this.c) {
      return this.c('#hall_name').text();
    }
    return '';
  }

  // methods
  start(event: Event) {
    if (event) event.preventDefault()

    this.c = Cheerio.load(document.documentElement.innerHTML);
  }

  @Watch('c', { immediate: true, deep: true })
  onLoadHtml(newValue: CheerioStatic, oldValue: CheerioStatic) {
    this.machineParams = [];
    if (newValue) {
      newValue('#20slot').closest('table').find('tr:nth-child(n + 2)').each((index, element) => {
        const elem     = newValue(element);
        const onClick = elem.find('[name=select]').attr('onclick') || '';
        this.machineParams.push(onClick);
      });
    }

    return newValue;
  }

  // ライフサイクル
  @Emit()
  created() {
    if (this.params) {
      ajax({} as AjaxParams).then((html: string) => {
        // TODO
        console.log('todo');
        this.c = Cheerio.load(html);
      });
    }
  }
}
