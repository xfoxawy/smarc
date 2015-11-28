angular.element(document).ready(function() {
    angular.bootstrap(document, ['Smarc']);
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup.
    // read more https://cordova.apache.org/docs/en/5.4.0/cordova/events/events.html
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event.
    onDeviceReady: function() {
        // your Code here
        // angular.bootstrap(document, ['Smarc']);
    }
};

// start init app
// app.initialize();
