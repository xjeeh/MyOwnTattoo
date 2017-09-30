var app = angular.module('myownApp', ['LocalStorageModule', 'ngRoute', 'ui.bootstrap', 'ui.utils.masks', 'angular-loading-bar', 'naif.base64', 'kendo.directives'])
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

        $rootScope.$on('$routeChangeSuccess', function () {
            var interval = setInterval(function () {
                if (document.readyState == 'complete') {
                    $window.scrollTo(0, 0);
                    clearInterval(interval);
                }
            }, 200);
        });
    }])