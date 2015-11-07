// connect to core
// inherit from core a config file holds commands for different components agains its routes
// example :{
// 	"light" : {
// 		"turnOn" : {
// 			method : "post",
// 			url     : "/whatever/id/execute"
// 		}
// 	}
// }
// load express.js
// sockets init
// implement routes against the actions of compnent controllers

// example

app.get('/light/turnOn/1', function(req, res){
	core.light(1,turnon, callback(status){
		if(status) res.json("ok");
		else res.json("error");
	});
});