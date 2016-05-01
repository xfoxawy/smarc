smarc.factory('Server', [
    '$http',
    '$q',
    function($http, $q){

        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };
        return {
            connectToServer: function(cb){
                return $q(function(resolve, reject) {
                    resolve();
                });
                // return $http.get('http://'+ config().serverIp +':'+ config().serverPort +'/checkConnection');
            },
            getStatus: function(){
                // return $http({
                //     "method": "GET",
                //     "url": "http://" + config().serverIp + ":" + config().serverPort + "/light/points"
                // });
                return $q(function(resolve, reject) {
                    var data = {
                        data: {
                            // points: [
                            //     { "p": "p177", "s": false, 'r': '1' },
                            //     { "p": "p178", "s": false, 'r': '1' },
                            //     { "p": "p179", "s": true, 'r': '2' },
                            //     { "p": "p180", "s": true, 'r': '2' },
                            //     { "p": "p181", "s": false, 'r': '3' },
                            //     { "p": "p182", "s": true, 'r': '3' },
                            //     { "p": "p183", "s": false, 'r': '3' },
                            //     { "p": "p184", "s": false, 'r': '1' },
                            //     { "p": "p185", "s": false, 'r': '2' },
                            //     { "p": "p186", "s": true, 'r': '2' },
                            // ],
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
                            rooms: [
                                { id: "1", name: "room One" },
                                { id: "2", name: "room Two" },
                                { id: "3", name: "room Three" },
                            ]
                        }
                    };
                    resolve(data);
                });

            },
        }
    }
]);
