import Machine from './Machine';
import * as $ from "jquery";
import Chart = require("chart.js");

export default class Hall {
  private _name: string;
  private _date: Date;
  private _machines = {} as any;
  private readonly _$dom: JQuery;
  private _chart: Chart;

  constructor() {
    this._$dom = $(`
      <div class="buccoHall">
        <div class="buccoHall__chart"><canvas></canvas></div>
        <div class="buccoHall__content"></div>
        <div class="buccoHall__status"></div>
      </div>
    `);

    const canvas = this.$dom.find('.buccoHall__chart canvas').get(0) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this._chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgba(255, 27, 75, 0.2)',
          borderColor: 'rgb(255, 27, 75)',
          data: []
        }]
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

  addMachine(machine: Machine) {
    this._machines.push(machine);
  }

  getMachine(tablenum: string): Machine {
    let machine = this._machines[tablenum];
    if (!machine) {
      machine = new Machine(this);
      machine.callback = ()=> {
        this.addScatterData({
          x: machine.coinRate,
          y: machine.nowCoin
        });
      };
      this._machines[tablenum] = machine;

      this.$dom.find('.buccoHall__content').append(machine.$dom);
    }

    return machine;
  }

  addScatterData(scatterData: {x: number, y: number}) {
    const data = this._chart.data as any;

    data.datasets[0].data.push(scatterData);
    this._chart.update();
  }

  pickup() {}

  update() {}
}
