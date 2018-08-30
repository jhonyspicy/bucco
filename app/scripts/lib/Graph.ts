
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

    console.log(resultData);
    return resultData;
  }

  analytics(data: number[][]): number[] {
    const result = [0];
    let goUp = false;
    for (let i = 51; i < data.length; i++) {
      let darkest = 999;
      for (let j = 0; j < data[i].length; j++) {
        let color = data[i][j];
        if (color < darkest) {
          darkest = color;
        }
      }
    }
    return result;
  }
}
