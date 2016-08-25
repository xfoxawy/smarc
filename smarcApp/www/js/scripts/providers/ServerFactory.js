smarc.factory('Server', [
    '$http',
    '$q',
    'Config',
    function($http, $q, Config){

        function config(){
            // get connection info from local storage
            if ( window.localStorage.getItem('options') ) {
                return JSON.parse( window.localStorage.getItem('options') );
            } else {
                // if not then get it from configValue.js
                window.localStorage.setItem('options') = Config;
                return config();
            }
        };
        return {
            connectToServer: function(){
                if (env == 'production') {
                    return $http.get('http://'+ config().serverIp +':'+ config().serverPort +'/checkConnection');
                }
                if (env == 'development') return $q(function(resolve, reject) { resolve(); });
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
                                    'p187': { 's': false, 'r': '1' },
                                    'p188': { 's': false, 'r': '2' },
                                    'p189': { 's': true,  'r': '3' },
                                    'p190': { 's': true,  'r': '2' },
                                    'p191': { 's': false, 'r': '3' },
                                    'p192': { 's': true,  'r': '1' },
                                    'p193': { 's': false, 'r': '2' },
                                    'p194': { 's': false, 'r': '1' },
                                    'p195': { 's': false, 'r': '3' },
                                    'p196': { 's': true,  'r': '3' },
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

            getGates: function(){
                if (env == "production") {
                    return $http({
                        "method": "GET",
                        "url": "http://" + config().serverIp + ":" + config().serverPort + "/doors/points"
                    });
                }
                if (env == "development") {
                    return $q(function(resolve, reject) {
                        var data = {
                            data: {
                                "gate1": {
                                    s : false,
                                    i : "",
                                    d : "",
                                    node_name : "",
                                    node_status : "",
                                    node_ip : ""
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
