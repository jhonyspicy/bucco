import * as $ from 'jquery';
import Chart = require( "chart.js" );
import Graph from "./Graph";
import Hall from "./Hall";

interface History {
  bonusType: string,
  rotate: number,
}

export default class Machine {
  private _name: string;
  private _date: string;
  private readonly _$dom: JQuery;
  private _resolve: { detail: any, history: any } = {detail: undefined, history: undefined};
  private _coinRate: number = 0;
  private _graph: Graph;

  public callback: ()=>void = ()=>{};

  public data: {
    number: number
    detail: any
    history: {
      mix: History[],
      big: History[],
      reg: History[]
    }
    bigGraph: string
    smallGraphs: string[]
  } = {
    number     : 0,
    detail     : undefined,
    history    : {
      mix: [],
      big: [],
      reg: []
    },
    bigGraph   : '',
    smallGraphs: [],
  };

  constructor(private hall: Hall) {
    this._$dom = $(`
      <div class="buccoMachine">
        <header class="buccoMachine__header">
          <h3 class="buccoMachine__header__number"></h3>
          <dl class="buccoMachine__header__setting">
            <dt class="buccoMachine__header__setting__key">設定</dt>
            <dd class="buccoMachine__header__setting__level">--</dd>
            <dt class="buccoMachine__header__setting__key">球持</dt>
            <dd class="buccoMachine__header__setting__coinRate">--</dd>
          </dl>
        </header>

        <div class="buccoMachine__info">
          <div class="buccoMachine__info__mixChart"><canvas></canvas></div>
          <div class="buccoMachine__info__bigChart"><canvas></canvas></div>
          <div class="buccoMachine__info__regChart"><canvas></canvas></div>
          <div class="buccoMachine__info__bigGraph"></div>
          <ul class="buccoMachine__info__smallGraphs"></ul>
          <div class="buccoMachine__info__detail" id="dedama_kind_table"></div>
        </div>
      </div>
      `);

    Promise.all([
      new Promise(resolve => this._resolve.detail = resolve),
      new Promise(resolve => this._resolve.history = resolve),
    ]).then(() => this.loadComplete());
  }

  loadComplete() {
    this.callback();
  }

  /**
   * 詳細
   * @param $html
   */
  convertDetailHtml($html: JQuery) {
    const bigGraph        = $html.find('#dedama_8days img').attr('src');
    const machineNumber   = $html.find('#dedama_detail_table .left h4').first().text();
    const smallGraphs     = $html.find('#graph_list dd').map((i, elem) => {
      const $elem = $(elem);
      return $elem.find('img').attr('src') || '';
    }).get();
    this.data.bigGraph = $html.find('#dedama_8days a').attr('href') || '';
    this.data.smallGraphs = $html.find('#graph_list dd').map((i, elem) => {
      const $elem = $(elem);
      return $elem.find('a').attr('href') || '';
    }).get();

    this.data.detail = [];
    $html.find('#dedama_kind_table tr:nth-child(n + 2)').map((i, elem) => {
      const $elem = $(elem);
      this.data.detail.push({
        total: $elem.find('td').eq(1).text(),
        big  : $elem.find('td').eq(2).text(),
        reg  : $elem.find('td').eq(3).text(),
        range: $elem.find('td').eq(5).text(),
      });
    });

    // 画像の解析
    // this._graph = new Graph();
    // this._graph
    //   .analyticsImage(this.data.smallGraphs[0])
    //   .then(() => {
    //     const detail = this.data.detail[0] as any;
    //     const nowCoin = this._graph.nowCoin;
    //     let coinRate: number = (detail.total / (312 * detail.big + 130 * detail.reg - this._graph.nowCoin)) * 50;
    //     coinRate = parseFloat(coinRate.toFixed(2));
    //
    //     this.coinRate = coinRate;
    //
    //     this.hall.addScatterData({
    //       x: coinRate,
    //       y: nowCoin
    //     });
    //
    //     this._resolve.detail(); // 詳細データの処理終了
    //   });


    // 画像の解析
    for (let i = 0; i < this.data.smallGraphs.length; i++) {
      const detail = this.data.detail[i] as any;
      const smallGraph = this.data.smallGraphs[i];
      if (detail.total < 1000) {continue;}

      const graph = new Graph();
      graph
        .analyticsImage(smallGraph)
        .then((g: Graph) => {
          const nowCoin = g.nowCoin;
          let coinRate: number = (detail.total / (312 * detail.big + 130 * detail.reg - g.nowCoin)) * 50;
          coinRate = parseFloat(coinRate.toFixed(2));

          if (i == 0) {
            this.coinRate = coinRate;
          }

          this.hall.addScatterData({
            x: coinRate,
            y: nowCoin
          });

          this._resolve.detail(); // 詳細データの処理終了
        });
    }

    this.number = parseInt(machineNumber);
    smallGraphs.forEach((src) => {
      this.$dom.find('.buccoMachine__info__smallGraphs').append(`<li><img src="${src}"></li>`);
    });
    this.$dom.find('.buccoMachine__info__bigGraph').append(`<img src="${bigGraph}">`);
    this.$dom.find('.buccoMachine__info__detail').append($html.find('#dedama_kind_table table'));
  }

