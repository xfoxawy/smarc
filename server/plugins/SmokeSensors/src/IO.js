'use strict';

module.exports = function(Core){

    // setup SocketIO.
    Core.smokeSensorIO = Core.io.of('/smoke_sensors');

    Core.smokeSensorIO.on('connection', function(socket){
        console.log('smokeSensor connected');
    });

    Core.smokeSensorIO.on('disconnect', function(socket){
        console.log('smokeSensor leaved');
    });
};
