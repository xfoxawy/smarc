var Telnet = require('../Connection');
var EventEmitter = new(require('events').EventEmitter);
var Transformer = require('../Transformer');

/**
 * Light Plugin Telnet Driver
 */

var telnetDriver = function(Core){
    var self = this;
    var model = "motions";
    var db = Core.db;
    var io = Core.motionSensorIO;
    var reconnectionInterval = 200; // reconnection to dead nodes interval
    var maxTries = 10 ; // reconnection to dead nodes max tries
    
    // all nodes placeholder
    this.nodes = [];
    // all errors placeholder
    this.errors = [];
    // hold all points mapped to their original 
    this.mappedPoints = [];
    // hold all rooms in array
    this.rooms = [];
    // holds all dead nodes
    this.deadNodes = [];

    // connect ready nodes in db
    (function connectNodes(){
            // load nodes from database
            loadNodes(function(nodes){});
            // load rooms from database
            loadRooms(function(rooms){
                self.rooms = rooms;
            })
    }());
    publishPointsStatusUpdates();

    function pushInDeadNodes(node)
    {
        for (var i = 0; i < self.deadNodes.length; i++) {
            if(self.deadNodes[i].ip == node.ip)
                return true;
        }
        node.tries = 0;
        self.deadNodes.push(node);
    }

    // function load nodes from db
    function loadNodes(cb){
        db.collection(model).find().toArray(function(err, docs){
            if(err) throw err;
            else if(docs.length){
                docs.forEach(function(doc){
                    self.nodes.push(doc);
                })
            }
            cb(self.nodes);
        });
    };

    // load rooms instaces from database
    function loadRooms (cb){
        db.collection('rooms').find().toArray(function(err, docs){
            if(err) throw err;
            else if(docs.length){
                cb(docs);
            }
        });
    }
    //once nodes loaded we can map them to be able to be used 
    function mapPoints(){
        
        self.mappedPoints = [];
        for (var y = 0; y < self.nodes.length ; y++) 
        {
            for(var x = 0; x < self.nodes[y].points.length; x++)
            {
                // if not saved in db ,, save it
                if(!self.nodes[y].points[x].p){
                    self.nodes[y].points[x].p = "p" + Math.floor((Math.random()*100)+(Math.random()*100));
                    saveMappedPoint(self.nodes[y].name , self.nodes[y].points[x])
                }

                // push if connected
                var newMappedPoint = { 
                    p : self.nodes[y].points[x].p , 
                    i : self.nodes[y].points[x].i ,
                    s : self.nodes[y].points[x].s,
                    r : self.nodes[y].points[x].r,
                    node_name : self.nodes[y].name , 
                    node_status : self.nodes[y].connected, 
                    node_ip : self.nodes[y].ip
                };

                self.mappedPoints.push(newMappedPoint);
            }
        }
        return self.mappedPoints;
    };

    // save the unique mapped id for each point after generating it
    function saveMappedPoint(nodeName ,point)
    {
        db.collection(model).updateOne({"name" : nodeName, "points" : {$elemMatch:{ i : point.i}}}, {$set : {"points.$.p" : point.p}}, function(err,r){
            if(err) throw err;
            else 
                return true;
        });
    };

    function findPointInMappedPoints(pointNumber)
    {
        for (var x = 0; x < self.mappedPoints.length ; x++) 
        {
            if(self.mappedPoints[x].i == pointNumber)
            {   
                return self.mappedPoints[x];
            }
        }
        return false;
    };
    // function to create new node
    function saveNode(node){
        Core.db.collection(model).insertOne(node, function(err,res){
            if(err) throw err;
            else
                self.nodes.push(node);
        });
    };

    // discconect and delete from db 
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

    /**
     * Updates Point's Status in DB
     * @param  {string} nodeName node's name in db
     * @param  {INT} pointID  [description]
     */
    function updatePointStatusDB(nodeName, pointID , pointStatus)
    {
        db.collection(model).update({name : nodeName, points : {$elemMatch: { i : pointID } } }, { $set : { "points.$.s" : pointStatus} }, function(err){
            if(err) throw err;
        });
    }

    /**
     * publish a json statuses of all points to redis server
     */
    function publishPointsStatusUpdates() {
        var status = true;
        // use socketID to publish Events
        setInterval(function(){
            status = !status;
            io.emit('motion', {
                type: 'motion',
                status: status
            });
            // io.emit(JSON.stringify(Transformer.transformPoints(mapPoints())));
        }, 3000);
    }

    // find point object in node
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
        node.socket.write("R\r\n");
        EventEmitter.emit("light/connected/"+ip);
        return true;
    };

    function setNodeStatusDisconnected(ip){ 
        var node = findNodeByIp(ip);
        node.connected = false;
        delete node.socket;
        pushInDeadNodes(node);
        EventEmitter.emit("light/disconnect/"+ip);
        return true;
    };

    function setNodeStatusError(ip, error){
        var node = findNodeByIp(ip);
        node.connected = false;
        self.errors.push({ip , error});
        pushInDeadNodes(node);
        EventEmitter.emit("light/error/"+ip);
        console.log('this ' + ip + " has some connection issues : " + error);
        return true;
    };

    function updateNodePointsStatus(ip, data){
        var node = findNodeByIp(ip);
        if(/(^I\d+,\d$)/igm.test(data))
        {
            var pointId = data.slice(1, -2);
            var newstatus = (Number(data.split(',')[1]) == 0) ? false : true;
            var point = findPointInNode(node, pointId);
            point.s = newstatus;
            updatePointStatusDB(node.name , point.i , newstatus);
            publishPointsStatusUpdates();
            console.log("the status has been updated for " + pointId + " with status " + newstatus);
        }
        else if(/(I)*(\d*\d,[0-1]){1}-/.test(data)){
            // remove I and split on - delimiter
            var all = data.substring(1).trim().split('-');
            // iterate and update the points statuses in memory and db          
            for(var i = 0; i < all.length; i++){
                if(all[i])
                {
                    var pointId = all[i].split(',')[0];
                    var newstatus = (Number(all[i].split(',')[1]) == 0) ? false : true;
                    var point = findPointInNode(node,pointId);
                    updatePointStatusDB(node.name , point , newstatus);
                    point.s = newstatus;
                }
            }
            publishPointsStatusUpdates();
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
                    setNodeStatusConnected(args.address,args.socket);
                break;
            case 'end':
                    setNodeStatusDisconnected(args.address); 
                break;
            case 'timeout':
                    setNodeStatusDisconnected(args.address); 
                break;
            case 'error':
                    setNodeStatusError(args.address, args.error);
                break;
            case 'data':
                    updateNodePointsStatus(args.address, args.str);
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
        var node = findNodeByIp(nodeIp);
        if(node.connected)
        {
            node.socket.write(order + '\r\n');
            console.log("this order has been sent : " + order + '\r\n');
        }
        else{
            console.log(node.ip + " is disconnected");
        }   
    };

    this.turnOn = function(point)
    {
        var order = 'O' + point.i + ',1';
        self.exec(point.node_ip, order);
    };

    this.turnOff =  function(point)
    {
        var order = 'O' + point.i + ',0';
        self.exec(point.node_ip, order);
    };

    this.toggle = function(pointNumber){
        var pointNumber = pointNumber || '';

        mapPoints();

        var point = findPointInMappedPoints(pointNumber);

        if(point.node_status === true)
        {
            if(point.s === false)
            {
                self.turnOn(point);
            }
            else if(point.s === true){
                self.turnOff(point);
            }
            else {
                throw "unknown point status , point number:-> " + pointNumber + " node ip:-> " + point.node_ip ;
            }
        }
        else if(point.node_status === false){
            console.log("its not connected");
        }
    };

    this.scene = function(rowCommand){
        mapPoints();

        // for each point in rowCommand check the current status for this point
        // if the status in rowCommand same as the real status ignore the point
        // if NOT then change the status
        for( var pointName in rowCommand ){
            var point = findPointInMappedPoints( pointName );
            if(point.node_status === true)
            {
                if( point.s != rowCommand[pointName] && point.s === false )
                {
                    self.turnOn(point);
                }
                else if( point.s != rowCommand[pointName] && point.s === true ){
                    self.turnOff(point);
                }
                else if( point.s != rowCommand[pointName] ) {
                    throw "unknown point status , point number:-> " + pointName + " node ip:-> " + point.node_ip ;
                }
            }
            else if(point.node_status === false){
                console.log("its not connected");
            }
        }
    };

    this.createNewNode = function(node){
        if(!node === null && typeof node !== 'object'  || node === undefined )
            throw "type of input must be an object";
        else if(!node.ip || !node.name || !node.points.length)
            throw "invalid properties of such a node";
        else if(!findNodeByIp(node.ip))
            throw "node ip exists already";
        else
            saveNode(node);

    };

    this.deleteNode = function(nodeIp){
        destoryNode(nodeIp);
    };

    this.getRooms = function(){
        return this.rooms;
    };
    
    this.roomPoints = function(id){
        if (!self.mappedPoints.length) {
            self.mapPoints();
        }
        return self.mappedPoints.filter(function(point){
            return point.r === id;
        });
    };
    this.mapPoints = mapPoints;
};

module.exports = telnetDriver;
 
