(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('eventsource', {
            parent: 'entity',
            url: '/eventsource',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'soPoCApp.eventsource.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/eventsource/eventsources.html',
                    controller: 'EventsourceController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('eventsource');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('eventsource-detail', {
            parent: 'entity',
            url: '/eventsource/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'soPoCApp.eventsource.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/eventsource/eventsource-detail.html',
                    controller: 'EventsourceDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('eventsource');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Eventsource', function($stateParams, Eventsource) {
                    return Eventsource.get({id : $stateParams.id});
                }]
            }
        })
        .state('eventsource.new', {
            parent: 'eventsource',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/eventsource/eventsource-dialog.html',
                    controller: 'EventsourceDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('eventsource', null, { reload: true });
                }, function() {
                    $state.go('eventsource');
                });
            }]
        })
        .state('eventsource.edit', {
            parent: 'eventsource',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/eventsource/eventsource-dialog.html',
                    controller: 'EventsourceDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Eventsource', function(Eventsource) {
                            return Eventsource.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('eventsource', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('eventsource.delete', {
            parent: 'eventsource',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/eventsource/eventsource-delete-dialog.html',
                    controller: 'EventsourceDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Eventsource', function(Eventsource) {
                            return Eventsource.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('eventsource', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
