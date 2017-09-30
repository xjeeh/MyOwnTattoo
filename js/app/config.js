angular.module('myownApp')
    .config(['$httpProvider', '$routeProvider', function ($httpProvider, $routeProvider) {

        $httpProvider.interceptors.push('authInterceptorService');

        $routeProvider
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'loginController',
                access: {
                    requiresLogin: false
                }
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'loginController',
                access: {
                    requiresLogin: false
                }
            })
            .when('/validate-register/:token', {
                templateUrl: 'views/validate-register.html',
                controller: 'loginController',
                access: {
                    requiresLogin: false
                }
            })
            .when('/forgot-password', {
                templateUrl: 'views/forgot-password.html',
                controller: 'loginController',
                access: {
                    requiresLogin: false
                }
            })
            .when('/reset-password/:token', {
                templateUrl: 'views/reset-password.html',
                controller: 'loginController',
                access: {
                    requiresLogin: false
                }
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'bookingController',
                access: {
                    requiresLogin: false
                }
            })
            .otherwise({
                redirectTo: '/home'
            });
    }])