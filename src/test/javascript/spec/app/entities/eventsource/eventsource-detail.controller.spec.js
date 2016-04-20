'use strict';

describe('Controller Tests', function() {

    describe('Eventsource Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockEventsource, MockUser;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockEventsource = jasmine.createSpy('MockEventsource');
            MockUser = jasmine.createSpy('MockUser');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Eventsource': MockEventsource,
                'User': MockUser
            };
            createController = function() {
                $injector.get('$controller')("EventsourceDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'soPoCApp:eventsourceUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
