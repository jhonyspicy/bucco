import * as $ from 'jquery';
import Hall from '../Hall/Hall';
import Graph from "../../../scripts_back/lib/Graph";

interface AjaxParams {
  method: string
  url: string
  data: any
}

interface GraphSrc {
  src: string
  thumb: string
}

$.ajaxSetup({
  crossDomain: true
});

export default class Machine {
  private _detailParams: AjaxParams;
  private _historyParams: AjaxParams;
  private _detailData: any;
  public readonly $dom: JQuery = $(`
      <div class="buccoMachine">
        <header class="buccoMachine__header">
          <h3 class="buccoMachine__header__number"></h3>
          <dl class="buccoMachine__header__setting">
            <dt class="buccoMachine__header__setting__key">獲得</dt>
            <dd class="buccoMachine__header__setting__sale">0</dd>
            <!--<dt class="buccoMachine__header__setting__key">球持</dt>-->
            <!--<dd class="buccoMachine__header__setting__coinRate">&#45;&#45;</dd>-->
          </dl>
        </header>

        <div class="buccoMachine__info">
          <!--<div class="buccoMachine__info__mixChart"><canvas></canvas></div>-->
          <!--<div class="buccoMachine__info__bigChart"><canvas></canvas></div>-->
          <!--<div class="buccoMachine__info__regChart"><canvas></canvas></div>-->
          <div class="buccoMachine__info__bigGraph"></div>
          <ul class="buccoMachine__info__smallGraphs"></ul>
          <div class="buccoMachine__info__detail" id="dedama_kind_table"></div>
        </div>
      </div>
      `);

  constructor(private _hall: Hall, public number: number) {
  }

  /**
   * 詳細ページから習慣グラフを取得する
   * @param $html
   */
  private getBigGraphFromDetailHtml($html: JQuery): GraphSrc {
    return {
      src:$html.find('#dedama_8days a').attr('href') || '',
      thumb:$html.find('#dedama_8days img').attr('src') || ''
    };
  }

  /**
   * 詳細ページから日別の画像を取得する
   * (解析ではない。urlだけ。)
   * @param $html
   */
  private getSmallGraphsFromDetailHtml($html: JQuery): GraphSrc[] {
    return $html.find('#graph_list dd').map((i, elem) => {
      const $elem = $(elem);
      return {
        src:$elem.find('a').attr('href') || '',
        thumb:$elem.find('img').attr('src') || ''
      };
    }).get();
  }

  /**
   * 詳細ページから表のデータを取得する
   * @param $html
   */
  private getTableDataFromDetailHtml($html: JQuery): any[] {
    const tableData:any[] = [];
    $html.find('#dedama_kind_table tr:nth-child(n + 2)').map((i, elem) => {
      const $elem = $(elem);
      tableData.push({
        total: $elem.find('td').eq(1).text(),
        big  : $elem.find('td').eq(2).text(),
        reg  : $elem.find('td').eq(3).text(),
        range: $elem.find('td').eq(5).text(),
      });
    });

    return tableData;
  }

  convertDetailHtml($html: JQuery): any {
    const bigGraph: GraphSrc = this.getBigGraphFromDetailHtml($html);
    const smallGraphs: GraphSrc[] = this.getSmallGraphsFromDetailHtml($html);
    const tableData:any[] = this.getTableDataFromDetailHtml($html);

    return {
      bigGraph,
      smallGraphs,
      tableData,
    }
  }

  convertHistoryHtml($html: JQuery) {

  }

  loadHtml(params: AjaxParams) {
    return new Promise((resolve, reject) => {
      this._hall.promise = this._hall.promise.then(() => new Promise((resolve2, reject2) => {
        const doGet = () => {
          $.ajax({
            method: params.method,
            url: params.url,
            data: params.data,
            dataType: 'html',
            success: (html) => {
              const $html = $(html);
              if (!$html.find('#machine_name').length) {
                console.log('Too many request wait a moment');
                setTimeout(() => {
                  doGet();
                }, 60000);
                return;
              }

              resolve($html);

              setTimeout(() => {
                resolve2();
              }, 3000 + Math.random() * 3000);
            },
            error: (e) => {
              // クッキーが切れたか何か、ブラウザのリロードが必要だはず。
              reject('something wrong');
            },
          });
        };
        doGet();
      }));
    });
  }

  loadDetail() {
    const detailData = this.getDataFromLocalStorage('detail');
    if (detailData) {
      this._detailData = detailData;
    } else {
      this.loadHtml(this._detailParams).then(($html: JQuery)=>{
        return new Promise((resolve, reject) => {
          resolve(this.convertDetailHtml($html))
        })
      }).then((data) => {
        this._detailData = data
      })
    }
/*    this.addQue(this._detailParams.method, this._detailParams.url, this._detailParams.data, ($html: JQuery) => {
      let _detailData = this.convertDetailHtml($html);
      // this._detailData = this.convertDetailHtml($html);
    })




    this.loadHtml().then(($html: JQuery)=>{

    }).then((data) => {
      this._detailData = data
    })*/
  }

  loadHistory() {

  }

  setDetailParams(method: string, url: string, data: any) {
    this._detailParams = {
      method,
      url,
      data,
    }
  }

  setHistoryParams(method: string, url: string, data: any) {
    this._historyParams = {
      method,
      url,
      data,
    }
  }

  getDataFromLocalStorage(type: string): any|boolean {
    // {
    //   501:{
    //     detail:{
    //       updated:'2019/1/5 12:38:19'
    //     }
    //     history:{
    //       updated:'2019/1/5 12:38:19'
    //     }
    //   }
    // }
    const data = this._hall.getLocalStorage();
    if (!(this.number in data)) {
      return false;
    }

    const machineData = data[this.number];
    if (!(type in machineData)) {
      return false;
    }

    const updated = new Date(machineData[type].updated);
    if (updated < this._hall.date) {
      return false;
    }

    return machineData[type];
  }

  addQue = (method: string, url: string, data: any, callback: ($html: JQuery) => void) => {
    this._hall.promise = this._hall.promise.then(value => new Promise((resolve, reject) => {
      const doGet = () => {
        $.ajax({
          method,
          url,
          data,
          dataType: 'html',
          success: (html) => {
            const $html = $(html);
            if (!$html.find('#machine_name').length) {
              console.log('Too many request wait a moment');
              setTimeout(() => {
                doGet();
              }, 60000);
              return;
            }

            callback($html);
            setTimeout(() => {
              resolve();
            }, 3000 + Math.random() * 3000);
          },
          error: (e) => {
            console.log('something wrong', e);
            setTimeout(() => {
              doGet();
            }, 60000);
          },
        });
      };
      doGet();
    }));
  }
}
