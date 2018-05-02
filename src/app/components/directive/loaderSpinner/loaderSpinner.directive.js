export function LoaderSpinnerDirective(_, ngDexie) {
  'ngInject';

  return {
    restrict: 'E',
    templateUrl: 'app/components/directive/loaderSpinner/loaderSpinner.html',
    controller: ctrl
  };

  function ctrl($scope) {
    $scope.toSpin = () => _.get(ngDexie, 'pendingRequests.length', 0);
  }

}
