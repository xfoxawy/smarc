'use strict';

module.exports = function(Core){

    // setup SocketIO.
    Core.heatSensorIO = Core.io.of('/heat_sensors');

    Core.heatSensorIO.on('connection', function(socket){
        console.log('heatSensor connected');
    });

    Core.heatSensorIO.on('disconnect', function(socket){
        console.log('heatSensor leaved');
    });

    // Core.heatSensorIO.emit('hi', 'everyone!');
};
