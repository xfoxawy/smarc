var Telnet = require('./Connection');
var EventEmitter = new(require('events').EventEmitter);
/**
 * Light Plugin Driver
 */

var Driver = function(){
	var self = this;

	
	// load nodes from db
	this.nodes = [{
		ip : '127.0.0.1',
		port : 23,
		points : [{
			i :  0,
			s : false
		},{
			i : 1,
			s : false
		},{
			i : 2,
			s : false
		}]
	}];
	// connect and emit event
	(function connectNodes(){
			for (var i = 0; i < self.nodes.length ; i++) 
			{
				Telnet.connect(self.nodes[i].ip,self.nodes[i].port);
			}
	}());

	// helper function to get node by ip
	function findNodeByIp(ip){
		for (var i = 0; i < self.nodes.length; i++) 
		{
			if(self.nodes[i].ip === ip)
			{
				return self.nodes[i];
			}
		}
		return false;
	};

	function findPointInNode(node ,pointId){
		for(var i = 0; i < node.points.length; i++)
		{
			if(node.points[i].i == pointId)
			{
				return node.points[i];
			}
		}
		return false;
	};

	// update node status
	function setNodeStatusConnected(ip, socket){
		var node = findNodeByIp(ip);
		node.connected = true;
		node.socket = socket;
		EventEmitter.emit("light/connected/"+ip);
		return true;
	};

	function setNodeStatusDisconnected(ip){	
		var node = findNodeByIp(ip);
		node.connected = false;
		delete node.socket;
		return true;
	}

	function updateNodePointsStatus(ip, data){
		var node = findNodeByIp(ip);
		var data = data.toString().replace(/(\r\n|\n|\r)/gm,"");
		if(data === 'OK')
		{
			console.log("yes it is ok");
		}
		else if(/^I\d,\d/i.test(data))
		{
			var pointId = data.slice(1,2);
			var newstatus = (Number(data.split(',')[1]) == 0) ? false : true;
			var point = findPointInNode(node,pointId);
			point.s = newstatus;
		}
		else
		{
			console.log(data);
		}
	}

	this.update = function(status , args){
		switch(status){			
			case 'connected': 
					setNodeStatusConnected(args.ip,args.socket);
				break;
			case 'end':
					setNodeStatusDisconnected(args.ip); 
				break;
			case 'timeout':
					setNodeStatusDisconnected(args.ip); 
				break;
			case 'data':
					updateNodePointsStatus(args.ip, args.data);
				break;
		}
	};

	this.exec = function(nodeIp,order){
		EventEmitter.once("light/connected/"+nodeIp,function(){
			findNodeByIp(nodeIp).socket.write(order);
		});
	};
};

// subscribing my driver to telnet connection manager
Telnet.subscribe(module.exports = new Driver);
 