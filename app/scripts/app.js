(function () {
    "use strict";
    angular
        .module('app', [
            'ngAnimate',
            'ngResource',
            'ngMessages',
            'restangular'

        ]).controller('InstagramController', function(InstagramService, $sce, $window, instagramAPI){
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
                    //clean API call to Instagram via our exposed methods
                    instagramAPI.queryRecentMedia(vm.keyword).then(function (result) {
                        vm.data = result.data;
                        vm.count = result.data.length;
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
        }).factory('instagramAPI', function(InstagramRestangularService){
            /**
                This factory would expose the Instagram API methods used by the application, I prefer this as my controller
                doesnt need a chain of .all .one method calls. All of that can be maintained in the factory
            */

            //For some reason setting default query params for get request is not working with jsonp, so setting it like this
            var clientId = {client_id: 'bd3de9a0d90f41e8847fa08e838b4a64'};

            return {
                queryRecentMedia: function(keyword){
                    return InstagramRestangularService.one('tags', keyword).one('media','recent').get(clientId)
                }
            }

        }).factory('InstagramRestangularService', function(Restangular){
            /**
                This will return a custom configured Restangular service.
            */
            return Restangular.withConfig(function(RestangularConfigurer){
                RestangularConfigurer.setJsonp(true);
                RestangularConfigurer.setBaseUrl('https://api.instagram.com/v1/');
                RestangularConfigurer.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
            });
        });
}());
