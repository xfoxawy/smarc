var Config = require('./Config');

var Delegator = function(Core){
	var LightDriverModel = require('../../Light/src/drivers/' + Config.driver +'DriverTest');
	var LightDriver      = new LightDriverModel(Core);

	this.scene = function(names){
		LightDriver.scene(names);
	};
};

module.exports = Delegator;
