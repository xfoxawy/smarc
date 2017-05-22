'use strict';

module.exports = function(Core){

    // setup SocketIO.
    Core.motorIO = Core.io.of('/motors');

    Core.motorIO.on('connection', function(socket){
        console.log('motor connected');
    });

    Core.motorIO.on('disconnect', function(socket){
        console.log('motor leaved');
    });

    // Core.motorIO.emit('hi', 'everyone!');
};
