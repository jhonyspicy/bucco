import Equipment from '../Equipment/Equipment';
import {interfaces, functions} from '../Includes/Util';
import getBaseUrl = functions.getBaseUrl;
import Base = interfaces.Base;
import AjaxParams = interfaces.AjaxParams;
import * as $ from 'jquery';

/**
 * 台の詳細情報
 */
export default class Machine extends Base {
  $dom: JQuery = $(`
    <div class="ultraMachine">マシーン！</div>
  `);
  protected _params: AjaxParams;
  private _historyParams: AjaxParams;

  constructor(private _equipment?: Equipment) {
    super();
  }

  /**
   * 直接作成された時に呼ばれる、
   */
  init(): void {
    const $html: JQuery = $('html');
    this.append($html);
    this.convertHtml($html).then(() => {
      // 全ての処理が終了
      this.resolve();
    });
  }

  /**
   * 直接作成された時に呼ばれる、
   */
  append($html: JQuery): void {
    this.$dom.insertAfter('#some_element');
  }

  convertHtml($html: JQuery): Promise<any> {
    return new Promise(((resolve, reject) => {
      console.log('Machine の読み込みが終わったポイよ！！')
      resolve();
    }));
  }

  /**
   * Ajaxで詳細を取得するためのパラメーターを作る
   *
   * @param cd
   * @param num
   */
  setDetailParams($html: JQuery, cd: any, num: any) {
    const $form  = this.getForm('dat', $html);
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

    this._params = {
      method,
      url,
      data,
    };
  }

  /**
   * Ajaxで履歴を取得するためのパラメーターを作る
   *
   * @param $html
   * @param num
   */
  setHistoryParams($html: JQuery, num: any) {
    const $form  = this.getForm('his', $html);
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

  private resolve() {
  }

  /**
   * form の名前を取得する
   *
   * @param name
   */
  private static getFormName(name: string): string {
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

  private getForm(name: string, $html: JQuery): JQuery {
    const formName = Machine.getFormName(name);
    return $html.find(`form[name=${formName}]`);
  }
}
