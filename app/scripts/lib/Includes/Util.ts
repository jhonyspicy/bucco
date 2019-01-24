/**
 * 自身の dom を htm に埋め込む。
 */
export interface Base {
  append(): void;
  convertHtml($html: JQuery): void;
}

export interface AjaxParams {
  method: string;
  url: string;
  data: any;
}

/**
 * ベースのURLを取得する
 */
export function getBaseUrl(): string {
  return location.href.replace(/\/[^\/]*$/, '/');
}
