import { Utils } from "../../../components/utils/utils.service";

export class AchievementController {
  constructor($scope, AchievementService, UserService, EventService, achievementData, $state) {
    'ngInject';

    console.log(arguments);
    this.achievement = achievementData;
    this.AchievementService = AchievementService;
    this.UserService = UserService;
    this.$state = $state;

    this.$scope = $scope;
    this.$scope.selectedTab = this.tabs.ACHIEVED;
    EventService.watch(this.$scope, 'selectedTab', (newVal) => {
      if (newVal) {
        this.selectTab(newVal);
      }
    });
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
    this.$scope.selectTab = tab;
    this.users = [];
    switch (tab) {
      case this.tabs.ACHIEVED:
        this.UserService.getAchievementUsers(this.achievement.id, true)
          .then(
            (users) => {
              this.users = users;
            }
          );
        break;
      case this.tabs.OTHERS:
        this.UserService.getAchievementUsers(this.achievement.id, false)
          .then(
            (users) => {
              this.users = users;
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
    this.achievement.$active = true;
    this.achievementCopy = angular.copy(this.achievement);
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

  toggleAchievement(userId = Utils.requiredParam(), achievementId = Utils.requiredParam(), toggle = true) {
    // TODO implement this logic
  }

}
