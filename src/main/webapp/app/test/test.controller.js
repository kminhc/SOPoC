(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .controller('TestController', TestController);

    TestController.$inject = ['$scope', 'Principal', 'LoginService', 'Event', 'AlertService'];

    function TestController ($scope, Principal, LoginService, Event, AlertService) {
        var vm = this;
        vm.eventList = [];
        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

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

         $scope.alertOnEventClick = function( date, jsEvent, view){
            $scope.alertMessage = (date.title + ' was clicked ');
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
