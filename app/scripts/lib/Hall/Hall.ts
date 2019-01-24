import {Base, getBaseUrl} from "../Includes/Util";
import * as $ from 'jquery';
import Equipment from "../Equipment/Equipment";

export default class Hall implements Base {
  $dom:JQuery = $(`
    <div class="ultraHall"></div>
  `)

  private _equipments: Equipment[] = [];


  append(): void {
    this.$dom.insertAfter('#some_element');
  }
  convertHtml($html: JQuery): void {
    const $targetTable: JQuery = $html.find('#20slot').closest('table')
    $targetTable.find('tr:nth-child(2)').each((i, elem) => {
      const $elem   = $(elem);
      const onClick = $elem.find('[name=select]').attr('onClick') || '';
      const equipment: Equipment = this.makeEquipment();
      const listClick = this.setParams.bind(null, equipment);


      eval(onClick); // openDedamaDetail() を実行している。
      // const hisHref = $elem.find('.his a').attr('href') || '';
      // const number = parseInt($elem.find('.num').text());
      // const machine = this.makeMachine(number);
      // const openDedamaDetail = this.setDetailParams.bind(null, machine);
      // const tableHistoryClick = this.setHistoryParams.bind(null, machine);
      //
      // eval(datHref); // openDedamaDetail() を実行している。
      // eval(hisHref); // tableHistoryClick() を実行している。
      //
      // machine.loadDetail();
    });
  }

  makeEquipment():Equipment {
    const equipment: Equipment = new Equipment();
    this._equipments.push(equipment);
    this.$dom.find('#some_element').append(equipment.$dom)

    return equipment;
  }


  private setParams(equipment: Equipment, kindCode: string, modelCode: string, edaNo: string, actionType: string, uritanka: string): void {
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
    data['forward']    = 'KAKIN_LIST';
    data['hallcode']   = ''; // TODO: hallcodeを取得する
    data['uritanka']   = uritanka;

    equipment.setParams(method, url, data)
  };
  /**
   * form の名前を取得する
   *
   * @param name
   */
  private getFormName(): string {
    return 'Hall' +
      'Dedama' +
      'Action' +
      'Form';
  }

  private getForm(): JQuery {
    const formName = this.getFormName();
    return $(`form[name=${formName}]`);
  }
}
