export function FileModelDirective($parse) {
  'ngInject';

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      const model = $parse(attrs.fileModel),
        modelSetter = model.assign;

      element.bind('change', () => {
        scope.$apply(() => {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}
