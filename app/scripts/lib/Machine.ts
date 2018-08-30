import * as $ from 'jquery';
import Chart = require( "chart.js" );
import Graph from "./Graph";

export default class Machine {
  private _name: string;
  private _date: string;
  private readonly _$dom: JQuery;
  private _resolve: { detail: any, history: any } = {detail: undefined, history: undefined};

  public data: {
    number: number
    detail: any
    history: {
      bonusType: string,
      rotate: number,
    }[]
    bigGraph: string
    smallGraphs: string[]
  } = {
    number     : 0,
    detail     : undefined,
    history    : [],
    bigGraph   : '',
    smallGraphs: [],
  };

  constructor() {
    this._$dom = $(`
      <div class="buccoMachine">
        <header class="buccoMachine__header">
          <h3 class="buccoMachine__header__number"></h3>
          <dl class="buccoMachine__header__setting">
            <dt class="buccoMachine__header__setting__key">設定</dt>
            <dd class="buccoMachine__header__setting__level"></dd>
            <dt class="buccoMachine__header__setting__key">球持</dt>
            <dd class="buccoMachine__header__setting__per"></dd>
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
    ]).then(() => this.loadComplete())
  }

  loadComplete() {
    // console.log(this.data);
  }

  convertDetailHtml($html: JQuery) {
    // const bigGraph = $html.find('#dedama_8days a').attr('href');
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

    const graph = new Graph();
    graph
      .analyticsImage(this.data.smallGraphs[0])
      .then(() => {
        console.log(graph);
      });


    this.number = parseInt(machineNumber);
    smallGraphs.forEach((src) => {
      this.$dom.find('.buccoMachine__info__smallGraphs').append(`<li><img src="${src}"></li>`);
    });
    this.$dom.find('.buccoMachine__info__bigGraph').append(`<img src="${bigGraph}">`);
    this.$dom.find('.buccoMachine__info__detail').append($html.find('#dedama_kind_table table'));

    this._resolve.detail();
  }

  convertHistoryHtml($html: JQuery) {
    $($html.find('#dedama_past_table tr:nth-child(n + 2)').get().reverse()).map((i, elem) => {
      const $elem = $(elem);
      let bonus = $elem.find('td').eq(0).text().trim();
      if (bonus == 'RB') {
        bonus = 'REG';
      } else if (bonus == '--') {
        bonus = '現在';
      } else {
        bonus = 'BIG';
      }

      this.data.history.push({
        bonusType: bonus,
        rotate: parseInt($elem.find('td').eq(2).text().trim()),
      });
    });

    const mixChart = this.getChart(
      this.getCTX('.buccoMachine__info__mixChart canvas'),
      '合算'
    );

    const bigChart = this.getChart(
      this.getCTX('.buccoMachine__info__bigChart canvas'),
      'ビッグ'
    );

    const regChart = this.getChart(
      this.getCTX('.buccoMachine__info__regChart canvas'),
      'ベイビー'
    );

    let bigRotate = 0;
    let regRotate = 0;
    let bigCount = 0;
    let regCount = 0;
    this.data.history.forEach((val, i) => {
      const mixData = mixChart.data as any;
      const bigData = bigChart.data as any;
      const regData = regChart.data as any;

      bigRotate += val.rotate;
      regRotate += val.rotate;
      if (val.bonusType === 'BIG') {
        bigCount++;

        mixData.datasets[0].backgroundColor.push('rgba(255, 27, 75, 0.2)');
        mixData.datasets[0].borderColor.push('rgb(255, 27, 75)');

        bigData.datasets[0].backgroundColor.push('rgba(255, 27, 75, 0.2)');
        bigData.datasets[0].borderColor.push('rgb(255, 27, 75)');
        bigData.labels.push(`${bigRotate} ${val.bonusType}`);
        bigData.datasets[0].data.push(bigRotate);
        bigRotate = 0;
      } else if (val.bonusType === 'REG') {
        regCount++;

        mixData.datasets[0].backgroundColor.push('rgba(200, 200, 80, 0.2)');
        mixData.datasets[0].borderColor.push('rgb(200, 200, 80)');

        regData.datasets[0].backgroundColor.push('rgba(200, 200, 80, 0.2)');
        regData.datasets[0].borderColor.push('rgb(200, 200, 80)');
        regData.labels.push(`${regRotate} ${val.bonusType}`);
        regData.datasets[0].data.push(regRotate);
        regRotate = 0;
      } else {
        mixData.datasets[0].backgroundColor.push('rgba(0, 0, 0, 0.2)');
        mixData.datasets[0].borderColor.push('rgb(0, 0, 0)');

        bigData.datasets[0].backgroundColor.push('rgba(0, 0, 0, 0.2)');
        bigData.datasets[0].borderColor.push('rgb(0, 0, 0)');
        bigData.labels.push(`${bigRotate} ${val.bonusType}`);
        bigData.datasets[0].data.push(bigRotate);

        regData.datasets[0].backgroundColor.push('rgba(0, 0, 0, 0.2)');
        regData.datasets[0].borderColor.push('rgb(0, 0, 0)');
        regData.labels.push(`${regRotate} ${val.bonusType}`);
        regData.datasets[0].data.push(regRotate);
      }

      mixData.labels.push(`${val.rotate} ${val.bonusType}`);
      mixData.datasets[0].data.push(val.rotate);
    });

    this.$dom.find('.buccoMachine__info__mixChart').height(75 + 25 * this.data.history.length);
    this.$dom.find('.buccoMachine__info__bigChart').height(75 + 25 * bigCount);
    this.$dom.find('.buccoMachine__info__regChart').height(75 + 25 * regCount);

    mixChart.update();
    bigChart.update();
    regChart.update();

    this._resolve.history();
  }

  getCTX(selector: string): CanvasRenderingContext2D {
    const canvas = this.$dom.find(selector).get(0) as HTMLCanvasElement;
    return canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  getChart(ctx: CanvasRenderingContext2D, title: string): Chart {
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

  get $dom() {
    return this._$dom;
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
