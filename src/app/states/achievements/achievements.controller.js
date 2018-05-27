import { Achievement } from "../../components/model/achievement.model";
import { CardCollection } from "../../components/directive/card/cardCollection";
import { Utils } from "../../components/utils/utils.service";

export class AchievementsController {
  constructor(_, AchievementService, EventService, $state, $scope, achievementsData) {
    'ngInject';

    this.AchievementService = AchievementService;
    this.$state = $state;
    this.$scope = $scope;
    this._ = _;

    this.achievements = new CardCollection(achievementsData);
    this.$scope.filters = {
      archivedKey: 'obj.archived',
      archivedValue: $state.params.archived,
      nameKey: 'obj.name',
      nameValue: null
    };

    this.isCardAdding = false;
  }

  get archived() {
    return this.$scope.filters.archived;
  }

  showArchived(archived = this.archived) {
    this.$state.go('main.achievements', {
      archived: archived
    }, {
      reload: true
    });
  }

  get newAchievement() {
    return this._newAchievement;
  }

  set newAchievement(achievement) {
    this._newAchievement = achievement;
  }

  get isCardAdding() {
    return this._isCardAdding;
  }

  set isCardAdding(value) {
    this._isCardAdding = value;
    this.newAchievement = new Achievement();
  }

  openAddingCard() {
    this.isCardAdding = true;
  }

  closeAddingCard() {
    this.isCardAdding = false;
  }

  goToAchievement(achievementId = Utils.requiredParam()) {
    this.$state.go('achievement', {
      achievementId: achievementId
    });
  }

  editAchievement(achievement = Utils.requiredParam()) {
    this.closeAddingCard();
    const cards = this.achievements;

    achievement.closeEditingAchievement = ($event) => {
      this.closeAchievements($event, achievement);
    };
    achievement.objCopy = angular.copy(achievement.obj);
    achievement.objCopy.original = achievement;
    cards.open(achievement);
  }

  closeAchievements($event = Utils.requiredParam(), achievement = null) {
    const cards = this.achievements;

    $event.stopImmediatePropagation();
    cards.close(achievement);
  }

  saveNewAchievement(achievement = Utils.requiredParam(), $event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.AchievementService.saveOrUpdate(achievement)
      .then((savedAchievement) => {
        this.achievements.push(savedAchievement);
        this.closeAddingCard();
      });
  }

  saveAchievement(achievement = Utils.requiredParam(), $event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.AchievementService.saveOrUpdate(achievement)
      .then((savedAchievement) => {
        angular.extend(achievement.original, {
          obj: savedAchievement,
          objCopy: null
        });
        this.closeAchievements($event);
      });
  }

  deleteAchievement(achievementCard = Utils.requiredParam(), $event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.AchievementService.delete(achievementCard.obj.id)
      .then(() => {
        achievementCard.obj.archived = true;
      });
  }

  restoreAchievement(achievementCard = Utils.requiredParam(), $event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.AchievementService.restore(achievementCard.obj.id)
      .then(() => {
        achievementCard.obj.archived = false;
      });
  }
}
