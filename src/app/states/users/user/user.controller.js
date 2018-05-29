import { Utils } from "../../../components/utils/utils.service";
import { UserAchievement } from "../../../components/model/userAchievement.model";
import { UserAchievementController } from "../../userAchievementEntity/entity.controller";
import { AchievedContentElm } from "../../userAchievementEntity/achievedContentElm";

export class UserController extends UserAchievementController {
  constructor(AchievementService, UserService, UserAchievementService, EventService, $state, $q, $log, userData) {
    'ngInject';

    super({
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
          name: 'Все достижения'
        },
        ACHIEVED: {
          value: AchievedContentElm.types.ACHIEVED,
          name: 'Имеющиеся достижения'
        },
        OTHERS: {
          value: AchievedContentElm.types.OTHERS,
          name: 'Неполученные достижения'
        }
      },
      selectTabImpl: function (tabInfo = {}) {
        const vm = this;

        switch (tabInfo) {
          case vm.tabs.ACHIEVED:
            vm.AchievementService.getUserAchievements(vm.entity.id, true)
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
            vm.AchievementService.getUserAchievements(vm.entity.id, false)
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
                vm.AchievementService.getUserAchievements(vm.entity.id, true),
                vm.AchievementService.getUserAchievements(vm.entity.id, false)
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
        this.$state.go('achievement', {
          achievementId: tabEntityId
        });
      },
      entity: userData,
      editEntityImpl: function () {
        this.entityCopy = angular.copy(this.entity);
        this.entity.$active = true;
      },
      saveEntityImpl: function (entity = Utils.requiredParam(), $event = Utils.requiredParam()) {
        $event.stopImmediatePropagation();
        this.UserService.saveOrUpdate(entity)
          .then((savedAchievement) => {
            this.entity = savedAchievement;
            this.closeEditingAchievement($event);
          });
      },
      deleteEntityImpl: function ($event = Utils.requiredParam()) {
        $event.stopImmediatePropagation();
        this.UserService.delete(this.entity.id)
          .then(() => {
            this.$state.go('main.users');
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

          userAchievement.achievement = tabEntityObj;
          userAchievement.user = vm.entity;
          tabEntityObj.userAchievement = userAchievement;
        } else {
          vm.UserAchievementService.delete(vm.entity.id, tabEntityObj.id)
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
        activeEntityTemplate: 'app/states/users/user/templates/activeEntity.html',
        defaultEntityTemplate: 'app/states/users/user/templates/defaultEntity.html',
        achievedEntityTemplate: 'app/states/users/user/templates/achievedEntity.html',
        othersEntityTemplate: 'app/states/users/user/templates/othersEntity.html',
        tabEmptyStateTemplate: 'app/states/users/user/templates/tabEmptyState.html'
      }
    });
  }
}
