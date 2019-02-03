import * as $ from 'jquery';

export namespace bucco {
  /**
   * Ajaxに必要なパラメーター
   */
  export interface AjaxParams {
    method: string;
    url: string;
    data: any;
  }
}

export namespace functions {
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
    if (document.querySelector('[alt="パチスロ設置機種一覧"]') === null) {
      return false;
    }

    if (document.getElementById('20slot') === null) {
      return false;
    }

    return  true;
  }

  /**
   * 現在のページが台一覧かどうか
   */
  export function isEquipmentPage(): boolean {
    if (document.querySelector('#ded' + 'ama' + '_table') === null) {
      return false;
    }

    const $machineName = <HTMLElement> document.querySelector('#machine_name');
    const machineName = $machineName === null ? '' : $machineName.innerText;
    if (machineName.indexOf('【20】スロ') === -1) {
      return false;
    }

    return  true;
  }

  /**
   * 現在のページが台詳細かどうか
   */
  export function isMachinePage(): boolean {
    if (document.querySelector('[alt="出' + '玉詳' + '細"]') === null) {
      return false;
    }

    const $machineName = <HTMLElement> document.querySelector('#machine_name');
    const machineName = $machineName === null ? '' : $machineName.innerText;
    if (machineName.indexOf('【20】スロ') === -1) {
      return false;
    }

    return  true;
  }
}

