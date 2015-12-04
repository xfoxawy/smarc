var Telnet = require('./Connection');
var EventEmitter = new(require('events').EventEmitter);
/**
 * Light Plugin Driver
 */

var Driver = function(Core){
	var self = this;
	var model = "light";
	
	// load nodes from db
	this.nodes = [{
		name : 'node1',
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
	// connect
	(function connectNodes(){
			loadNodes(function(nodes){
				for (var i = 0; i < nodes.length ; i++) 
				{
					Telnet.connect(nodes[i].ip,nodes[i].port);
				}
			});
	}());
	// function load nodes from db
	function loadNodes(cb){
		db.collection(model).find().toArray(function(err, docs){
			if(err) throw err;
			else
				self.nodes.push(docs);
				cb(self.nodes);
		});
	};
	// function to create new node
	function saveNode(node){
		Core.db.collection(model).insertOne(node, function(err,res){
			if(err) throw err;
			else
				this.nodes.push(node);
		});
	};

	function destoryNode(ip){
		var node = findNodeByIp(ip);
		// disconnect node first
		Telnet.disconnect(node.socket);
		// delete it from nodes array
		delete node;
		// delete it from db
		db.collection(model).findAndRemove({ip : ip}, function(err){
			if(err) throw err;
		});
	};

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
	};

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
	};

	/**
	 * [update description]
	 * @param  {[type]} status [description]
	 * @param  {[type]} args   [description]
	 * @return {[type]}        [description]
	 */
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

	/**
	 * [exec description]
	 * @param  {[type]} nodeIp [description]
	 * @param  {[type]} order  [description]
	 * @return {[type]}        [description]
	 */
	this.exec = function(nodeIp,order){
		EventEmitter.once("light/connected/"+nodeIp,function(){
			findNodeByIp(nodeIp).socket.write(order);
		});
	};

	this.createNewNode = function(node){
		if(!node === null && typeof node !== 'object')
			throw "type of input must be an object";
		else if(!node.ip || !node.name || !node.points.length)
			throw "invalid properties of such a node";
		else if(findNodeByIp(node.ip))
			throw "node ip exists already";
		else
			saveNode(node);

	};

	this.deleteNode = function(nodeIp){
		destoryNode(nodeIp);
	};

	this.getStatus = function(type){

	};
};

// subscribing my driver to telnet connection manager
Telnet.subscribe(module.exports = new Driver);
 