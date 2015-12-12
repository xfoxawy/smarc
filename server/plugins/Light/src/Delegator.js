var Telnet = require("./Connection");

var Delegator = function(Core){
	var e = require('./Driver');
	var Driver = new e(Core);
	Telnet.subscribe(Driver);

	this.getNodes = function(){
		return Driver.mapPoints();
	};
	
	this.turnOn = function(pointNumber){
		Driver.exec('192.168.0.177','O'+pointNumber+',1');
	};

	this.turnOff = function(pointNumber){
		Driver.exec('192.168.0.177','O'+pointNumber+',0');		
	};

	this.getAllNodesStatus = function(){
		// return all nodes status
	};

	this.getAllPointsStatus = function(){
		// return all nodes status
	};

	this.createNewNode = function(node){
		Driver.createNewNode(node);
	};

	this.deleteNode = function(nodeIp){

	};
};

module.exports = Delegator;