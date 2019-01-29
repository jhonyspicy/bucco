import * as $ from 'jquery';

export module interfaces {
  /**
   * 自身の dom を htm に埋め込む。
   */
  export interface Base2 {
    append(): void;

    convertHtml($html: JQuery): void;
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
            this.load(this._params).then(($html) => {
              return this.convertHtml($html);
            }).then(() => {
              resolve();
            });
          }, 5000);
        });
      });
    }

    load(params: AjaxParams): Promise<any> {
      return new Promise(((resolve, reject) => {
        let isRetry = false;

        $.ajax({
          method: params.method,
          url: params.url,
          data: params.data,
          dataType: 'html',
          success: function (html) {
            const $html = $(html);
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

