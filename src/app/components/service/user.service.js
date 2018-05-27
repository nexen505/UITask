import { User } from "../model/user.model";
import { DexieService } from "./ngDexie.service";
import { UserAchievement } from "../model/userAchievement.model";
import { Utils } from "../utils/utils.service";

export class UserService extends DexieService {
  constructor(_, ngDexie, $log, $q, $injector, archivedCriterions) {
    'ngInject';

    super(ngDexie, _, $q, $log, $injector);
    this.archivedCriterions = archivedCriterions;
  }

  get AchievementService() {
    return this.$injector.get('AchievementService');
  }

  get UserAchievementService() {
    return this.$injector.get('UserAchievementService');
  }

  static usersMapper(user = {}) {
    return new User(user.id, user.name, user.bio, user.photo, user.archived);
  }

  getUsersDb(db = this.getDb()) {
    return db.users;
  }

  getAll(archivedCriterion = this.archivedCriterions.NOT_ARCHIVED) {
    const $filter = this.$injector.get('$filter');

    return super.getAllEntities(
      this.getUsersDb().toArray(),
      (values) => $filter('archived')(
        values.map(UserService.usersMapper),
        {
          archivedKey: 'archived',
          archivedValue: archivedCriterion
        }
      )
    );
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
      promise = deferred.promise,
      vm = this,
      usAchs = vm.UserAchievementService
        .getUserAchievementsCollection(null, achievementId)
        .toArray();

    vm.$$pushPendingReq(promise);
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
                  vm.$$removePendingReq(promise);
                  return deferred.resolve(
                    achievementUsers
                  );
                },
                (rejections) => {
                  vm.$$removePendingReq(promise);
                  return deferred.reject(rejections);
                }
              );
          },
          (rejection) => {
            vm.$$removePendingReq(promise);
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

            vm.$$removePendingReq(promise);
            return deferred.resolve(users);
          },
          (rejection) => {
            vm.$$removePendingReq(promise);
            return deferred.reject(rejection);
          }
        );
    }

    return deferred.promise;
  }

  $$updateArchived(userId = Utils.requiredParam(), value = false) {
    return super.update(this.getUsersDb(), userId, {
      archived: value
    });
  }

  delete(userId = Utils.requiredParam()) {
    return this.$$updateArchived(userId, false);
  }

  restore(userId = Utils.requiredParam()) {
    return this.$$updateArchived(userId, true);
  }

  saveOrUpdate(user = Utils.requiredParam()) {
    return super.put(this.getUsersDb(), user);
  }
}
