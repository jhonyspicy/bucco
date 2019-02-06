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

    if (document.getElementById('20s' + 'lot') === null) {
      return false;
    }

    return  true;
  }

  /**
   * 現在のページが台一覧かどうか
   */
  export function isEquipmentPage(): boolean {
    if (document.querySelector('#d' + 'ed' + 'ama' + '_table') === null) {
      return false;
    }

    const $machineName = <HTMLElement> document.querySelector('#mach' + 'ine_name');
    const machineName = $machineName === null ? '' : $machineName.innerText;
    if (machineName.indexOf('【2' + '0】ス' + 'ロ') === -1) {
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

  export function ajax(params: AjaxParams) {
    return new Promise(((resolve, reject) => {
      // TODO
      resolve('');
    }));
  }
}

