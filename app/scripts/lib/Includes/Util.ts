import * as $ from 'jquery';

export module bucco {
  /**
   * Ajaxを実行できる回数に制限があるので
   * それを超えないようにAjaxを管理する。
   */
  export class Ajax {
    static promise: Promise<any> = Promise.resolve();

    static send(params: AjaxParams): Promise<JQuery> {
      return new Promise((resolve1, reject1) => {
        Ajax.promise = Ajax.promise.then(() => {
          return new Promise(((resolve2, reject2) => {
            let isRetry = false;

            $.ajax({
              method  : params.method,
              url     : params.url,
              data    : params.data,
              dataType: 'html',
              success : function (html) {
                const $html: JQuery = $(html);
                if (!$html.find('#machine_name').length) {
                  if (!isRetry) {
                    isRetry = true;
                    console.log('Too many request wait a moment');
                    setTimeout(() => {
                      $.ajax(this);
                    }, 60000);

                    return;
                  }

                  // 2回連続で失敗したら停止させる
                  reject2('stop loading. please reload your browser.');
                  return;
                }

                console.log('get success!!');
                resolve2();
                resolve1($html);
              },
              error   : (e) => {
                // クッキーが切れたか何か、ブラウザのリロードが必要だはず。
                reject2('something wrong');
              },
            });
          }));
        });
      });
    }
  }

  export class Base {
    protected _params: AjaxParams;

    append($html: JQuery): void {
    }

    convertHtml($html: JQuery): void {
    }

    run(promise: Promise<any>): Promise<any> {
      return promise.then(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            Ajax.send(this._params).then(($html) => {
              return this.convertHtml($html);
            }).then(() => {
              resolve();
            });
          }, 5000);
        });
      });
    }

    /**
     * 直接作成された時に呼ばれる、
     * 機種一覧ならHall.init()が呼ばれ
     * 台一覧ならEquipment.init()が呼ばれ
     * 詳細ページならMachine.init()が呼ばれる
     */
    init(): void {}
  }

  /**
   * Ajaxに必要なパラメーター
   */
  export interface AjaxParams {
    method: string;
    url: string;
    data: any;
  }
}

export module functions {
  /**
   * ベースのURLを取得する
   */
  export function getBaseUrl(): string {
    return location.href.replace(/\/[^\/]*$/, '/');
  }
}

