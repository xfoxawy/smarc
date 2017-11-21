var Telnet      = require("./Connection");
var Transformer = require('./Transformer');
var Config      = require('./Config');

var Delegator = function(Core){
    var e = require('./drivers/'+ Config.driver +'DriverTest');
    var Driver = new e(Core);
    Telnet.subscribe(Driver);

    this.open = function(pointNumber){
        Driver.open(pointNumber);
    };

    this.getAllStatus = function(){
        var transformedPointsValues = Transformer.transformPoints(Driver.mapPoints());
        return transformedPointsValues;
    };
};

module.exports = Delegator;
