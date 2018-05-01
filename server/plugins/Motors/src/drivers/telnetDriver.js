/**
 * Motor Plugin Telnet Driver
 */
var telnetDriver = function(Core){
    var self = this;
    this.model = "motors";
    this.db = Core.db;
    this.io = Core.io;
    this.Connection = Core.Connection; // telnet connection
    this.mappedMotors = [];
    this.telnetId = ""; // No Feedback for Motors just Timeout

    // first register the driver into Telnet
    this.Connection.subscribe(self);

    //once nodes loaded we can map them to be able to be used
    this.mapMotors = function(cb){
        if (self.mappedMotors.length) {
            return cb(false);
        }

        // select motors from DB
        self.getDBPoints(function(err, docs) {
            if (err) throw new Error("failed to get Motors from DB");

            // for each motor
            for (var i = 0; i < docs.length; i++) {
                // check if it's node connected
                var nodeStatus = self.Connection.isNodeConnected( docs[i].node_id );
                if (nodeStatus) {
                    // create motor object and push it to mappedMotors
                    self.mappedMotors.push({
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
        })
    };

    this.getDBPoints = function(cb) {
        if (self.mappedMotors.length) {
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

    this.findMotorInMappedMotors = function(motorId) {
        if (!motorId) return false;
        for (var x = 0; x < self.mappedMotors.length ; x++) {
            if(self.mappedMotors[x].id.toString() === motorId) {   
                return self.mappedMotors[x];
            }
        }

        return false;
    };

    this.updateDBMotor = function(motor) {
        self.db.collection(self.model).update({_id : motor.id}, {$set : { s : motor.s}}, function(err){
            if(err) throw err;
        });
    }

    this.motorStatusChanged = function(motor) {
        self.io.emit('stream', {
            type: 'motor',
            data: motor
        });
        // setTimeout(() => {
        // }, 10);
    }

    // find motor object in node
    this.findMotorInNode = function(nodeId, motorId){
        for(var i = 0; i < self.mappedMotors.length; i++) {
            if(self.mappedMotors[i].node_id.toString() === nodeId.toString() && self.mappedMotors[i].i.toString() === motorId) {
                return self.mappedMotors[i];
            }
        }

        return false;
    };

    // update node status
    this.nodeConnected = function(node){
        self.mapMotors(() => {});
    };

    this.update = function(node, data){
        // no updates for Motors
        // just place holder
        // if you see it then there is a big problem
        console.log("update motor");
    };

    this.stop =  function(motorId) {
        console.log('motor stop');
        self.mapMotors(function(err) {
            if (err) throw Error("mapMotors failed");
            var motor = self.findMotorInMappedMotors(motorId);
            if(motor.node_status === true) {
                var command = 'W' + motor.i + ',0';
                self.Connection.run(motor.node_id, command);
            } else if(motor.node_status === false){
                console.log("it's not connected");
            }
        });
    };

    this.up = function(motorId) {
        console.log('motor up');
        self.mapMotors(function(err) {
            if (err) throw Error("mapMotors failed");
            var motor = self.findMotorInMappedMotors(motorId);
            if(motor.node_status === true) {
                var command = 'W' + motor.i + ',1';
                self.Connection.run(motor.node_id, command);
            } else if(motor.node_status === false){
                console.log("it's not connected");
            }
        });
        setTimeout(function(){
            self.stop(motorId);
        }, Config.timeout);
    };

    this.down =  function(motorId) {
        console.log('down');
        self.mapMotors(function(err) {
            if (err) throw Error("mapMotors failed");
            var motor = self.findMotorInMappedMotors(motorId);
            if(motor.node_status === true) {
                var command = 'W' + motor.i + ',2';
                self.Connection.run(motor.node_id, command);
            } else if(motor.node_status === false){
                console.log("it's not connected");
            }
        });
        setTimeout(function(){
            self.stop(motorId);
        }, Config.timeout);
    };

    this.scene = function(rowCommand){
        console.log('start scene');
        self.mapMotors(function(err) {
            if (err) throw Error("mapMotors failed");

            for( var motorId in rowCommand ){
                var motor = findMotorInMappedMotors(motorId);
                if(motor.node_status === true) {
                    if (rowCommand[motorId] == true) {
                        console.log('scene UP');
                        this.up(motorId);
                    }
                    if (rowCommand[motorId] == false) {
                        console.log('scene DOWN');
                        this.down(motorId);
                    }
                } else if(motor.node_status === false){
                    console.log("it's not connected");
                }
            }
        });
    };

    this.roomMotors = function(roomId){
        self.mapMotors(function(err){
            if (err) return [];

            return self.mappedMotors.filter(function(motor){
                return motor.r.toString() === roomId;
            });
        });
    };

    this.motors = function(cb) {
        self.mapMotors(function(err){
            if (err) return cb([]);

            return cb(self.mappedMotors);
        })
    }
};

module.exports = telnetDriver;
 
