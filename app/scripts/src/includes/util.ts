import * as Cheerio from 'cheerio';
import axios from 'axios';

export namespace bucco {
  /**
   * Ajaxに必要なパラメーター
   */
  export interface AjaxParams {
    method: string;
    url: string;
    data: any;
  }

  export interface GraphSrc {
    original: string;
    thumbnail: string;
  }

  export interface MachineInfo {
    number: number;
    name: string;
    results: MachineResult[];
  }

  export interface MachineResult {
    total: number;
    coin: number;
  }
}

export namespace functions {
  import AjaxParams = bucco.AjaxParams;

  /**
   * ベースのURLを取得する
   */
  export function getBaseUrl(): string {
    return location.href.replace(/\/[^\/]*$/, '/');
  }

  /**
   * 現在のページがホールアーカイブページかどうか
   */
  export function isHallPage(): boolean {
    if (document.querySelector('[alt="パ' + 'チ' + 'ス' + 'ロ' + '設置' + '機' + '種一' + '覧"]') === null) {
      return false;
    }

    return document.getElementById('20s' + 'lot') !== null;
  }

  /**
   * 現在のページが台一覧かどうか
   */
  export function isEquipmentPage(): boolean {
    if (document.querySelector('#d' + 'ed' + 'ama' + '_table') === null) {
      return false;
    }

    const $machineName = <HTMLElement>document.querySelector('#mach' + 'ine_name');
    const machineName  = $machineName === null ? '' : $machineName.innerText;
    return machineName.indexOf('【2' + '0】ス' + 'ロ') !== -1;
  }

  /**
   * 現在のページが台詳細かどうか
   */
  export function isMachinePage(): boolean {
    if (document.querySelector('[alt="出' + '玉詳' + '細"]') === null) {
      return false;
    }

    const $machineName = <HTMLElement>document.querySelector('#machine_name');
    const machineName  = $machineName === null ? '' : $machineName.innerText;
    return machineName.indexOf('【20】スロ') !== -1;
  }

  /**
   * Ajaxのリミットに気を使いながら発行する
   * サーバーに負担かけないようにやさしくすること！
   */
  export const ajax = (() => {
    let promise: Promise<any> = Promise.resolve();

    return function (params: AjaxParams) {
      return new Promise(((resolve1, reject1) => {
        promise = promise.then(() => {
          return new Promise(((resolve2, reject2) => {
            function send(retries: number = 0) {
              if (2 < retries) {
                reject2('stop loading. please reload your browser.');
                return;
              }

              const searchParams = new URLSearchParams();
              Object.keys(params.data).forEach(function (key) {
                searchParams.append(key, params.data[key]);
              });

              axios({
                method: params.method,
                url: params.url,
                data: searchParams,
                headers: {
                  'Accept': 'text/html, */*; q=0.01',
                },
              }).then((res: any) => {
                const $html = Cheerio.load(res.data);
                if (0 < $html('#machine_name').length) {
                  // 成功しているようだ！！
                  setTimeout(() => {
                    resolve2();
                    resolve1($html);
                  }, 5000);
                  return;
                }

                console.log('Too many request wait a moment');
                setTimeout(() => {
                  send(++retries);
                }, 60000);
              }).catch(() => {
                reject2('ajax failed. please reload your browser.');
              });
            }

            send(0);
          }));
        });
      }));
    };
  })();
}

