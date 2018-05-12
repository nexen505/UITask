import { Utils } from "./utils.service";

export class EventService {
  constructor($rootScope) {
    this.$rootScope = $rootScope;
  }

  subscribe($scope = this.$rootScope, event = Utils.requiredParam(), callback = angular.noop, toUnsubscribeImmediately = false) {
    const handler = $scope.$on(event, (evt, data) => {
      (callback || angular.noop)(evt, data);
      if (toUnsubscribeImmediately) {
        handler();
      }
    });

    if (!toUnsubscribeImmediately) {
      $scope.$on('$destroy', handler);
    }
    return handler;
  }

  watch($scope = this.$rootScope, watchExpr = Utils.requiredParam(), callback = angular.noop, objectEquality = false) {
    const handler = $scope.$watch(watchExpr, callback, objectEquality);

    $scope.$on('$destroy', handler);
    return handler;
  }

  broadcast($scope = this.$rootScope, event = Utils.requiredParam(), args = {}) {
    $scope.$broadcast(event, args);
  }
}
