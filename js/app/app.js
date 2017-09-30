var app = angular.module('myownApp', ['ngRoute', 'ui.bootstrap', 'ui.utils.masks', 'naif.base64', 'kendo.directives'])
    .service('urls', function () {
        this.baseAPIUrl = localStorage.getItem("baseAPIUrl");
        this.pagseguroAPIUrl = localStorage.getItem("pagseguroAPIUrl");
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