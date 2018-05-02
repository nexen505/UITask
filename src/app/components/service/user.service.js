import { User } from "../model/user.model";
import { DexieService } from "./ngDexie.service";

export class UserService extends DexieService {
  constructor(ngDexie, $q, AchievementService, UtilsService) {
    'ngInject';

    super(ngDexie);
    this.$q = $q;
    this.AchievementService = AchievementService;
    this.UtilsService = UtilsService;
  }

  getUsersDb() {
    return this.ngDexie.getDb().users;
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
                this.AchievementService
                  .getUserAchievements(userId)
                  .then(
                    (achievements) => {
                      this.$$removePendingReq(promise);
                      user.achievements = achievements;
                      return deferred.resolve(user);
                    },
                    (ignoredRejection) => {
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
