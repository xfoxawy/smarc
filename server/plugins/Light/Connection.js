var net = require('net');

/**
 * Telnet Connection Manager for lighting system
 */
var Connection = function(){
	var self = this;
	this.drivers = [];

	this.connect = function(ip,port,cb){
		var socket = net.connect({ip,port}, function(){
			//console.log('connecting to ' + ip);
		});
		// set connection params
		socket.setEncoding('utf8');
		socket.setKeepAlive('enable');
		socket.setNoDelay(true);
		// handle on connect
		socket.on('connect', function(){
			//console.log(ip + ' connected');
			process.emit('light/sockets/'+ip, socket);
			self.notify('connected',{ip,socket});
		});

		// handle on data
		socket.on('data', function(data){
			//console.log("some data over " + ip);
			self.notify('data', {ip, data});
		});
		
		// handle on connection timeout
		socket.on('timeout', function(){
			//console.log(ip +" socket has been timeouted");
			self.notify('timout',{ip})
		});
		
		// handle on connection timeout
		socket.on('end', function(){
			//console.log(ip +" socket has been closed");
			self.notify('end', {ip});
		});
	};

	this.disconnect = function(socket){
		socket.destroy();
	};
};

Connection.prototype.subscribe = function(driver){
	this.drivers.push(driver);		
};

Connection.prototype.remove = function(driver){
	for(var i = 0; i < this.drivers.length; i ++)
	{
		if(this.drivers[i] === driver)
		{
			this.drivers.splice(i,0);
			return true;
		}
	}
};

Connection.prototype.notify = function()
{
	var args = Array.prototype.slice.call(arguments,0);

	for(var i =0; i < this.drivers.length; i++)
	{
		this.drivers[i].update.apply(null, args);
	}
};

module.exports = new Connection;