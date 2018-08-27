import Machine from './Machine';

export default class Hall {
  private _name: string;
  private _date: Date;
  private _machines: [Machine];

  constructor() {}

  set name(name: string) {
    this._name = name;
  }

  set date(date: string) {
    this._date = new Date(date);
  }

  addMachine(machine: Machine) {
    this._machines.push(machine);
  }

  update() {}
}