  /**
   * 履歴
   * @param $html
   */
  convertHistoryHtml($html: JQuery) {
    let bigRotate = 0;
    let regRotate = 0;
    const mixChart = this.getChart(this.getCTX('.buccoMachine__info__mixChart canvas'), '合算');
    const bigChart = this.getChart(this.getCTX('.buccoMachine__info__bigChart canvas'), 'ビッグ');
    const regChart = this.getChart(this.getCTX('.buccoMachine__info__regChart canvas'), 'ベイビー');
    const initChart = (chart: any, bonusList: { bonusType: string, rotate: number }[]) => {
      const data = chart.data;
      bonusList.forEach((val, i) => {
        if (val.bonusType === 'BIG') {
          data.datasets[0].backgroundColor.push('rgba(255, 27, 75, 0.2)');
          data.datasets[0].borderColor.push('rgb(255, 27, 75)');
        } else if (val.bonusType === 'REG') {
          data.datasets[0].backgroundColor.push('rgba(200, 200, 80, 0.2)');
          data.datasets[0].borderColor.push('rgb(200, 200, 80)');
        } else {
          data.datasets[0].backgroundColor.push('rgba(0, 0, 0, 0.2)');
          data.datasets[0].borderColor.push('rgb(0, 0, 0)');
        }
        data.labels.push(`${val.rotate} ${val.bonusType}`);
        data.datasets[0].data.push(val.rotate);
      });
    };

    $($html.find('#dedama_past_table tr:nth-child(n + 2)').get().reverse()).map((i, elem) => {
      const $elem = $(elem);
      let bonus = $elem.find('td').eq(0).text().trim();
      let rotate = parseInt($elem.find('td').eq(2).text().trim());
      bigRotate += rotate;
      regRotate += rotate;

      if (bonus == 'RB') {
        bonus = 'REG';
      } else if (bonus == '--') {
        bonus = '現在';
      } else {
        bonus = 'BIG';
      }

      this.data.history.mix.push({
        bonusType: bonus,
        rotate: parseInt($elem.find('td').eq(2).text().trim()),
      });

      if (bonus == 'BIG' || bonus == '現在') {
        this.data.history.big.push({
          bonusType: bonus,
          rotate: bigRotate,
        });
        bigRotate = 0;
      }

      if (bonus == 'REG' || bonus == '現在') {
        this.data.history.reg.push({
          bonusType: bonus,
          rotate: regRotate,
        });
        regRotate = 0;
      }
    });

    initChart(mixChart, this.data.history.mix);
    initChart(bigChart, this.data.history.big);
    initChart(regChart, this.data.history.reg);

    this.$dom.find('.buccoMachine__info__mixChart').height(75 + 25 * this.data.history.mix.length);
    this.$dom.find('.buccoMachine__info__bigChart').height(75 + 25 * this.data.history.big.length);
    this.$dom.find('.buccoMachine__info__regChart').height(75 + 25 * this.data.history.reg.length);

    mixChart.update();
    bigChart.update();
    regChart.update();

    this._resolve.history(); // 履歴の処理終了
  }

  private getCTX(selector: string): CanvasRenderingContext2D {
    const canvas = this.$dom.find(selector).get(0) as HTMLCanvasElement;
    return canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  private getChart(ctx: CanvasRenderingContext2D, title: string): Chart {
    return new Chart(ctx, {
      type: 'horizontalBar',

      data: {
        labels: [],

        datasets: [
          {
            data           : [],
            fill           : false,
            backgroundColor: [],
            borderColor    : [],
            borderWidth    : 1
          }
        ]
      },

      options: {
        title: {
          display  : true,
          position : 'top',
          fontColor: '#333',
          text     : title,
        },

        legend: {
          display: false
        },

        responsive         : true,
        maintainAspectRatio: false,

        scales: {
          xAxes: [
            {
              stacked: true,
              ticks  : {
                beginAtZero: true,
                min        : 0,
                max        : 1000
              }
            }
          ]
        }
      }
    });
  }

  set number(n: number) {
    this.data.number = n;
    this.$dom.find('.buccoMachine__header__number').text(this.data.number);
  }

  set name(name: string) {
    this._name = name;
  }

  set date(date: string) {
    this._date = date;
  }

  set coinRate(n: number) {
    this._coinRate = n;
    this.$dom.find('.buccoMachine__header__setting__coinRate').text(this._coinRate);
  }

  get coinRate() {
    return this._coinRate;
  }

  get $dom() {
    return this._$dom;
  }

  get nowCoin() {
    return this._graph.nowCoin;
  }

  setDetail() {
  }

  setHistory() {
  }

  update() {
  }

  next() {
  }

  prev() {
  }

  isCorner() {
  }
}
