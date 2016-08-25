smarc.controller('lightsController', [
    '$rootScope',
    '$scope',
    'Server',
    'Queue',
    function($rootScope, $scope, Server, Queue){
        $rootScope.title = "Rooms";
        
        $scope.toggle = function(id){
            var options = {
                'model': 'Light',
                'method': 'toggle',
                'data': id,
                'success': function(data){
                    $rootScope.points[id] = data;
                },
                'error': function(e){
                    console.log(e);
                }
            };
            // start dequeuing items
            Queue.enqueue(options);
        };

        // get all points and rooms
        Server.getStatus().then(function(response){
            $rootScope.rooms  = response.data.rooms;
            $rootScope.points = response.data.points;
        }, function(response){
            console.log(response);
        });
    }
]);
