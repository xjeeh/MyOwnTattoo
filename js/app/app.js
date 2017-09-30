var app = angular.module('myownApp', ['LocalStorageModule', 'ngRoute', 'ui.bootstrap', 'ui.utils.masks', 'ngAnimate', 'angular-loading-bar', 'pascalprecht.translate', 'ngCookies', 'naif.base64', 'ngSanitize', 'kendo.directives'])
.constant('apiUrls', {
    baseAPIUrl: localStorage.getItem("baseAPIUrl"),
    pagseguroAPIUrl: localStorage.getItem("pagseguroAPIUrl")
})
.service('urls', function (apiUrls) {
    this.baseAPIUrl = apiUrls.baseAPIUrl;
    this.pagseguroAPIUrl = apiUrls.pagseguroAPIUrl;
})
.run(['$window', '$rootScope', 'authService', function ($window, $rootScope, authService) {
    authService.populaAuthData();

    $rootScope.$on('$routeChangeStart', function (e, toState, toParams, fromState, fromParams) {
        if (toState.access !== undefined && toState.access.requiresLogin) {
            if (!authService.usuarioLogado.logado) {
                $window.location.href = "#login";
            }
        }
    });

    $rootScope.clearArray = function (array) {
        array.splice(0);
    }

    $rootScope.inArray = function (array, item) {
        return (-1 !== array.indexOf(item));
    }

    $rootScope.toggleArrayItem = function (array, item) {
        var i = array.indexOf(item);
        if (i === -1)
            array.push(item);
        else
            array.splice(i, 1);
    }

    $rootScope.$on('$routeChangeSuccess', function () {
        var interval = setInterval(function () {
            if (document.readyState == 'complete') {
                $window.scrollTo(0, 0);
                clearInterval(interval);
            }
        }, 200);
    });
}])