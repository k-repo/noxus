angular.module('starter')
    .controller('LolCtrl', function ($scope, $http, ionicMaterialInk, $ionicLoading, $timeout, ionicMaterialMotion, localStorageService) {

        ionicMaterialInk.displayEffect();

        //$scope.currentGame = currentExample;
        //
        $scope.notFound = null;
        $scope.noCurrentGame = false;
        const apiKey = 'c088e234-32a3-4cba-b894-3db265fdb14f';
        const staticDataUrl = 'https://global.api.pvp.net/api/lol/static-data/';
        const staticDataImgUrl = 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/';
        const imgChampUrl = staticDataImgUrl + 'champion/';
        $scope.imgItemUrl = staticDataImgUrl + 'item/';
        const apiUrl = 'https://euw.api.pvp.net/api/lol/';
        const apiKeyUrl = '?api_key=';
        const entryUrl = '/entry';
        const leagueVersionUrl = '/v2.5/league/by-summoner/';
        const summonerByNameUrl = '/v1.4/summoner/by-name/';
        const championVersionUrl = '/v1.2/champion/';
        const extentionImg = '.png';
        $scope.region = 'euw';
        $scope.friends = localStorageService.keys();

        function clearAll() {
            return localStorageService.clearAll();
        }

        $scope.addFriend = function (summoner, friend) {
            if (friend) {
                console.log('save');
                if (localStorageService.isSupported) {
                    console.log('supp');
                    if (!localStorageService.get(summoner)){
                        console.log('set');
                        localStorageService.set(summoner, summoner);
                        $scope.friends = localStorageService.keys();
                        console.log(localStorageService.keys());
                    }
                }
            }
        };

        $scope.removeFriend = function(friend){
            if (localStorageService.isSupported) {
                if (localStorageService.get(summoner)){
                    console.log('remove');
                    localStorageService.remove(summoner);
                    $scope.friends = localStorageService.keys();
                    console.log(localStorageService.keys());
                }
            }
        };

        $scope.getSummoner = function (summoner) {
            $http({
                method: 'GET',
                url: apiUrl + $scope.region + summonerByNameUrl + summoner + apiKeyUrl + apiKey
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.summonerInfo = data[Object.keys(data)];
                    $scope.summonerId = $scope.summonerInfo.id;
                    $scope.recentGames = {};
                    //$scope.currentGame = $scope.getCurrentGame($scope.summonerInfo.id);
                    $scope.notFound = null;
                    $timeout(function () {
                        ionicMaterialInk.displayEffect();
                    }, 0);
                    // get league info
                    $http({
                        method: 'GET',
                        url: apiUrl + $scope.region + leagueVersionUrl + $scope.summonerId + entryUrl + apiKeyUrl + apiKey
                    }).success(function (data) {
                        $scope.leagueInfo = {};
                        $scope.leagueInfo = data[Object.keys(data)][0];
                        console.log($scope.leagueInfo);

                    });


                })
                .error(function (error) {
                    $scope.summonerInfo = null;
                    $scope.notFound = error;
                });
        };

        $scope.getRecentGames = function (id) {
            $http({
                method: 'GET',
                url: apiUrl + $scope.region + '/v1.3/game/by-summoner/' + id + '/recent?api_key=' + apiKey
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.recentGames = null;
                    $scope.recentGames = data.games;
                    var i = 0;
                    $scope.recentGames.forEach(function (game) {
                        var championId = game.championId;
                        $http({
                            method: 'GET',
                            //champion info
                            url: staticDataUrl + $scope.region + championVersionUrl + championId + apiKeyUrl + apiKey
                        })
                            .success(function (data) {
                                var index = $scope.recentGames.indexOf(game);
                                console.log(data);
                                var champion = data.name;
                                $scope.recentGames[index].champion = champion;
                                $scope.recentGames[index].championImg = imgChampUrl + champion.replace(/\s+/g, '').replace('\'', '') + extentionImg;
                                i++;
                                $timeout(function () {
                                    ionicMaterialInk.displayEffect();
                                }, 0);
                            });
                    });
                });
        };

        $scope.getHistory = function () {
            $scope.currentGame = null;
            $scope.noCurrentGame = null;
            $scope.getRecentGames($scope.summonerId);
        }

        $scope.getCurrent = function () {
            $scope.recentGames = null;
            $scope.getCurrentGame($scope.summonerId);
        }

        $scope.getChampionByID = function (id) {
            $http({
                method: 'GET',
                //champion info
                url: 'https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/' + id + '?api_key=' + apiKey
            })
                .success(function (data) {
                    data.img = 'http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/' + champion.replace(/\s+/g, '').replace('\'', '') + '.png';
                    return data;
                });
        }


        $scope.getCurrentGame = function (id) {
            $scope.noCurrentGame = false;
            var url = 'https://euw.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/EUW1/' + id + '?api_key=' + apiKey;
            console.log(url);
            $http({
                method: 'GET',
                url: url,
                //params : {callback : 'JSON_CALLBACK'},
                //responseType: "json"
            })
                .success(function (data) {
                    $scope.currentGame = data;
                    //$scope.currentGame = currentExample;
                    $scope.currentGame.participants.forEach(function (participant) {
                        var championId = participant.championId;
                        $http({
                            method: 'GET',
                            //champion info
                            url: staticDataUrl + $scope.region + championVersionUrl + championId + apiKeyUrl + apiKey
                        })
                            .success(function (data) {
                                console.log(data.name);
                                var champion = data.name;
                                participant.champion = champion;
                                participant.championImg = imgChampUrl + champion.replace(/\s+/g, '').replace('\'', '') + extentionImg;
                                $timeout(function () {
                                    ionicMaterialInk.displayEffect();
                                }, 0);
                            });
                    });
                }).error(function (error) {
                    //$scope.nocurrentGame = error;
                    $scope.noCurrentGame = true;
                });
        };


        //$scope.loading= function() {
        //    $ionicLoading.show({
        //        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        //    });
        //
        //    // For example's sake, hide the sheet after two seconds
        //    $timeout(function() {
        //        $ionicLoading.hide();
        //    }, 2000);
        //};

        //$scope.refreshInk = function(){
        //    ionic.material.ink.displayEffect();
        //};

        //$scope.$on('ngLastRepeat.refreshInk',function(e) {
        //    ionic.material.ink.displayEffect();
        //});


    });

