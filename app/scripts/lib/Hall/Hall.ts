import Machine from '../Machine/Machine';
import * as $ from 'jquery';
import Chart = require('chart.js');

export default class Hall {
  public readonly $dom: JQuery = $(`
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

  private _machines = {} as any;
  private _sales: number[] = [];
  private _chartCoinRate: Chart;
  private _showIndex: number = -1;

  public date: Date;
  public readonly name: string;
  public promise: Promise<any> = Promise.resolve();


  constructor() {
    const $html = $('html');
    this.name = $html.find('#hall_name').text();
    this.date = new Date($html.find('#hall_date').text().split('|')[1].trim().split('：')[1]);

    for (let i = 0; i < $('.past_days_right tr td').length; i++) {
      this.$dom.find('.buccoHall__info__sales').append('<li class="buccoHall__info__sales__sale"></li>');
    }

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

  set status(status: string) {
    this.$dom.find('.buccoHall__status').text(status);
  }

  private showNext() {
    this._showIndex++;
    const max = this.$dom.find('.buccoMachine').length - 1;

    if (max < 0) {
      return;
    }

    if (max < this._showIndex) {
      this._showIndex = 0;
    }

    let $target = this.$dom.find('.buccoMachine').eq(this._showIndex);
    $('html').scrollTop($target.position().top);
  }

  private showPrev() {
    this._showIndex--;
    const max = this.$dom.find('.buccoMachine').length - 1;

    if (max < 0) {
      return;
    }

    if (this._showIndex < 0) {
      this._showIndex = max;
    }

    let $target = this.$dom.find('.buccoMachine').eq(this._showIndex);
    $('html').scrollTop($target.position().top);
  }

  make(name: string): Machine|boolean {
    switch (name) {
      case 'machine':
        return new Machine(this);
      default:
        return false;
    }
  }

  getMachine(tablenum: string): Machine {
    let machine = this._machines[tablenum];
    if (!machine) {
      machine = new Machine(this);
      this._machines[tablenum] = machine;

      this.$dom.find('.buccoHall__content').append(machine.$dom);

      // 読み込んだら追従させたい。
      // $('html').scrollTop(machine.$dom.position().top);
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

  isCorner(num: number) {
    switch (this.name) {
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
      case ('Ｐ－ｔｉｍｅおもろ'):
        return -1 !== $.inArray(num, [
          706,
          727,
          728,
          760,
          761,
          782,
          783,
          815,
          816,
          837,
          838,
          870,
          871,
          1002,
          1003,
          1025,
          1026,
          1053,
          1061,
          1062,
          1080,
          1081,
          1108,
          1110,
          1130,
        ]);
      case ('Ｐ－ｔｉｍｅ壷屋'):
        return -1 !== $.inArray(num, [
          351,
          370,
          371,
          500,
          501,
          520,
          521,
          550,
          651,
          670,
          671,
          700,
          701,
          720,
          721,
          750,
        ]);
      default:
        return false;
    }
  }

  pickup() {}

  update() {}
}
