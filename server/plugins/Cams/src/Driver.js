var exec   = require('child_process').exec;
var ffmpeg = require('fluent-ffmpeg');

var Driver = function(Core){
    var cams      = {};
    var deadCams  = {};

    init();
    function init(){
        // load cams from DB
        var rowCams = getCamsFromDB();

        // try to connect with them
        for(var i = 0; i < rowCams.length; i++){
            checkCam(cams[i]);
        };
        // store dead cams
        // try to connect every 60 sec
    };

    function getCamsFromDB(){
        return [];
    };

    /**
     * check if cam is connected to network
     * @param  {String} cam [ip of the cam]
     * @return {Boolean}
     */
    function checkCam(cam){};

    function isCamValid(ip){
        var arr = Object.keys(deadCams);
        return arr.indexOf(ip) == -1;
    };

    /**
     * close Cam stream and stop ffmpeg connection
     * @param  {String} ip [the cam ip]
     * @return {Empty}     [void]
     */
    function closeStream(ip){
        /**
         * SIGKILL - Default signal, Kill the proccess [error event will emit]
         * SIGSTOP - suspend proccess
         * SIGCONT - resume proccess
         */
        // cams[ip].ffmpeg.kill is not a function !!!!!!
        cams[ip].ffmpeg.kill('SIGKILL');

        // remove cam empty object from global cams
        delete cams[ip];
    };

    /**
     * stop stream to spacicif user or socket
     * @param  {Object} socket [socket object]
     * @return {Empty}         [void]
     */
    this.quit = function(socket){
        // loop into cams
        for(camIP in cams){
            // loop into cam.users
            for(userID in cams[camIP].users){
                // if socket.id is set then delete it
                if(socket.id == userID) delete cams[camIP].users[userID];
                // if cam.users is empty then run closeStream(ip)
                if (!Object.keys(cams[camIP].users).length) {
                    closeStream(camIP);
                }
            }
        }
    };

    this.stream = function(data, socket, Core){
        // data = { ip: "", size: "" };
        var data = data || {};

        // check if this cam id is valid
        isCamValid(data.ip);

        // check if the cam is opend before
        // if not start the proccess
        if (cams[data.ip]){
            // check if the socket is first connect
            if ( Object.keys(cams[data.ip].users).indexOf(socket.id) == -1 )
                // connect it
                cams[data.ip].users[socket.id] = socket;
        } else {
            cams[data.ip] = {};
            cams[data.ip].users = {};
            cams[data.ip].users[socket.id] = socket;
            try {
                cams[data.ip].ffmpeg = startFFMPEG(data);
            } catch(err){
                closeStream(data.ip);
            }
        };

        sendStream(data.ip);
    };

    function sendStream(ip){
        // new method, send the last user, which will be the new one
        cams[ip].ffmpeg.on('data', function(chunk) {
            var keys    = Object.keys(cams[ip].users),
                lastkey = keys[keys.length - 1];

            if (cams[ip].users[lastkey])
                cams[ip].users[lastkey].emit('stream', chunk);
        });

        // old method to send stream to all users, loop in all users and send
        // cams[ip].ffmpeg.on('data', function(chunk) {
        //     for (id in cams[ip].users) {
        //         cams[ip].users[id].emit('stream', chunk);
        //     }
        // });
    };

    function startFFMPEG(data){
        console.log('startFFMPEG');
        return ffmpeg('http://192.168.1.' + data.ip + ':8008')
            .format('mpeg1video')
            .size(data.size)
            .videoBitrate('800k')
            .fps(25)
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            }).pipe();
    };
};
module.exports = Driver;
