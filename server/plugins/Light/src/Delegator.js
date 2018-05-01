var Transformer  = require('./Transformer');
var Config       = require('./Config');
var globalConfig = require('../../../core/Config');

var Delegator = function(Core){
    var driverPath = (globalConfig.env === 'development') ? './drivers/'+ Config.driver +'DriverTest' : './drivers/'+ Config.driver +'Driver';
	var e          = require(driverPath);
	var Driver     = new e(Core);

	this.toggle = function(pointId){
		Driver.toggle(pointId);
	};

	this.points = function(cb){
		Driver.points(function(success) {
			if (success) {
				var transformedPointsValues = Transformer.transformPoints(Driver.mappedPoints);
				return cb(transformedPointsValues);
			}

			return cb([]);
		});
	};

	// this.createNewNode = function(nodeObject){
	// 	Driver.createNewNode(nodeObject);
	// };

	// this.deleteNode = function(nodeIp){
	// 	Driver.deleteNode(nodeIp);
	// };

	// // deprecated, will remove in the future
 //    this.getRooms = function(){
 //        return Transformer.transformRooms(Driver.getRooms());
 //    };

	// this.scene = function(names){
	// 	Driver.scene(names);
	// };

	// this.getRoomPoints = function(id){
	// 	var roomPoints = Transformer.transformPoints(Driver.roomPoints(id));
	// 	return roomPoints;
	// };

    Core.plugins.Light = this;
};

module.exports = Delegator;
