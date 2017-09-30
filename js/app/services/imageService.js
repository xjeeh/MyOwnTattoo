angular.module('myownApp').factory('imageService', function ($http, $q, urls) {

    function imageService() {

        var self = this;

        self.ResizeImage = function (Image, Width, Height) {

            var deferred = $q.defer();
            var data = { "Image": Image, "Width": Width, "Height": Height };
            $http.post(urls.baseAPIUrl + '/Image/ResizeImage?lang=pt-BR', data)
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message);
                    } else {
                        self.resizedImage = response.data;
                        deferred.resolve(response.data);
                    }
                },
            function errorCallback(response) {
                deferred.reject(response.data.Error);
            });

            return deferred.promise;
        };

    };

    return new imageService();
});