(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .controller('EventsourceDialogController', EventsourceDialogController);

    EventsourceDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Eventsource', 'User'];

    function EventsourceDialogController ($scope, $stateParams, $uibModalInstance, entity, Eventsource, User) {
        var vm = this;
        vm.eventsource = entity;
        vm.users = User.query();
        vm.load = function(id) {
            Eventsource.get({id : id}, function(result) {
                vm.eventsource = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('soPoCApp:eventsourceUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.eventsource.id !== null) {
                Eventsource.update(vm.eventsource, onSaveSuccess, onSaveError);
            } else {
                Eventsource.save(vm.eventsource, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
