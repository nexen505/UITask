export function ViewWrapperDirective($parse) {
  'ngInject';

  return {
    restrict: 'E',
    templateUrl: 'app/components/directive/viewWrapper/viewWrapper.html',
    controller: ctrl
  };

  function ctrl($scope, $element, $attrs) {
    $scope.viewName = $parse($attrs.viewName)($scope.$parent);
  }

}
