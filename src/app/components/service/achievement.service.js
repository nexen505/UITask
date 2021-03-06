import { Achievement } from "../model/achievement.model";
import { DexieService } from "./ngDexie.service";
import { UserAchievement } from "../model/userAchievement.model";
import { Utils } from "../utils/utils.service";

export class AchievementService extends DexieService {
  constructor(_, ngDexie, $log, $q, $injector, archivedCriterions) {
    'ngInject';

    super(ngDexie, _, $q, $log, $injector);
    this.archivedCriterions = archivedCriterions;
  }

  get UserService() {
    return this.$injector.get('UserService');
  }

  get UserAchievementService() {
    return this.$injector.get('UserAchievementService');
  }

  static achievementMapper(achievement = {}) {
    return new Achievement(achievement.id, achievement.name, achievement.description, achievement.karma, achievement.icon, achievement.archived);
  }

  getAchievementsDb(db = this.getDb()) {
    return db.achievements;
  }

  getAll(archivedCriterion = this.archivedCriterions.NOT_ARCHIVED, searchText = '') {
    const $filter = this.$injector.get('$filter');

    return super.getAllEntities(
      this.getAchievementsDb().toArray(),
      (values) => $filter('archivedName')(
        values.map(AchievementService.achievementMapper),
        {
          archivedKey: 'archived',
          archivedValue: archivedCriterion,
          nameKey: 'name',
          nameValue: searchText
        }
      )
    );
  }

  get(achievementId = null, withUsers = false) {
    const vm = this,
      deferred = vm.$q.defer(),
      promise = deferred.promise;

    if (achievementId) {
      vm.$$pushPendingReq(promise);
      vm.getAchievementsDb()
        .where("id")
        .equalsIgnoreCase(achievementId)
        .first()
        .then(
          (value = []) => {
            const achievement = AchievementService.achievementMapper(value);

            if (withUsers) {
              vm.UserService
                .getAchievementUsers(achievementId)
                .then(
                  (achievementUsers) => {
                    achievement.users = achievementUsers;

                    vm.$$removePendingReq(promise);
                    return deferred.resolve(achievement);
                  },
                  (ignoredRejection) => {
                    vm.$$removePendingReq(promise);
                    return deferred.resolve(achievement);
                  }
                );
            } else {
              vm.$$removePendingReq(promise);
              return deferred.resolve(achievement);
            }
          },
          (ignoredRejection) => {
            vm.$$removePendingReq(promise);
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
      vm = this,
      usAchs = vm.UserAchievementService
        .getUserAchievementsCollection(userId, null)
        .toArray();

    vm.$$pushPendingReq(promise);
    if (hasUser) {
      usAchs
        .then(
          (values = []) => {
            return vm.$q
              .all(
                values.map(
                  (userAchievement) => {
                    const d = vm.$q.defer();

                    vm.get(userAchievement.achievementId)
                      .then(
                        (achievement) => {
                          return d.resolve(new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date, AchievementService.achievementMapper(achievement)));
                        },
                        (ignoredRejection) => {
                          return d.resolve(new UserAchievement(userAchievement.id, userAchievement.comment, userAchievement.date));
                        }
                      );

                    return d.promise;
                  }
                )
              )
              .then(
                (userAchievements) => {
                  vm.$$removePendingReq(promise);
                  return deferred.resolve(
                    userAchievements
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
      usAchs.then(
        (rows) => {
          const achIds = vm._.uniq(
            vm._.compact(
              rows.map((row) => row.achievementId)
            )
          );

          return vm.getAchievementsDb().where('id').noneOf(achIds).toArray();
        },
        (rejection) => {
          return deferred.reject(rejection);
        }
      ).then(
        (values = []) => {
          const achievements = values.map(AchievementService.achievementMapper);

          vm.$$removePendingReq(promise);
          return deferred.resolve(achievements);
        },
        (rejection) => {
          vm.$$removePendingReq(promise);
          return deferred.reject(rejection);
        }
      );
    }

    return promise;
  }

  $$updateArchived(achievementId = Utils.requiredParam(), value = false) {
    return super.update(this.getAchievementsDb(), achievementId, {
      archived: value
    });
  }

  delete(achievementId = Utils.requiredParam()) {
    return this.$$updateArchived(achievementId, true);
  }

  restore(achievementId = Utils.requiredParam()) {
    return this.$$updateArchived(achievementId, false);
  }

  saveOrUpdate(achievement = Utils.requiredParam()) {
    return super.put(this.getAchievementsDb(), achievement);
  }
}
