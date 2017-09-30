angular.module('myownApp').controller("bookingController", function ($scope, $window, $uibModal, urls, modalService, bookingService, paymentService) {

    $scope.model = { startDate: null, selectedDate: null, selectedHour: null };

    $scope.is = { loading: false, loadingAdd: false }
    $scope.busyReasons = ["O dia está em análise", "Não há mais horários disponíveis para este dia"];
    $scope.busyStatus = ["unavailable", "unavailable"];
    $scope.intervalStatus = ["Reservar", "Reservado", "Aguardando Liberação"];
    $scope.paymentStatus = [
        { code: '0', status: 'Indefinido', description: 'Ainda não é uma transação criada no pagseguro' },
        { code: '1', status: 'Aguardando pagamento', description: 'O comprador iniciou a transação, mas até o momento o PagSeguro não recebeu nenhuma informação sobre o pagamento.' },
        { code: '2', status: 'Em análise', description: 'O comprador optou por pagar com um cartão de crédito e o PagSeguro está analisando o risco da transação.' },
        { code: '3', status: 'Paga', description: 'A transação foi paga pelo comprador e o PagSeguro já recebeu uma confirmação da instituição financeira responsável pelo processamento.' },
        { code: '4', status: 'Disponível', description: 'A transação foi paga e chegou ao final de seu prazo de liberação sem ter sido retornada e sem que haja nenhuma disputa aberta.' },
        { code: '5', status: 'Em disputa', description: 'O comprador, dentro do prazo de liberação da transação, abriu uma disputa.' },
        { code: '6', status: 'Devolvida', description: 'O valor da transação foi devolvido para o comprador.' },
        { code: '7', status: 'Cancelada', description: 'A transação foi cancelada sem ter sido finalizada.' }
    ];

    $scope.closeModals = function () {
        $scope.model.selectedDate = null;
        $scope.model.selectedHour = null;
    };

    $scope.changeDay = function () {
        $scope.selectDay($scope.model.startDate);
        $scope.listPeriodDetail();
    }

    $scope.changeMonth = function (date) {
        setTimeout(function () { $scope.listPeriodDetail() }, 600);
    }

    function FromKendoUI(data) {
        var dia = data.getDate();
        if (dia.toString().length == 1)
            dia = "0" + dia;
        var mes = data.getMonth() + 1;
        if (mes.toString().length == 1)
            mes = "0" + mes;
        var ano = data.getFullYear();
        return ano + "-" + mes + "-" + dia;
    }

    function ToKendoUI(data) {
        var dia = data.getDate();
        if (dia.toString().length == 2)
            dia = dia[0] == "0" ? dia[1] : dia;
        var mes = data.getMonth();
        if (mes.toString().length == 2)
            mes = mes[0] == "0" ? mes[1] : mes;
        var ano = data.getFullYear();
        return ano + "/" + mes + "/" + dia;
    }

    $scope.listPeriodDetail = function () {
        var startDate = $(".k-content a:first").attr("data-value");
        var finishDate = $(".k-content a:last").attr("data-value");

        if (startDate != null && finishDate != null) {

            var auxStartDate = startDate.split("/");
            var auxFinishDate = finishDate.split("/");
            startDate = auxStartDate[0] + "/" + (parseInt(auxStartDate[1]) + 1) + "/" + auxStartDate[2];
            finishDate = auxFinishDate[0] + "/" + (parseInt(auxFinishDate[1]) + 1) + "/" + auxFinishDate[2];

            // Format to the correct mask and add 1 month (because the calendar plugin uses month -1)
            startDate = moment(startDate, "YYYY/MM/DD").format("YYYY-MM-DD");
            finishDate = moment(finishDate, "YYYY/MM/DD").format("YYYY-MM-DD");

            $(".k-link").removeClass("BookingFillAllTheDay DailyLimitReached");

            $scope.is.LoadingPeriod = true;
            bookingService.ListPeriodDetail(startDate, finishDate).then(
            function (response) {
                angular.forEach(response.List, function (busyDay, key) {
                    var busyDate = ToKendoUI(new Date(moment(busyDay.Date).format("YYYY/MM/DD")));
                    $("a[data-value='" + busyDate + "']").addClass("unavailable");
                })
            },
            function (errorMessage) {
                modalService.showModal({}, { bodyTitle: errorMessage, actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true });
            }).finally(function () {
                $scope.is.LoadingPeriod = false;
            })
        }
    }

    $scope.selectDay = function (val) {

        $scope.model.selectedHour = null;
        $scope.model.selectedDate = moment(val).format("YYYY-MM-DD");

        // Get the bookings for the current selected day
        bookingService.ListDayDetail($scope.model.selectedDate, $scope.LoggedUser ? $scope.LoggedUser.Token : "").then(
        function (response) {
            $scope.dayDetail = response;

            // Scroll to intervals div in mobile
            $('html,body').animate({ scrollTop: $("html, body").height() }, "slow");

        },
        function (errorMessage) {
            modalService.showModal({}, { bodyTitle: errorMessage, actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true });
        })
    }

    $scope.selectHour = function (hour) {
        if ($scope.LoggedUser == null) {
            modalService.showModal({}, { bodyTitle: "Você precisa estar logado para fazer uma reserva.", actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true });
            return;
        }
        else {
            $scope.model.selectedHour = hour;
            // Scroll to intervals div in mobile
            $('html,body').animate({ scrollTop: $("html, body").height() }, "slow");
        }
    };

    $scope.addBooking = function () {
        $scope.is.loadingAdd = true;

        bookingService.AddBooking($scope.model.selectedDate, $scope.model.selectedHour).then(
        function (response) {
            $scope.checkoutPayment(response.Booking.ID);
        },
        function (errorMessage) {
            modalService.showModal({}, { bodyTitle: errorMessage, actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true });
            $scope.is.loadingAdd = false;
        });
    };

    $scope.checkoutPayment = function (bookingId) {
        paymentService.CheckoutPayment(bookingId).then(
        function (response) {
            modalService.showModal({}, { bodyTitle: "Você será redirecionado para a página de pagamentos.", actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true }).then(function () {
                $window.open(urls.pagseguroAPIUrl + '/checkout/payment.html?code=' + response, '_blank');
                $scope.listPeriodDetail();
                $scope.selectDay($scope.model.selectedDate);
                $scope.model.selectedHour = null;
                $scope.is.loadingAdd = false;
            });
        },
        function () {
            modalService.showModal({}, { bodyTitle: "Erro ao redirecionar para pagamento. \nTente novamente mais tarde.", actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true });
            $scope.is.loadingAdd = false;
        })
    };

    $scope.deleteBooking = function (id) {
        modalService.showModal({}, { bodyTitle: "Deseja realmente excluir a reserva?", actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: false }).then(function () {
            bookingService.DeleteBooking(id).then(
            function (response) {
                modalService.showModal({}, { bodyTitle: response.Message, actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true })
                $scope.listPeriodDetail();
                $scope.selectDay($scope.model.selectedDate);
                $scope.model.selectedHour = null;
            },
            function (errorMessage) {
                modalService.showModal({}, { bodyTitle: errorMessage, actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true })
            })
        });
    }

    $scope.changeFillAllTheDay = function (date, status) {
        modalService.showModal({}, { bodyTitle: "Deseja realmente alterar esta informação?", actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: false }).then(function () {
            bookingService.ChangeFillAllTheDay(date, status).then(
            function (response) {
                modalService.showModal({}, { bodyTitle: response.Message, actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true })
                $scope.listPeriodDetail();
                $scope.selectDay($scope.model.selectedDate);
                $scope.model.selectedHour = null;
            },
            function (errorMessage) {
                modalService.showModal({}, { bodyTitle: errorMessage, actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true })
            })
        });
    };

    $scope.changePaymentStatus = function (id) {
        var newPaymentStatus = $scope.model.bookingDetail.PaymentStatus === "3" ? "1" : "3";

        modalService.showModal({}, { bodyTitle: "Deseja realmente alterar o status de pagamento?", actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: false }).then(function () {
            bookingService.ChangePaymentStatus(id, newPaymentStatus).then(
            function (response) {
                modalService.showModal({}, { bodyTitle: response.Message, actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true })
                $scope.listPeriodDetail();
                $scope.selectDay($scope.model.selectedDate);
                $scope.model.selectedHour = null;
            },
            function (errorMessage) {
                modalService.showModal({}, { bodyTitle: errorMessage, actionButtonText: 'Ok', classIcon: "fa fa-exclamation-circle faa-vertical animated", onlyAlert: true })
            })
        });
    };

    $scope.redirectToPaymentPage = function (checkoutId) {
        $window.open(urls.pagseguroAPIUrl + '/checkout/payment.html?code=' + checkoutId, '_blank');
    };

    $scope.showBookingDetail = function (booking) {
        $scope.model.bookingDetail = booking;

        $scope.modalInstane = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views/partials/booking-detail.html',
            scope: $scope
        });

    }

    $scope.closeBookingDetail = function () {
        $scope.model.bookingDetail = null
        $scope.modalInstane.close();
    }

})