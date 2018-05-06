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
}
