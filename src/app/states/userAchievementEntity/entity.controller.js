import { Utils } from "../../components/utils/utils.service";

export class UserAchievementController {
  constructor({
                $scope, AchievementService, UserService, UserAchievementService, EventService, $state, $q, $log,
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
    const vm = this;

    vm._$scope = $scope;
    vm._AchievementService = AchievementService;
    vm._UserService = UserService;
    vm._UserAchievementService = UserAchievementService;
    vm._EventService = EventService;
    vm._$state = $state;
    vm._$q = $q;
    vm._$log = $log;
    vm._tabs = tabs;
    vm._selectTab = selectTabImpl;
    vm._goToTabEntity = goToTabEntityImpl;
    vm._toggleTabEntity = toggleTabEntityImpl;

    vm._entity = entity;
    vm._editEntity = editEntityImpl;
    vm._saveEntity = saveEntityImpl;
    vm._deleteEntity = deleteEntityImpl;
    vm._closeEditingEntity = closeEditingEntityImpl;

    vm._activeEntityTemplate = activeEntityTemplate;
    vm._defaultEntityTemplate = defaultEntityTemplate;
    vm._achievedEntityTemplate = achievedEntityTemplate;
    vm._othersEntityTemplate = othersEntityTemplate;
    vm._tabEmptyStateTemplate = tabEmptyStateTemplate;

    vm.$scope.selectedTab = Object.values(vm.tabs).find((value) => value.value === $state.params.tab) || vm.tabs.ALL;
    vm.selectTab(vm.$scope.selectedTab);
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
    return this.$scope.selectedTab;
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
