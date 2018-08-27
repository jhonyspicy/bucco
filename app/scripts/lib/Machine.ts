import Graph from './Graph';

export default class Machine {
    private _name: string;
    private _date: string;
    number: number;
    $elem: JQuery;

    constructor(num: number, $elem: JQuery) {
        this.number = num;
        this.$elem = $elem;
    }

    set name(name: string) {
        this._name = name;
    }

    set date(date: string) {
        this._date = date;
    }

    setDetail(){}
    setHistory(){}
    update() {}
}
