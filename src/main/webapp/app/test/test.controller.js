(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .controller('TestController', TestController);

    TestController.$inject = ['$scope', 'Principal', 'LoginService', 'Event', 'AlertService', 'Eventsource', 'uiCalendarConfig'];

    function TestController ($scope, Principal, LoginService, Event, AlertService, Eventsource, uiCalendarConfig) {
        var vm = this;
        /*Get all Events*/
        $scope.events = Event.query();
        /*Get all EventSources for dropdown list*/
        vm.eventSourcesList = Eventsource.query();

        vm.event = {
            title: null,
            start: null,
            end: null,
            allDay: null,
            id: null,
            eventsource: null
        };

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;



        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }

        getAccount();

        /*Save Event to Database*/
        vm.save = function () {
            vm.isSaving = true;
            if (vm.event.id !== null) {
                Event.update(vm.event, onSaveSuccess, onSaveError);
            } else {
                Event.save(vm.event, onSaveSuccess, onSaveError);
            }
        };

        function updateCalendar(){
            $scope.events = Event.query();
            $scope.events.$promise.then(function(result){

                $scope.events = result;
                uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
                uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', $scope.events);
            })
        }


        /*Setting is Saving state*/
        var onSaveSuccess = function (result) {
            vm.isSaving = false;
            updateCalendar();
        };
        var onSaveError = function () {
            vm.isSaving = false;
        };

        /*Declaring and initializing datePickerOpen State */
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.start = false;
        vm.datePickerOpenStatus.end = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };

        /*Configuration for the calendar*/
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: true,
                header:{
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                }
            }
        };

       /* Set reference to eventsources for the calendar
        as referred here: "http://fullcalendar.io/docs/event_data/Event_Source_Object/"*/
        $scope.eventSources =[{
            events: $scope.events
           /* color: 'red',   // an option!
            textColor: 'black' // an option!*/
        }];

    }
})();
