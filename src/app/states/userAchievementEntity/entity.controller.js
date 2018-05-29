import { Utils } from "../../components/utils/utils.service";

export class UserAchievementController {
  constructor({
                AchievementService, UserService, UserAchievementService, EventService, $state, $q, $log,
                tabs, selectTabImpl, toggleTabEntityImpl, goToTabEntityImpl,
                entity,
                editEntityImpl,
                saveEntityImpl,
                deleteEntityImpl,
                closeEditingEntityImpl,
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
    this._selectTab = selectTabImpl;
    this._goToTabEntity = goToTabEntityImpl;
    this._toggleTabEntity = toggleTabEntityImpl;

    this._entity = entity;
    this._editEntity = editEntityImpl;
    this._saveEntity = saveEntityImpl;
    this._deleteEntity = deleteEntityImpl;
    this._closeEditingEntity = closeEditingEntityImpl;

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

  get selectTab() {
    return this._selectTab;
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

  get editEntity() {
    return this._editEntity;
  }

  get saveEntity() {
    return this._saveEntity;
  }

  get deleteEntity() {
    return this._deleteEntity;
  }

  get closeEditingEntity() {
    return this._closeEditingEntity;
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
