export function MaterialSidenavDirective($q, $animate, $window, $mdConstant) {
  'ngInject';

  return {
    restrict: 'E',
    scope: {
      isOpen: '=?materialIsOpen'
    },
    controller: SidenavController,
    controllerAs: '$sidenavCtrl',
    compile: function (element) {
      element.addClass('material-closed').attr('tabIndex', '-1');
      return postLink;
    }
  };

  function postLink(scope, element, attr, sidenavCtrl) {
    let lastParentOverFlow,
      disableScrollTarget = element.parent(),
      previousContainerStyles;

    scope.$watch('isOpen', updateIsOpen);

    sidenavCtrl.$toggleOpen = toggleOpen;

    function updateIsOpen(isOpen) {
      const parent = element.parent(),
        restorePositioning = updateContainerPositions(parent, isOpen);

      parent[isOpen ? 'on' : 'off']('keydown', onKeyDown);

      disableParentScroll(isOpen);

      return $q.all([
        $animate[isOpen ? 'removeClass' : 'addClass'](element, 'material-closed')
      ]).then(() => {
        restorePositioning && restorePositioning();
      });
    }

    function updateContainerPositions(parent, willOpen) {
      const drawerEl = element[0],
        scrollTop = parent[0].scrollTop;

      if (willOpen && scrollTop) {
        previousContainerStyles = {
          top: drawerEl.style.top,
          bottom: drawerEl.style.bottom,
          height: drawerEl.style.height
        };

        const positionStyle = {
          top: `${scrollTop}px`,
          bottom: 'auto',
          height: `${parent[0].clientHeight}px`
        };

        // Apply the new position styles to the sidenav and backdrop.
        element.css(positionStyle);
      }

      if (!willOpen && previousContainerStyles) {
        return function () {
          drawerEl.style.top = previousContainerStyles.top;
          drawerEl.style.bottom = previousContainerStyles.bottom;
          drawerEl.style.height = previousContainerStyles.height;

          previousContainerStyles = null;
        };
      }
    }

    function disableParentScroll(disabled) {
      if (disabled && !lastParentOverFlow) {
        lastParentOverFlow = disableScrollTarget.css('overflow');
        disableScrollTarget.css('overflow', 'hidden');
      } else if (angular.isDefined(lastParentOverFlow)) {
        disableScrollTarget.css('overflow', lastParentOverFlow);
        lastParentOverFlow = undefined;
      }
    }

    function toggleOpen(isOpen) {
      if (scope.isOpen === isOpen) {
        return $q.when(true);
      }
      return $q((resolve) => {
        resolve(scope.isOpen = isOpen);
      });
    }

    function onKeyDown(ev) {
      const isEscape = (ev.keyCode === $mdConstant.KEY_CODE.ESCAPE);

      return isEscape ? close(ev) : $q.when(true);
    }

    function close(ev) {
      ev.preventDefault();

      return sidenavCtrl.close();
    }
  }
}

export function SidenavController($scope, $q) {
  'ngInject';

  const vm = this;

  // Synchronous getters
  vm.isOpen = function () {
    return !!$scope.isOpen;
  };

  // Async actions
  vm.open = function () {
    return vm.$toggleOpen(true);
  };
  vm.close = function () {
    return vm.$toggleOpen(false);
  };
  vm.toggle = function () {
    return vm.$toggleOpen(!$scope.isOpen);
  };
  vm.$toggleOpen = function (value) {
    return $q.when($scope.isOpen = value);
  };

}
