var net = require('net');
var TelnetInput = require('telnet-stream').TelnetInput;
var TelnetOutput = require('telnet-stream').TelnetOutput;

// var socket = net.createConnection(23, '127.0.0.1', function() {
//     //var telnetInput = new TelnetInput();
//     //var telnetOutput = new TelnetOutput();
//    	//
//     //socket.pipe(telnetInput).pipe(process.stdout);
//     //process.stdin.pipe(telnetOutput).pipe(socket);
//     socket.pipe(process.stdout);
//     process.stdin.pipe(socket);
// });

var socket = net.connect({addres : '127.0.0.1', port:23}, function(){
	console.log("all good");
});

socket.on('data', function(data){
	console.log(data.toString());
});

socket.on('end', function(){
	console.log('connection Ended');
});

socket.on('error', function(err){
	console.log("there was an error " + err);
});

socket.write('help','utf8', function(res){
	console.log(res);
});


 
