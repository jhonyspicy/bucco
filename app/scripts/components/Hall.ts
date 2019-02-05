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
  @Prop({ type: String })
  html: string;

  attrOnClicks: string[] = [];
  private $: CheerioStatic;

  get name(): string {
    if (this.$) {
      return this.$('#hall_name').text();
    }
    return '';
  }

  // methods
  start(event: Event) {
    if (event) event.preventDefault()

    this.$ = Cheerio.load(this.html);
    console.log('a');
  }

  @Watch('$', { immediate: true, deep: true })
  onLoadHtml(newValue: CheerioStatic, oldValue: CheerioStatic) {
    this.attrOnClicks = [];
    if (newValue) {
      newValue('#20slot').closest('table').find('tr:nth-child(n + 2)').each((index, element) => {
        const elem     = newValue(element);
        const onClick = elem.find('[name=select]').attr('onclick') || '';
        this.attrOnClicks.push(onClick);
      });
    }

    return newValue;
  }
}
