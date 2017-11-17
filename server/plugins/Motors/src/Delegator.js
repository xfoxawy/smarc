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

	this.motors = function(){
		return Driver.motors();
	};
};

module.exports = Delegator;
