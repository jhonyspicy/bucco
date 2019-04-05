import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import {bucco} from "../includes/util";
import IslandInfo = bucco.IslandInfo;

@Component({
  template: require('./Hall.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
  },
})
export default class HeatMap extends Vue {
  @Prop() params: string;

  get isSupportHall(): boolean {
    return this.$store.getters.isSupportHall;
  }

  get islandInfos(): IslandInfo[] {
    return this.$store.getters.islandInfos;
  }

  get hallModuleName(): string {
    return this.$store.getters.islandInfos;
  }

  @Watch('ch') onLoadHtml(ch: CheerioStatic) {
  }

  // ライフサイクル
  @Emit() created() {
  }
}
