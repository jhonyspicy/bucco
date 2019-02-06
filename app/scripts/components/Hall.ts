import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import Equipment from './Equipment';
import Machine from './Machine';
import Cheerio = require('cheerio');

@Component({
  template: require('./Hall.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Equipment,
    Machine,
  },
})
export default class Hall extends Vue {
  // data
  @Prop({type: String})
  params: string;

  equipmentParams: string[] = [];
  private c: CheerioStatic = Cheerio.load('');

  get name(): string {
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
    this.equipmentParams = [];
    if (newValue) {
      newValue('#20slot').closest('table').find('tr:nth-child(n + 2)').each((index, element) => {
        const elem     = newValue(element);
        const onClick = elem.find('[name=select]').attr('onclick') || '';
        this.equipmentParams.push(onClick);
      });
    }

    return newValue;
  }

  // ライフサイクル
  @Emit()
  created() {
    // if (this.html) {
    //   this.$ = Cheerio.load(this.html);
    // }
  }
}
