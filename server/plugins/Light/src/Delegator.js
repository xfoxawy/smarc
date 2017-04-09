var Transformer = require('./Transformer');
var Config      = require('./Config');

var Delegator = function(Core){
	var e = require('./drivers/'+ Config.driver +'Driver');

	var Driver = new e(Core);

	if( Config.driver == "telnet" ) require("./Connection").subscribe(Driver);

	this.toggle = function(pointNumber){
		Driver.toggle(pointNumber);
	};

	this.getAllStatus = function(){
		var transformedPointsValues = Transformer.transformPoints(Driver.mapPoints());
		return transformedPointsValues;
	};

	this.createNewNode = function(nodeObject){
		Driver.createNewNode(nodeObject);
	};

	this.deleteNode = function(nodeIp){
		Driver.deleteNode(nodeIp);
	};

	this.getRooms = function(){
		return Transformer.transformRooms(Driver.getRooms());
	};

	this.scene = function(names){
		Driver.scene(names);
	};
};

module.exports = Delegator;
