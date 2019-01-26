import {interfaces, functions} from '../Includes/Util';
import Base = interfaces.Base;
import * as $ from 'jquery';
import Equipment from '../Equipment/Equipment';

/**
 * ホールのホームページで
 * 複数のEquipmentを管理する。
 */
export default class Hall extends Base {
  $dom: JQuery          = $(`
    <div class="ultraHall"></div>
  `);
  promise: Promise<any> = Promise.resolve();

  private _equipments: Equipment[] = [];

  append(): void {
    this.$dom.insertAfter('#some_element');
  }

  convertHtml($html: JQuery): Promise<any> {
    return new Promise(((resolve, reject) => {
      const $targetTable: JQuery = $html.find('#20slot').closest('table');
      $targetTable.find('tr:nth-child(n + 2)').first().each((i, elem) => {
        const $elem                = $(elem);
        const onClick              = $elem.find('[name=select]').attr('onClick') || '';
        const equipment: Equipment = this.makeEquipment();
        const listClick            = equipment.setParams.bind(equipment, $html);

        eval(onClick); // listClick() を実行している。

        this.promise = equipment.run(this.promise);
      });

      this.promise.then(() => {
        this.resolve();
        resolve();
      });
    }));
  }

  makeEquipment(): Equipment {
    const equipment: Equipment = new Equipment(this);
    this._equipments.push(equipment);
    this.$dom.find('#some_element').append(equipment.$dom);

    return equipment;
  }

  private resolve() {
    console.log('Hallの読み込み終了');
  }
}
