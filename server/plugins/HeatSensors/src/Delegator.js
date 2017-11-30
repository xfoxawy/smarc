// var Delegator = function(Core){
// 	var e = require('./drivers/'+ Config.driver +'DriverTest');

// 	var Driver = new e(Core);

// 	if( Config.driver == "telnet" ) require("./Connection").subscribe(Driver);

//     // get all heat sensors
// 	this.heats = function(){
//         var mapPoints = Transformer.transformPoints(Driver.mapPoints());
//         return mapPoints;
// 	};

//     this.getRoomPoints = function(id){
//         var roomPoints = Transformer.transformPoints(Driver.roomPoints(id));
//         return roomPoints;
//     };
// };

// module.exports = Delegator;

var Transformer = require('./Transformer');
var Config      = require('./Config');

// create a unique, global symbol name
const HeatDelegator_KEY = Symbol.for("heat.delegator.heatsensors");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
var globalSymbols     = Object.getOwnPropertySymbols(global);
var hasHeatDelegator = (globalSymbols.indexOf(HeatDelegator_KEY) > -1);

if (!hasHeatDelegator){
    global[HeatDelegator_KEY] = (function(){
        var Driver = {};
        return {
            init: function(Core){
                if (!this.Driver) {
                    var e = require('./drivers/'+ Config.driver +'DriverTest');
                    this.Driver = new e(Core);
                    if( Config.driver === "telnet" ) require("./Connection").subscribe(Driver);
                }
            },

            // get all Heat sensors
            heats: function(){
                var mapPoints = Transformer.transformPoints(this.Driver.mapPoints());
                return mapPoints;
            },

            getRoomPoints: function(id){
                var roomPoints = Transformer.transformPoints(this.Driver.roomPoints(id));
                return roomPoints;
            }
        }
    })();
}

// define the singleton API
var heatDelegatorSingleton = {};
Object.defineProperty(heatDelegatorSingleton, "instance", {
  get: function(){
    return global[HeatDelegator_KEY];
  }
});

// ensure the API is never changed
Object.freeze(heatDelegatorSingleton);

// export the singleton API only
module.exports = heatDelegatorSingleton;
