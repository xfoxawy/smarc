var Telnet = require("./Connection");
var Transformer = require('./Transformer');

var Delegator = function(Core){
	var e = require('./Driver');
	var Driver = new e(Core);
	Telnet.subscribe(Driver);
	
	this.toggle = function(pointNumber){
		Driver.toggle(pointNumber);
	};

	this.getAllStatus = function(){
		var transformedPointsValues = Transformer.transform(Driver.mapPoints());
		return transformedPointsValues;
	};

	this.createNewNode = function(nodeObject){
		Driver.createNewNode(nodeObject);
	};

	this.deleteNode = function(nodeIp){
		Driver.deleteNode(nodeIp);
	};

	this.getRooms =  function(){
		return Driver.getRooms();
	};
};

module.exports = Delegator;