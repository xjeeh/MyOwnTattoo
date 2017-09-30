angular.module('myownApp').factory('paymentService', function ($http, $q, urls) {

    function paymentService() {

        var self = this
        var controller = "/Payment"

        self.CheckoutPayment = function (bookingId) {
            var deferred = $q.defer()

            $http.get(urls.baseAPIUrl + controller + '/Checkout?bookingId=' + bookingId)
                .then(function (response) {
                    if (response.length <= 0)
                        deferred.reject()
                    else
                        deferred.resolve(response.data)
                },
            function (response) {
                deferred.reject()
            });

            return deferred.promise
        }

    }

    return new paymentService()
})