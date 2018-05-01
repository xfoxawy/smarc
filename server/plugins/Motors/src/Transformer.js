var Transformer =  function(){

    this.transformMotors = function(data) {
        var motors = {};
        for(var i = 0; i < data.length; i++)
        {
            motors[data[i].id] = this.transformMotor( data[i] );
        }
        return motors;
    };

    this.transformMotor = function(point) {
        return {
            i:           point.i,
            p:           point.p,
            r:           point.r,
            id:          point.id,
            node_status: point.node_status,
            node_id:     point.node_id
        };
    };

    this.transformRooms = function(data) {
        var value = {};

        for(var i =0; i < data.length; i++)
        {
            value[data[i]._id] = data[i].name;
        }
        return value;
    };
};

module.exports = new Transformer;
