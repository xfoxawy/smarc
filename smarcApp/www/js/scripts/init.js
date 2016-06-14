window.env = "production";

if (env == "development") {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['Smarc']);
    });
}

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
        document.addEventListener('deviceready', this.onDeviceReady,   false);
        document.addEventListener("offline",     this.onDeviceOffline, false);
        document.addEventListener("online",      this.onDeviceOnline,  false);
        document.addEventListener("resume",      this.onResume,        false);
        document.addEventListener("pause",       this.onPause,         false);
    },

    // offline Event Hamdler
    // fires whene the app goes offline
    onDeviceOffline: function(){
        if (env == "production") {
            navigator.app.exitApp();
        }
        if (env == "development") {
            console.log('no Internet Connection .. closing app ....');
        }
    },

    // online Event Hamdler
    // fires whene the app back to online
    onDeviceOnline: function(){
        console.log('the app back to online .. restore functionality...');
    },

    onResume: function(){
        angular.bootstrap(document, ['Smarc']);
    },

    onPause: function(){},
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event.
    onDeviceReady: function() {
        angular.bootstrap(document, ['Smarc']);
    }
};

// start init app
if (env == "production") {
    app.initialize();
}
