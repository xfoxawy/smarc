smarc.factory('Server', [
    '$http',
    '$q',
    function($http, $q){

        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };
        return {
            connectToServer: function(){
                if (env == 'production') {
                    return $http.get('http://'+ config().serverIp +':'+ config().serverPort +'/checkConnection');
                }
                if (env == 'development') {
                    return $q(function(resolve, reject) {
                        resolve();
                    });
                }
            },
            getStatus: function(){
                if (env == "production") {
                    return $http({
                        "method": "GET",
                        "url": "http://" + config().serverIp + ":" + config().serverPort + "/light/points"
                    });
                }
                if (env == "development") {
                    return $q(function(resolve, reject) {
                        var data = {
                            data: {
                                points: {
                                    'p177': { 's': false, 'r': '1' },
                                    'p178': { 's': false, 'r': '2' },
                                    'p179': { 's': true,  'r': '3' },
                                    'p180': { 's': true,  'r': '2' },
                                    'p181': { 's': false, 'r': '3' },
                                    'p182': { 's': true,  'r': '1' },
                                    'p183': { 's': false, 'r': '2' },
                                    'p184': { 's': false, 'r': '1' },
                                    'p185': { 's': false, 'r': '3' },
                                    'p186': { 's': true,  'r': '3' },
                                },
                                rooms: {
                                    "1" : "room One",
                                    "2" : "room Two",
                                    "3" : "room Three",
                                }
                            }
                        };
                        resolve(data);
                    });
                }
            },
        }
    }
]);
