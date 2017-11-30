var Transformer = require('./Transformer');
var Config      = require('./Config');

// create a unique, global symbol name
const MotionDelegator_KEY = Symbol.for("motion.delegator.motionsensors");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
var globalSymbols     = Object.getOwnPropertySymbols(global);
var hasMotionDelegator = (globalSymbols.indexOf(MotionDelegator_KEY) > -1);

if (!hasMotionDelegator){
    global[MotionDelegator_KEY] = (function(){
        var Driver = {};
        return {
            init: function(Core){
                if (!this.Driver) {
                    var e = require('./drivers/'+ Config.driver +'DriverTest');
                    this.Driver = new e(Core);
                    if( Config.driver === "telnet" ) require("./Connection").subscribe(Driver);
                }
            },

            // get all motion sensors
            motions: function(){
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
var motionDelegatorSingleton = {};
Object.defineProperty(motionDelegatorSingleton, "instance", {
  get: function(){
    return global[MotionDelegator_KEY];
  }
});

// ensure the API is never changed
Object.freeze(motionDelegatorSingleton);

// export the singleton API only
module.exports = motionDelegatorSingleton;
