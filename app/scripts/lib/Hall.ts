import Machine from './Machine';
import * as $ from "jquery";
import Chart = require("chart.js");

export default class Hall {
  private _name: string;
  private _date: Date;
  private _machines = {} as any;
  private _sales: number[] = [];
  private readonly _$dom: JQuery;
  private _chartCoinRate: Chart;

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
  }

  set name(name: string) {
    this._name = name;
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

  getMachine(tablenum: string): Machine {
    let machine = this._machines[tablenum];
    if (!machine) {
      machine = new Machine(this);
      this._machines[tablenum] = machine;

      this.$dom.find('.buccoHall__content').append(machine.$dom);
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

  pickup() {}

  update() {}
}
