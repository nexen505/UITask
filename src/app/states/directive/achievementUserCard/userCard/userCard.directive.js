export function UserCardDirective(_, EventService) {
  'ngInject';

  return {
    restrict: 'E',
    templateUrl: 'app/states/directive/achievementUserCard/userCard/userCard.template.html',
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

  function ctrl($scope, $element, $attrs) {
    const vm = this;

    if (!$attrs.active) {
      vm.active = false;
    }

    EventService.watch($scope, 'iconImg', (newVal) => {
      if (newVal) {
        vm.user.photo = _.get(newVal, 'base64', null);
      }
    }, true);
  }
}
