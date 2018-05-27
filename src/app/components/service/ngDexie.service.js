import { Utils } from "../utils/utils.service";

export class DexieService {
  constructor(ngDexie, _, $q, $log, $injector) {
    this._ngDexie = ngDexie;
    this._$log = $log;
    this._$q = $q;
    this._lodash = _;
    this._$injector = $injector;
  }

  get ngDexie() {
    return this._ngDexie;
  }

  get $log() {
    return this._$log;
  }

  get $q() {
    return this._$q;
  }

  get _() {
    return this._lodash;
  }

  get $injector() {
    return this._$injector;
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

  getDb() {
    const db = this.ngDexie.getDb();

    db.open();
    return db;
  }

  getAllEntities(allEntitiesPromise = Utils.requiredParam(), resultMapper = angular.identity) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    this.$$pushPendingReq(promise);
    allEntitiesPromise
      .then(
        (values = []) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(resultMapper.apply(this, [values]));
        },
        (ignoredRejection) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(null);
        }
      );

    return promise;
  }

  update(db = Utils.requiredParam(), id = Utils.requiredParam(), valuesObj = {}) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    this.$$pushPendingReq(promise);
    db.update(id, valuesObj)
      .then(
        (updated = []) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(updated);
        },
        (ignoredRejection) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(null);
        }
      );

    return promise;
  }

  put(db = Utils.requiredParam(), entity = Utils.requiredParam()) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    this.$$pushPendingReq(promise);
    db.put(entity.toObject())
      .then(
        (ignoredResponse) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(entity);
        },
        (rejection) => {
          this.$$removePendingReq(promise);
          return deferred.reject(rejection);
        }
      );

    return promise;
  }
}
