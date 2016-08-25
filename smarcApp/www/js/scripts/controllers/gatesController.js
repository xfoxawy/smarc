smarc.controller('gatesController', [
    '$rootScope',
    '$scope',
    'Server',
    'Gate',
    function($rootScope, $scope, Server, Gate){
        $rootScope.title = "Gates";
        
        // get all gates
        Server.getGates().then(function(response){
            $rootScope.gates  = response.data;
        }, function(e){
            console.log(e);
        });

        $scope.open = function(id){
            Gate.open(id).then(function(data){
                console.log(data);
                $rootScope.gates[id].s = true;
                $timeout(function(){
                    $rootScope.gates[id].s = false;
                }, 5000);
            }, function(e){
                console.log(e);
            });
        };
    }
]);
