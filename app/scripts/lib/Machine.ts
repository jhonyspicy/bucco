import * as $ from 'jquery';
import {Chart} from 'chart.js';

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
          <div class="buccoMachine__info__history" id="dedama_past_table"></div>
        </div>
      </div>
      `);

    Promise.all([
      new Promise(resolve => this._resolve.detail = resolve),
      new Promise(resolve => this._resolve.history = resolve),
    ]).then(() => this.loadComplete())
  }

  loadComplete() {
    console.log(this.data);
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

    /**
     * 画像データを含めた解析
     */
    (() => {

      // console.log(dayGraphs);
      // console.log(resultData);

      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.data.smallGraphs[0], true);
      xhr.responseType = 'arraybuffer';
      xhr.onload       = function (e) {
        // ArrayBufferで返ってくる
        // console.log(this.response.byteLength);
        const dataURIFromArrayBuffer = (ab: any) => {
          return 'data:image/png;base64,' +
            btoa(Array.from(new Uint8Array(ab), e => String.fromCharCode(e)).join(''));
        };

        const img  = new Image();
        img.onload = () => {
          const cv  = document.createElement('canvas');
          cv.width  = img.naturalWidth;
          cv.height = img.naturalHeight;

          const ct = cv.getContext('2d') as CanvasRenderingContext2D;
          ct.drawImage(img, 0, 0);

          const data: any       = ct.getImageData(0, 0, cv.width, cv.height);
          const resultData: any = [];
          for (let i = 0; i < cv.height; i++) {
            resultData[i] = [];
            for (let j = 0; j < cv.width; j++) {
              const n = ((i * cv.width) + j) * 4;
              const r = data.data[n];
              const g = data.data[n + 1];
              const b = data.data[n + 2];
              const a = data.data[n + 3];
              let sum = r + g + b;

              if (650 < sum) {
                // 背景でしょう。
                sum = 999;
              }

              resultData[i][j] = sum;
            }
          }
          // console.log(resultData);
        };

        img.src = dataURIFromArrayBuffer(this.response);
      };

      xhr.send();
    })();

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
        bonus = 'reg';
      } else if (bonus == '--') {
        bonus = '';
      } else {
        bonus = 'big';
      }

      this.data.history.push({
        bonusType: bonus,
        rotate: parseInt($elem.find('td').eq(2).text().trim()),
      });
    });

    this.$dom.find('.buccoMachine__info__history').append($html.find('#dedama_past_table table'));

    const mixChart = this.getChart(
      this.getCTX('.buccoMachine__info__mixChart canvas')
    );

    const bigChart = this.getChart(
      this.getCTX('.buccoMachine__info__bigChart canvas')
    );

    const regChart = this.getChart(
      this.getCTX('.buccoMachine__info__regChart canvas')
    );

    this.data.history.forEach((val, i) => {
      // if (typeof mixChart.data.labels === 'object') {
      //   mixChart.data.labels.push(val.bonusType);
      // }
      // if (typeof mixChart.data.datasets === 'object' && typeof mixChart.data.datasets[0].data === 'object') {
      //   mixChart.data.datasets[0].data.push(val.rotate);
      // }
    });



    this.$dom.find('.buccoMachine__info__mixChart').height(75 + 25 * 2);
    this.$dom.find('.buccoMachine__info__bigChart').height(75 + 25 * 2);
    this.$dom.find('.buccoMachine__info__regChart').height(75 + 25 * 2);

    this._resolve.history();
  }

  getCTX(selector: string): CanvasRenderingContext2D {
    const canvas = this.$dom.find(selector).get(0) as HTMLCanvasElement;
    return canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  getChart(ctx: CanvasRenderingContext2D): Chart {
    return new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            fill: false,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 1000
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
