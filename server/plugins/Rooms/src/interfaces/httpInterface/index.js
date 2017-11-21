var ObjectID   = require('mongodb').ObjectID;

module.exports = function(Core){
    // list all rooms
    Core.app.get('/rooms', function(req,res){
        Core.db.collection('rooms').find({}).toArray(function(err, docs) {
            if (err) throw err;

            return res.json(docs);
        });
    });

    // create new room
    Core.app.post('/rooms', function(req,res){
        // validate req.body
        // then
        Core.db.collection('rooms').insertOne({
            name: req.body.name
        }, function(err, doc){
            if (err) throw err;

            return res.status(200).json(doc).end();
        });
    });

    // get room by id
    Core.app.get('/rooms/:id', function(req,res){
        // we need to get the room with it's lights, sensors, access control and cams
        Core.db.collection('rooms').find({ _id: new ObjectID(req.params.id) }).toArray(function(err, room){
            if (err) throw err;
            room   = room[0];
            roomId = room._id.toString();

            /**
             * All this SHIT MUST BE refactored
             */
            // get room Lights
            getLights(roomId, function(light){
                room['lights'] = light;

                // get room Doors
                getDoors(roomId, function(doors){
                    room['doors'] = doors;

                    // get room HeatSensors
                    getHeatSensors(roomId, function(heats){
                        room['heats'] = heats;

                        // get room Motors
                        getMotors(roomId, function(motors){
                            room['motors'] = motors;

                            // get room SmokeSensors
                            getSmokeSensors(roomId, function(smokes){
                                room['smokes'] = smokes;

                                // get room AccessControl
                                getAccessControl(roomId, function(access){
                                    room['access_control'] = access;

                                    // get room MotionSensors
                                    getMotionSensors(roomId, function(motions){
                                        room['motions'] = motions;

                                        // finaly return all data
                                        return res.status(200).json(room).end();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    // update room by id
    Core.app.put('/rooms/:id', function(req,res){
        // validate room object
        // then
        Core.db.collection('rooms').updateOne({_id: new ObjectID(req.params.id)}, {
            $set: {
                name: req.body.name
            }
        }, function(err, doc){
            if (err) throw err;

            return res.status(200).end();
        });
    });

    // delete room by id
    Core.app.delete('/rooms/:id', function(req,res){
        Core.db.collection('rooms').remove({ _id: new ObjectID(req.params.id) }, function(err, data){
            if (err) throw err;

            return res.status(200).end();
        });
    });

    function getLights(id, cb){
        Core.db.collection('light').aggregate([
            {
                $match: {
                    'points.r': id
                }
            },
            {
                $project: {
                    _id: 0,
                    points: {
                        $filter: {
                            input: '$points',
                            as: 'points',
                            cond: {
                                $eq: ['$$points.r', id]
                            }
                        }
                    }
                }
            }
        ]).toArray(function(err, light){
            if(err) throw err;

            return cb(light);
        });
    }

    function getDoors(id, cb){
        Core.db.collection('doors').aggregate([
            {
                $match: {
                    'points.r': id
                }
            },
            {
                $project: {
                    _id: 0,
                    points: {
                        $filter: {
                            input: '$points',
                            as: 'points',
                            cond: {
                                $eq: ['$$points.r', id]
                            }
                        }
                    }
                }
            }
        ]).toArray(function(err, doors){
            if(err) throw err;

            return cb(doors);
        });
    }

    function getHeatSensors(id, cb){
        Core.db.collection('heats').aggregate([
            {
                $match: {
                    'points.r': id
                }
            },
            {
                $project: {
                    _id: 0,
                    points: {
                        $filter: {
                            input: '$points',
                            as: 'points',
                            cond: {
                                $eq: ['$$points.r', id]
                            }
                        }
                    }
                }
            }
        ]).toArray(function(err, heat){
            if(err) throw err;

            return cb(heat);
        });
    }

    function getMotors(id, cb){
        Core.db.collection('motors').aggregate([
            {
                $match: {
                    'points.r': id
                }
            },
            {
                $project: {
                    _id: 0,
                    points: {
                        $filter: {
                            input: '$points',
                            as: 'points',
                            cond: {
                                $eq: ['$$points.r', id]
                            }
                        }
                    }
                }
            }
        ]).toArray(function(err, motors){
            if(err) throw err;

            return cb(motors);
        });
    }

    function getSmokeSensors(id, cb){
        Core.db.collection('smokes').aggregate([
            {
                $match: {
                    'points.r': id
                }
            },
            {
                $project: {
                    _id: 0,
                    points: {
                        $filter: {
                            input: '$points',
                            as: 'points',
                            cond: {
                                $eq: ['$$points.r', id]
                            }
                        }
                    }
                }
            }
        ]).toArray(function(err, smoke){
            if(err) throw err;

            return cb(smoke);
        });
    }

    function getAccessControl(id, cb){
        Core.db.collection('access_control').aggregate([
            {
                $match: {
                    'points.r': id
                }
            },
            {
                $project: {
                    _id: 0,
                    points: {
                        $filter: {
                            input: '$points',
                            as: 'points',
                            cond: {
                                $eq: ['$$points.r', id]
                            }
                        }
                    }
                }
            }
        ]).toArray(function(err, access){
            if(err) throw err;

            return cb(access);
        });
    }

    function getMotionSensors(id, cb){
        Core.db.collection('motions').aggregate([
            {
                $match: {
                    'points.r': id
                }
            },
            {
                $project: {
                    _id: 0,
                    points: {
                        $filter: {
                            input: '$points',
                            as: 'points',
                            cond: {
                                $eq: ['$$points.r', id]
                            }
                        }
                    }
                }
            }
        ]).toArray(function(err, motions){
            if(err) throw err;

            return cb(motions);
        });
    }
};
