import * as $ from "jquery";

export default class Graph {
  readonly $dom: JQuery;
  data:number[] = [];
  private _src: string = '';
  private _nowCoin: number = 0; // 獲得枚数
  private _coinRate: number = 0; // 球持
  private _min: number = 0; // 最低点
  private _max: number = 0; // 最高点
  private _rangePlus: number = 0; // プラス方向のレンジ
  private _rangeMinus: number = 0; // マイナス方向のレンジ
  private perCoin = 55; // 1pxあたりのコイン数
  private perRotate = 75.7; // 1pxあたりの回転数
  dayBefore: number = 0; // 何日前

  constructor() {
    this.$dom = $(`
      <li class="buccoGraph">
        <img class="buccoGraph__image">
        <div class="buccoGraph__info">
          <dl class="buccoGraph__info__coinRate">
            <dt class="buccoGraph__info__coinRate__key">球持: </dt>
            <dd class="buccoGraph__info__coinRate__value">--</dd>
          </dl>
          <dl class="buccoGraph__info__nowCoin">
            <dt class="buccoGraph__info__nowCoin__key">獲得: </dt>
            <dd class="buccoGraph__info__nowCoin__value">0</dd>
          </dl>
          <dl class="buccoGraph__info__min">
            <dt class="buccoGraph__info__min__key">最下: </dt>
            <dd class="buccoGraph__info__min__value">0</dd>
          </dl>
          <dl class="buccoGraph__info__max">
            <dt class="buccoGraph__info__max__key">最高: </dt>
            <dd class="buccoGraph__info__max__value">0</dd>
          </dl>
          <dl class="buccoGraph__info__rangePlus">
            <dt class="buccoGraph__info__rangePlus__key">正幅: </dt>
            <dd class="buccoGraph__info__rangePlus__value">0</dd>
          </dl>
          <dl class="buccoGraph__info__rangeMinus">
            <dt class="buccoGraph__info__rangeMinus__key">負幅: </dt>
            <dd class="buccoGraph__info__rangeMinus__value">0</dd>
          </dl>
        </div>
      </li>
    `);
  }

  analyticsImage(src: string) {
    this.src = src;
    return new Promise((resolve, reject) => {
      this
        .loadImage(src)
        .then((img: HTMLImageElement) => {
          const imageData = this.imageToArray(img);
          this.data = this.analytics(imageData);
          if (this.data.length === 0) {
            this.nowCoin = 0;
          } else {
            this.nowCoin = this.data[this.data.length - 1] * this.perCoin;
          }

          let rangeMinusBase = 0;
          let rangePlusBase = 0;
          this.data.forEach((value, index, array) => {
            const coin = value  * this.perCoin;
            if (this.max < coin) {
              // 最高点
              this.max = coin;
              rangeMinusBase = coin;
            }

            if (coin < this.min) {
              // 最低点
              this.min = coin;
              rangePlusBase = coin;
            }

            if (coin - rangeMinusBase < this.rangeMinus) {
              this.rangeMinus = coin - rangeMinusBase;
            }

            if (this.rangePlus < coin - rangePlusBase) {
              this.rangePlus = coin - rangePlusBase;
            }
          });

          resolve(this);
        });
    });
  }

  loadImage(src: string) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', src, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = (e) => {
        const img  = new Image();
        img.onload = () => {
          resolve(img);
        };

