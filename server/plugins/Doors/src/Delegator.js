var Telnet      = require("./Connection");
var Transformer = require('./Transformer');
var Config      = require('./Config');
var globalConfig = require('../../../core/Config');

var Delegator = function(Core){
    var driverPath = (globalConfig.env === 'development') ? './drivers/'+ Config.driver +'DriverTest' : './drivers/'+ Config.driver +'Driver';
    var e = require(driverPath);
    var Driver = new e(Core);
    Telnet.subscribe(Driver);

    this.open = function(pointNumber){
        Driver.open(pointNumber);
    };

    this.getAllStatus = function(){
        var transformedPointsValues = Transformer.transformPoints(Driver.mapPoints());
        return transformedPointsValues;
    };

    this.getRoomPoints = function(id){
        var roomPoints = Transformer.transformPoints(Driver.roomPoints(id));
        return roomPoints;
    };
};

module.exports = Delegator;
