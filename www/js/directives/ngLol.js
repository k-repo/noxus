angular.module('starter')
    .directive('ngLolSearch', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/ng-lol-search.html'
        }
    })

    .directive('ngLolPerso', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/ng-lol-perso.html'
        }
    })

    .directive('ngLolHistory', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/ng-lol-history.html'
        }
    })

    .directive('ngLolCurrent', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/ng-lol-current.html'
        }
    })

    .directive('ngLolPersoItems', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/directives/ng-lol-perso-items.html'
        }
    })

;