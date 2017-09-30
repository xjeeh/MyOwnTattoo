angular.module('myownApp').factory('authService', ['$http', '$q', '$rootScope', '$window', '$location', 'urls', function ($http, $q, $rootScope, $window, $location, urls) {

    var authServiceFactory = {};

    var _usuarioLogado = { login: null, logado: false };

    var _login = function (loginData) {

        var deferred = $q.defer();

        $http.post(urls.baseAPIUrl + '/Login/Login', loginData)
            .success(function (response) {
                if (!response.Error) {
                    localStorage.setItem('authorizationData', response.UserData);
                    _populaAuthData();
                    deferred.resolve(response);
                }
                else
                    deferred.reject(response.Message)

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

        return deferred.promise;
    };

    var _logOut = function () {

        localStorage.removeItem('authorizationData');

        _usuarioLogado.login = null;
        _usuarioLogado.logado = false;


        $rootScope.LoggedUser = null;
    };

    var _populaAuthData = function () {

        var authData = localStorage.getItem('authorizationData');
        if (authData) {
            _usuarioLogado.login = authData.Login;
            _usuarioLogado.logado = true;

            _setCachedData(authData);
        }

    };

    var _setCachedData = function (response) {
        $rootScope.LoggedUser = response;
    };

    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.populaAuthData = _populaAuthData;
    authServiceFactory.usuarioLogado = _usuarioLogado;

    $rootScope.doLogout = function () {
        _logOut();
        $window.location.href = "#login";
    };
    $rootScope.go = function (path) {
        $location.path(path);
    };
    $rootScope.back = function () {
        $window.history.back();
    };
    $rootScope.showHelp = function () {
        $rootScope.$broadcast('show-help', { show: true });
    };
    $rootScope.setPrivilegeLevel = function (level) {
        return ($rootScope.TypeUser <= level);
    };
    $rootScope.isThisBookingTypeMonthly = function (type) {
        return type >= 5 && type < 8;
    };

    return authServiceFactory;
}]);
