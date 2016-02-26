smarc.factory('IO', [
    function(){
        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };
        var socket = io("http://"+ config().serverIp +":"+ config().serverPort +"/");
        return socket;
    }
]);
