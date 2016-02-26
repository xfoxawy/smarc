smarc.factory('Miscellaneous', [
    '$http',
    '$q',
    function($http, $q){

        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };
        return {
            allStatus: function(){
                // return $q(function(resolve, reject) {
                //     var data = {
                //         points: [
                //             { "p": "p177", "s": false, 'r': '1' },
                //             { "p": "p178", "s": false, 'r': '1' },
                //             { "p": "p179", "s": false, 'r': '2' },
                //             { "p": "p180", "s": false, 'r': '2' },
                //             { "p": "p181", "s": false, 'r': '3' },
                //             { "p": "p182", "s": false, 'r': '3' },
                //             { "p": "p183", "s": false, 'r': '3' },
                //             { "p": "p184", "s": false, 'r': '1' },
                //             { "p": "p185", "s": false, 'r': '2' },
                //             { "p": "p186", "s": false, 'r': '2' },
                //         ],
                //         rooms: [
                //             { id: "1", name: "room One" },
                //             { id: "2", name: "room Two" },
                //             { id: "3", name: "room Three" },
                //         ]
                //     };
                //     resolve(data);
                // });
                return $http({
                    "method": "GET",
                    "url": "http://" + config().serverIp + ":" + config().serverPort + "/light/points"
                });
            },
        }
    }
]);
