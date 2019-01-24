/**
 * 複数のMachineを管理する
 */
import {AjaxParams, Base, getBaseUrl} from "../Includes/Util";
import Machine from "../Machine/Machine";
import * as $ from "jquery";

export default class Equipment implements Base {
  $dom:JQuery = $(`
    <div class="ultraEquipment "></div>
  `)
  private _machines: Machine[] = [];
  private _params: AjaxParams;

  append(): void {
    this.$dom.insertAfter('#some_element');
  }

  convertHtml($html: JQuery): void {
    $html.find('#ata0 .ind').first().each((i, elem) => {
      const $elem   = $(elem);
      const datHref = $elem.find('.det a').attr('href') || '';
      const hisHref = $elem.find('.his a').attr('href') || '';
      const number = parseInt($elem.find('.num').text());
      const machine = this.makeMachine(number);
      const openDedamaDetail = machine.setDetailParams.bind(machine);
      const tableHistoryClick = machine.setHistoryParams.bind(machine);

      eval(datHref); // openDedamaDetail() を実行している。
      eval(hisHref); // tableHistoryClick() を実行している。
    });
  }

  private makeMachine(number: number): Machine {
    const machine: Machine = new Machine();
    this._machines[number] = machine;

    this.$dom.find('#some_element').append(machine.$dom)
    return machine;
  }

  setParams(kindCode: string, modelCode: string, edaNo: string, actionType: string, uritanka: string): void {
    const $form = this.getForm()
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
    data['hallcode']   = ''; // TODO: hallcodeを取得する
    data['uritanka']   = uritanka;

    this._params = {
      method,
      url,
      data,
    };
  };

  private getForm(): JQuery {
    const formName = 'Hall' +
      'Ded' +
      'ama' +
      'Action' +
      'Form';
    return $(`form[name=${formName}]`);
  }
}
