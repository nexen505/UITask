export function AchievementCardDirective(_) {
  'ngInject';

  return {
    restrict: 'E',
    templateUrl: 'app/states/achievements/directive/achievementCard/achievementCard.template.html',
    scope: {
      active: '=',
      achievement: '<',
      saveAchievement: '&',
      closeAchievement: '&'
    },
    controller: ctrl,
    controllerAs: '$ctrl',
    bindToController: true,
    link: postLink
  };

  function ctrl($scope, $element, $attrs) {
    const vm = this,
      $$deregIconImgWatch = $scope.$watch('iconImg', (newVal) => {
        if (newVal) {
          vm.achievement.icon = _.get(newVal, 'base64', null);
        }
      }, true);

    $scope.$on('$destroy', () => {
      $$deregIconImgWatch();
    });
  }

  function postLink(scope, element, attrs, ctrls) {

  }

}
