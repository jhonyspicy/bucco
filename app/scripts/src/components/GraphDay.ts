import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop} from 'vue-property-decorator';
import {bucco, functions} from '../includes/util';
import GraphSrc = bucco.GraphSrc;

@Component({
  template: require('./GraphDay.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
})
export default class GraphDay extends Vue {
  @Prop() graph: GraphSrc;
  range = {
    plus: 0,
    minus: 0,
  };

  // ライフサイクル
  @Emit() created() {
    this.$emit('test', 'how');
  }
}
