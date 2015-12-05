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

module.exports = function(Core){
    // Core.app.get('/light/turnOn/1', function(req, res){
    // 	core.light(1,turnon, callback(status){
    //         if(status) {
    //             Core.io.emit('incomeReq', "i'm a socket data");
    //             res.json("ok");
    //         } else { 
    //             res.json("error");
    //         }
    //     });
    // });
    Core.app.get('/test1', function(req, res){
        return res.sendFile( Core.app.get('root') + "mobileTest/main.html" );
    });

    Core.app.get('/test2', function(req, res){
        // ssgdfgdhfgxbcbc
        Core.io.emit('incomeReq', {
            data: "i'm a socket data"
        });
        return res.json({
            message: "request success!!"
        });
    });
};
