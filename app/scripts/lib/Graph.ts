
export default class Graph {
  data:number[] = [];
  src: string = '';
  perCoin = 53; // 1pxあたりのコイン数
  perRotate = 75.7; // 1pxあたりの回転数

  constructor() {
  }

  analyticsImage(src: string) {
    this.src = src;
    return new Promise((resolve, reject) => {
      this
        .loadImage(src)
        .then((img: HTMLImageElement) => {
          const data = this.imageToArray(img);
          this.data = this.analytics(data);
          resolve(this.data);
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

  /**
   * 現在の予想差枚数
   */
  get nowCoin(): number {
    if (this.data.length === 0) {
      return 0;
    }

    return this.data[this.data.length - 1] * this.perCoin;
  }
}
