(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .controller('EventDetailController', EventDetailController);

    EventDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Event', 'Eventsource'];

    function EventDetailController($scope, $rootScope, $stateParams, entity, Event, Eventsource) {
        var vm = this;
        vm.event = entity;
        vm.load = function (id) {
            Event.get({id: id}, function(result) {
                vm.event = result;
            });
        };
        var unsubscribe = $rootScope.$on('soPoCApp:eventUpdate', function(event, result) {
            vm.event = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
