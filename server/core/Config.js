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
    env: "development",
    log: true,
    logType : 'db', // or file
    logFile : __dirname + '/log.txt',
    logDBModel : 'logs',
    pluginsDir: __dirname + '/../plugins/',
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
    },
    filesystem : [
        {
            default : true,
            driver : 'localstorage',
            settings : {
                directory : __dirname + '/../../localstorage'
            }
        }
    ],
};

module.exports = Config;
