(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .controller('TestController', TestController);

    TestController.$inject = ['$scope', 'Principal', 'LoginService', 'Event', 'AlertService', 'Eventsource'];

    function TestController ($scope, Principal, LoginService, Event, AlertService, Eventsource) {
        var vm = this;
        vm.eventList = []
        vm.eventsources = Eventsource.query();;
        vm.event = {
            title: null,
            start: null,
            end: null,
            allDay: null,
            id: null
        };
        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        var onSaveSuccess = function (result) {
            $scope.$emit('soPoCApp:eventUpdate', result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.event.id !== null) {
                Event.update(vm.event, onSaveSuccess, onSaveError);
            } else {
                Event.save(vm.event, onSaveSuccess, onSaveError);
            }
        };

        vm.loadAll = function() {
            Event.query(onSuccess, onError);
            function onSuccess(data, headers) {
                for (var i = 0; i < data.length; i++) {
                    vm.eventList.push(data[i]);
                }
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        };

        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.start = false;
        vm.datePickerOpenStatus.end = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };

        $scope.eventSources =[{
            events: vm.eventList,
            color: 'red',   // an option!
            textColor: 'black' // an option!
        }];

        $scope.uiConfig = {
            calendar:{
            height: 450,
            editable: true,
            header:{
              left: 'month basicWeek basicDay agendaWeek agendaDay',
              center: 'title',
              right: 'today prev,next'
            },
            dayClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
            }
        };

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }
        vm.loadAll();
    }
})();
