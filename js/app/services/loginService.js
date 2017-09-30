angular.module('myownApp').factory('loginService', function ($http, $q, urls) {

    function loginService() {

        var self = this
        var controller = "/Login"

        self.Register = function (registerModel) {
            var deferred = $q.defer();
            $http.post(urls.baseAPIUrl + controller + '/Register', registerModel)
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message);
                    } else {
                        deferred.resolve(response.data);
                    }
                },
            function errorCallback(response) {
                deferred.reject(response.data.Error);
            })

            return deferred.promise;
        };

        self.CheckLoginExists = function (login) {
            var deferred = $q.defer();
            $http.get(urls.baseAPIUrl + controller + '/CheckLoginExists?Login=' + login)
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message);
                    } else {
                        deferred.resolve(response.data);
                    }
                },
            function errorCallback(response) {
                deferred.reject(response.data.Error);
            })

            return deferred.promise;
        };

        self.ValidateRegister = function (token) {
            var deferred = $q.defer();
            var params = { Token: token };

            $http.post(urls.baseAPIUrl + controller + '/ValidateRegister', params)
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message);
                    } else {
                        deferred.resolve(response.data);
                    }
                },
            function errorCallback(response) {
                deferred.reject(response.data.Error);
            })

            return deferred.promise;
        };

        self.ForgotPassword = function (email) {
            var deferred = $q.defer();
            $http.post(urls.baseAPIUrl + controller + '/ForgotPassword?Email=' + email)
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message);
                    } else {
                        deferred.resolve(response.data);
                    }
                },
            function errorCallback(response) {
                deferred.reject(response.data.Error);
            })

            return deferred.promise;
        };

        self.ResetPassword = function (newPassword, token) {
            var deferred = $q.defer();
            var params = { NewPassword: newPassword, Token: token };

            $http.post(urls.baseAPIUrl + controller + '/ResetPassword', params)
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message);
                    } else {
                        deferred.resolve(response.data);
                    }
                },
            function errorCallback(response) {
                deferred.reject(response.data.Error);
            })

            return deferred.promise;
        };

    }

    return new loginService();
})