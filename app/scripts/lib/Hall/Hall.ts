import {Base, getBaseUrl} from '../Includes/Util';
import * as $ from 'jquery';
import Equipment from '../Equipment/Equipment';

/**
 * ホールのホームページで
 * 複数のEquipmentを管理する。
 */
export default class Hall implements Base {
  $dom: JQuery = $(`
    <div class="ultraHall"></div>
  `);

  private _equipments: Equipment[] = [];

  append(): void {
    this.$dom.insertAfter('#some_element');
  }

  convertHtml($html: JQuery): void {
    const $targetTable: JQuery = $html.find('#20slot').closest('table');
    $targetTable.find('tr:nth-child(n + 2)').each((i, elem) => {
      const $elem                = $(elem);
      const onClick              = $elem.find('[name=select]').attr('onClick') || '';
      const equipment: Equipment = this.makeEquipment();
      const listClick            = equipment.setParams.bind(equipment);

      eval(onClick); // listClick() を実行している。
    });
  }

  makeEquipment(): Equipment {
    const equipment: Equipment = new Equipment(this);
    this._equipments.push(equipment);
    this.$dom.find('#some_element').append(equipment.$dom);

    return equipment;
  }

  private resolve() {
  }
}