var currentExample = {
    "gameId": 2218566061,
    "mapId": 11,
    "gameMode": "CLASSIC",
    "gameType": "MATCHED_GAME",
    "gameQueueConfigId": 2,
    "participants": [{
        "teamId": 100,
        "spell1Id": 4,
        "spell2Id": 11,
        "championId": 64,
        "profileIconId": 657,
        "summonerName": "Muay Thai Lee Si",
        "bot": false,
        "summonerId": 20784112,
        "runes": [{"count": 9, "runeId": 5245}, {"count": 9, "runeId": 5289}, {
            "count": 9,
            "runeId": 5317
        }, {"count": 3, "runeId": 5335}],
        "masteries": [{"rank": 1, "masteryId": 4111}, {"rank": 4, "masteryId": 4113}, {
            "rank": 1,
            "masteryId": 4114
        }, {"rank": 3, "masteryId": 4122}, {"rank": 1, "masteryId": 4124}, {
            "rank": 1,
            "masteryId": 4131
        }, {"rank": 1, "masteryId": 4132}, {"rank": 3, "masteryId": 4134}, {
            "rank": 1,
            "masteryId": 4141
        }, {"rank": 1, "masteryId": 4144}, {"rank": 3, "masteryId": 4152}, {
            "rank": 1,
            "masteryId": 4162
        }, {"rank": 2, "masteryId": 4211}, {"rank": 2, "masteryId": 4214}, {
            "rank": 1,
            "masteryId": 4221
        }, {"rank": 3, "masteryId": 4222}, {"rank": 1, "masteryId": 4232}]
    }, {
        "teamId": 100,
        "spell1Id": 4,
        "spell2Id": 12,
        "championId": 68,
        "profileIconId": 897,
        "summonerName": "Äteerpützee",
        "bot": false,
        "summonerId": 38398466,
        "runes": [{"count": 3, "runeId": 5267}, {"count": 6, "runeId": 5273}, {
            "count": 6,
            "runeId": 5289
        }, {"count": 3, "runeId": 5297}, {"count": 6, "runeId": 5317}, {
            "count": 3,
            "runeId": 5327
        }, {"count": 3, "runeId": 5357}],
        "masteries": [{"rank": 1, "masteryId": 4111}, {"rank": 4, "masteryId": 4113}, {
            "rank": 1,
            "masteryId": 4114
        }, {"rank": 3, "masteryId": 4123}, {"rank": 1, "masteryId": 4131}, {
            "rank": 1,
            "masteryId": 4133
        }, {"rank": 3, "masteryId": 4134}, {"rank": 2, "masteryId": 4142}, {
            "rank": 3,
            "masteryId": 4143
        }, {"rank": 3, "masteryId": 4152}, {"rank": 1, "masteryId": 4154}, {
            "rank": 1,
            "masteryId": 4162
        }, {"rank": 2, "masteryId": 4211}, {"rank": 1, "masteryId": 4212}, {
            "rank": 2,
            "masteryId": 4213
        }, {"rank": 1, "masteryId": 4222}]
    }, {
        "teamId": 100,
        "spell1Id": 14,
        "spell2Id": 4,
        "championId": 69,
        "profileIconId": 785,
        "summonerName": "Superb Manatee",
        "bot": false,
        "summonerId": 27737066,
        "runes": [{"count": 9, "runeId": 5273}, {"count": 9, "runeId": 5298}, {
            "count": 9,
            "runeId": 5316
        }, {"count": 3, "runeId": 5357}],
        "masteries": [{"rank": 4, "masteryId": 4113}, {"rank": 1, "masteryId": 4114}, {
            "rank": 3,
            "masteryId": 4123
        }, {"rank": 1, "masteryId": 4131}, {"rank": 1, "masteryId": 4133}, {
            "rank": 3,
            "masteryId": 4134
        }, {"rank": 3, "masteryId": 4143}, {"rank": 1, "masteryId": 4144}, {
            "rank": 2,
            "masteryId": 4152
        }, {"rank": 1, "masteryId": 4154}, {"rank": 1, "masteryId": 4162}, {
            "rank": 3,
            "masteryId": 4312
        }, {"rank": 1, "masteryId": 4313}, {"rank": 3, "masteryId": 4322}, {
            "rank": 1,
            "masteryId": 4324
        }, {"rank": 1, "masteryId": 4334}]
    }, {
        "teamId": 100,
        "spell1Id": 7,
        "spell2Id": 4,
        "championId": 67,
        "profileIconId": 775,
        "summonerName": "Groarrmeister",
        "bot": false,
        "summonerId": 27830684,
        "runes": [{"count": 9, "runeId": 5245}, {"count": 4, "runeId": 5277}, {
            "count": 5,
            "runeId": 5289
        }, {"count": 9, "runeId": 5317}, {"count": 3, "runeId": 5337}],
        "masteries": [{"rank": 4, "masteryId": 4112}, {"rank": 1, "masteryId": 4114}, {
            "rank": 3,
            "masteryId": 4122
        }, {"rank": 1, "masteryId": 4124}, {"rank": 1, "masteryId": 4131}, {
            "rank": 1,
            "masteryId": 4132
        }, {"rank": 3, "masteryId": 4134}, {"rank": 1, "masteryId": 4141}, {
            "rank": 1,
            "masteryId": 4144
        }, {"rank": 1, "masteryId": 4151}, {"rank": 3, "masteryId": 4152}, {
            "rank": 1,
            "masteryId": 4162
        }, {"rank": 2, "masteryId": 4211}, {"rank": 2, "masteryId": 4212}, {
            "rank": 1,
            "masteryId": 4221
        }, {"rank": 3, "masteryId": 4222}, {"rank": 1, "masteryId": 4232}]
    }, {
        "teamId": 100,
        "spell1Id": 4,
        "spell2Id": 3,
        "championId": 57,
        "profileIconId": 610,
        "summonerName": "Groarr Wollah",
        "bot": false,
        "summonerId": 19421751,
        "runes": [{"count": 9, "runeId": 5273}, {"count": 3, "runeId": 5289}, {
            "count": 6,
            "runeId": 5290
        }, {"count": 9, "runeId": 5316}, {"count": 3, "runeId": 5357}],
        "masteries": [{"rank": 2, "masteryId": 4211}, {"rank": 2, "masteryId": 4212}, {
            "rank": 1,
            "masteryId": 4221
        }, {"rank": 3, "masteryId": 4222}, {"rank": 1, "masteryId": 4232}, {
            "rank": 3,
            "masteryId": 4312
        }, {"rank": 3, "masteryId": 4313}, {"rank": 1, "masteryId": 4323}, {
            "rank": 1,
            "masteryId": 4324
        }, {"rank": 3, "masteryId": 4331}, {"rank": 1, "masteryId": 4334}, {
            "rank": 1,
            "masteryId": 4341
        }, {"rank": 1, "masteryId": 4342}, {"rank": 3, "masteryId": 4343}, {
            "rank": 1,
            "masteryId": 4352
        }, {"rank": 3, "masteryId": 4353}]
    }, {
        "teamId": 200,
        "spell1Id": 4,
        "spell2Id": 7,
        "championId": 18,
        "profileIconId": 581,
        "summonerName": "Latens",
        "bot": false,
        "summonerId": 34930803,
        "runes": [{"count": 8, "runeId": 5245}, {"count": 1, "runeId": 5251}, {
            "count": 9,
            "runeId": 5289
        }, {"count": 9, "runeId": 5317}, {"count": 3, "runeId": 5337}],
        "masteries": [{"rank": 4, "masteryId": 4112}, {"rank": 1, "masteryId": 4114}, {
            "rank": 3,
            "masteryId": 4122
        }, {"rank": 1, "masteryId": 4124}, {"rank": 1, "masteryId": 4132}, {
            "rank": 3,
            "masteryId": 4134
        }, {"rank": 2, "masteryId": 4142}, {"rank": 1, "masteryId": 4144}, {
            "rank": 1,
            "masteryId": 4151
        }, {"rank": 3, "masteryId": 4152}, {"rank": 1, "masteryId": 4162}, {
            "rank": 2,
            "masteryId": 4211
        }, {"rank": 2, "masteryId": 4212}, {"rank": 1, "masteryId": 4221}, {
            "rank": 3,
            "masteryId": 4222
        }, {"rank": 1, "masteryId": 4232}]
    }, {
        "teamId": 200,
        "spell1Id": 4,
        "spell2Id": 12,
        "championId": 11,
        "profileIconId": 539,
        "summonerName": "Amên",
        "bot": false,
        "summonerId": 24381372,
        "runes": [{"count": 9, "runeId": 5245}, {"count": 9, "runeId": 5289}, {
            "count": 9,
            "runeId": 5317
        }, {"count": 3, "runeId": 5337}],
        "masteries": [{"rank": 1, "masteryId": 4111}, {"rank": 2, "masteryId": 4112}, {
            "rank": 1,
            "masteryId": 4114
        }, {"rank": 3, "masteryId": 4122}, {"rank": 1, "masteryId": 4124}, {
            "rank": 1,
            "masteryId": 4132
        }, {"rank": 3, "masteryId": 4134}, {"rank": 3, "masteryId": 4142}, {
            "rank": 1,
            "masteryId": 4144
        }, {"rank": 1, "masteryId": 4151}, {"rank": 3, "masteryId": 4152}, {
            "rank": 1,
            "masteryId": 4162
        }, {"rank": 2, "masteryId": 4211}, {"rank": 2, "masteryId": 4212}, {
            "rank": 1,
            "masteryId": 4221
        }, {"rank": 3, "masteryId": 4222}, {"rank": 1, "masteryId": 4232}]
    }, {
        "teamId": 200,
        "spell1Id": 4,
        "spell2Id": 3,
        "championId": 53,
        "profileIconId": 900,
        "summonerName": "bertobest",
        "bot": false,
        "summonerId": 27537166,
        "runes": [{"count": 6, "runeId": 5267}, {"count": 3, "runeId": 5273}, {
            "count": 4,
            "runeId": 5289
        }, {"count": 5, "runeId": 5297}, {"count": 9, "runeId": 5317}, {
            "count": 2,
            "runeId": 5357
        }, {"count": 1, "runeId": 5361}],
        "masteries": [{"rank": 4, "masteryId": 4113}, {"rank": 1, "masteryId": 4121}, {
            "rank": 3,
            "masteryId": 4123
        }, {"rank": 1, "masteryId": 4133}, {"rank": 3, "masteryId": 4312}, {
            "rank": 3,
            "masteryId": 4313
        }, {"rank": 3, "masteryId": 4322}, {"rank": 1, "masteryId": 4324}, {
            "rank": 3,
            "masteryId": 4331
        }, {"rank": 1, "masteryId": 4334}, {"rank": 1, "masteryId": 4341}, {
            "rank": 1,
            "masteryId": 4342
        }, {"rank": 1, "masteryId": 4352}, {"rank": 3, "masteryId": 4353}, {"rank": 1, "masteryId": 4362}]
    }, {
        "teamId": 200,
        "spell1Id": 11,
        "spell2Id": 4,
        "championId": 421,
        "profileIconId": 898,
        "summonerName": "xandro5",
        "bot": false,
        "summonerId": 38578502,
        "runes": [{"count": 9, "runeId": 5245}, {"count": 9, "runeId": 5289}, {
            "count": 9,
            "runeId": 5317
        }, {"count": 3, "runeId": 5345}],
        "masteries": [{"rank": 4, "masteryId": 4112}, {"rank": 4, "masteryId": 4113}, {
            "rank": 1,
            "masteryId": 4121
        }, {"rank": 3, "masteryId": 4122}, {"rank": 1, "masteryId": 4131}, {
            "rank": 1,
            "masteryId": 4132
        }, {"rank": 3, "masteryId": 4142}, {"rank": 3, "masteryId": 4152}, {
            "rank": 1,
            "masteryId": 4162
        }, {"rank": 2, "masteryId": 4212}, {"rank": 2, "masteryId": 4213}, {
            "rank": 2,
            "masteryId": 4214
        }, {"rank": 3, "masteryId": 4222}]
    }, {
        "teamId": 200,
        "spell1Id": 4,
        "spell2Id": 14,
        "championId": 103,
        "profileIconId": 779,
        "summonerName": "RX79G",
        "bot": false,
        "summonerId": 69792822,
        "runes": [{"count": 3, "runeId": 5290}, {"count": 6, "runeId": 5295}, {
            "count": 9,
            "runeId": 5317
        }, {"count": 3, "runeId": 5357}, {"count": 9, "runeId": 5402}],
        "masteries": [{"rank": 4, "masteryId": 4113}, {"rank": 1, "masteryId": 4114}, {
            "rank": 3,
            "masteryId": 4123
        }, {"rank": 1, "masteryId": 4124}, {"rank": 1, "masteryId": 4133}, {
            "rank": 3,
            "masteryId": 4134
        }, {"rank": 3, "masteryId": 4143}, {"rank": 1, "masteryId": 4144}, {
            "rank": 3,
            "masteryId": 4152
        }, {"rank": 1, "masteryId": 4162}, {"rank": 3, "masteryId": 4312}, {
            "rank": 3,
            "masteryId": 4313
        }, {"rank": 1, "masteryId": 4314}, {"rank": 1, "masteryId": 4324}, {"rank": 1, "masteryId": 4334}]
    }],
    "observers": {"encryptionKey": "yHgq4bTXOFLb80/fDLGae/z9iPTzEdYL"},
    "platformId": "EUW1",
    "bannedChampions": [],
    "gameStartTime": 1437839094680,
    "gameLength": 482
};
