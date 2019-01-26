import {interfaces, functions} from '../Includes/Util';
import getBaseUrl = functions.getBaseUrl;
import Base = interfaces.Base;
import AjaxParams = interfaces.AjaxParams;
import Machine from '../Machine/Machine';
import * as $ from 'jquery';
import Hall from '../Hall/Hall';

/**
 * 複数のMachineを管理する
 */
export default class Equipment extends Base {
  $dom: JQuery          = $(`
    <div class="ultraEquipment "></div>
  `);
  promise: Promise<any> = Promise.resolve();

  private _machines: Machine[] = [];
  protected _params: AjaxParams;

  constructor(private _hall?: Hall) {
    super();
  }

  append(): void {
    this.$dom.insertAfter('#some_element');
  }

  /**
   * 台一覧ページのHTMLから台詳細のオブジェクトを生成して
   * パラメーターをセットしていく
   *
   * @param $html
   */
  convertHtml($html: JQuery): Promise<any> {
    return new Promise(((resolve, reject) => {
      $html.find('#ata0 .ind').first().each((i, elem) => {
        const $elem             = $(elem);
        const datHref           = $elem.find('.det a').attr('href') || '';
        const hisHref           = $elem.find('.his a').attr('href') || '';
        const num               = parseInt($elem.find('.num').text());
        const machine           = this.makeMachine(num);
        const openDedamaDetail  = machine.setDetailParams.bind(machine, $html);
        const tableHistoryClick = machine.setHistoryParams.bind(machine, $html);

        eval(datHref); // openDedamaDetail() を実行している。
        eval(hisHref); // tableHistoryClick() を実行している。

        this.promise = machine.run(this.promise);
      });

      this.promise.then(() => {
        this.resolve();
        resolve();
      });
    }));
  }

  /**
   * 台一覧ページの取得に必要なパラメーターをセットする
   *
   * @param $html
   * @param kindCode
   * @param modelCode
   * @param edaNo
   * @param actionType
   * @param uritanka
   */
  setParams($html: JQuery, kindCode: string, modelCode: string, edaNo: string, actionType: string, uritanka: string): void {
    const $form  = this.getForm();
    const method = $form.attr('method') || '';
    const action = $form.attr('action') || '';
    const url    = getBaseUrl() + action;
    const data   = {} as any;

    $form.find('[name]').each((i, elem) => {
      const $elem = $(elem);
      const name  = $elem.attr('name') || '';
      data[name]  = $elem.attr('value') || '';
    });

    data['kindcode']   = kindCode;
    data['modelcode']  = modelCode;
    data['edano']      = edaNo;
    data['actiontype'] = actionType;
    data['forward']    = 'K' +
      'AK' +
      'IN_' +
      'LIST';
    data['uritanka']   = uritanka;

    this._params = {
      method,
      url,
      data,
    };
  }

  private resolve() {
    console.log('Equipmentの読み込み終了');
  }

  private makeMachine(num: number): Machine {
    const machine: Machine = new Machine(this);
    this._machines[num]    = machine;

    this.$dom.find('#some_element').append(machine.$dom);
    return machine;
  }

  private getForm(): JQuery {
    const formName = 'Hall' +
      'Ded' +
      'ama' +
      'Action' +
      'Form';
    return $(`form[name=${formName}]`);
  }
}
