/**
 * require modules
 */
var express     = require("express");
var bodyParser  = require("body-parser");
var Core        = {};
    Core.app    = express();
var http        = require("http").Server(Core.app);
    Core.io     = require('socket.io')(http);
var Config      = require("./Config");
var IOC         = require("./IOC");
var path        = require("path");
var MongoClient = require('mongodb').MongoClient;
var crossOriginEnable = require('./Middlewares/crossOriginEnableMiddleware');

/**
 * setup Database Connection
 */
MongoClient.connect('mongodb://'+ Config.db.host +':'+ Config.db.port +'/'+ Config.db.name).then(
// connect success with database
function(db){
    /**
     * save database connection to Core to be ble to pass it to plugins
     */
    Core.db = db;

    /**
     * console.log request info.
     * enable fo development
     */
    if (Config.env == "development") {
        var morgan       = require('morgan');
        var responseTime = require('response-time');
        Core.app.use(morgan('dev'));
        Core.app.use(responseTime());
    };

    /**
     * middlewares for express
     * @description [crossOriginEnable] for anable cross origin to allow server recive reqs from other domains
     */
    Core.app.use(crossOriginEnable);
    Core.app.use(express.static('./'));
    Core.app.use(bodyParser.urlencoded({ extended: false }));
    Core.app.use(bodyParser.json({limit : '1mb'}));

    /**
     * load Plugins from IOC container
     */
    IOC.loadPlugins(Core);

    /**
     * start Socket.IO
     */
    Core.io.on('connection', function(socket){
        console.log('IO detect new Client');
        // send back current status to this socket
        socket.emit("overallStatus", {one: "One", two: "Two"});

        // socket.on('disconnect', function(){
        //     console.log('user disconnected');
        // });
    });
},
// connect failed with database
function(err){
    throw err;
});

http.listen(3050, function(){
    console.log('listening on *:3050');
});
