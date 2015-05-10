'use strict';

/**
 * @ngdoc overview
 * @name instagramSearcherApp
 * @description
 * # instagramSearcherApp
 *
 * Main module of the application.
 */
angular
  .module('instagramSearchApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router'

  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
