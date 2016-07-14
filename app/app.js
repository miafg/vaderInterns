
// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ngMaterial', 'ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/html/home.html',
            controller: 'homeCtrl'
        })
        .when('/about', {
            templateUrl: 'app/html/about.html',
            controller: 'aboutCtrl'
        })
        .when('/boris', {
            templateUrl: 'app/html/boris.html',
            controller: 'borisCtrl'
        })
        .when('/joi', {
            templateUrl: 'app/html/joi.html',
            controller: 'joiCtrl'
        })
        .when('/luis', {
            templateUrl: 'app/html/luis.html',
            controller: 'luisCtrl'
        })
        .when('/mia', {
            templateUrl: 'app/html/mia.html',
            controller: 'miaCtrl'
        })
        .when('/darth', {
            templateUrl: 'app/html/darth.html',
            controller: 'darthCtrl'
        })
        .when('/game', {
            templateUrl: 'app/html/game.html',
            controller: 'gameCtrl'
        })
        .otherwise({redirectTo: '/'});
});

