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
    this.getUsersDb()
      .toArray()
      .then(
        (values = []) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(values.map(UserService.usersMapper).filter((user) => user.archived === archived));
        },
        (ignoredRejection) => {
          this.$$removePendingReq(promise);
          return deferred.resolve(null);
        }
      );

    return promise;
  }

  get(userId = null, withAchievements = false) {
    const deferred = this.$q.defer();

    if (userId) {
      this.$$pushPendingReq(deferred.promise);
      this.getUsersDb()
        .where("id")
        .equalsIgnoreCase(userId)
        .first()
        .then(
          (value) => {
            if (value) {
              const user = UserService.usersMapper(value);

              if (withAchievements) {
                this.AchievementService
                  .getUserAchievements(userId)
                  .then(
                    (achievements) => {
                      user.achievements = achievements;
                      this.$$removePendingReq(deferred.promise);
                      return deferred.resolve(user);
                    },
                    (ignoredRejection) => {
                      this.$$removePendingReq(deferred.promise);
                      return deferred.resolve(user);
                    }
                  );
              } else {
                this.$$removePendingReq(deferred.promise);
                return deferred.resolve(user);
              }
            } else {
              this.$$removePendingReq(deferred.promise);
              return deferred.resolve(null);
            }
          },
          deferred.resolve(null)
        );
    } else {
      deferred.resolve(null);
    }

    return deferred.promise;
  }

  getAchievementUsers(achievementId = Utils.requiredParam(), hasAchievement = true) {
    const deferred = this.$q.defer(),
      vm = this,
      usAchs = vm.UserAchievementService
        .getUserAchievementsCollection(null, achievementId)
        .toArray();

    vm.$$pushPendingReq(deferred.promise);
    if (hasAchievement) {
      usAchs
        .then(
          (rows = []) => {
            return vm.$q
              .all(
                rows.map(
                  (userAchievement) => vm.get(userAchievement.userId)
                    .then(
                      (user) => {
                        console.log(user, userAchievement);
                        return new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date, null, UserService.usersMapper(user));
                      },
                      (ignoredRejection) => {
                        return new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date);
                      }
                    )
                )
              )
              .then(
                (achievementUsers) => {
                  vm.$$removePendingReq(deferred.promise);
                  return deferred.resolve(
                    achievementUsers
                  );
                },
                (rejections) => {
                  vm.$$removePendingReq(deferred.promise);
                  return deferred.reject(rejections);
                }
              );
          },
          (rejection) => {
            vm.$$removePendingReq(deferred.promise);
            return deferred.resolve(rejection);
          }
        );
    } else {
      usAchs
        .then(
          (rows) => {
            const usIds = vm._.uniq(
              vm._.compact(
                rows.map((row) => row.userId)
              )
            );

            return vm.getUsersDb().where('id').noneOf(usIds).toArray();
          },
          (rejection) => {
            return deferred.reject(rejection);
          }
        )
        .then(
          (values = []) => {
            const users = values.map(UserService.usersMapper);

            vm.$$removePendingReq(deferred.promise);
            return deferred.resolve(users);
          },
          (rejection) => {
            vm.$$removePendingReq(deferred.promise);
            return deferred.reject(rejection);
          }
        );
    }

    return deferred.promise;
  }

  $$updateArchived(userId = Utils.requiredParam(), value = false) {
    const deferred = this.$q.defer(),
      promise = deferred.promise;

    this.$$pushPendingReq(promise);
    this.getUsersDb()
      .update(userId, {
        archived: value
      })
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

  delete(userId = Utils.requiredParam()) {
    return this.$$updateArchived(userId, false);
  }

  restore(userId = Utils.requiredParam()) {
    return this.$$updateArchived(userId, true);
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
