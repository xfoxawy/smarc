var Driver = require('./Driver')(Core);


var Delegator = function(Core){

	this.getNodes = function(){
		return Driver.nodes;
	};
	
	this.turnOn = function(pointNumber){
		Driver.exec('127.0.0.1','O'+pointNumber+',1');
	};

	this.turnOff = function(pointNumber){
		Driver.exec('127.0.0.1','O'+pointNumber+',0');		
	};

	this.getAllNodesStatus = function(){
		// return all nodes status
	};

	this.getAllPointsStatus = function(){
		// return all nodes status
	};

	this.createNewNode = function(node){

	};

	this.deleteNode = function(nodeIp){

	};
};

module.exports = new Delegator;