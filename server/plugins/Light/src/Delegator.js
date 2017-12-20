var Transformer  = require('./Transformer');
var Config       = require('./Config');
var globalConfig = require('../../../core/Config');

var Delegator = function(Core){
    var driverPath = (globalConfig.env === 'development') ? './drivers/'+ Config.driver +'DriverTest' : './drivers/'+ Config.driver +'Driver';
	var e          = require(driverPath);
	var Driver     = new e(Core);

	if( Config.driver == "telnet" ) require("./ConnectionLight").subscribe(Driver);

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

	// deprecated, will remove in the future
    this.getRooms = function(){
        return Transformer.transformRooms(Driver.getRooms());
    };

	this.scene = function(names){
		Driver.scene(names);
	};

	this.getRoomPoints = function(id){
		var roomPoints = Transformer.transformPoints(Driver.roomPoints(id));
		return roomPoints;
	};

    Core.plugins.Light = this;
};

module.exports = Delegator;
