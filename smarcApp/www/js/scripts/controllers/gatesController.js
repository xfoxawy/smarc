smarc.controller('gatesController', [
    '$rootScope',
    '$scope',
    'Server',
    'Gate',
    '$timeout',
    function($rootScope, $scope, Server, Gate, $timeout){
        $rootScope.title = "Gates";

        $scope.open = function(id){
            Gate.open(id).then(function(data){
                console.log(data);
                $rootScope.gates[id].s = true;
                $timeout(function(){
                    console.log('closed');
                    $rootScope.gates[id].s = false;
                }, 1 * 60 * 1000);
            }, function(e){
                console.log(e);
            });
        };
    }
]);
