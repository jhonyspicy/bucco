import {interfaces, functions} from '../Includes/Util';
import Base = interfaces.Base;
import * as $ from 'jquery';
import Equipment from '../Equipment/Equipment';

/**
 * ホールのホームページで
 * 複数のEquipmentを管理する。
 */
export default class Hall extends Base {
  $dom: JQuery = $(`
    <div class="ultraHall">
      <div class="ultraHall_equipments"></div>
    </div>
  `);
  promise: Promise<any> = Promise.resolve();

  private _equipments: Equipment[] = [];

  /**
   * 直接作成された時に呼ばれる、
   */
  init(): void {
    const $html: JQuery = $('html')
    const $button: JQuery = $('<h1>TEST</h1>')
    const $target = $html.find('#20slot').closest('table.slot')
    $button.insertBefore($target)
    $button.on('click', ()=>{
      this.append($html)
      this.convertHtml($html).then(() => {
        // 全ての処理が終了
        this.resolve();
      });
    })
  }

  /**
   * 直接作成された時に呼ばれる、
   */
  append($html: JQuery): void {
    const $target = $html.find('#20slot').closest('table.slot');
    this.$dom.insertBefore($target)
  }

  convertHtml($html: JQuery): Promise<any> {
    return new Promise(((resolve, reject) => {
      const $targetTable: JQuery = $html.find('#20slot').closest('table');
      // $targetTable.find('tr:nth-child(n + 2)').first().each((i, elem) => {
      $targetTable.find('tr:nth-child(2), tr:nth-child(3)').each((i, elem) => {
        const $elem                = $(elem);
        const onClick              = $elem.find('[name=select]').attr('onClick') || '';
        const equipment: Equipment = this.makeEquipment();
        const listClick            = equipment.setParams.bind(equipment, $html);

        this.$dom.find('.ultraHall_equipments').append(equipment.$dom);

        eval(onClick); // listClick() を実行している。

        this.promise = equipment.run(this.promise);
      });

      this.promise.then(() => {
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
