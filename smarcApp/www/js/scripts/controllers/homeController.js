smarc.controller('homeController', [
	'$scope',
	'$http',
	function($scope, $http){
	    $scope.allNodes = function(){
	    	$http({
	    		method: "GET",
	    		url: "http://localhost:3050/light/allNodes",
	    	}).then(function(data){
	    		console.log(data);
	    	});
	    };
	    $scope.onLight = function(id){
	    	$http({
	    		method: "GET",
	    		url: "http://localhost:3050/light/on/:id",
	    		data: {
	    			id: id
	    		}
	    	}).then(function(data){
	    		console.log(data);
	    	});
	    };
	    $scope.offLight = function(id){
	    	$http({
	    		method: "GET",
	    		url: "http://localhost:3050/light/off/:id",
	    		data: {
	    			id: id
	    		}
	    	}).then(function(data){
	    		console.log(data);
	    	});
	    };
	}
])
