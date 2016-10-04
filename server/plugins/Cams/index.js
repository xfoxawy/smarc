/**
 * require modules
 */
var Routes = require("./src/interfaces/httpInterface");
var d = require("./src/Delegator");

/**
 * firstPlugin Container
 */
var Cams = function(){
    this.register = function(Core){
        var Delegator = new d(Core);
        Core.stream = Core.io.of('/stream').on('connection', function(socket){
            console.log('stream connected');
            socket.on('stream', function(data){
                if (data == 'stop') {
                    Delegator.quit(socket);
                } else {
                    Delegator.stream(data, socket);
                }
            });
            socket.on('disconnect', function(){
                Delegator.quit(socket);
            });
            socket.on('error', function(err){
                console.log(err);
            });
        });

        /**
         * load Routes
         */
        Routes(Core);
    };
};

module.exports = new Cams;


// GPRS
// sim900 
