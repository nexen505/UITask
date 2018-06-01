import { Utils } from "../../../components/utils/utils.service";
import { UserAchievement } from "../../../components/model/userAchievement.model";
import { UserAchievementController } from "../../userAchievementEntity/entity.controller";
import { AchievedContentElm } from "../../userAchievementEntity/achievedContentElm";

export class AchievementController extends UserAchievementController {
  constructor(AchievementService, UserService, UserAchievementService, EventService, $state, $q, $log, achievementData) {
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
      achievedEntitiesImpl: function (entityId) {
        return this.UserService.getAchievementUsers(entityId, true);
      },
      othersEntitiesImpl: function (entityId) {
        return this.UserService.getAchievementUsers(entityId, false);
      },
      goToTabEntityImpl: function (tabEntityId = Utils.requiredParam()) {
        this.$state.go('user', {
          userId: tabEntityId
        });
      },
      entity: achievementData,
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
      toggleTabEntityImpl: function (tabEntityObj = Utils.requiredParam(), toggle = true) {
        const vm = this;

        if (toggle) {
          const userAchievement = new UserAchievement();

          userAchievement.achievement = vm.entity;
          userAchievement.user = tabEntityObj;
          tabEntityObj.userAchievement = userAchievement;
        } else {
          vm.UserAchievementService.delete(tabEntityObj.user.id, vm.entity.id)
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
