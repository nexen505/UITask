export class AchievedContentElm {
  constructor({obj, type}) {
    this._obj = obj;
    this._type = type;
  }

  get type() {
    return this._type;
  }

  get obj() {
    return this._obj;
  }

  static get types() {
    return {
      ACHIEVED: 'ACHIEVED',
      OTHERS: 'OTHERS'
    };
  }
}
