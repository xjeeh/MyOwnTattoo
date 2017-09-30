angular.module('myownApp')

.directive("collapseNavigation", function ($window) {
    return function (scope, element, attrs) {
        angular.element($window).bind("scroll", function () {
            if (this.pageYOffset >= 10) {
                scope.navigationCollapsed = true;
            } else {
                scope.navigationCollapsed = false;
            }
            scope.$apply();
        });
    };
})

.directive('showFocus', function ($timeout) {
    return function (scope, element, attrs) {
        scope.$watch(attrs.showFocus,
          function (newValue) {
              $timeout(function () {
                  newValue && element.focus();
              });
          }, true);
    };
});

