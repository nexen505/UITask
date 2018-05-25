import { Utils } from "../../../components/utils/utils.service";
import { UserAchievement } from "../../../components/model/userAchievement.model";

export class AchievementController {
  constructor($scope, AchievementService, UserService, UserAchievementService, EventService, achievementData, $state) {
    'ngInject';

    this.achievement = achievementData;
    this.AchievementService = AchievementService;
    this.UserService = UserService;
    this.UserAchievementService = UserAchievementService;
    this.$state = $state;

    this.$scope = $scope;
    this.$scope.selectedTab = this.tabs.ACHIEVED;
    EventService.watch(this.$scope, 'selectedTab', (newVal) => {
      if (newVal) {
        this.selectTab(newVal);
      }
    });
  }

  get selectedTab() {
    return this.$scope.selectedTab;
  }

  get achievement() {
    return this._achievement;
  }

  set achievement(value) {
    this._achievement = value || {};
    this._achievement.$active = false;
  }

  get tabs() {
    return {
      ACHIEVED: 'ACHIEVED',
      OTHERS: 'OTHERS'
    };
  }

  selectTab(tab) {
    this.$scope.selectedTab = tab;
    this.users = [];
    switch (tab) {
      case this.tabs.ACHIEVED:
        this.UserService.getAchievementUsers(this.achievement.id, true)
          .then(
            (users) => {
              this.users = users;
            },
            (error) => {
              console.log(error);
            }
          );
        break;
      case this.tabs.OTHERS:
        this.UserService.getAchievementUsers(this.achievement.id, false)
          .then(
            (users) => {
              this.users = users;
            },
            (error) => {
              console.log(error);
            }
          );
        break;
      default:

    }
  }

  goToUser(userId = Utils.requiredParam()) {
    this.$state.go('user', {
      userId: userId
    });
  }

  editAchievement() {
    this.achievementCopy = angular.copy(this.achievement);
    this.achievement.$active = true;
  }

  saveAchievement(achievement = Utils.requiredParam(), $event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.AchievementService.saveOrUpdate(achievement)
      .then((savedAchievement) => {
        this.achievement = savedAchievement;
        this.closeEditingAchievement($event);
      });
  }

  deleteAchievement($event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.AchievementService.delete(this.achievement.id)
      .then(() => {
        this.$state.go('main.achievements');
      });
  }

  closeEditingAchievement($event) {
    $event.stopImmediatePropagation();
    this.achievement.$active = false;
  }

  toggleAchievement(user = Utils.requiredParam(), toggle = true) {
    if (toggle) {
      const userAchievement = new UserAchievement();

      userAchievement.achievement = this.achievement;
      userAchievement.user = user;
      user.userAchievement = userAchievement;
    } else {
      this.UserAchievementService.delete(user.id, this.achievement.id)
        .then(
          (resp) => {
            this.selectTab(this.selectedTab);
          },
          (errorResp) => {
            console.log(errorResp);
          }
        );
    }
  }

  saveUserAchievement(userAchievement = Utils.requiredParam()) {
    this.UserAchievementService.saveOrUpdate(userAchievement)
      .then(
        (resp) => {
          this.selectTab(this.selectedTab);
        },
        (errorResp) => {
          console.log(errorResp);
        }
      );
  }

}
