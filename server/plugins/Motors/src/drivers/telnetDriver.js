var Telnet = require('../ConnectionMotors');
var EventEmitter = new(require('events').EventEmitter);
var Transformer = require('../Transformer');
var Config = require('../Config');

/**
 * Light Plugin Telnet Driver
 */
var telnetDriver = function(Core){
    var self = this;
    var model = "motors";
    var db = Core.db;
    var io = Core.io;
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

    // first register the driver into Telnet
    Connection.subscribe({
        telnetId: "",
        name: "motor",
        driver: self
    });

    //once nodes loaded we can map them to be able to be used
    function mapPoints(cb){
        if (self.mappedPoints.length) {
            return self.mappedPoints;
        }

        // select light points from DB
        getDBPoints(function(success) {
            if (!success) {
                throw new Error("failed to get Light Points from DB");
            }

            // for each point
            for (var i = 0; i <= self.points; i++) {

                // check if it's node connected
                var nodeStatus = Connection.isNodeConnected( self.points[i].node_id );
                if (nodeStatus) {
                    // create point object and push it to mappedPoits
                    self.mappedPoints.push({ 
                        p : self.points[i].name,
                        i : self.points[i].id,
                        s : self.points[i].status,
                        r : self.points[i].room_id,
                        id : self.points[i]._id,
                        node_status: nodeStatus,
                        node_id: points[i].node_id
                    });
                }
            }

            return cb(success);
        })
    };

    function getDBPoints(cb) {
        if (points.length) {
            return cb(true);
        }
        db.collection(model).find({}).toArray(function(err, docs){
            if(err) throw err;

            if(docs.length) {
                self.points = self.points.concat(docs);
                return cb(true);
            }
            return cb(false);
        });
    }

    function findPointInMappedPoints(pointId) {
        if (!pointId) return false;

        for (var x = 0; x < self.mappedPoints.length ; x++) {
            if(self.mappedPoints[x].i === pointId) {   
                return self.mappedPoints[x];
            }
        }

        return false;
    };

    function updateDBPoint(point) {
        db.collection(model).update({_id : point.id}, {$set : { s : point.s}}, function(err){
            if(err) throw err;
        });
    }

    function pointsStatusChanged(point) {
        setTimeout(() => {
            var data = {
                type: 'light',
                data: point
            };

            io.emit('stream', data);
        }, 100);
    }

    // find point object in node
    function findPointInNode(nodeId, pointId){
        for(var i = 0; i < self.points.length; i++) {
            if(self.points[i].node_id === nodeId && self.points[i].i === pointId) {
                return self.points[i];
            }
        }
        return false;
    };

    // update node status
    this.nodeConnected = function(node){
        Connection.run(node._id, "R");
    };

    function update(ip, data){
        console.log('motors');
        // var node = findNodeByIp(ip);
        // if(/(^I\d+,\d$)/igm.test(data))
        // {
        //     var pointId = data.slice(1, -2);
        //     var newstatus = (Number(data.split(',')[1]) == 0) ? false : true;
        //     var point = findPointInNode(node, pointId);
        //     point.s = newstatus;
        //     updatePointStatusDB(node.name , point.i , newstatus);
        //     publishPointsStatusUpdates(point);
        //     console.log("the status has been updated for " + pointId + " with status " + newstatus);
        // }
        // else if(/(I)*(\d*\d,[0-1]){1}-/.test(data)){
        //     // remove I and split on - delimiter
        //     var all = data.substring(1).trim().split('-');
        //     // iterate and update the points statuses in memory and db          
        //     for(var i = 0; i < all.length; i++){
        //         if(all[i])
        //         {
        //             var pointId = all[i].split(',')[0];
        //             var newstatus = (Number(all[i].split(',')[1]) == 0) ? false : true;
        //             var point = findPointInNode(node,pointId);
        //             updatePointStatusDB(node.name , point , newstatus);
        //             point.s = newstatus;
        //             publishPointsStatusUpdates(point);
        //         }
        //     }
        // }
    };

    this.stop =  function(pointID) {
        console.log('stop');
        mapPointsMotors();
        var point = findPointInMappedPoints(pointID);
        var order = 'W' + point.i + ',0';
        self.exec(point.node_ip, order);
    };

    this.up = function(pointID) {
        console.log('up');
        mapPointsMotors();
        var point = findPointInMappedPoints(pointID);
        var order = 'W' + point.i + ',1';
        self.exec(point.node_ip, order);
        setTimeout(function(){
            self.stop(pointID);
        }, Config.timeout)
    };

    this.down =  function(pointID) {
        console.log('down');
        mapPointsMotors();
        var point = findPointInMappedPoints(pointID);
        var order = 'W' + point.i + ',2';
        self.exec(point.node_ip, order);
        setTimeout(function(){
            self.stop(pointID);
        }, Config.timeout)
    };

    this.scene = function(rowCommand){
        console.log('start scene');
        mapPointsMotors();

        // for each point in rowCommand check the current status for this point
        // if the status in rowCommand same as the real status ignore the point
        // if NOT then change the status
        for( var pointName in rowCommand ){
            var point = findPointInMappedPoints( pointName );
            if(point.node_status === true)
            {
                console.log('point connected');
                if (rowCommand[pointName] == true) {
                    console.log('scene UP');
                    this.up(pointName);
                }
                if (rowCommand[pointName] == false) {
                    console.log('scene DOWN');
                    this.down(pointName);
                }
            }
            else if(point.node_status === false){
                console.log("its not connected");
            }
        }
    };

    this.getRooms = function(){
        return this.rooms;
    };
    
    this.roomPoints = function(id){
        if (!self.mappedPoints.length) {
            mapPointsMotors();
        }
        return self.mappedPoints.filter(function(point){
            return point.r === id;
        });
    };

    this.mapPoints = mapPointsMotors;
};

module.exports = telnetDriver;
 
