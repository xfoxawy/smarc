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
    pluginsDir: path.resolve() + "/plugins/"
};

module.exports = Config;
