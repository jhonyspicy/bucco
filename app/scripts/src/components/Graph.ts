import Vue from 'vue';
import Component from 'vue-class-component';
import {Emit, Prop} from 'vue-property-decorator';
import {bucco, functions} from '../includes/util';
import GraphSrc = bucco.GraphSrc;
import axios from 'axios';
import * as _ from 'lodash';

@Component({
  template: require('./Graph.html'), // html-loaderを使うと外部のhtmlファイルを読み込める
})
export default class Graph extends Vue {
  @Prop() graph: GraphSrc;
  @Prop() kind: string;

  private perCoin = 55; // 1pxあたりのコイン数
  private perRotate = 87; // 1pxあたりの回転数

  // ライフサイクル
  @Emit() created() {
    Graph
      .loadImage(this.graph.original)
      .then((img: HTMLImageElement) => {
        return new Promise(((resolve, reject) => {
          resolve(Graph.imageToArray(img));
        }));
      })
      .then((imageData: number[][]) => {
        return new Promise(((resolve, reject) => {
          resolve(Graph.analytics(imageData));
        }));
      })
      .then((data: number[]) => {
        let nowCoin = 0; // 現在のコイン枚数
        let operation = 0; // 現在の回転数
        let max = 0; // 最高到達点
        let min = 0; // 最低到達点
        let rangePlus = 0; // 正幅
        let rangeMinus = 0; // 負幅

        if (data.length <= 1) {
          nowCoin = 0;
          operation = 0;
        } else {
          nowCoin = ~~(data[data.length - 1] * this.perCoin);
          operation = ~~((data.length - 1) * this.perRotate);
        }

        let rangeMinusBase = 0;
        let rangePlusBase = 0;
        data.forEach((value, index, array) => {
          const coin = value  * this.perCoin;
          if (max < coin) {
            // 最高点
            max = coin;
            rangeMinusBase = coin;
          }

          if (coin < min) {
            // 最低点
            min = coin;
            rangePlusBase = coin;
          }

          if (coin - rangeMinusBase < rangeMinus) {
            rangeMinus = coin - rangeMinusBase;
          }

          if (rangePlus < coin - rangePlusBase) {
            rangePlus = coin - rangePlusBase;
          }
        });

        this.$emit('load', {
          nowCoin,
          operation,
          max,
          min,
          rangePlus,
          rangeMinus,
        });
      });
  }

  static loadImage(src: string) {
    return new Promise((resolve, reject) => {
      axios.get(src, {
        responseType: 'arraybuffer'
      }).then((response) => {
        const base64: string = new Buffer(response.data, 'binary').toString('base64');
        const img: HTMLImageElement = new Image();
        img.onload = () => {
          resolve(img);
        };

        img.src = 'data:image/png;base64,' + base64;
      });
    });
  }

  static imageToArray(img: HTMLImageElement): number[][] {
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


  static analytics(data: number[][]): number[] {
    const result = [0];
    for (let i = 0; i < data[0].length; i++) {
      let darkest = 999;
      let candidate: number[] = [];
      for (let j = 0; j < data.length; j++) {
        let color = data[j][i];
        if (color < darkest && color !== 308) {
          darkest = color; // その列でもっともくらい色
        }
      }
      if (darkest === 999) {
        // 該当データなし
        continue;
      }
      for (let j = 0; j < data.length; j++) {
        let color = data[j][i];
        if (color === darkest) {
          candidate.push(348 - j);
        }
      }
      if (result[i] <  _.mean(candidate)) {
        result.push(candidate[0]);
      } else {
        result.push(candidate[candidate.length - 1]);
      }
    }

    return result;
  }



}
