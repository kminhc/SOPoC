(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .controller('EventsourceDeleteController',EventsourceDeleteController);

    EventsourceDeleteController.$inject = ['$uibModalInstance', 'entity', 'Eventsource'];

    function EventsourceDeleteController($uibModalInstance, entity, Eventsource) {
        var vm = this;
        vm.eventsource = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Eventsource.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
