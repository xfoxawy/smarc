var ffmpeg = require('ffmpeg');

module.exports = function(Core){
    Core.app.get('/stream/:ip_of_the_feed/:width/:height', function(req, res){
        // res.contentType('mp4');
        // make sure you set the correct path to your video file storage
        var pathToMovie = 'http://192.168.1.' + req.params.ip_of_the_feed + ':8008';

        var proc = ffmpeg(pathToMovie)
            // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
            .format('mpeg1video')
            .videoBitrate('800k')
            .inputFps(29.7)
            .size(req.params.width +'x'+ req.params.height)
            // setup event handlers
            .on('start', function(commandLine) {
                console.log('Ffmpeg Starts with command: ' + commandLine);
            })
            .on('end', function() {
                console.log('file has been converted succesfully');
            })
            .on('error', function(err) {
                console.log('an error happened: ' + err.message);
            })
            // save to stream
            .pipe(res, { end: false });
    });
};
// ffmpeg -i http://192.168.1.3:8008/ -s 1980x1080 -f mpeg1video -b 800k -r 30 http://127.0.0.1:8082/password/1980/1080/
