import { DexieService } from "./ngDexie.service";
import { Utils } from "../utils/utils.service";

export class UserAchievementService extends DexieService {
  constructor(ngDexie, $log, $q) {
    'ngInject';

    super(ngDexie, $log);
    this.$q = $q;
  }

  getUserAchievementsDb(db = this.getDb()) {
    return db.userAchievements;
  }

  getUserAchievementsCollection(userId, achievementId) {
    let userAchievements = this.getUserAchievementsDb();

    if (userId) {
      userAchievements = userAchievements.where("userId")
        .equalsIgnoreCase(userId);
    }
    if (achievementId) {
      userAchievements = userAchievements.where('achievementId')
        .equalsIgnoreCase(achievementId);
    }

    return userAchievements;
  }

  delete(userId, achievementId) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    this.getUserAchievementsCollection(userId, achievementId)
      .delete()
      .then(
        (value = []) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(value);
        },
        (rejection) => {
          this.$$removePendingReq(promise);
          return deferred.reject(rejection);
        }
      );

    return promise;
  }

  saveOrUpdate(userAchievement = Utils.requiredParam()) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    this.$log.info('saveOrUpdate userAchievement', userAchievement.toObject());
    this.$$pushPendingReq(promise);
    this.getUserAchievementsDb()
      .put(userAchievement.toObject())
      .then(
        (resp) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(resp);
        },
        (rejection) => {
          this.$$removePendingReq(promise);
          return deferred.reject(rejection);
        }
      );

    return promise;
  }
}
