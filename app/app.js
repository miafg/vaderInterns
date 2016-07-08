
// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ngMaterial', 'ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'homeCtrl'
        })
        .when('/about', {
            templateUrl: 'about.html',
            controller: 'aboutCtrl'
        })
        .when('/boris', {
            templateUrl: 'boris.html',
            controller: 'borisCtrl'
        })
        .when('/joi', {
            templateUrl: 'joi.html',
            controller: 'joiCtrl'
        })
        .when('/luis', {
            templateUrl: 'luis.html',
            controller: 'luisCtrl'
        })
        .when('/mia', {
            templateUrl: 'mia.html',
            controller: 'miaCtrl'
        })
        .when('/darth', {
            templateUrl: 'darth.html',
            controller: 'darthCtrl'
        })
        .when('/game', {
            templateUrl: 'game.html',
            controller: 'gameCtrl'
        })
        .otherwise({redirectTo: '/home'});
});

