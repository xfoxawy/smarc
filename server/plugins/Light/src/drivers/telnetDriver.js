var EventEmitter = new(require('events').EventEmitter);
var Transformer = require('../Transformer');

/**
 * Light Plugin Telnet Driver
 */
var telnetDriver = function(Core){
    var self = this;
    var model = "light";
    var db = Core.db;
    var io = Core.io;
    var Connection = Core.Connection; // telnet connection
    var points = [];
    var mappedPoints = [];

    // first register the driver into Telnet
    Connection.subscribe({
        telnetId: "I",
        name: "light",
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

    this.update = function(node, data){
        // one point returned
        if(/(^I\d+,\d$)/igm.test(data)) {
            var pointId = data.slice(1, -2);
            var newstatus = (Number(data.split(',')[1]) == 0) ? false : true;
            var point = findPointInNode(node._id, pointId);
            point.s = newstatus;
            updateDBPoint(point);
            pointsStatusChanged(point);
            console.log("the status has been updated for " + pointId + " with status " + newstatus);
        }
        // all points returned
        else if(/(I)*(\d*\d,[0-1]){1}-/.test(data)){
            // remove I and split on - delimiter
            var all = data.substring(1).trim().split('-');
            // iterate and update the points statuses in memory and db
            for(var i = 0; i < all.length; i++){
                if(all[i]) {
                    var pointId = all[i].split(',')[0];
                    var newstatus = (Number(all[i].split(',')[1]) == 0) ? false : true;
                    var point = findPointInNode(node._id, pointId);
                    point.s = newstatus;
                    updateDBPoint(point);
                    pointsStatusChanged(point);
                    console.log("the status has been updated for " + pointId + " with status " + newstatus);
                }
            }
        }
    };

    this.turnOn = function(point) {
        var command = 'O' + point.i + ',1';
        Connection.run(point.node_id, command);
    };

    this.turnOff =  function(point) {
        var command = 'O' + point.i + ',0';
        Connection.run(point.node_id, command);
    };

    this.toggle = function(pointId){
        mapPoints(function(success) {
            if (!success) return [];

            var point = findPointInMappedPoints(pointId);
            if(point.node_status === true) {
                if(point.s === false) {
                    self.turnOn(point);
                } else if(point.s === true){
                    self.turnOff(point);
                } else {
                    throw "unknown point status , Light point ID:-> " + pointId;
                }
            } else if(point.node_status === false){
                console.log("its not connected");
            }
        });
    };

    this.scene = function(rowCommand){
        mapPoints(function(success) {
            if (!success) return [];

            for( var pointId in rowCommand ) {
                var point = findPointInMappedPoints( pointId );
                if(point.node_status === true) {
                    if( point.s != rowCommand[pointId] && point.s === false ) {
                        self.turnOn(point);
                    } else if( point.s != rowCommand[pointId] && point.s === true ){
                        self.turnOff(point);
                    } else if( point.s != rowCommand[pointId] ) {
                        throw "unknown point status , Light point ID:-> " + pointId;
                    }
                } else {
                    console.log("its not connected");
                }
            }
        });
    };

    this.roomPoints = function(roomId){
        mapPoints(function(success){
            if (!success) return [];

            return self.mappedPoints.filter(function(point){
                return point.r.toString() === roomId;
            });
        });
    };

    this.mapPoints = mapPoints;
};

module.exports = telnetDriver;
 
