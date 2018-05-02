export function MaterialInputDirective() {

  return {
    restrict: 'E',
    scope: {
      label: '@'
    },
    link: postLink
  };

  function postLink(scope, element) {
    // element.append(angular.element(`<label>${scope.label}</label>`));
    // element.append(angular.element(`<span class="highlight"></span>`));
    // element.append(angular.element(`<span class="bar"></span>`));
  }

}
