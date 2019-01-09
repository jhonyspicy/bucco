import Machine from './Machine';
import * as $ from "jquery";
import Chart = require("chart.js");

export default class Hall {
  private _machineName:string;
  private _hallName:string;
  private _name: string;
  private _date: Date;
  private _machines = {} as any;
  private _sales: number[] = [];
  private readonly _$dom: JQuery;
  private _chartCoinRate: Chart;
  private _showIndex: number = -1;

  constructor() {
    this._$dom = $(`
      <div class="buccoHall">
        <div class="buccoHall__info">
          <h2 class="buccoHall__info__title">トータル獲得枚数</h2>
          <ul class="buccoHall__info__sales"></ul>
        </div>
        <div class="buccoHall__chartCoinRate"><canvas></canvas></div>
        <div class="buccoHall__content"></div>
        <div class="buccoHall__status"></div>
      </div>
    `);

    for (let i = 0; i < $('.past_days_right tr td').length; i++) {
      this.$dom.find('.buccoHall__info__sales').append('<li class="buccoHall__info__sales__sale"></li>')
    }

    const canvas = this.$dom.find('.buccoHall__chartCoinRate canvas').get(0) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this._chartCoinRate = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgba(255, 27, 75, 0.2)',
          borderColor: 'rgb(255, 27, 75)',
          data: []
        }]
      },
      options: {
        title: {
          display  : true,
          position : 'top',
          fontColor: '#333',
          fontSize : 30,
          text     : '球持 - 獲得',
        },

        legend: {
          display: false
        },

        responsive         : true,
        maintainAspectRatio: false,
      }
    });

    $('html').on('keyup', (e) => {
        switch (e.which) {
          case 39: // Key[→]
            this.showNext();
            break;
          case 37: // Key[←]
            this.showPrev();
            break;
        }
      }
    );
  }

  set name(name: string) {
    this._name = name;
  }

  set machineName(machineName: string) {
    this._machineName = machineName;
  }

  get machineName() {
    return this._machineName;
  }

  set hallName(hallName: string) {
    this._hallName = hallName;
  }

  get hallName() {
    return this._hallName;
  }

  set date(date: string) {
    this._date = new Date(date);
  }

  set status(status: string) {
    this.$dom.find('.buccoHall__status').text(status);
  }

  get $dom() {
    return this._$dom;
  }

  private showNext() {
    this._showIndex++;
    const max = this._$dom.find('.buccoMachine').length - 1;

    if (max < 0) {
      return;
    }

    if (max < this._showIndex) {
      this._showIndex = 0;
    }

    let $target = this._$dom.find('.buccoMachine').eq(this._showIndex);
    $('html').scrollTop($target.position().top);
  }

  private showPrev() {
    this._showIndex--;
    const max = this._$dom.find('.buccoMachine').length - 1;

    if (max < 0) {
      return;
    }

    if (this._showIndex < 0) {
      this._showIndex = max;
    }

    let $target = this._$dom.find('.buccoMachine').eq(this._showIndex);
    $('html').scrollTop($target.position().top);
  }

  getMachine(tablenum: string): Machine {
    let machine = this._machines[tablenum];
    if (!machine) {
      machine = new Machine(this);
      this._machines[tablenum] = machine;

      this.$dom.find('.buccoHall__content').append(machine.$dom);

      // 読み込んだら追従させたい。
      $('html').scrollTop(machine.$dom.position().top);
    }

    return machine;
  }

  addScatterData(scatterData: {x: number, y: number}) {
    const data = this._chartCoinRate.data as any;

    data.datasets[0].data.push(scatterData);
    this._chartCoinRate.update();
  }

  /**
   * 売り上げ
   * @param dayBefore
   * @param sale
   */
  addSale(dayBefore: number, sale: number) {
    this._sales[dayBefore] = this._sales[dayBefore] || 0;
    this._sales[dayBefore] += sale;

    this.$dom.find('.buccoHall__info__sales__sale').eq(dayBefore).text(this._sales[dayBefore]);
  }

  isHana() {
    return this.machineName.indexOf('ハナハナ') !== -1;
  }

  isTriple() {
    return this.machineName.indexOf('トリプルクラウン') !== -1;
  }

  isFestival() {
    return this.machineName.indexOf('フェスティバル') !== -1;
  }

  isCorner(num: number) {
    switch (this.hallName) {
      case ('Ｍ’ｓニューポート'):
        return -1 !== $.inArray(num, [
          156,
          178,
          180,
          212,
          271,
          303,
          305,
          327,
          328,
          361,
          362,
          385,
          386,
          518,
          520,
          552,
          553,
          576,
          577,
          610,
          611,
          633,
          635,
          667
        ]);
      default:
        return false;
    }
  }

  pickup() {}

  update() {}
}
