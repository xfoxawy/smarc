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
    pluginsDir: path.resolve() + "/plugins/",
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
