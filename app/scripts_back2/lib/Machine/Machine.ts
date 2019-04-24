import * as $ from 'jquery';
import Hall from '../Hall/Hall';
import Graph from '../../../scripts_back/lib/Graph';

interface AjaxParams {
  method: string;
  url: string;
  data: any;
}

$.ajaxSetup({
  crossDomain: true
});

export default class Machine {
  private _detailParams: AjaxParams;
  private _historyParams: AjaxParams;
  public readonly $dom: JQuery = $();

  constructor(private _hall: Hall, public readonly number: number) {
  }

  loadDetail() {
    const promise = new Promise(((resolve, reject) => {
      if (this.existLocalStorage()) {
        this.loadDetailFromStorage().then((data) => {

        });
      } else {
        this.loadDetailFromAjax().then((data) => {

        });
      }
    }))
  }

  setDetailParams(method: string, url: string, data: any) {
    this._detailParams = {
      method,
      url,
      data,
    };
  }

  setHistoryParams(method: string, url: string, data: any) {
    this._historyParams = {
      method,
      url,
      data,
    };
  }

  private existLocalStorage(): boolean {
    return false;
  }

  private loadDetailFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({
        // some data here
      });
    });
  }

  private loadDetailFromAjax() {
    return new Promise(((resolve, reject) => {
      resolve({
        // some data here
      })
    }))
  }
}
