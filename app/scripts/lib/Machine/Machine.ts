/**
 * 台の詳細情報
 */
import {Base, AjaxParams} from "../Includes/Util";
import {getBaseUrl} from "../Includes/Util";

export default class Machine implements Base {
  $dom:JQuery = $(`
    <div class="ultraHall"></div>
  `)
  private _detailParams: AjaxParams;
  private _historyParams: AjaxParams;


  append(): void {
    this.$dom.insertAfter('#some_element');
  }
  convertHtml($html: JQuery): void {
  }

  /**
   * Ajaxで詳細を取得するためのパラメーターを作る
   *
   * @param cd
   * @param num
   */
  setDetailParams(cd: any, num: any) {
    const $form  = this.getForm('dat');
    const method = $form.attr('method') || '';
    const action = $form.attr('action') || '';
    const url    = getBaseUrl() + action;
    const data   = {} as any;

    $form.find('[name]').each((i, elem) => {
      const $elem = $(elem);
      const name  = $elem.attr('name') || '';
      data[name]  = $elem.attr('value') || '';
    });

    data.tablenum = num;
    data.forward  = 'K' +
      'AK' +
      'IN_' +
      'TABLE' +
      'SELECT';

    if (cd === 1) {
      data.actiontype = '12';
    } else {
      data.actiontype = '14';
    }

    this._detailParams = {
      method,
      url,
      data,
    };
  }

  /**
   * Ajaxで履歴を取得するためのパラメーターを作る
   *
   * @param num
   */
  setHistoryParams(num: any) {
    const $form  = this.getForm('his');
    const method = $form.attr('method') || '';
    const action = $form.attr('action') || '';
    const url    = getBaseUrl() + action;
    const data   = {} as any;

    $form.find('[name]').each((i, elem) => {
      const $elem = $(elem);
      const name  = $elem.attr('name') || '';
      data[name]  = $elem.attr('value') || '';
    });

    data.tablenum = num;

    this._historyParams = {
      method,
      url,
      data,
    };
  }
  /**
   * form の名前を取得する
   *
   * @param name
   */
  private getFormName(name: string): string {
    if (name === 'dat') {
      return 'Table' +
        'Select' +
        'Action' +
        'Form';
    } else {
      return 'Table' +
        'History' +
        'Action' +
        'Form';
    }
  }

  private getForm(name: string): JQuery {
    const formName = this.getFormName(name);
    return $(`form[name=${formName}]`);
  }
}
