import { Utils } from "../../components/utils/utils.service";
import { AchievedContentElm } from "./achievedContentElm";

export class UserAchievementController {
  constructor({
                AchievementService, UserService, UserAchievementService, EventService, $state, $q, $log,
                tabs, toggleTabEntityImpl, goToTabEntityImpl,
                entity,
                achievedEntitiesImpl,
                othersEntitiesImpl,
                saveEntityImpl,
                deleteEntityImpl,
                templates: {
                  activeEntityTemplate,
                  defaultEntityTemplate,
                  achievedEntityTemplate,
                  othersEntityTemplate,
                  tabEmptyStateTemplate
                }
              }) {
    this._AchievementService = AchievementService;
    this._UserService = UserService;
    this._UserAchievementService = UserAchievementService;
    this._EventService = EventService;
    this._$state = $state;
    this._$q = $q;
    this._$log = $log;
    this._tabs = tabs;
    this._goToTabEntity = goToTabEntityImpl;
    this._toggleTabEntity = toggleTabEntityImpl;

    this._entity = entity;
    this._achievedEntitiesImpl = achievedEntitiesImpl;
    this._othersEntitiesImpl = othersEntitiesImpl;
    this._saveEntity = saveEntityImpl;
    this._deleteEntity = deleteEntityImpl;

    this._activeEntityTemplate = activeEntityTemplate;
    this._defaultEntityTemplate = defaultEntityTemplate;
    this._achievedEntityTemplate = achievedEntityTemplate;
    this._othersEntityTemplate = othersEntityTemplate;
    this._tabEmptyStateTemplate = tabEmptyStateTemplate;

    this.selectedTab = Object.values(this.tabs).find((value) => value.value === $state.params.tab) || this.tabs.ALL;
    this.selectTab(this.selectedTab);
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

  get tabs() {
    return this._tabs;
  }

  get tabEntities() {
    return this._tabEntities;
  }

  set tabEntities(value) {
    this._tabEntities = value || {};
  }

  get goToTabEntity() {
    return this._goToTabEntity;
  }

  get toggleTabEntity() {
    return this._toggleTabEntity;
  }

  get entity() {
    return this._entity;
  }

  set entity(value) {
    this._entity = value || {};
    this._entity.$active = false;
  }

  get selectedTab() {
    return this._selectedTab;
  }

  set selectedTab(value) {
    this._selectedTab = value;
  }

  get saveEntity() {
    return this._saveEntity;
  }

  get deleteEntity() {
    return this._deleteEntity;
  }

  get activeEntityTemplate() {
    return this._activeEntityTemplate;
  }

  get defaultEntityTemplate() {
    return this._defaultEntityTemplate;
  }

  get achievedEntityTemplate() {
    return this._achievedEntityTemplate;
  }

  get othersEntityTemplate() {
    return this._othersEntityTemplate;
  }

  get tabEmptyStateTemplate() {
    return this._tabEmptyStateTemplate;
  }

  get achievedEntities() {
    return this._achievedEntitiesImpl;
  }

  get othersEntities() {
    return this._othersEntitiesImpl;
  }

  allEntities(entityId) {
    return [this.achievedEntities(entityId), this.othersEntities(entityId)];
  }

  selectTab(tabInfo = {}) {
    const vm = this;

    switch (tabInfo) {
      case vm.tabs.ACHIEVED:
        vm.achievedEntities(vm.entity.id)
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
        vm.othersEntities(vm.entity.id)
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
          .all(
            vm.allEntities(vm.entity.id)
          )
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

  editEntity() {
    this.entityCopy = angular.copy(this.entity);
    this.entity.$active = true;
  }

  closeEditingEntity($event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.entity.$active = false;
  }
}
