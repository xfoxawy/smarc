'use strict';

module.exports = function(Core){

    // setup SocketIO.
    Core.roomsIO = Core.io.of('/rooms');

    Core.roomsIO.on('connection', function(socket){
        console.log('rooms connected');
    });

    Core.roomsIO.on('disconnect', function(socket){
        console.log('rooms leaved');
    });

    // Core.roomsIO.emit('hi', 'everyone!');
};
