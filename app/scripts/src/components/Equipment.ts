import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop, Watch} from 'vue-property-decorator';
import {bucco, functions} from '../includes/util';
import Island from './Island';
import TotalInfo from './TotalInfo';
import Cheerio = require('cheerio');
import AjaxParams = bucco.AjaxParams;
import Side = bucco.Side;
import ajax = functions.ajax;
import getBaseUrl = functions.getBaseUrl;
import MachinePosition = bucco.MachinePosition;
import arrayPack = functions.arrayPack;

@Component({
  template: require('./Equipment.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
  components: {
    Island,
    TotalInfo,
  },
})
export default class Equipment extends Vue {
  @Prop() params: AjaxParams; // onClickの値がテキストで入っている
  paramsList: AjaxParams[]  = [];
  islands: any[]            = [];
  isShow: boolean           = true;
  isOwn: boolean            = false;
  promise: Promise<any>     = Promise.resolve();
  private ch: CheerioStatic = Cheerio.load('');
  private finish            = () => {
  };

  get name(): string {
    return this.ch('#machine_name a').text();
  }

  get hallName(): string {
    return this.ch('#hall_name').text();
  }

  get ok(): boolean {
    // @ts-ignore
    return !!this.ch.text();
  }

  get machineIdList(): number[] {
    return this.paramsList.map(function (params) {
      return params.id || 0;
    });
    // this.$store.getters.aa();
  }

  get totalInfo(): number {
    return this.$store.getters.totalInfo(this.machineIdList);
  }

  // methods
  start(event: Event) {
    event.preventDefault();
    this.ch = Cheerio.load(document.documentElement.innerHTML);

    // ホール名をStoreに設定する
    this.$store.dispatch('hallName', {hallName: this.ch('#hall_name').text()});
  }

  toggleShow() {
    this.isShow = !this.isShow;
  }

  @Watch('ch') onLoadHtml(ch: CheerioStatic) {
    if (this.ok) {
      this.paramsList = [];

      ch('#ata0 .ind').each((index, element) => {
        const $elem            = Cheerio(element);
        const datHref          = $elem.find('.det a').attr('href') || '';
        const openDedamaDetail = this.getParams.bind(this);

        const params: AjaxParams = eval(datHref); // openDedamaDetail() を実行している。
        params.id = parseInt($elem.find('.num').text());

        this.paramsList.push(params);
      });

      this.islands = [];
      const islands: any[] = [];
      if (this.$store.getters.isSupportHall) {
        this.paramsList.forEach((params) => {
          const p: MachinePosition = this.$store.getters.position(params.id);
          islands[p.island] = islands[p.island] || {};
          islands[p.island][p.side] = islands[p.island][p.side] || [];
          islands[p.island][p.side][p.order] = params;
        });
        this.islands = arrayPack(islands).map((island) => {
          /*
          配列のindexが0から始まっているとは限らないので(islands[5]みたいな)
          0から順番になるようにする
           */
          for (let key in Side) {
            const side = Side[key]; // left or right

            if (Object.keys(island).indexOf(side) !== -1) {
              island[side] = arrayPack(island[side]);
            }
          }

          return island;
        });
      } else {
        const island = {
          left: this.paramsList.slice(0, this.paramsList.length / 2),
          right: this.paramsList.slice(this.paramsList.length / 2),
        };
        this.islands.push(island);
      }

      this.finish();
    }
  }

  // ライフサイクル
  @Emit() created() {
    if (this.params) {
      this.isOwn = false;
      this.$parent.$data.promise = this.$parent.$data.promise.then(() => {
        return new Promise((resolve, reject) => {
          this.finish = resolve;
          ajax(this.params).then(($html: CheerioStatic) => {
            this.ch = $html;
          });
        });
      });
    } else {
      this.isOwn = true;
    }
  }

  private getParams(
    cd: any,
    num: any
  ) {
    const formName =  'Table' + 'Select' + 'Action' + 'Form';
    const $form    = this.ch(`form[name=${formName}]`);
    const method   = $form.attr('method') || '';
    const action   = $form.attr('action') || '';
    const url      = getBaseUrl() + action;
    const data     = {} as any;

    $form.find('[name]').each((i, elem) => {
      const $elem = Cheerio(elem);
      const name  = $elem.attr('name') || '';
      data[name]  = $elem.attr('value') || '';
    });

    data.tablenum = num;
    data.forward  = 'K' +
      'AK' +
      'IN_' +
      'TABLE' +
      'SELECT';

    if (cd === 1) {
      data.actiontype = '12';
    } else {
      data.actiontype = '14';
    }

    return {
      method,
      url,
      data,
    };
  }
}
