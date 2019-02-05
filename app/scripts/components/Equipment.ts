import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import Cheerio = require('cheerio');

@Component({
  template: require('./Equipment.html') // html-loaderを使うと外部のhtmlファイルを読み込める
})
export default class Equipment extends Vue {
  private $: CheerioStatic;

  @Prop({ type: String })
  html: string;

  @Prop({ type: String })
  attrOnClick: string;

  @Watch('html')
  onUpdateHtml() {
    this.$ = Cheerio.load(this.html);
  }

  // ライフサイクル
  @Emit()
  created() {
    if (this.html) {
      this.$ = Cheerio.load(this.html);
    } else if (this.attrOnClick) {

    }
  }
}
