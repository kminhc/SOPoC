(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .controller('EventDialogController', EventDialogController);

    EventDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Event', 'Eventsource'];

    function EventDialogController ($scope, $stateParams, $uibModalInstance, entity, Event, Eventsource) {
        var vm = this;
        vm.event = entity;
        vm.eventsources = Eventsource.query();
        vm.load = function(id) {
            Event.get({id : id}, function(result) {
                vm.event = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('soPoCApp:eventUpdate', result);
            $uibModalInstance.close(result);
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

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.start = false;
        vm.datePickerOpenStatus.end = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };
    }
})();