        img.src = 'data:image/png;base64,' +
          btoa(Array.from(new Uint8Array(xhr.response), e => String.fromCharCode(e)).join(''));
      };
      xhr.send();
    });
  }

  imageToArray(img: HTMLImageElement): number[][] {
    const cv  = document.createElement('canvas');
    cv.width  = img.naturalWidth;
    cv.height = img.naturalHeight;

    const ct = cv.getContext('2d') as CanvasRenderingContext2D;
    ct.drawImage(img, 0, 0);

    const data: any       = ct.getImageData(0, 0, cv.width, cv.height);
    const resultData: any = [];
    // あらかじめ、左と下の余白を除外しておく(どうせ使わない)
    for (let i = 0; i < cv.height - 80; i++) {
      resultData[i] = [];
      for (let j = 51; j < cv.width; j++) {
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

        if (166 < j && j < 175 && 356 < i && i < 383) {
          // 30000と言う数字が書いてあるのでこのエリアはとりあえず背景で塗りつぶす
          // マイナス行ってて10000回転はそうそうないでしょう。
          sum = 999;
        }

        resultData[i][j - 51] = sum;
      }
    }

    return resultData;
  }

  analytics(data: number[][]): number[] {
    const result = [0];
    for (let i = 0; i < data[0].length; i++) {
      let darkest = 999;
      let candidate: number[] = [];
      for (let j = 0; j < data.length; j++) {
        let color = data[j][i];
        if (color < darkest && color != 308) {
          darkest = color; // その列でもっともくらい色
        }
      }
      if (darkest == 999) {
        // 該当データなし
        continue;
      }
      for (let j = 0; j < data.length; j++) {
        let color = data[j][i];
        if (color == darkest) {
          candidate.push(348 - j);
        }
      }
      if (result[i] < this.average(candidate)) {
        result.push(candidate[0]);
      } else {
        result.push(candidate[candidate.length - 1]);
      }
    }

    return result;
  }

  /**
   * 数字の配列の合計値
   * @param data
   */
  private sum(data: number[]): number {
    return data.reduce((prev, current, i, arr) => {
      return prev + current;
    });
  }

  /**
   * 数字の配列の平均値
   * @param data
   */
  private average(data: number[]): number {
    if (data.length) {
      return this.sum(data) / data.length;
    }

    return 0;
  }

  set src(src:string) {
    this._src = src;
    this.$dom.find('.buccoGraph__image').attr('src', src)
  }

  /**
   * 現在の予想差枚数
   */
  get nowCoin(): number {
    return this._nowCoin;
  }
  set nowCoin(nowCoin: number) {
    this._nowCoin = nowCoin;
    this.$dom.find('.buccoGraph__info__nowCoin__value').text(nowCoin);
  }

  /**
   * 球持ち
   */
  get coinRate(): number {
    return this._coinRate;
  }
  set coinRate(coinRate: number) {
    this._coinRate = coinRate;
    if (40 < coinRate && coinRate < 100) {
      this.$dom.addClass('coinRate40');
    } else if (39 < coinRate) {
      this.$dom.addClass('coinRate39');
    } else if (38 < coinRate) {
      this.$dom.addClass('coinRate38');
    } else if (37 < coinRate) {
      this.$dom.addClass('coinRate37');
    } else if (36 < coinRate) {
      this.$dom.addClass('coinRate36');
    } else if (35 < coinRate) {
      this.$dom.addClass('coinRate35');
    } else if (34 < coinRate) {
      this.$dom.addClass('coinRate34');
    } else if (33 < coinRate) {
      this.$dom.addClass('coinRate33');
    } else {
      this.$dom.addClass('coinRate00');
    }
    this.$dom.find('.buccoGraph__info__coinRate__value').text(coinRate);
  }

  get max(): number {
    return this._max;
  }
  set max(max: number) {
    this._max = max;
    this.$dom.find('.buccoGraph__info__max__value').text(max);
  }

  get min(): number {
    return this._min;
  }
  set min(min: number) {
    this._min = min;
    this.$dom.find('.buccoGraph__info__min__value').text(min);
  }

  get rangePlus(): number {
    return this._rangePlus;
  }
  set rangePlus(rangePlus: number) {
    this._rangePlus = rangePlus;
    this.$dom.find('.buccoGraph__info__rangePlus__value').text(rangePlus);
  }

  get rangeMinus(): number {
    return this._rangeMinus;
  }
  set rangeMinus(rangeMinus: number) {
    this._rangeMinus = rangeMinus;
    this.$dom.find('.buccoGraph__info__rangeMinus__value').text(rangeMinus);
  }
}
