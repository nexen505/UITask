import { User } from "../model/user.model";
import { DexieService } from "./ngDexie.service";
import { UserAchievement } from "../model/userAchievement.model";
import { Utils } from "../utils/utils.service";

export class UserService extends DexieService {
  constructor(ngDexie, $log, $q, $injector) {
    'ngInject';

    super(ngDexie, $log);
    this.$q = $q;
    this.$injector = $injector;
  }

  get AchievementService() {
    return this.$injector.get('AchievementService');
  }

  getUsersDb(db = this.getDb()) {
    return db.users;
  }

  getUserAchievementsDb(db = this.getDb()) {
    return db.userAchievements;
  }

  static usersMapper(user = {}) {
    return new User(user.id, user.name, user.bio, user.photo);
  }

  getAll(archived = false) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    this.$$pushPendingReq(promise);
    let ordered = this.getUsersDb();

    if (angular.isDefined(archived)) {
      ordered = ordered.where('archived').equals(+archived);
    }
    ordered
      .toArray()
      .then(
        (values = []) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(values.map(UserService.usersMapper));
        },
        (ignoredRejection) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(null);
        }
      );

    return promise;
  }

  get(userId = null, withAchievements = false) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (userId) {
      this.$$pushPendingReq(promise);
      this.getUsersDb()
        .where("id")
        .equalsIgnoreCase(userId)
        .first()
        .then(
          (value) => {
            if (value) {
              const user = UserService.usersMapper(value);

              if (withAchievements) {
                const userAchievementsPromise = this.AchievementService
                  .getUserAchievements(userId);

                this.$$pushPendingReq(userAchievementsPromise);
                userAchievementsPromise
                  .then(
                    (achievements) => {
                      user.achievements = achievements;
                      this.$$removePendingReq(userAchievementsPromise);
                      this.$$removePendingReq(promise);
                      return deferred.resolve(user);
                    },
                    (ignoredRejection) => {
                      this.$$removePendingReq(userAchievementsPromise);
                      this.$$removePendingReq(promise);
                      return deferred.resolve(user);
                    }
                  );
              } else {
                this.$$removePendingReq(promise);
                return deferred.resolve(user);
              }
            } else {
              this.$$removePendingReq(promise);
              return deferred.resolve(null);
            }
          },
          deferred.resolve(null)
        );
    } else {
      deferred.resolve(null);
    }

    return promise;
  }

  getAchievementUsers(achievementId = Utils.requiredParam(), hasAchievement = true) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (achievementId) {
      this.$$pushPendingReq(promise);
      ((has) => {
        const achievementUserIds = this.getUserAchievementsDb()
          .where('[userId+achievementId]')
          .between([DexieService.minKey, achievementId], [DexieService.maxKey, achievementId]) // FIXME it doesn't work
          .toArray();

        if (has) {
          return achievementUserIds;
        }
        return this.getUsersDb().where('id').noneOf(achievementUserIds).toArray(); // FIXME noneOf expected Array instead of Promise
      })(hasAchievement)
        .then(
          (values = []) => {
            const achUsPromises = values.map(
              (userAchievement) => {
                const userPromise = this.get(userAchievement.achievementId),
                  userAchievementId = `${userAchievement.userId}/${userAchievement.achievementId}`;

                this.$$pushPendingReq(userPromise);
                userPromise
                  .then(
                    (achievement) => {
                      this.$$removePendingReq(userPromise);
                      return new UserAchievement(userAchievementId, userAchievement.comment, userAchievement.date, null, UserService.usersMapper(achievement));
                    },
                    (ignoredRejection) => {
                      this.$$removePendingReq(userPromise);
                      return new UserAchievement(userAchievementId, userAchievement.comment, userAchievement.date);
                    }
                  );

                return userPromise;
              }
            );

            return this.$q.all(achUsPromises)
              .then(
                (achievementUsers) => {
                  this.$$removePendingReq(promise);
                  return deferred.resolve(
                    achievementUsers
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

  delete(userId = null) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (userId) {
      this.$$pushPendingReq(promise);
      this.getUsersDb()
        .update(userId, {
          archived: true
        })
        .then(
          (value = []) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(value);
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

  saveOrUpdate(user) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (user) {
      this.$$pushPendingReq(promise);
      this.getUsersDb()
        .put(user.toObject())
        .then(
          (value) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(value);
          },
          (ignoredRejection) => {
            this.$$removePendingReq(promise);
            return deferred.reject(ignoredRejection);
          }
        );
    } else {
      deferred.resolve(user);
    }

    return promise;
  }

  deleteUserAchievement(userId, achievementId) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    if (userId) {
      this.$$pushPendingReq(promise);
      let userAchievements = this.AchievementService.getUserAchievementsDb()
        .where("userId")
        .equalsIgnoreCase(userId);

      if (achievementId) {
        userAchievements = userAchievements.where('achievementId')
          .equalsIgnoreCase(achievementId);
      }
      userAchievements
        .delete()
        .then(
          (value = []) => {
            this.$$removePendingReq(promise);
            return deferred.resolve(value);
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

}
