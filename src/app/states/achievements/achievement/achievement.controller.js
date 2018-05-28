import { Utils } from "../../../components/utils/utils.service";
import { UserAchievement } from "../../../components/model/userAchievement.model";
import { UserAchievementController } from "../../userAchievementEntity/entity.controller";
import { AchievedContentElm } from "../../userAchievementEntity/achievedContentElm";

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
      $log: $log,
      tabs: {
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
      },
      selectTabImpl: function (tabInfo = {}) {
        const vm = this;

        vm.$scope.selectedTab = tabInfo;
        switch (tabInfo) {
          case vm.tabs.ACHIEVED:
            vm.UserService.getAchievementUsers(vm.entity.id, true)
              .then(
                (tabEntities) => {
                  vm.tabEntities = tabEntities.map((obj) => {
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
            vm.UserService.getAchievementUsers(vm.entity.id, false)
              .then(
                (tabEntities) => {
                  vm.tabEntities = tabEntities.map((obj) => {
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
                vm.UserService.getAchievementUsers(vm.entity.id, true),
                vm.UserService.getAchievementUsers(vm.entity.id, false)
              ])
              .then(
                (values) => {
                  const [achieved, others] = values;

                  vm.tabEntities = [
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
      },
      goToTabEntityImpl: function (tabEntityId = Utils.requiredParam()) {
        this.$state.go('user', {
          userId: tabEntityId
        });
      },
      entity: achievementData,
      editEntityImpl: function () {
        this.entityCopy = angular.copy(this.entity);
        this.entity.$active = true;
      },
      saveEntityImpl: function (entity = Utils.requiredParam(), $event = Utils.requiredParam()) {
        $event.stopImmediatePropagation();
        this.AchievementService.saveOrUpdate(entity)
          .then((savedAchievement) => {
            this.entity = savedAchievement;
            this.closeEditingAchievement($event);
          });
      },
      deleteEntityImpl: function ($event = Utils.requiredParam()) {
        $event.stopImmediatePropagation();
        this.AchievementService.delete(this.entity.id)
          .then(() => {
            this.$state.go('main.achievements');
          });
      },
      closeEditingEntityImpl: function ($event = Utils.requiredParam()) {
        $event.stopImmediatePropagation();
        this.entity.$active = false;
      },
      toggleTabEntityImpl: function (tabEntityObj = Utils.requiredParam(), toggle = true) {
        const vm = this;

        if (toggle) {
          const userAchievement = new UserAchievement();

          userAchievement.achievement = vm.entity;
          userAchievement.user = tabEntityObj;
          tabEntityObj.userAchievement = userAchievement;
        } else {
          vm.UserAchievementService.delete(tabEntityObj.id, vm.entity.id)
            .then(
              (ignoredResp) => {
                vm.selectTab(vm.selectedTab);
              },
              (errorResp) => {
                console.log(errorResp);
              }
            );
        }
      },
      templates: {
        activeEntityTemplate: 'app/states/achievements/achievement/templates/activeEntity.html',
        defaultEntityTemplate: 'app/states/achievements/achievement/templates/defaultEntity.html',
        achievedEntityTemplate: 'app/states/achievements/achievement/templates/achievedEntity.html',
        othersEntityTemplate: 'app/states/achievements/achievement/templates/othersEntity.html',
        tabEmptyStateTemplate: 'app/states/achievements/achievement/templates/tabEmptyState.html'
      }
    });
  }
}
