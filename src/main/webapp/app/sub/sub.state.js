(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('sub', {
            parent: 'app',
            url: '/',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/sub/sub.html',
                    controller: 'SubController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('sub');
                    return $translate.refresh();
                }]
            }
        })

    }
})();
