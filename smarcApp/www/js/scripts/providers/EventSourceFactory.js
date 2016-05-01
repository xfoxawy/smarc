smarc.factory('EventSource', [
    function(){
        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };
        return {};
    }
]);
