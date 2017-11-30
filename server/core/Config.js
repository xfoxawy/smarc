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
    env: "development", // production
    log: true,
    logType : 'db', // or file
    logFile : __dirname + '/log.txt',
    logDBModel : 'logs',
    pluginsDir: __dirname + '/../plugins/',
    // plugins just defined the order of loading, any unsorted plugins will load in alphabit order
    plugins: [
        'Auth',
        'Logger',
        'Light',
        'AccessControl',
        'Doors',
        'HeatSensors',
        'MotionSensors',
        'SmokeSensors',
        'Motors',
        'Siren',
        'Rooms'
    ],
    secret: "randomstringtousedinencryption",
    jwtStorage: "file", // or cache
    db: {
        'host': '127.0.0.1',
        'port': 27017,
        'name': 'smarc',
        'username': '',
        'password': '',
        'options': {
            'db': 'admin'
        }
    }
};

module.exports = Config;
