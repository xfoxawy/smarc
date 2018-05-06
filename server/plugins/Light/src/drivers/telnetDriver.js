/**
 * Light Plugin Telnet Driver
 */
var telnetDriver = function(Core){
    var self = this;
    this.model = "light";
    this.db = Core.db;
    this.Connection = Core.Connection; // telnet connection
    this.mappedPoints = [];
    this.telnetId = "I";

    // first register the driver into Telnet
    this.Connection.subscribe(self);

    // once nodes loaded we can map them to be able to use
    this.mapPoints = function(cb){
        if (self.mappedPoints.length) {
            return cb(false);
        }
        // select light points from DB
        self.getDBPoints(function(err, docs) {
            if (err) throw new Error("failed to get Light Points from DB");

            // for each point
            for (var i = 0; i < docs.length; i++) {
                // check if it's node connected
                var nodeStatus = self.Connection.isNodeConnected( docs[i].node_id );
                if (nodeStatus) {
                    // create point object and push it to mappedPoits
                    self.mappedPoints.push({
                        p : docs[i].name,
                        i : docs[i].id,
                        s : docs[i].status,
                        r : docs[i].room_id,
                        id : docs[i]._id,
                        node_status: nodeStatus,
                        node_id: docs[i].node_id
                    });
                }
            }

            return cb(false);
        });
    };

    this.getDBPoints = function(cb) {
        if (self.mappedPoints.length) {
            return cb(false, []);
        }

        self.db.collection(self.model).find({}).toArray(function(err, docs){
            if(err) throw err;

            if(docs.length) {
                return cb(false, docs);
            }

            return cb(true, []);
        });
    }

    this.findPointInMappedPoints = function(pointId) {
        if (!pointId) return false;
        for (var x = 0; x < self.mappedPoints.length ; x++) {
            if(self.mappedPoints[x].id.toString() === pointId) {   
                return self.mappedPoints[x];
            }
        }

        return false;
    };

    this.updateDBPoint = function(point) {
        self.db.collection(self.model).update({_id : point.id}, {$set : { status : point.s}}, function(err){
            if(err) throw err;
        });
    }

    this.pointStatusChanged = function(point) {
        Core.io.emit('stream', {
            type: 'light',
            data: point
        });
    }

    // find point object in node
    this.findPointInNode = function(nodeId, pointId){
        for(var i = 0; i < self.mappedPoints.length; i++) {
            if(self.mappedPoints[i].node_id.toString() === nodeId.toString() && self.mappedPoints[i].i.toString() === pointId.toString()) {
                return self.mappedPoints[i];
            }
        }

        return false;
    };

    // update node status
    this.nodeConnected = function(node){
        // send R command to get status of all points
        self.Connection.run(node._id, "R");
    };

    this.update = function(node, data){
        // one point returned
        if(/(^I\d+,\d$)/igm.test(data)) {
            var pointId = data.slice(1, -2);
            var newstatus = (Number(data.split(',')[1]) == 0) ? false : true;
            var point = self.findPointInNode(node._id, pointId);
            point.s = newstatus;
            self.updateDBPoint(point);
            self.pointStatusChanged(point);
            console.log("the status has been updated for " + pointId + " with status " + newstatus);
        }
        // all points returned
        else if(/(I)*(\d*\d,[0-1]){1}-/.test(data)){
            // remove I and split on - delimiter
            var all = data.substring(1).trim().split('-');
            // iterate and update the points status in memory and db
            self.mapPoints(function(err){
                if (err) throw Error("failed to map points");
                for(var i = 0; i < all.length; i++){
                    var pointId = all[i].split(',')[0];
                    var newstatus = (Number(all[i].split(',')[1]) == 0) ? false : true;
                    var point = self.findPointInNode(node._id, pointId);
                    point.s = newstatus;
                    self.updateDBPoint(point);
                    self.pointStatusChanged(point);
                    console.log("the status has been updated for " + pointId + " with status " + newstatus);
                }
            });
        }
    };

    this.turnOn = function(point) {
        var command = 'O' + point.i + ',1';
        self.Connection.run(point.node_id, command);
    };

    this.turnOff =  function(point) {
        var command = 'O' + point.i + ',0';
        self.Connection.run(point.node_id, command);
    };

    this.toggle = function(pointId){
        self.mapPoints(function(err) {
            if (err) throw Error("mapPoints failed");

            var point = self.findPointInMappedPoints(pointId);
            if(point.node_status === true) {
                if(point.s === false) {
                    self.turnOn(point);
                } else if(point.s === true){
                    self.turnOff(point);
                } else {
                    throw "unknown point status , Light point ID:-> " + pointId;
                }
            } else if(point.node_status === false){
                console.log("it's not connected");
            }
        });
    };

    this.scene = function(rowCommand){
        self.mapPoints(function(err) {
            if (err) return [];

            for( var pointId in rowCommand ) {
                var point = self.findPointInMappedPoints( pointId );
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

    this.roomPoints = function(roomId, cb){
        self.mapPoints(function(err){
            if (err) return cb(true);

            var roomPoints = self.mappedPoints.filter(function(point){
                return point.r.toString() === roomId;
            });

            return cb(false, roomPoints);
        });
    };

    this.points = function(cb) {
        self.mapPoints(function(err){
            if (err) return cb([]);

            return cb(self.mappedPoints);
        })
    }
};

module.exports = telnetDriver;
 
