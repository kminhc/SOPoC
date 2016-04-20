(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .controller('EventsourceDetailController', EventsourceDetailController);

    EventsourceDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Eventsource', 'User'];

    function EventsourceDetailController($scope, $rootScope, $stateParams, entity, Eventsource, User) {
        var vm = this;
        vm.eventsource = entity;
        vm.load = function (id) {
            Eventsource.get({id: id}, function(result) {
                vm.eventsource = result;
            });
        };
        var unsubscribe = $rootScope.$on('soPoCApp:eventsourceUpdate', function(event, result) {
            vm.eventsource = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
