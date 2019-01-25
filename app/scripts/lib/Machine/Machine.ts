import Equipment from '../Equipment/Equipment';
import {interfaces, functions} from '../Includes/Util';
import getBaseUrl = functions.getBaseUrl;
import Base = interfaces.Base;
import AjaxParams = interfaces.AjaxParams;
import * as $ from "jquery";

/**
 * 台の詳細情報
 */
export default class Machine implements Base {
  $dom: JQuery = $(`
    <div class="ultraMachine"></div>
  `);
  private _detailParams: AjaxParams;
  private _historyParams: AjaxParams;
  private _resolve: (value?: any) => void;

  constructor(private _equipment?: Equipment) {
  }

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

  load(): Promise<any> {
    return new Promise(((resolve, reject) => {
      let isRetry = false

      $.ajax({
        method: this._detailParams.method,
        url: this._detailParams.url,
        data: this._detailParams.data,
        dataType: 'html',
        success: function (html) {
          const $html = $(html);
          if (!$html.find('#machine_name').length) {
            if (!isRetry) {
              isRetry = true;
              console.log('Too many request wait a moment');
              setTimeout(() => {
                $.ajax(this)
              }, 60000);

              return;
            }

            // 2回連続で失敗したら停止させる
            reject('stop loading. please reload your browser.');
            return;
          }

          console.log('get success!!');
          resolve($html);
        },
        error: (e) => {
          // クッキーが切れたか何か、ブラウザのリロードが必要だはず。
          reject('something wrong');
        },
      });
    }));
  }

  run(promise: Promise<any>): Promise<any> {
    return promise.then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.load().then(() => {
            resolve();
          });
        }, 5000)
      });
    })
  }

  private resolve() {
    this._resolve();
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
