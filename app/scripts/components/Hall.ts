import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  template: require('./Hall.html') // html-loaderを使うと外部のhtmlファイルを読み込める
})
export default class Hall extends Vue {
  // data
  hoge: string = 'こんにちは';

  // methods
  onClick() {
    this.hoge = 'さようなら';
  }
}
