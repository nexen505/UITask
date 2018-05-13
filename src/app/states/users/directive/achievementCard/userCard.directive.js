export function UserCardDirective(_, EventService) {
  'ngInject';

  return {
    restrict: 'E',
    templateUrl: 'app/states/achievements/directive/achievementCard/achievementCard.template.html',
    scope: {
      active: '=',
      user: '<',
      saveUser: '&',
      closeUser: '&'
    },
    controller: ctrl,
    controllerAs: '$ctrl',
    bindToController: true
  };

  function ctrl($scope) {
    const vm = this;

    EventService.watch($scope, 'iconImg', (newVal) => {
      if (newVal) {
        vm.user.icon = _.get(newVal, 'base64', null);
      }
    }, true);
  }
}
