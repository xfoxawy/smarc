var exec   = require('child_process').exec;
var ffmpeg = require('fluent-ffmpeg');

var Driver = function(Core){
    var cams      = {};
    var deadCams  = [];
    var model     = "security";
    var interval  = 60 * 1000; // check dead cams every 1 minute

    init();
    function init(){
        // load cams from DB
        getCamsFromDB(function(rowCams){
            // try to connect with them
            for(var i = 0; i < rowCams.length; i++){
                if( checkCam( rowCams[i] ) ){
                    createCamObj(rowCams[i].ip);
                } else {
                    // store dead cams
                    storeDeadCam(rowCams[i].ip);
                }
            };
        });

        // try to connect every interval sec
        setInterval(function(){
            tryToConnect();
        }, interval);
    };

    function tryToConnect(){
        for (var i = 0; i < deadCams.length; i++) {
            if(checkCam(deadCams[i])){
                createCamObj(deadCams[i]);

                // remove the cam from dead cams
                deadCams.splice(i, 1);
            }
        }
    };

    function storeDeadCam(ip){
        if( deadCams.indexOf(ip) == -1 )
            deadCams.push(ip);
    };

    function getCamsFromDB(cb){
        Core.db.collection(model).find().toArray(function(err, docs){
            if(err) throw err;
            return cb(docs);
        });
    };

    /**
     * check if cam is connected to network
     * @param  {String} ip [ip of the cam]
     * @return {Boolean}
     */
    function checkCam(camObj){
        return true;
    };

    function isCamValid(ip){
        return (ip in cams)
    };

    /**
     * close Cam stream and stop ffmpeg connection
     * @param  {String} ip [the cam ip]
     * @return {Empty}     [void]
     */
    function closeStream(ip){
        exec('ps aux | grep ffmpeg', (error, stdout, stderr) => {
            if (error) throw error;
            // ibrahimsaqr      67341  24.8  0.3  2520944  29240 s001  S+    6:10PM   0:01.36 /Users/ibrahimsaqr/Development/ffmpeg/ffmpeg -i http://192.168.1.3:8008 -b:v 800k -r 25 -filter:v scale=w=640:h=480 -f mpeg1video pipe:1,
            
            // find the command
            var command = stdout.split('\n').filter(function(element, index){
                if ( element.search(ip) > -1 ) return true;
                return false;
            });

            // search in it and get the PID
            var res = command[0].match("([0-9]+)");
            if (res) {
                // kill it
                exec('kill -9 ' + res[0], (error, stdout, stderr) => {
                    if (error) throw error;
                    console.log(stdout);
                    console.log(stderr);
                });
            } else {
                console.log('no resault');
            }

        });
        // reset Cam Obj
        cams[ip].ffmpeg = {};
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

    this.stream = function(ip, socket){
        // check if this cam id is valid
        if (isCamValid(ip)) {
            
            // check if the cam is opend before
            if (isCamOpened(ip)) {
                registerUserIntoCam(ip, socket);

            // if not start the proccess
            } else {
                startNewStream(ip);
                registerUserIntoCam(ip, socket)
            }

        } else {

        }
    };

    function isCamOpened(ip){
        return typeof cams[ip].ffmpeg.on == 'function';
    };

    function registerUserIntoCam(ip, socket){
        if (!cams[ip].users[socket.id])
            cams[ip].users[socket.id] = socket;
    };

    function createCamObj(ip){
        cams[ip] = {
            users: {},
            ffmpeg: {}
        };
    };

    function startNewStream(ip){
        try {
            cams[ip].ffmpeg = startFFMPEG(ip);
        } catch(err){
            closeStream(ip);
        }
    };

    function startFFMPEG(ip){
        /**
         * the sorting of methods is important
         * espcialy pipe() and on(data), we Must call pipe() then on(data)
         */
        var command = ffmpeg('http://' + ip + ':8008')
            .format('mpeg1video')
            .size('640x480')
            .videoBitrate('800k')
            .fps(25)
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })
            .pipe()
            .on('data', function(chunk) {
                for (userId in cams[ip].users) {
                    cams[ip].users[userId].emit('stream', chunk);
                }
            });
        return command;
    };
};
module.exports = Driver;
