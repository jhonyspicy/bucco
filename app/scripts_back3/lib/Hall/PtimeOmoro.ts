import Hall from './Hall';
import * as $ from "jquery";

export default class PtimeOmoro extends Hall {
  static amI(hallName: string): boolean {
    if (hallName.indexOf('Ｐ－ｔｉｍｅおもろ')) {
      return true;
    }

    return false;
  }

  isCorner(num: number) {
    return -1 !== $.inArray(num, [
      706,
      727,
      728,
      760,
      761,
      782,
      783,
      815,
      816,
      837,
      838,
      870,
      871,
      1002,
      1003,
      1025,
      1026,
      1053,
      1061,
      1062,
      1080,
      1081,
      1108,
      1110,
      1130,
    ]);
  }

}
