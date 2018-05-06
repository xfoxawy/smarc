/**
 * require modules
 */
var path = require("path");

/**
 * Config options for the system
 * @type {Object}
 * @return {Object} [all options as object]
 */
var Config = {
    env: "production", // production, development
    log: true,
    logType : 'db', // or file
    logFile : __dirname + '/log.txt',
    logDBModel : 'logs',
    pluginsDir: __dirname + '/../plugins/',

    // load just these Plugins in this Order
    plugins: [
        'Auth',
        // 'Logger',
        'Light',
        'Motors',
        'Rooms',
        'Scenes',
        // 'AccessControl',
        // 'Doors',
        // 'HeatSensors',
        // 'MotionSensors',
        // 'SmokeSensors',
        // 'Siren',
    ],
    secret: "randomstringtousedinencryption",
    jwtStorage: "file", // or cache
    db: {
        'host': '127.0.0.1',
        'port': 27017,
        'name': 'new_smarc',
        'username': '',
        'password': '',
        'options': {
            'db': 'admin'
        }
    }
};

module.exports = Config;
