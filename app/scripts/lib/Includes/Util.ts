export module interfaces {
  /**
   * 自身の dom を htm に埋め込む。
   */
  export interface Base {
    append(): void;

    convertHtml($html: JQuery): void;
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

