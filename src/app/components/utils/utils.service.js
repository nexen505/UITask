export class Utils {
  static uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);

      return v.toString(16);
    });
  }

  static requiredParam() {
    throw new TypeError('Function has required param that was not passed!');
  }

  static isEmpty(e) {
    switch (e) {
      case '':
      case 0:
      case '0':
      case null:
      case false:
      case angular.isUndefined(this):
        return true;
      case angular.isArray(this):
        for (let i = 0; i < this.length; i++) {
          if (!Utils.isEmpty(this[i])) {
            return false;
          }
        }
        return true;
      default:
        return false;
    }
  }
}
