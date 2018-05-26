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

  getAll(archived = false) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    this.$$pushPendingReq(promise);
    this.getAchievementsDb().toArray()
      .then(
        (values = []) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(values.map(AchievementService.achievementMapper).filter((achievement) => achievement.archived === archived));
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
              this.UserService.getAchievementUsers(achievementId).then(
                (achievementUsers) => {
                  achievement.users = achievementUsers;

                  this.$$removePendingReq(promise);
                  return deferred.resolve(achievement);
                },
                (ignoredRejection) => {
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
    if (hasUser) {
      usAchs
        .then(
          (values = []) => {
            return this.$q
              .all(
                values.map(
                  (userAchievement) => this.get(userAchievement.achievementId)
                    .then(
                      (achievement) => {
                        return new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date, AchievementService.achievementMapper(achievement));
                      },
                      (ignoredRejection) => {
                        return new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date);
                      }
                    )
                )
              )
              .then(
                (userAchievements) => {
                  this.$$removePendingReq(promise);
                  return deferred.resolve(
                    userAchievements
                  );
                },
                (rejections) => {
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

          return this.getAchievementsDb().where('id').noneOf(achIds).toArray();
        },
        (rejection) => {
          return deferred.reject(rejection);
        }
      ).then(
        (values = []) => {
          const achievements = values.map(AchievementService.achievementMapper);

          this.$$removePendingReq(promise);
          return deferred.resolve(achievements);
        },
        (rejection) => {
          this.$$removePendingReq(promise);
          return deferred.reject(rejection);
        }
      );
    }

    return promise;
  }

  $$updateArchived(achievementId = Utils.requiredParam(), value = false) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (achievementId) {
      this.$$pushPendingReq(promise);
      this.getAchievementsDb()
        .update(achievementId, {
          archived: value
        })
        .then(
          (updated) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(updated);
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

  delete(achievementId = Utils.requiredParam()) {
    return this.$$updateArchived(achievementId, true);
  }

  restore(achievementId = Utils.requiredParam()) {
    return this.$$updateArchived(achievementId, false);
  }

  saveOrUpdate(achievement = Utils.requiredParam()) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

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
