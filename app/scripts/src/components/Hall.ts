import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import Equipment from './Equipment';
import {bucco, functions} from '../includes/util';
import TotalInfo from './TotalInfo';
import Cheerio = require('cheerio');
import getBaseUrl = functions.getBaseUrl;
import AjaxParams = bucco.AjaxParams;
import BasicData = bucco.BasicData;

@Component({
  template: require('./Hall.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Equipment,
    TotalInfo,
  },
})
export default class Hall extends Vue {
  @Prop() params: string;
  paramsList: AjaxParams[] = [];
  promise: Promise<any> = Promise.resolve();
  private ch: CheerioStatic = Cheerio.load('');

  get name(): string {
    return this.ch('#hall_name').text();
  }

  get ok(): boolean {
    // @ts-ignore
    return !!this.ch.text();
  }

  get allTotalInfo(): BasicData[] {
    return this.$store.getters.totalInfo(false);
  }

  get islandNumberList(): number[][] {
    return this.$store.getters.islandNumberList;
  }

  getTotalInfo(numberList: number[]): BasicData[] {
    return this.$store.getters.totalInfo(numberList);
  }

  // methods
  start(event: Event) {
    event.preventDefault();
    this.ch = Cheerio.load(document.documentElement.innerHTML);

    // ホール名をStoreに設定する
    this.$store.dispatch('hallName', {hallName: this.ch('#hall_name').text()});
  }

  @Watch('ch') onLoadHtml(ch: CheerioStatic) {
    this.paramsList = [];
    if (this.ok) {
      let begin20 = false;
      ch('#20slot').closest('table').find('tr').each((index, element): boolean|any => {
        // ch('#20slot').closest('table').find('tr:nth-child(2), tr:nth-child(3)').each((index, element) => {
        const $elem = Cheerio(element);
        const titleCellRegex = new RegExp('【.*】スロ');

        if (titleCellRegex.test($elem.text())) {
          if ($elem.text().indexOf('【2' + '0】ス' + 'ロ') === -1) {
            if (begin20) {
              // 20スロのエリアが終わったらループ終了
              return false;
            }
          } else {
            begin20 = true;
            return;
          }
        }

        const onClick = $elem.find('[name=select]').attr('onclick') || '';
        const listClick = this.getParams.bind(this, ch);
        const params: AjaxParams = eval(onClick); // listClick() を実行している。

        this.paramsList.push(params);
      });
    }
  }

  // ライフサイクル
  @Emit() created() {
  }


  /**
   * 台一覧ページの取得に必要なパラメーターをセットする
   *
   * @param ch
   * @param kindCode
   * @param modelCode
   * @param edaNo
   * @param actionType
   * @param uritanka
   */
  private getParams(
    ch: CheerioStatic,
    kindCode: string,
    modelCode: string,
    edaNo: string,
    actionType: string,
    uritanka: string
  ): AjaxParams {
    const formName = 'Hall' +
      'Ded' +
      'ama' +
      'Action' +
      'Form';
    const $form = ch(`form[name=${formName}]`);
    const method = $form.attr('method') || '';
    const action = $form.attr('action') || '';
    const url = getBaseUrl() + action;
    const data = {} as any;

    $form.find('[name]').each((i, elem) => {
      const $elem = Cheerio(elem);
      const name = $elem.attr('name') || '';
      data[name] = $elem.attr('value') || '';
    });

    data['kindcode'] = kindCode;
    data['modelcode'] = modelCode;
    data['edano'] = edaNo;
    data['actiontype'] = actionType;
    data['forward'] = 'K' +
      'AK' +
      'IN_' +
      'LIST';
    data['uritanka'] = uritanka;

    return {
      method,
      url,
      data,
    };
  }
}
