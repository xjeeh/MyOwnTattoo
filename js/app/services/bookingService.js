angular.module('myownApp').factory('bookingService', function ($http, $q, urls) {

    function bookingService() {

        var self = this
        var controller = "/Booking"

        // Debbug mode!
        self.ListPeriodDetail = function (startDate, finishDate) {
            var deferred = $q.defer()
            var data = "?startDate=" + startDate + "&finishDate=" + finishDate
            $http.get("http://localhost:3000/List")
                .then(function successCallback(response) {
                    var data = { List: response.data };
                    deferred.resolve(data)
                },
                function errorCallback(response) {
                    deferred.reject(response.data.Error)
                })

            return deferred.promise
        };

        // self.ListPeriodDetail = function (startDate, finishDate) {
        //     var deferred = $q.defer()
        //     var data = "?startDate=" + startDate + "&finishDate=" + finishDate
        //     $http.get(urls.baseAPIUrl + controller + '/ListPeriodDetail' + data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', } })
        //         .then(function successCallback(response) {
        //             if (response.data.Error) {
        //                 deferred.reject(response.data.Message)
        //             } else {
        //                 deferred.resolve(response.data)
        //             }
        //         },
        //     function errorCallback(response) {
        //         deferred.reject(response.data.Error)
        //     })

        //     return deferred.promise
        // };        

        self.ListDayDetail = function (date, token) {
            var deferred = $q.defer()
            var data = { Date: date, Token: token };
            $http.post(urls.baseAPIUrl + controller + '/ListDayDetail', data)
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message)
                    } else {
                        deferred.resolve(response.data)
                    }
                },
                function errorCallback(response) {
                    deferred.reject(response.data.Error)
                })

            return deferred.promise
        };

        self.ListBookings = function (startDate, finishDate) {
            var deferred = $q.defer()
            var data = "?startDate=" + startDate + "&finishDate=" + finishDate
            $http.get(urls.baseAPIUrl + controller + '/ListBookings' + data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message)
                    } else {
                        deferred.resolve(response.data)
                    }
                },
                function errorCallback(response) {
                    deferred.reject(response.data.Error)
                })

            return deferred.promise
        };

        self.AddBooking = function (date, startTime, checkoutCode) {
            var deferred = $q.defer()
            var data = "?startTime=" + startTime + "&date=" + date;
            $http.post(urls.baseAPIUrl + controller + '/AddBooking' + data)
                .then(function (response) {
                    if (response.data.Error)
                        deferred.reject(response.data.Message)
                    else
                        deferred.resolve(response.data)
                },
                function (response) {
                    deferred.reject(response.data.Error)
                })

            return deferred.promise
        };

        self.DeleteBooking = function (id) {
            var deferred = $q.defer()
            var data = "?bookingId=" + id
            $http.post(urls.baseAPIUrl + controller + '/DeleteBooking' + data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message)
                    } else {
                        deferred.resolve(response.data)
                    }
                },
                function errorCallback(response) {
                    deferred.reject(response.data.Error)
                })

            return deferred.promise
        };

        self.ChangeFillAllTheDay = function (date, status) {
            var deferred = $q.defer()
            var data = "?Date=" + date + "&Status=" + status;
            $http.post(urls.baseAPIUrl + controller + '/ChangeFillAllTheDay' + data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message)
                    } else {
                        deferred.resolve(response.data)
                    }
                },
                function errorCallback(response) {
                    deferred.reject(response.data.Error)
                })

            return deferred.promise
        };

        self.ChangePaymentStatus = function (id, paymentStatus) {
            var deferred = $q.defer()
            var data = "?bookingId=" + id + "&paymentStatus=" + paymentStatus;
            $http.post(urls.baseAPIUrl + controller + '/ChangePaymentStatus' + data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function successCallback(response) {
                    if (response.data.Error) {
                        deferred.reject(response.data.Message)
                    } else {
                        deferred.resolve(response.data)
                    }
                },
                function errorCallback(response) {
                    deferred.reject(response.data.Error)
                })

            return deferred.promise
        };

    }

    return new bookingService()
})