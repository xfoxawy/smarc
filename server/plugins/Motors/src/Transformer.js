var Transformer =  function(){

    this.transformPoints = function(data)
    {
        var points = {};
        for(var i = 0; i < data.length; i++)
        {
            points[data[i].i] = this.transformPoint( data[i] );
        }
        return points;
    };

    this.transformPoint = function(point){
        return {
            s : point.s,
            p : point.p,
            r : point.r,
            type: 'motor',
            node_name : point.node_name,
            node_status : point.node_status,
            node_ip : point.node_ip
        };
    };

    this.transformRooms = function(data){
        var value = {};

        for(var i =0; i < data.length; i++)
        {
            value[data[i]._id] = data[i].name;
        }
        return value;
    };
};

module.exports = new Transformer;
