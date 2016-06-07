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
        $scope.dateformat = "dd.MM.yyyy"

        vm.event = {
            title: null,
            start: null,
            end: null,
            allDay: false,
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

        /*alert on event click*/

        $scope.alertOnEventClick = function(date, jsEvent, view){
            $scope.alertMessage = ('Das Event '+ date.title + ' wurde ausgewählt.');

            vm.event = Event.get({id : date.id});
            vm.clickedEventID = date.id;

        };

        $scope.onDayClick = function(date, jsEvent, view){
            vm.changedDate = new Date(date.format());
            $scope.alertMessage = ('Der Tag ' + vm.changedDate.toLocaleDateString() + ' wurde ausgewählt.');

            vm.event.title = "";
            vm.event.start = vm.changedDate;

        };

        $scope.dropEvent = function (event, delta, revertFunc,jsEvent, ui, view){
            vm.changedDateStart = new Date(event.start.format());
            if(event.end != null){
                vm.changedDateEnd = new Date(event.end.format());
                $scope.alertMessage = ('Das Event ' + event.title + ' wurde auf ' + vm.changedDateStart.toLocaleDateString()+' - ' + vm.changedDateEnd.toLocaleDateString() + ' verschoben.')
            }else{
                vm.changedDateEnd = null;
                $scope.alertMessage = ('Das Event ' + event.title + ' wurde auf ' + vm.changedDateStart.toLocaleDateString() + event.allDay + ' verschoben.')
            }

            vm.event.id = event.id;
            vm.event.title = event.title;
            vm.event.start = vm.changedDateStart;
            vm.event.end = vm.changedDateEnd;
            vm.event.allDay = event.allDay;

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
                editable: true,
                header:{
                    left: 'month basicWeek agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                dayClick:   $scope.onDayClick,
                eventDrop: $scope.dropEvent

            }
        };



       /* Set reference to eventsources for the calendar
        as referred here: "http://fullcalendar.io/docs/event_data/Event_Source_Object/"*/
        $scope.eventSources =[{
            events: $scope.events
        }];

        $scope.list = [
            {
                "id": 1,
                "title": "node1",
                "nodes": [
                    {
                        "id": 11,
                        "title": "node1.1",
                        "nodes": [
                            {
                                "id": 111,
                                "title": "node1.1.1",
                                "nodes": []
                            }
                        ]
                    },
                    {
                        "id": 12,
                        "title": "node1.2",
                        "nodes": []
                    }
                ]
            },
            {
                "id": 2,
                "title": "node2",
                "nodrop": true,
                "nodes": [
                    {
                        "id": 21,
                        "title": "node2.1",
                        "nodes": []
                    },
                    {
                        "id": 22,
                        "title": "node2.2",
                        "nodes": []
                    }
                ]
            },
            {
                "id": 3,
                "title": "node3",
                "nodes": [
                    {
                        "id": 31,
                        "title": "node3.1",
                        "nodes": []
                    }
                ]
            }
        ];

    }
})();
