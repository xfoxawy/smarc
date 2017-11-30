var Transformer = require('./Transformer');
var Config      = require('./Config');

var Delegator = function(Core){
	var e = require('./drivers/'+ Config.driver +'DriverTest');

	var Driver = new e(Core);

	if( Config.driver == "telnet" ) require("./Connection").subscribe(Driver);


	this.up = function(id){
		Driver.up(id);
	};

	this.down = function(id){
		Driver.down(id);
	};

	this.stop = function(id){
		Driver.stop(id);
	};

	this.motors = function(){
        var mapPoints = Transformer.transformPoints(Driver.mapPoints());
        return mapPoints;
	};

    this.getRoomPoints = function(id){
        var roomPoints = Transformer.transformPoints(Driver.roomPoints(id));
        return roomPoints;
    };
};

module.exports = Delegator;
