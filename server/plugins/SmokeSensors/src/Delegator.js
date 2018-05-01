var Transformer = require('./Transformer');
var Config      = require('./Config');

// create a unique, global symbol name
const SmokeDelegator_KEY = Symbol.for("smoke.delegator.smokesensors");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
var globalSymbols     = Object.getOwnPropertySymbols(global);
var hasSmokeDelegator = (globalSymbols.indexOf(SmokeDelegator_KEY) > -1);

if (!hasSmokeDelegator){
    global[SmokeDelegator_KEY] = (function(){
        var Driver = {};
        return {
            init: function(Core){
                if (!this.Driver) {
                    var e = require('./drivers/'+ Config.driver +'Driver');
                    this.Driver = new e(Core);
                    if( Config.driver === "telnet" ) require("./Connection").subscribe(Driver);
                }
            },
            // get all heat sensors
            smokes: function(){
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
var SmokeDelegatorSingleton = {};
Object.defineProperty(SmokeDelegatorSingleton, "instance", {
  get: function(){
    return global[SmokeDelegator_KEY];
  }
});

// ensure the API is never changed
Object.freeze(SmokeDelegatorSingleton);

// export the singleton API only
module.exports = SmokeDelegatorSingleton;
