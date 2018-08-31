
export default class Graph {
  data:number[] = [];
  width: number = 0;
  height: number = 0;

  constructor() {
  }

  analyticsImage(src: string) {
    console.log(src);
    return new Promise((resolve, reject) => {
      this
        .loadImage(src)
        .then((img: HTMLImageElement) => {
          const data = this.imageToArray(img);
          resolve(this.analytics(data));
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

    console.log(resultData);
    return resultData;
  }

  analytics(data: number[][]): number[] {
    const result = [0];
    let goUp = false;
    for (let i = 0; i < data[0].length; i++) {
      let darkest = 999;
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
          console.log(348 - j);
        }
      }
      console.log('次！');
    }
    return result;
  }
}
