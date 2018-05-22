import { User } from "../model/user.model";
import { DexieService } from "./ngDexie.service";
import { UserAchievement } from "../model/userAchievement.model";
import { Utils } from "../utils/utils.service";

export class UserService extends DexieService {
  constructor(_, ngDexie, $log, $q, $injector) {
    'ngInject';

    super(ngDexie, $log, _);
    this.$q = $q;
    this.$injector = $injector;
  }

  get AchievementService() {
    return this.$injector.get('AchievementService');
  }

  get UserAchievementService() {
    return this.$injector.get('UserAchievementService');
  }

  getUsersDb(db = this.getDb()) {
    return db.users;
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
      // ordered = ordered.where('archived').equals(+archived);
      // FIXME it doesn't work
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
      promise = deferred.promise,
      usAchs = this.UserAchievementService
        .getUserAchievementsCollection(null, achievementId)
        .toArray();

    this.$$pushPendingReq(promise);
    this.$$pushPendingReq(usAchs);
    if (hasAchievement) {
      usAchs
        .then(
          (values = []) => {
            const achUsPromises = values.map(
              (userAchievement) => {
                const userPromise = this.get(userAchievement.userId);

                this.$$pushPendingReq(userPromise);
                userPromise
                  .then(
                    (user) => {
                      this.$$removePendingReq(userPromise);
                      return new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date, null, UserService.usersMapper(user));
                    },
                    (ignoredRejection) => {
                      this.$$removePendingReq(userPromise);
                      return new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date);
                    }
                  );

                return userPromise;
              }
            );

            return this.$q.all(achUsPromises)
              .then(
                (achievementUsers) => {
                  this.$$removePendingReq(usAchs);
                  this.$$removePendingReq(promise);
                  return deferred.resolve(
                    achievementUsers
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
      usAchs
        .then(
          (rows) => {
            const usIds = this._.uniq(
              this._.compact(
                rows.map((row) => row.userId)
              )
            );

            this.$$removePendingReq(usAchs);
            return this.getUsersDb().where('id').noneOf(usIds).toArray();
          },
          (rejection) => {
            this.$$removePendingReq(usAchs);
            return deferred.reject(rejection);
          }
        ).then(
        (values = []) => {
          const users = values.map(UserService.usersMapper);

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

  delete(userId = Utils.requiredParam()) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

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

    return promise;
  }

  saveOrUpdate(user = Utils.requiredParam()) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    this.$log.info('saveOrUpdate user', user.toObject());
    this.$$pushPendingReq(promise);
    this.getUsersDb()
      .put(user.toObject())
      .then(
        (ignoredResponse) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(user);
        },
        (rejection) => {
          this.$$removePendingReq(promise);
          return deferred.reject(rejection);
        }
      );

    return promise;
  }
}
