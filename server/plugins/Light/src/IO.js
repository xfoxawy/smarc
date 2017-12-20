'use strict';

module.exports = function(Core){

    // setup SocketIO.
    Core.lightIO = Core.io.of('/lights');

    Core.lightIO.on('connection', function(socket){
        console.log('light connected');
    });

    Core.lightIO.on('disconnect', function(socket){
        console.log('light left');
    });

    // Core.lightIO.emit('hi', 'everyone!');
};
