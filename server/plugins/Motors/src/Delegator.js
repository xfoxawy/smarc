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

    this.getRoomMotors = function(id, cb){
        Driver.roomMotors(id, function(err, motors){
            if (err) return cb(true);
            return cb(false, Transformer.transformMotors(motors));
        });
    };

    Core.plugins.Motors = this;
};

module.exports = Delegator;
