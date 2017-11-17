var Transformer = require('./Transformer');
var Config      = require('./Config');

var Delegator = function(Core){
	var e = require('./drivers/'+ Config.driver +'DriverTest');

	var Driver = new e(Core);

	if( Config.driver == "telnet" ) require("./Connection").subscribe(Driver);

	this.fire = function(id){
		Driver.fire(id);
	};

	this.sirens = function(){
		return Driver.sirens();
	};
};

module.exports = Delegator;
