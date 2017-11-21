var Transformer = require('./Transformer');
var Config      = require('./Config');

var Delegator = function(Core){
	var e = require('./drivers/'+ Config.driver +'DriverTest');

	var Driver = new e(Core);

	if( Config.driver == "telnet" ) require("./Connection").subscribe(Driver);

    // get all heat sensors
	this.heats = function(){
		return Driver.mapPoints();
	};
};

module.exports = Delegator;
