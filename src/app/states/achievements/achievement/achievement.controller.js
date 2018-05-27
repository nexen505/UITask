import { Utils } from "../../../components/utils/utils.service";
import { UserAchievement } from "../../../components/model/userAchievement.model";

export class AchievedContentElm {
  constructor({ obj, type }) {
    this._obj = obj;
    this._type = type;
  }

  get type() {
    return this._type;
  }

  get obj() {
    return this._obj;
  }

  static get types() {
    return {
      ACHIEVED: 'ACHIEVED',
      OTHERS: 'OTHERS'
    };
  }
}

export class UserAchievementController {
  constructor({
                $scope, AchievementService, UserService, UserAchievementService, EventService, $state, $q, $log
              }) {
    this._$scope = $scope;
    this._AchievementService = AchievementService;
    this._UserService = UserService;
    this._UserAchievementService = UserAchievementService;
    this._EventService = EventService;
    this._$state = $state;
    this._$q = $q;
    this._$log = $log;
  }

  get $scope() {
    return this._$scope;
  }

  get AchievementService() {
    return this._AchievementService;
  }

  get UserService() {
    return this._UserService;
  }

  get UserAchievementService() {
    return this._UserAchievementService;
  }

  get EventService() {
    return this._EventService;
  }

  get $state() {
    return this._$state;
  }

  get $q() {
    return this._$q;
  }

  get $log() {
    return this._$log;
  }

}

export class AchievementController extends UserAchievementController {
  constructor($scope, AchievementService, UserService, UserAchievementService, EventService, $state, $q, $log, achievementData) {
    'ngInject';

    super({
      $scope: $scope,
      AchievementService: AchievementService,
      UserService: UserService,
      UserAchievementService: UserAchievementService,
      EventService: EventService,
      $state: $state,
      $q: $q,
      $log: $log
    });

    const vm = this;

    vm._tabs = {
      ALL: {
        value: 'ALL',
        name: 'Все пользователи'
      },
      ACHIEVED: {
        value: AchievedContentElm.types.ACHIEVED,
        name: 'Награжденные пользователи'
      },
      OTHERS: {
        value: AchievedContentElm.types.OTHERS,
        name: 'Ненагражденные пользователи'
      }
    };
    vm.achievement = achievementData;
    vm.$scope.selectedTab = Object.values(vm.tabs).find((value) => value.value === $state.params.tab) || vm.tabs.ALL;
    vm.selectTab(vm.$scope.selectedTab);
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

  get users() {
    return this._users;
  }

  set users(value) {
    this._users = value || {};
  }

  get tabs() {
    return this._tabs;
  }

  selectTab(tabInfo = {}) {
    const vm = this;

    this.$scope.selectedTab = tabInfo;
    switch (tabInfo) {
      case vm.tabs.ACHIEVED:
        vm.UserService.getAchievementUsers(vm.achievement.id, true)
          .then(
            (users) => {
              vm.users = users.map((obj) => {
                return new AchievedContentElm({
                  obj: obj,
                  type: vm.tabs.ACHIEVED.value
                });
              });
            },
            (error) => {
              console.log(error);
            }
          );
        break;
      case vm.tabs.OTHERS:
        vm.UserService.getAchievementUsers(vm.achievement.id, false)
          .then(
            (users) => {
              vm.users = users.map((obj) => {
                return new AchievedContentElm({
                  obj: obj,
                  type: vm.tabs.OTHERS.value
                });
              });
            },
            (error) => {
              console.log(error);
            }
          );
        break;
      case vm.tabs.ALL:
        vm.$q
          .all([
            vm.UserService.getAchievementUsers(vm.achievement.id, true),
            vm.UserService.getAchievementUsers(vm.achievement.id, false)
          ])
          .then(
            (values) => {
              const [achieved, others] = values;

              vm.users = [
                ...achieved.map((obj) => {
                  return new AchievedContentElm({
                    obj: obj,
                    type: vm.tabs.ACHIEVED.value
                  });
                }),
                ...others.map((obj) => {
                  return new AchievedContentElm({
                    obj: obj,
                    type: vm.tabs.OTHERS.value
                  });
                })
              ];
            },
            (error) => {
              console.log(error, error);
            }
          );
        break;
      default:
        vm.$log.warn('unknown tab info', tabInfo);
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
    const vm = this;

    if (toggle) {
      const userAchievement = new UserAchievement();

      userAchievement.achievement = vm.achievement;
      userAchievement.user = user;
      user.userAchievement = userAchievement;
    } else {
      vm.UserAchievementService.delete(user.id, vm.achievement.id)
        .then(
          (ignoredResp) => {
            vm.selectTab(vm.selectedTab);
          },
          (errorResp) => {
            console.log(errorResp);
          }
        );
    }
  }

  saveUserAchievement(userAchievement = Utils.requiredParam()) {
    const vm = this;

    vm.UserAchievementService.saveOrUpdate(userAchievement)
      .then(
        (ignoredResp) => {
          vm.selectTab(vm.selectedTab);
        },
        (errorResp) => {
          console.log(errorResp);
        }
      );
  }

}
