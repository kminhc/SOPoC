(function() {
    'use strict';
    angular
        .module('soPoCApp')
        .factory('Eventsource', Eventsource);

    Eventsource.$inject = ['$resource'];

    function Eventsource ($resource) {
        var resourceUrl =  'api/eventsources/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
