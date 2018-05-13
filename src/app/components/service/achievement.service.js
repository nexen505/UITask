import { Achievement } from "../model/achievement.model";
import { DexieService } from "./ngDexie.service";
import { UserAchievement } from "../model/userAchievement.model";
import { Utils } from "../utils/utils.service";

export class AchievementService extends DexieService {
  constructor(_, ngDexie, $log, $q, $injector) {
    'ngInject';

    super(ngDexie, $log, _);
    this.$q = $q;
    this.$injector = $injector;
  }

  get UserService() {
    return this.$injector.get('UserService');
  }

  get UserAchievementService() {
    return this.$injector.get('UserAchievementService');
  }

  getAchievementsDb(db = this.getDb()) {
    return db.achievements;
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
      // ordered = ordered.where('archived').equalsIgnoreCase(archived);
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
      promise = deferred.promise,
      usAchs = this.UserAchievementService
        .getUserAchievementsCollection(userId, null)
        .toArray();

    this.$$pushPendingReq(promise);
    this.$$pushPendingReq(usAchs);
    if (hasUser) {
      usAchs
        .then(
          (values = []) => {
            const usAch = values.map(
              (userAchievement) => {
                const achievementPromise = this.get(userAchievement.achievementId);

                this.$$pushPendingReq(achievementPromise);
                achievementPromise
                  .then(
                    (achievement) => {
                      this.$$removePendingReq(achievementPromise);
                      return new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date, AchievementService.achievementMapper(achievement));
                    },
                    (ignoredRejection) => {
                      this.$$removePendingReq(achievementPromise);
                      return new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date);
                    }
                  );

                return achievementPromise;
              }
            );

            return this.$q.all(usAch)
              .then(
                (userAchievements) => {
                  this.$$removePendingReq(usAchs);
                  this.$$removePendingReq(promise);
                  return deferred.resolve(
                    userAchievements
                  );
                },
                (rejections) => {
                  this.$$removePendingReq(usAchs);
                  this.$$removePendingReq(promise);
                  return deferred.reject(rejections);
                }
              );
          },
          (rejection) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(rejection);
          }
        );
    } else {
      return usAchs.then(
        (rows) => {
          const achIds = this._.uniq(
            this._.compact(
              rows.map((row) => row.achievementId)
            )
          );

          this.$$removePendingReq(usAchs);
          return this.getAchievementsDb().where('id').noneOf(achIds).toArray();
        },
        (rejection) => {
          this.$$removePendingReq(usAchs);
          return deferred.reject(rejection);
        }
      ).then(
        (values = []) => {
          const users = values.map(AchievementService.achievementMapper);

          this.$$removePendingReq(promise);
          return deferred.resolve(users);
        },
        (rejection) => {
          this.$$removePendingReq(promise);
          return deferred.reject(rejection);
        }
      );
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
          (resp) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(resp);
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

  saveOrUpdate(achievement = Utils.requiredParam()) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

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

    return promise;
  }
}
