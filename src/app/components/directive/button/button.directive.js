export function MdButtonDirective(EventService) {
  'ngInject';

  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: getTemplate,
    link: postLink
  };

  function isAnchor(attr) {
    return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
  }

  function getTemplate(element, attr) {
    if (isAnchor(attr)) {
      return '<a class="material-button" ng-transclude></a>';
    }
    const btnType = (typeof attr.type === 'undefined') ? 'button' : attr.type;

    return `<button class="material-button" type="${btnType}" ng-transclude></button>`;

  }

  function postLink(scope, element, attr) {
    if (isAnchor(attr) && angular.isDefined(attr.ngDisabled)) {
      EventService.watch(scope, attr.ngDisabled, (isDisabled) => {
        element.attr('tabindex', isDisabled ? -1 : 0);
      });
    }

    element.on('click', (e) => {
      if (attr.disabled === true) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });

    if (!element.hasClass('md-no-focus')) {
      element.on('focus', () => {
        element.addClass('md-focused');
      });

      element.on('blur', () => {
        element.removeClass('md-focused');
      });
    }

  }

}
