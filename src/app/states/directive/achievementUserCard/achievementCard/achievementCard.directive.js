export function AchievementCardDirective(_, EventService) {
  'ngInject';

  return {
    restrict: 'E',
    templateUrl: 'app/states/directive/achievementUserCard/achievementCard/achievementCard.template.html',
    scope: {
      active: '=?',
      achievement: '<',
      saveAchievement: '&',
      closeAchievement: '&'
    },
    controller: ctrl,
    controllerAs: '$ctrl',
    bindToController: true
  };

  function ctrl($scope, $element, $attrs) {
    const vm = this;

    if (!$attrs.active) {
      vm.active = false;
    }

    EventService.watch($scope, 'iconImg', (newVal) => {
      if (newVal) {
        vm.achievement.icon = _.get(newVal, 'base64', null);
      }
    }, true);
  }
}
