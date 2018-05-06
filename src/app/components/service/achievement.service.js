import { Achievement } from "../model/achievement.model";
import { UserAchievement } from "../model/userAchievement.model";
import { DexieService } from "./ngDexie.service";

export class AchievementService extends DexieService {
  constructor(ngDexie, $log, $q) {
    'ngInject';

    super(ngDexie, $log);
    this.$q = $q;
  }

  getAchievementsDb(db = this.ngDexie.getDb()) {
    db.open();
    return db.achievements;
  }

  getUserAchievementsDb(db = this.ngDexie.getDb()) {
    db.open();
    return db.userAchievements;
  }

  static achievementMapper(achievement = {}) {
    return new Achievement(achievement.id, achievement.name, achievement.description, achievement.karma, achievement.icon, achievement.archived);
  }

  getAll(archived) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    this.$$pushPendingReq(promise);
    let ordered = this.getAchievementsDb();

    if (angular.isDefined(archived)) {
      // ordered = ordered.where({
      //   archived: +archived
      // });
      // FIXME it doesn't work
    }

    ordered
      .toArray()
      .then(
        (values = []) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(values.map(AchievementService.achievementMapper));
        },
        (ignoredRejection) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(null);
        }
      );

    return promise;
  }

  get(achievementId = null) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (achievementId) {
      this.$$pushPendingReq(promise);
      this.getAchievementsDb()
        .where("id")
        .equalsIgnoreCase(achievementId)
        .first()
        .then(
          (value = []) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(AchievementService.achievementMapper(value));
          },
          (ignoredRejection) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(null);
          }
        );
    } else {
      deferred.resolve(null);
    }

    return promise;
  }

  getUserAchievements(userId) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (userId) {
      this.$$pushPendingReq(promise);
      this.getUserAchievementsDb()
        .where('userId')
        .equalsIgnoreCase(userId)
        .toArray()
        .then(
          (values = []) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(
              values.map(
                (userAchievement) => {
                  const userPromise = this.get(userAchievement.achievementId);

                  this.$$pushPendingReq(userPromise);
                  userPromise
                    .then(
                      (achievement) => {
                        this.$$removePendingReq(userPromise);
                        return deferred.resolve(new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date, AchievementService.achievementMapper(achievement)));
                      },
                      (ignoredRejection) => {
                        this.$$removePendingReq(userPromise);
                        return deferred.resolve(new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date));
                      }
                    );
                }
              )
            );
          },
          (ignoredRejection) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(null);
          }
        );
    } else {
      deferred.resolve(null);
    }

    return promise;
  }

  delete(achievementId = null) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (achievementId) {
      this.$$pushPendingReq(promise);
      this.getAchievementsDb()
        .update(achievementId, {
          archived: true
        })
        .then(
          (ignoredRespo) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(true);
          },
          (rejection) => {
            this.$$removePendingReq(promise);
            return deferred.reject(rejection);
          }
        );
    } else {
      deferred.resolve(null);
    }

    return promise;
  }

  saveOrUpdate(achievement) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (achievement) {
      this.$log.info('saveOrUpdate achievement', achievement.toObject());
      this.$$pushPendingReq(promise);
      this.getAchievementsDb()
        .put(achievement.toObject())
        .then(
          (ignoredResponse) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(achievement);
          },
          (rejection) => {
            this.$$removePendingReq(promise);
            return deferred.reject(rejection);
          }
        );
    } else {
      deferred.resolve(achievement);
    }

    return promise;
  }


}
