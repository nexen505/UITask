import { Achievement } from "../../components/model/achievement.model";
import { CardCollection } from "../../components/directive/card/cardCollection";

export class AchievementsController {
  constructor(_, AchievementService, achievementsData) {
    'ngInject';

    console.log('achievementsData', achievementsData);
    this.AchievementService = AchievementService;
    this.achievements = new CardCollection(achievementsData);
    this._ = _;

    this.isCardAdding = false;
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

  openAchievement(achievement = {}) {
    const cards = this.achievements;

    achievement.closeEditingAchievement = ($event) => {
      this.closeAchievements($event, achievement);
    };
    achievement.objCopy = angular.copy(achievement.obj);
    cards.open(achievement);
  }

  closeAchievements($event, achievement = null) {
    const cards = this.achievements;

    $event.stopImmediatePropagation();
    cards.close(achievement);
  }

  saveNewAchievement(achievement, $event) {
    $event.stopImmediatePropagation();
    this.AchievementService.saveOrUpdate(achievement)
      .then((savedAchievement) => {
        this.achievements.push(savedAchievement);
        this.closeAchievements($event);
      });
  }

  saveAchievement(achievement, $event) {
    $event.stopImmediatePropagation();
    this.AchievementService.saveOrUpdate(achievement)
      .then((savedAchievement) => {
        achievement.obj = savedAchievement;
        this.closeAchievements($event);
      });
  }

  deleteAchievement(achievementCard, $event) {
    $event.stopImmediatePropagation();
    this.AchievementService.delete(achievementCard.obj.id)
      .then(() => {
        this.achievements.remove(achievementCard);
      });
  }
}
