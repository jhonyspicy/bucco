import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import {bucco} from '../includes/util';
import Machine from './Machine';
import AjaxParams = bucco.AjaxParams;

@Component({
  template: require('./Island.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Machine,
  },
})
export default class Island extends Vue {
  @Prop() islandData: AjaxParams; // onClickの値がテキストで入っている
}
