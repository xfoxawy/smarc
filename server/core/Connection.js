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

var Connection = function(Core){
    var self = this;
    var nodesCollection = "nodes";
    var reconnectionInterval = 2000; // reconnection to dead nodes interval
    var maxTries = 10 ; // reconnection to dead nodes max tries
    this.drivers = [];
    this.nodes = [];
    this.errors = [];
    this.deadNodes = [];

    // init Connection
    // connect with all registered nodes
    var db = Core.db;
    connectNodes();
    // interval to check if there any dead nodes and try to reconnect to them
    setInterval(reConnectLight, reconnectionInterval);

    this.connect = function(node){
        var socket = net.connect(node.port, node.address, function(){
            console.log('connecting to ' + node.address);
        });

        // set connection params
        socket.setEncoding('ascii');
        socket.setKeepAlive('enable');
        socket.setNoDelay(true);

        // handle on connect
        socket.on('connect', function(){
            console.log(node.address + ' connected');
            var node = findNodeById(node._id);
            node.connected = true;
            node.socket = socket;

            // notify all drivers to update there status
            self.notifyConnectedNode(node);
        });

        // handle on data
        var str = ''; // empty string to hold up coming data from socket
        socket.on('data', function(data){
            if(!/(\n)/.test(data)) {
                str += data
            } else if(/(\n)/.test(data)) {
                str += data;
                str = str.trim();

                self.notify(node, str);
                str = '';
            }
        });
        
        socket.on('drain', function(e){
            console.log("the controller has been drained " + e);
        });
        // handle on connection timeout
        socket.on('timeout', function(){
            console.log(node.address +" socket has been timeouted");
            var node = findNodeById(node._id);
            node.connected = false;
            delete node.socket;
            pushInDeadNodes(node);
        });

        // handle on connection end
        socket.on('end', function(){
            console.log(node.address +" socket has been closed");
            var node = findNodeById(node._id);
            node.connected = false;
            delete node.socket;
            pushInDeadNodes(node);
        });

        // handle connection error
        socket.on('error', function(error){
            var node = findNodeById(node._id);
            node.connected = false;
            self.errors.push({
                node_ip: node.ip ,
                error
            });
            pushInDeadNodesLight(node);
            console.log('this ' + node.ip + " has some connection issues : " + node.error);
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
        var driver = getDriverByResponse(data);
        driver.update(node, data);
    };

    this.notifyConnectedNode = function(node) {
        for(var i =0; i < self.drivers.length; i++) {
            self.drivers[i].nodeConnected(node);
        }
    };

    function getDriverByResponse(data) {
        var firstChar = data.charAt(0);
        for(var i =0; i < self.drivers.length; i++) {
            if (self.drivers[i].telnetId === firstChar) {
                return self.drivers[i];
            }
        }
        return false;
    }

    function connectNodes() {
        loadNodes(function(success){
            if (success) {
                for (var i = 0; i < self.nodes.length ; i++) {
                    self.connect(self.nodes[i]);
                }
            }
        });
    }

    this.isNodeConnected = function(nodeId) {
        var node = self.nodes.filter(function(node) {
            return node._id === nodeId;
        })[0] || {};

        return node.connected || false;
    }

    this.run = function(nodeId, command) {
        var node = findNodeById(nodeIp);
        if(node.connected) {
            node.socket.write(command + '\r\n');
            console.log("this command has been sent : " + command + '\r\n');
        } else{
            console.log(node._ip + " is disconnected");
        }
    }

    function loadNodes(cb) {
        db.collection(nodesCollection).find({}).toArray(function(err, docs){
            if(err) throw err;
            
            if(docs.length) {
                self.nodes = self.nodes.concat(docs);
                return cb(true);
            }
            return cb(false);
        });
    }

    // responsible of reconnection for dead nodes 
    function reConnectLight() {
        if(self.deadNodes.length) {
            self.deadNodes.forEach(function(node){
                if(node.tries < maxTries){
                    self.connect(node);
                    node.tries++;
                }
            });
        }     
    }

    function pushInDeadNodes(node) {
        for (var i = 0; i < self.deadNodes.length; i++) {
            if(self.deadNodes[i]._id === node._id)
                return true;
        }
        node.tries = 0;
        self.deadNodes.push(node);
    }

    // helper function to get node by ip
    function findNodeById(id){
        for (var i = 0; i < self.nodes.length; i++) {
            if(self.nodes[i]._id === id) {
                return self.nodes[i];
            }
        }
        return false;
    };

};

module.exports = Connection;
