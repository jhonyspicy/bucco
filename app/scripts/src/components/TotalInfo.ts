import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import {bucco, functions} from '../includes/util';
import BasicData = bucco.BasicData;

@Component({
  template: require('./TotalInfo.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
})
export default class TotalInfo extends Vue {
  @Prop() totalInfo: BasicData[]; // onClickの値がテキストで入っている
}
