'use strict';

module.exports = function(Core){

    // setup SocketIO.
    Core.motionSensorIO = Core.io.of('/motion_sensors');

    Core.motionSensorIO.on('connection', function(socket){
        console.log('motionSensor connected');
    });

    Core.motionSensorIO.on('disconnect', function(socket){
        console.log('motionSensor leaved');
    });

    // Core.motionSensorIO.emit('hi', 'everyone!');
};
