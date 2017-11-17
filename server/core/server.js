/**
 * require modules
 */
var express     = require("express");
var bodyParser  = require("body-parser");
var Core        = {};
    Core.app    = express();
var server      = require('http').Server(Core.app);
    Core.io     = require('socket.io')(server);
var Config      = require("./Config");
    Core.Config = Config;
var IOC         = require("./IOC");
var path        = require("path");
var MongoClient = require('mongodb').MongoClient;

/**
 * setup Database Connection
 */
MongoClient.connect('mongodb://'+ Config.db.host +':'+ Config.db.port +'/'+ Config.db.name).then(
// connect success with database
function(db){
    console.log('DB Connected');
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
    Core.app.use(express.static('./'));
    Core.app.use(bodyParser.urlencoded({ extended: false }));
    Core.app.use(bodyParser.json({limit : '1mb'}));

    /**
     * this Route is just for check if the mobile app can comunicate with the server
     * @retun {JSON} msg OK.
     */
    Core.app.get('/check_connection', function(req,res){
        res.status(200).json({msg : 'ok'});
    });

    /**
     * load Plugins from IOC container
     */
    Core.app.set('globalIp', '127.0.0.1');
    IOC.loadPlugins(Core);
},
// connect failed with database
function(err){
    throw err;
});

server.listen(3050, function(){
    console.log('listening on *:3050');
});
