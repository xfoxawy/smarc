// create interface IntegrationTelnet
// contains
// setNodeStatusConnectedLight
// setNodeStatusErrorLight
// updateNodePointsStatusLight

// implement this interface into every Driver
// when telnet return response
// parse it and define it's type
// also define which driver should notify
// then notify it

var net = require('net');

var Connection = function(Core){
    var self = this;
    this.nodesCollection = "nodes";
    this.reconnectionInterval = 2000; // reconnection to dead nodes interval
    this.maxTries = 10 ; // reconnection to dead nodes max tries
    this.drivers = [];
    this.nodes = [];
    this.errors = [];
    this.deadNodes = [];
    this.db = Core.db;

    this.connect = function(node){
        var nodeObj = node;

        var socket = net.connect(nodeObj.port, nodeObj.ip, function(){
            console.log('connecting to ' + nodeObj.ip);
        });

        // set connection params
        socket.setEncoding('ascii');
        socket.setKeepAlive('enable');
        socket.setNoDelay(true);

        // handle on connect
        socket.on('connect', function(){
            console.log(nodeObj.ip + ' connected');
            nodeObj.connected = true;
            nodeObj.socket = socket;

            // notify all drivers to update there status
            self.notifyConnectedNode(nodeObj);
        });

        // handle on data
        var str = ''; // empty string to hold up coming data from socket
        socket.on('data', function(data){
            if(!/(\n)/.test(data)) {
                str += data
            } else {
                str += data;
                str = str.trim();

                self.notify(nodeObj, str);
                str = '';
            }
        });
        
        socket.on('drain', function(e){
            console.log("the controller has been drained " + e);
        });
        // handle on connection timeout
        socket.on('timeout', function(){
            console.log(nodeObj.ip +" socket has been timeouted");
            nodeObj.connected = false;
            delete nodeObj.socket;
            self.pushInDeadNodes(nodeObj);
        });

        // handle on connection end
        socket.on('end', function(){
            console.log(nodeObj.ip +" socket has been closed");
            nodeObj.connected = false;
            delete nodeObj.socket;
            self.pushInDeadNodes(nodeObj);
        });

        // handle connection error
        socket.on('error', function(error){
            nodeObj.connected = false;
            self.errors.push({
                node_ip: nodeObj.ip ,
                error
            });
            self.pushInDeadNodes(nodeObj);
            console.log('this ' + nodeObj.ip + " has some connection issues : " + error);
        });
    };

    this.disconnect = function(socket){
        socket.destroy();
    };

    // driver = {
    //     telnetChar: "O",
    //     name: "light",
    //     driver: Driver
    // }
    this.subscribe = function(driver){
        this.drivers.push(driver);
    };

    // driver = {
    //     telnetId: "I",
    //     name: "light",
    //     driver: Driver
    // }
    // driver = {
    //     telnetId: "",
    //     name: "motor",
    //     driver: Driver
    // }

    this.unsubscribe = function(driver){
        for(var i = 0; i < this.drivers.length; i ++) {
            if(this.drivers[i].name === driver.name) {
                this.drivers.splice(i, 0);
                break;
            }
        }
    };

    // light
    // I2,0
    // I2,0-I3,1...
    this.notify = function(node, data) {
        // remove this check when move to Production
        if (data != "OK") {
            var driver = self.getDriverByResponse(data);
            driver.update(node, data);
        }
    };

    this.notifyConnectedNode = function(node) {
        for(var i =0; i < self.drivers.length; i++) {
            self.drivers[i].nodeConnected(node);
        }
    };

    this.getDriverByResponse = function(data) {
        var firstChar = data.charAt(0);
        for(var i = 0; i < self.drivers.length; i++) {
            if (self.drivers[i].telnetId === firstChar) {
                return self.drivers[i];
            }
        }
        return false;
    }

    this.connectNodes = function() {
        self.loadNodes(function(success){
            if (success) {
                for (var i = 0; i < self.nodes.length ; i++) {
                    self.connect(self.nodes[i]);
                }
            }
        });
    }

    this.isNodeConnected = function(nodeId) {
        var node = self.nodes.filter(function(node) {
            return node._id.toString === nodeId.toString;
        })[0] || {};

        return node.connected || false;
    }

    this.run = function(nodeId, command) {
        var node = self.findNodeById(nodeId);
        if(node.connected) {
            node.socket.write(command + '\r\n');
            console.log("this command has been sent => " + command + " To: " + node.ip);
        } else {
            console.log(node.ip + " is disconnected");
        }
    }

    this.loadNodes = function(cb) {
        self.db.collection(self.nodesCollection).find({}).toArray(function(err, docs){
            if(err) throw err;
            if(docs.length) {
                self.nodes = self.nodes.concat(docs);
                return cb(true);
            }
            return cb(false);
        });
    }

    // responsible of reconnection for dead nodes 
    this.reConnectLight = function() {
        if(self.deadNodes.length) {
            self.deadNodes.forEach(function(node){
                if(node.tries < self.maxTries){
                    self.connect(node);
                    node.tries++;
                }
            });
        }     
    }

    this.pushInDeadNodes = function(node) {
        for (var i = 0; i < self.deadNodes.length; i++) {
            if(self.deadNodes[i]._id.toString() === node._id.toString())
                return true;
        }
        node.tries = 0;
        self.deadNodes.push(node);
    }

    // helper function to get node by ip
    this.findNodeById = function(id){
        for (var i = 0; i < self.nodes.length; i++) {
            if (self.nodes[i]._id.toString() === id.toString()) {
                return self.nodes[i];
            }
        }

        return false;
    };

    /**
     * Init Connection
     */
    this.connectNodes();
    // interval to check if there any dead nodes and try to reconnect to them
    setInterval(self.reConnectLight, this.reconnectionInterval);
};

module.exports = Connection;
