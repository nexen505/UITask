import {Achievement} from "../model/achievement.model";
import {DexieService} from "./ngDexie.service";
import {UserAchievement} from "../model/userAchievement.model";
import {Utils} from "../utils/utils.service";

export class AchievementService extends DexieService {
  constructor(ngDexie, $log, $q, $injector) {
    'ngInject';

    super(ngDexie, $log);
    this.$q = $q;
    this.$injector = $injector;
  }

  get UserService() {
    return this.$injector.get('UserService');
  }

  getAchievementsDb(db = this.getDb()) {
    return db.achievements;
  }

  getUserAchievementsDb(db = this.getDb()) {
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

  get(achievementId = null, withUsers = false) {
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
            const achievement = AchievementService.achievementMapper(value);

            if (withUsers) {
              const achievementUserPromise = this.UserService.getAchievementUsers(achievementId);

              this.$$pushPendingReq(achievementUserPromise);
              achievementUserPromise
                .then(
                  (achievementUsers) => {
                    achievement.users = achievementUsers;

                    this.$$removePendingReq(achievementUserPromise);
                    this.$$removePendingReq(promise);
                    return deferred.resolve(achievement);
                  },
                  (ignoredRejection) => {
                    this.$$removePendingReq(achievementUserPromise);
                    this.$$removePendingReq(promise);
                    return deferred.resolve(achievement);
                  }
                );
            } else {
              this.$$removePendingReq(promise);
              return deferred.resolve(achievement);
            }
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

  getUserAchievements(userId = Utils.requiredParam(), hasUser = true) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (userId) {
      this.$$pushPendingReq(promise);
      ((has) => {
        const userAchievementsIds = this.getUserAchievementsDb()
          .where('[userId+achievementId]')
          .between([userId, this.ngDexie.minKey], [userId, this.ngDexie.maxKey]) // FIXME it doesn't work
          .toArray();

        if (has) {
          return userAchievementsIds;
        }
        return userAchievementsIds.then(
          (ids) => {
            return this.getAchievementsDb().where('id').noneOf(ids).toArray();
          }
        ); // TODO check implementation
      })(hasUser)
        .then(
          (values = []) => {
            const usAchPromises = values.map(
              (userAchievement) => {
                const userPromise = this.get(userAchievement.achievementId),
                  userAchievementId = `${userAchievement.userId}/${userAchievement.achievementId}`;

                this.$$pushPendingReq(userPromise);
                userPromise
                  .then(
                    (achievement) => {
                      this.$$removePendingReq(userPromise);
                      return new UserAchievement(userAchievementId, userAchievement.comment, userAchievement.date, AchievementService.achievementMapper(achievement));
                    },
                    (ignoredRejection) => {
                      this.$$removePendingReq(userPromise);
                      return new UserAchievement(userAchievementId, userAchievement.comment, userAchievement.date);
                    }
                  );

                return userPromise;
              }
            );

            return this.$q.all(usAchPromises)
              .then(
                (userAchievements) => {
                  this.$$removePendingReq(promise);
                  return deferred.resolve(
                    userAchievements
                  );
                }
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
