'use strict';

module.exports = function(Core){

    // setup SocketIO.
    Core.accessControlIO = Core.io.of('/access_controls');

    Core.accessControlIO.on('connection', function(socket){
        console.log('accessControl connected');
    });

    Core.accessControlIO.on('disconnect', function(socket){
        console.log('accessControl leaved');
    });

    // Core.accessControlIO.emit('hi', 'everyone!');
};
