export class DexieService {
  constructor(ngDexie, $log) {
    'ngInject';

    this._ngDexie = ngDexie;
    this._$log = $log;
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
}
