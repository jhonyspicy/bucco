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

interface PerDate {
  nowCoin: number
  max: number
  min: number
  rangePlus: number
  rangeMinus: number
  rotate: number
}

interface DetailData {
  bigGraph: GraphSrc;
  perDate: PerDate[];
}

$.ajaxSetup({
  crossDomain: true
});

export default class Machine {
  private _detailParams: AjaxParams;
  private _historyParams: AjaxParams;
  private _detailData: DetailData;
  public readonly $dom: JQuery = $(`
      <div class="buccoMachine">
        <header class="buccoMachine__header">
          <h3 class="buccoMachine__header__number"></h3>
          <dl class="buccoMachine__header__setting">
            <dt class="buccoMachine__header__setting__key">獲得</dt>
            <dd class="buccoMachine__header__setting__sale">0</dd>
            <dt class="buccoMachine__header__setting__key">球持</dt>
            <dd class="buccoMachine__header__setting__coinRate">--</dd>
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

  convertDetailHtml($html: JQuery): Promise<any> {
    const promisses: Promise<any>[] = [];
    let result = {};

    const bigGraph = {
      src:$html.find('#dedama_8days a').attr('href') || '',
      thumb:$html.find('#dedama_8days img').attr('src') || ''
    };
    const smallGraphs: GraphSrc[] = $html.find('#graph_list dd').map((i, elem) => {
      const $elem = $(elem);
      return {
        src:$elem.find('a').attr('href') || '',
        thumb:$elem.find('img').attr('src') || ''
      };
    }).get();

    smallGraphs.forEach((smallGraph: GraphSrc, index: number) => {
      const graph = new Graph();

/*
      let promise = graph
        .analyticsImage(smallGraph.src)
        .then((graph: Graph) => {
          return new Promise((resolve, reject) => {
            const nowCoin = graph.nowCoin;
            const spendCoin = (this.spec.big * detail.big + this.spec.reg * detail.reg - graph.nowCoin);
            let coinRate: number = 0;
            if (spendCoin !== 0) {
              coinRate = (detail.total / spendCoin) * 50;
              coinRate = parseFloat(coinRate.toFixed(2));
            }
            graph.coinRate = coinRate;

            if (3000 < detail.total) {
              this._hall.addScatterData({
                x: coinRate,
                y: nowCoin
              });
            }

            if (graph.dayBefore == 0 && nowCoin < -1000 && this.spec.coinRate < coinRate) {
              graph.$dom.addClass('shrimp');
            }

            this._hall.addSale(graph.dayBefore, nowCoin);
            this.addSale(nowCoin);

            resolve();
          });
        });

      promisses.push(promise);
*/
    });

    return new Promise((resolve, reject) => {
      Promise.all(promisses).then(() => {
        resolve(result);
      });
    });

    /*
    return {
      bigGraph,
      perDate: [{
        nowCoin: 0,
        max: 0,
        min: 0,
        rangePlus: 0,
        rangeMinus: 0,
        rotate: 0,
      }, {
        nowCoin: 0,
        max: 0,
        min: 0,
        rangePlus: 0,
        rangeMinus: 0,
        rotate: 0,
      }]
    }
*/
  }

  convertHistoryHtml($html: JQuery) {

  }

  loadDetail() {
    this.addQue(this._detailParams.method, this._detailParams.url, this._detailParams.data, ($html: JQuery) => {
      let _detailData = this.convertDetailHtml($html);
      // this._detailData = this.convertDetailHtml($html);
    })
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
