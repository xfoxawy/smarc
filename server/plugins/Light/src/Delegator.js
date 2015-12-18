var Telnet = require("./Connection");

var Delegator = function(Core){
	var e = require('./Driver');
	var Driver = new e(Core);
	Telnet.subscribe(Driver);
	
	this.toggle = function(pointNumber){
		Driver.toggle(pointNumber);
	};

	this.getAllStatus = function(){
		return Driver.mapPoints();
	};

	this.createNewNode = function(nodeObject){
		Driver.createNewNode(nodeObject);
	};

	this.deleteNode = function(nodeIp){
		Driver.deleteNode(nodeIp);
	};
};

module.exports = Delegator;