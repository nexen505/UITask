export class AchievedContentElm {
  constructor({
                obj, type
              }) {
    this._obj = angular.copy(obj);
    this._type = type;
  }

  get obj() {
    return this._obj;
  }

  get type() {
    return this._type;
  }

  static get types() {
    return {
      ACHIEVED: 'ACHIEVED',
      OTHERS: 'OTHERS'
    };
  }
}
