smarc.controller('homeController', [
	'$scope',
	'$http',
	function($scope, $http){
	    $scope.toggle = function(id){
	    	$http({
	    		method: "GET",
	    		url: "http://192.168.0.177:3050/light/toggle/" + id
	    	}).then(function(data){
	    		console.log(data);
	    	});
	    };

	    $scope.testJwt = function(){
	    	$http({
	    		method: "GET",
	    		url: "http://localhost:3050/testjwt"
	    	}).then(function(data){
	    		console.log(data);
	    	});
	    };
	}
]);
