import Machine from "./Machine";

export default class Hanahana extends Machine {
  static amI(machineName: string): boolean {
    if (machineName.indexOf('ハナハナ')) {
      return true;
    }

    return false;
  }
}
