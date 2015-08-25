angular.module('starter', ['ngResource'])

    .factory('Champion', function($resource) {
        var apiKey = 'c088e234-32a3-4cba-b894-3db265fdb14f';
        return $resource('https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/:championId?api_key=' + apiKey,
            {championId: '@id'});
    });