var Transformer  = require('./Transformer');
var Config       = require('./Config');
var globalConfig = require('../../../core/Config');

var Delegator = function(Core){
    var driverPath = (globalConfig.env === 'development') ? './drivers/'+ Config.driver +'DriverTest' : './drivers/'+ Config.driver +'Driver';
    var e          = require(driverPath);
	var Driver     = new e(Core);

	this.up = function(id){
		Driver.up(id);
	};

	this.down = function(id){
		Driver.down(id);
	};

	this.stop = function(id){
		Driver.stop(id);
	};

	this.motors = function(cb){
        Driver.motors(function(success) {
            if (success) {
                var transformedMotorsValues = Transformer.transformMotors(Driver.mappedMotors);
                return cb(transformedMotorsValues);             
            }

            return cb([]);
        });

	};

    // this.scene = function(names){
    //     Driver.scene(names);
    // };

    // this.getRoomPoints = function(id){
    //     var roomPoints = Transformer.transformPoints(Driver.roomPoints(id));
    //     return roomPoints;
    // };

    Core.plugins.Motors = this;
};

module.exports = Delegator;
