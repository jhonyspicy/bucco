/**
 * 複数のMachineを管理する
 */
import {Base, getBaseUrl} from "../Includes/Util";
import Machine from "../Machine/Machine";

export default class Equipment implements Base {
  $dom:JQuery = $(`
    <div class="ultraEquipment "></div>
  `)
  private _machines: Machine[] = [];




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

      machine.loadDetail();
    });
  }

  setParams(method: string, url: string, data: any) {

  }

  private makeMachine(number: number): Machine {
    const machine: Machine = new Machine();
    this._machines[number] = machine;

    this.$dom.find('#some_element').append(machine.$dom)
    return machine;
  }


}
