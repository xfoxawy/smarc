var redis           = require("redis"),
    publisherClient = redis.createClient();

module.exports = function(Core){

    Core.app.get('/test-notification/:e', function(req, res){
        publisherClient.publish('updates', req.params.e );
        res.end();
    });

    Core.app.get('/notification', function(req,res){

        res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
        res.write("retry: 10000\n");

        /**
         * Now we need something to make this function send notification to clients and keep update
         * so we use redis to make it reFire or reSend new updates
         */
        /**
         * recieve Updates from Redis
         */
        var subscriber = redis.createClient();
        subscriber.subscribe("updates");

        /**
         * In case we encounter an error...print it out to the console
         */
        subscriber.on("error", function(err) {
            console.log("Redis Error: " + err);
        });

        /**
         * When receiveing a message from the redis connection
         */
        subscriber.on("message", function(channel, message) {
            res.write("data: " + message + '\n\n');
        });

        /**
         * The 'close' event is fired when a user closes their browser window.
         * In that situation we want to make sure our redis channel subscription
         * is properly shut down to prevent memory leaks...and incorrect subscriber
         * counts to the channel.
         */
        req.on("close", function() {
            subscriber.unsubscribe();
            subscriber.quit();
        });
    });
};


