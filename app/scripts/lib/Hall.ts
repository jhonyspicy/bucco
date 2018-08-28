import Machine from './Machine';
import * as $ from "jquery";

export default class Hall {
  private _name: string;
  private _date: Date;
  private _machines = {} as any;
  private readonly _$dom: JQuery;

  constructor() {
    this._$dom = $(`
      <div class="buccoHall">
        <div class="buccoHall__content"></div>
        <div class="buccoHall__status"></div>
      </div>
    `);
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

  addMachine(machine: Machine) {
    this._machines.push(machine);
  }

  getMachine(tablenum: string): Machine {
    let machine = this._machines[tablenum];
    if (!machine) {
      machine = new Machine();
      this._machines[tablenum] = machine;

      this.$dom.find('.buccoHall__content').append(machine.$dom);
    }

    return machine;
  }

  pickup() {}

  update() {}
}
