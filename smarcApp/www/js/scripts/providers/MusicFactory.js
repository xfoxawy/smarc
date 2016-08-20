smarc.factory('Music', [
    '$http',
    '$q',
    function($http, $q){

        return {
            song: {
                all: function(){},
                add: function(){ // one or multi songs
                },
                //--------- in option menu ---------//
                addToPlaylist: function(){},
                play:   function(){},
                rename: function(){},
                //----------------------------------//
                pause:  function(){},
                stop:   function(){},
                delete: function(){},
                next:   function(){},
                prev:   function(){},
                filter: function(){},
            },
            folder: {
                create: function(){},
                rename: function(){},
                play:   function(){},
                delete: function(){},
                upload: function(){},
                addToPlaylist: fnction(){},
            },
            volume: {
                up:   function(){},
                down: function(){},
                set:  function(){},
                mute: function(){},
                unMute: function(){},
            },
            playlist: {
                all:     function(){},
                create:  function(){},
                delete:  function(){},
                enqueue: function(){},
                dequeue: function(){},
                next:    function(){},
                prev:    function(){},
                rand:    function(){},
                repeat:  function(){},
            }
        };
    }
]);
