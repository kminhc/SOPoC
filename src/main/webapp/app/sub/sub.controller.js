(function() {
    'use strict';

    angular
        .module('soPoCApp')
        .controller('SubController', SubController);

    SubController.$inject = ['$scope', 'Principal', 'LoginService'];

    function SubController ($scope, Principal, LoginService) {
        var vm = this;
        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;


        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }

        getAccount();



        $scope.nodes = [
            {
                "id": 1,
                "checkeStatus" : "unchecked",
                "title": "node1",
                "nodes": [
                    {
                        "id": 11,
                        "checkeStatus" : "unchecked",
                        "title": "node1.1",
                        "nodes": [
                            {
                                "id": 111,
                                "checkeStatus" : "unchecked",
                                "title": "node1.1.1",
                                "nodes": []
                            }
                        ]
                    },
                    {
                        "id": 12,
                        "checkeStatus" : "unchecked",
                        "title": "node1.2",
                        "nodes": []
                    }
                ]
            },
            {
                "id": 2,
                "checkeStatus" : "unchecked",
                "title": "node2",
                "nodrop": true,
                "nodes": [
                    {
                        "id": 21,
                        "checkeStatus" : "unchecked",
                        "title": "node2.1",
                        "nodes": []
                    },
                    {
                        "id": 22,
                        "checkeStatus" : "unchecked",
                        "title": "node2.2",
                        "nodes": []
                    }
                ]
            },
            {
                "id": 3,
                "checkeStatus" : "unchecked",
                "title": "node3",
                "nodes": [
                    {
                        "id": 31,
                        "checkeStatus" : "unchecked",
                        "title": "node3.1",
                        "nodes": []
                    }
                ]
            }
        ];


    }

})();
