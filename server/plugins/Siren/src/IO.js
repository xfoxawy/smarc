'use strict';

module.exports = function(Core){

    // setup SocketIO.
    Core.sirenIO = Core.io.of('/sirens');

    Core.sirenIO.on('connection', function(socket){
        console.log('siren connected');
    });

    Core.sirenIO.on('disconnect', function(socket){
        console.log('siren leaved');
    });

    // Core.sirenIO.emit('hi', 'everyone!');
};
