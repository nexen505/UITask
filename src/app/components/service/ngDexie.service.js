export class DexieService {
  constructor(_, ngDexie, $log) {
    'ngInject';

    this._ngDexie = ngDexie;
    this._$log = $log;
    this._lodash = _;
  }

  $$removePendingReq(promise) {
    const idx = this.ngDexie.pendingRequests.indexOf(promise);

    if (idx !== -1) {
      this.ngDexie.pendingRequests.splice(idx, 1);
    }
  }

  $$pushPendingReq(promise) {
    if (!this.ngDexie.pendingRequests) {
      this.ngDexie.pendingRequests = [];
    }
    this.ngDexie.pendingRequests.push(promise);
  }

  get ngDexie() {
    return this._ngDexie;
  }

  get $log() {
    return this._$log;
  }

  get _() {
    return this._lodash;
  }

  static get minKey() {
    return -Infinity;
  }

  static get maxKey() {
    return String.fromCharCode(65535);
  }

  getDb() {
    const db = this.ngDexie.getDb();

    db.open();
    return db;
  }
}
