var net = require('net');
/**
 * Telnet ConnectionMotors Manager for motors system
 */
var ConnectionMotors = function(){
	var self = this;
	this.drivers = [];

	this.connect = function(address,port,cb){
		var socket = net.connect(port, address,function(){
			console.log('connecting to ' + address);
		});

		// set connection params
		socket.setEncoding('ascii');
		socket.setKeepAlive('enable');
		socket.setNoDelay(true);
		// handle on connect
		socket.on('connect', function(){
			console.log(address + ' connected');
			process.emit('light/sockets/'+address, socket);
			self.notify('connected',{address,socket});
		});
		
		// handle on data
		var str = ''; // empty string to hold up coming data from socket
		socket.on('data', function(data){
			if(!/(\n)/.test(data))
			{
				str += data 
			}
			else if(/(\n)/.test(data))
			{
				str += data;
				str = str.trim();
				self.notify('data', {address, str});

				str = '';
			}
		});
		
		socket.on('drain', function(e){
			console.log("the controller has been drained " + e);
		});
		// handle on connection timeout
		socket.on('timeout', function(){
			console.log(address +" socket has been timeouted");
			self.notify('timeout',{address})
		});
		
		// handle on connection timeout
		socket.on('end', function(){
			console.log(address +" socket has been closed");
			self.notify('end', {address});
		});

		// handle connection error
		socket.on('error', function(error){
			self.notify('error',{address,error});
		});
	};

	this.disconnect = function(socket){
		socket.destroy();
	};
};

ConnectionMotors.prototype.subscribe = function(driver){
	this.drivers.push(driver);
};

ConnectionMotors.prototype.unsubscribe = function(driver){
	for(var i = 0; i < this.drivers.length; i ++)
	{
		if(this.drivers[i] === driver)
		{
			this.drivers.splice(i,0);
			return true;
		}
	}
};

ConnectionMotors.prototype.notify = function()
{
	var args = Array.prototype.slice.call(arguments,0);
	for(var i =0; i < this.drivers.length; i++)
	{
		this.drivers[i].update.apply(null, args);
	}
};

module.exports = new ConnectionMotors;
