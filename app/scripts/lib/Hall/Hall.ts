import Machine from '../Machine/Machine';
import Hanahana from '../Machine/Hanahana';
import * as $ from 'jquery';
import Chart = require('chart.js');

enum PachinkoOrSlot {
  Pachinko,
  Slot
}

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

  private _machines: Machine[] = [];

  public date: Date;
  public readonly name: string;
  public readonly machineName: string;
  public readonly pachinkoOrSlot: PachinkoOrSlot;
  public promise: Promise<any> = Promise.resolve();

  constructor() {
    const $html = $('html');
    this.name = $html.find('#hall_name').text();
    this.date = new Date($html.find('#hall_date').text().split('|')[1].trim().split('：')[1]);
    this.machineName = $('#machine_name a').text();
    if ($('#machine_name').text().match(/パチ$/)) {
      this.pachinkoOrSlot = PachinkoOrSlot.Pachinko;
    } else {
      this.pachinkoOrSlot = PachinkoOrSlot.Slot;
    }

    for (let i = 0; i < $('.past_days_right tr td').length; i++) {
      this.$dom.find('.buccoHall__info__sales').append('<li class="buccoHall__info__sales__sale"></li>');
    }
  }

  makeMachine(number: number) {
    let machine: Machine = new Machine(this, number);

    if (Hanahana.amI(this.machineName)) {
      machine = new Hanahana(this, number);
    }

    this._machines[number] = machine;
    this.$dom.find('.buccoHall__content').append(machine.$dom);

    return machine;
  }

  isPachinko() {
    return this.pachinkoOrSlot === PachinkoOrSlot.Pachinko;
  }

  isSlot() {
    return this.pachinkoOrSlot === PachinkoOrSlot.Slot;
  }

  isCorner(num: number) {
    return false;
  }
}
