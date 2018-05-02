import { Achievement } from "../../components/model/achievement.model";
import { CardCollection } from "../../components/directive/card/cardCollection";

export class AchievementsController {
  constructor(AchievementService, achievementsData) {
    'ngInject';

    this.AchievementService = AchievementService;
    this.achievements = new CardCollection(achievementsData);
    this.initNewAchievement();
  }

  get newAchievement() {
    return this._newAchievement;
  }

  set newAchievement(achievement) {
    this._newAchievement = achievement;
  }

  initNewAchievement() {
    this.newAchievement = new Achievement();
  }

  saveAchievement(achievement) {
    this.AchievementService.saveOrUpdate(achievement)
      .then((savedAchievement) => {
        this.achievements.push(savedAchievement);
        this.initNewAchievement();
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
