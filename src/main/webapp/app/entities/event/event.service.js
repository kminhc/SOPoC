(function() {
    'use strict';
    angular
        .module('soPoCApp')
        .factory('Event', Event);

    Event.$inject = ['$resource', 'DateUtils'];

    function Event ($resource, DateUtils) {
        var resourceUrl =  'api/events/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.start = DateUtils.convertLocalDateFromServer(data.start);
                    data.end = DateUtils.convertLocalDateFromServer(data.end);
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.start = DateUtils.convertLocalDateToServer(data.start);
                    data.end = DateUtils.convertLocalDateToServer(data.end);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.start = DateUtils.convertLocalDateToServer(data.start);
                    data.end = DateUtils.convertLocalDateToServer(data.end);
                    return angular.toJson(data);
                }
            }
        });
    }
})();
