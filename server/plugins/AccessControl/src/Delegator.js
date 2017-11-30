var Transformer  = require('./Transformer');
var Config       = require('./Config');
var globalConfig = require('../../../core/Config');

var Delegator = function(Core){
    var driverPath = (globalConfig.env === 'development') ? './drivers/'+ Config.driver +'DriverTest' : './drivers/'+ Config.driver +'Driver';
	var e          = require(driverPath);
	var Driver     = new e(Core);

	if( Config.driver === "telnet" ) require("./Connection").subscribe(Driver);

	this.open = function(id){
		Driver.open(id);
	};

	this.access_controls = function(){
        var mapPoints = Transformer.transformPoints(Driver.mapPoints(id));
        return mapPoints;
	};

    this.getRoomPoints = function(id){
        var roomPoints = Transformer.transformPoints(Driver.roomPoints(id));
        return roomPoints;
    };
};

module.exports = Delegator;
