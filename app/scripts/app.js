(function () {
    "use strict";
    angular
        .module('app', [
            'ngAnimate',
            'ngResource',
            'ngMessages'

        ]).controller('InstagramController', function(InstagramService, $sce, $window){
            var vm = this;
            vm.keyword = '';
            vm.display = false;
            vm.count = 0;
            vm.data = null;
            vm.message = '';

            vm.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };
            function ErrorHandling() {
                vm.message = 'Oops something went wrong ,please try again';
                vm.data = null;
                vm.display = true;
            }

            vm.submit = function () {
                vm.message = 'Please wait while we get your results';
                if (!isBlank(vm.keyword)) {
                    InstagramService.get(vm.keyword).then(function (result) {
                        vm.data = result.data.data;
                        vm.count = result.data.data.length;
                        vm.display = true;
                        vm.message = 'We found ' + vm.count + ' results for ' + vm.keyword;
                    }).catch(function (error) {
                        ErrorHandling();
                    })
                }
                else {
                    ErrorHandling();
                }
            };
            vm.keywordOnChange = function () {
                if (vm.keyword === undefined) {
                    vm.display = false;
                }
            };
            function isBlank(str) {
                return (!str || /^\s*$/.test(str));
            }
            vm.openLinkWindow = function (link) {
                $window.open(link);
            };


        }).service('InstagramService', function ($http) {
            var result = null;
            return {
                'get': function (keyword) {
                    var clientId = 'bd3de9a0d90f41e8847fa08e838b4a64';
                    var url = 'https://api.instagram.com/v1/tags/' + keyword + '/media/recent';
                    var request = {
                        callback: "JSON_CALLBACK",
                        client_id: clientId
                    };

                    return $http({
                        method: 'JSONP',
                        url: url,
                        params: request
                    }).success(function (response) {
                        result = response;
                    }).error(function (error) {
                        result = error;
                    });
                }
            }

        });
}());

