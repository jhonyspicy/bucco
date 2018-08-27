export default class Hall {
  private _name: string;
  private _date: string;

  constructor() {
  }

  set name(name: string) {
    this._name = name;
  }

  set date(date: string) {
    this._date = date;
  }

  addMachine() {}

  update(){}
}
