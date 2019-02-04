import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import Cheerio = require('cheerio');
import Equipment from "./Equipment";
import Machine from "./Machine";

@Component({
  template: require('./Hall.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Equipment,
    Machine,
  },
})
export default class Hall extends Vue {
  private $: CheerioStatic;

  // data
  @Prop({ type: String })
  html: string;

  hoge: string = 'こんにちは';

  get name(): string {
    return this.$('#hall_name').text();
  }

  get equipments(): CheerioElement[] {
    return this.$('#20slot').closest('table').find('tr:nth-child(n + 2)').toArray();
  }

  // methods
  onClick() {
    this.hoge = 'さようなら';
  }

  // ライフサイクル
  @Emit()
  created() {
    this.$ = Cheerio.load(this.html);
  }
}
