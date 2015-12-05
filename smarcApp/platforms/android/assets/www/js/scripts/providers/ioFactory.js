smarc.factory('IO', [
    function(){
        var socket = io("http://localhost:3050/");
        return socket;
    }
]);
