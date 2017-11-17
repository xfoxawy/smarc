var Transformer = require('./Transformer');
var Config      = require('./Config');

var Delegator = function(Core){
	var e = require('./drivers/'+ Config.driver +'DriverTest');

	var Driver = new e(Core);

	if( Config.driver == "telnet" ) require("./Connection").subscribe(Driver);


	this.open = function(id){
		Driver.open(id);
	};

	this.access_controls = function(){
		return Driver.access_controls();
	};
};

module.exports = Delegator;
