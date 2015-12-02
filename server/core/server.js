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
 */
Core.app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Route for testing
 */
Core.app.get("/smarc", function(req, res){
    return res.sendFile(path.resolve() + "mobileTest/main.html");
});

Core.app.post("/smarc/posttest", function(req, res){
    Core.io.emit('incomeReq', msg);
    return res.json(req.body);
});

/**
 * load Plugins from IOC container
 */
IOC.loadPlugins(Core);

/**
 * start Socket.IO
 */
Core.io.on('connection', function(socket){
    console.log('IO detect new Client');
    // socket.on('incomeReq', function(msg){
    //     console.log(msg);
    // });
    // socket.on('disconnect', function(){
    //     console.log('user disconnected');
    // });
});

http.listen(3050, function(){
    console.log('listening on *:3050');
});
