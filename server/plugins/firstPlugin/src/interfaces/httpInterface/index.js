// connect to core
// inherit from core a config file holds commands for different components agains its routes
// example :{
// 	"light" : {
// 		"/whatever/id/execute" : {
// 			method : "post",
// 			controller     : "core.light"
// 		}
// 	}
// }
// load express.js
// sockets init
// implement routes against the actions of compnent controllers

module.exports = function(app){
    // app.get('/light/turnOn/1', function(req, res){
    // 	core.light(1,turnon, callback(status){
    // 		if(status) res.json("ok");
    // 		else res.json("error");
    // 	});
    // });
    app.get('/test1', function(req, res){
        return res.json({
            message: "test page loaded !!"
        });
    });

    app.get('/test2', function(req, res){
        return res.json({
            message2: "test page 2 loaded successfully !!"
        });
    });
};
