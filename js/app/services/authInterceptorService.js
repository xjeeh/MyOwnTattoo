'use strict';
angular.module('myownApp').factory('authInterceptorService', ['$q', '$window', '$injector', function ($q, $injector, $window) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};

        var authData = localStorage.getItem('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.Token;
        }

        var browser = get_browser();

        config.headers.view = config.url;
        config.headers.osVersion = browser.name;
        config.headers.appVersion = browser.version;

        return config;
    };
    var _responseError = function (rejection) {

        //var authService = $injector.get('authService');

        //if (rejection.status === 401) {
        //    authService.logOut();
        //    $window.location.href = "#login";
        //}

        return $q.reject(rejection);
    };

    function get_browser() {
        var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return { name: 'IE', version: (tem[1] || '') };
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/);
            if (tem != null) { return { name: 'Opera', version: tem[1] }; }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
        return {
            name: M[0],
            version: M[1]
        };
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);