/*
* Sources:
* http://www.davidmclifton.com/2011/07/22/simple-telnet-server-in-node-js/
*/

var net = require('net');

/*
* Config Variables
*/
var config = {
    port: 23
};

/*
* Global Variables
*/
var sockets = [];
var lastInput = '';

/*
* Cleans the input of carriage return, newline
*/
function cleanInput(data) {
    return data.toString().replace(/(\r\n|\n|\r)/gm,"").toLowerCase();
}

/*
* Send Data to Socket
*/
function sendData(socket, data) {
    socket.write(data + "\n\n");
    //socket.write("$ ");
}

/*
* Method executed when data is received from a socket
*/
function receiveData(socket, data) {
    var cleanData = cleanInput(data);

    if ( cleanData != '!!' ) {
        lastInput = cleanData;
    } else {
        cleanData = lastInput;
    }

    var output = "";
    var points = ['0','1','2','3','4'];

    if(/^o\d,\d/.test(cleanData))
    {
        var arr = cleanData.split(',');
        var point = arr[0].substr(1,1);
        var status = Number(arr[1]);
        if(points.indexOf(point) != -1)
        {
            // var newStatus = 1 - status ;
            var newStatus = status ;
            sendData(socket,'OK');
            var out = "I" + point + ',' + newStatus;
            console.log(out);            
            setTimeout(function(){
                sendData(socket,out);
                out = '';
            }, 7000);
        }
        else
        {
            sendData(socket,"notfound");
        }
        return;
    }
    switch ( cleanData ) {    
        case 'r':
            output += "I1,0-1,0-2,1-3,0-4,1\r\n";
            sendData(socket, output);
            break;
        case 'quit':
        case 'exit':
            socket.end('Goodbye!\n');
            break;
        default:
            sendData(socket, "-resume: " + cleanData + ": command not found");
            break;
    }
}

/*
* Method executed when a socket ends
*/
function closeSocket(socket) {
    var i = sockets.indexOf(socket);

    if (i != -1) {
        sockets.splice(i, 1);
    }
    console.log("Server : a user has been disconnected\n");
    console.log("Server : number of users is " + sockets.length);

}


/*
* Callback method executed when a new TCP socket is opened.
*/
function newSocket(socket) {
    sockets.push(socket);
    console.log("Server : new user has been connected\n");
    console.log("Server : number of users is " + sockets.length);
    // socket.write("\n");
    // socket.write("Last updated: Wed May 14 18:59:40 MST by Zachary Flower\n");
    // socket.write("\n");
    // socket.write(" ______ _ _____ _\n");
    // socket.write("|___ / | | | ___| |\n");
    // socket.write(" / / __ _ ___| |__ __ _ _ __ _ _ | |_ | | _____ _____ _ __\n");
    // socket.write(" / / / _` |/ __| '_ \\ / _` | '__| | | | | _| | |/ _ \\ \\ /\\ / / _ \\ '__|\n");
    // socket.write("./ /__| (_| | (__| | | | (_| | | | |_| | | | | | (_) \\ V V / __/ |\n");
    // socket.write("\\_____/\\__,_|\\___|_| |_|\\__,_|_| \\__, | \\_| |_|\\___/ \\_/\\_/ \\___|_|\n");
    // socket.write(" __/ |\n");
    // socket.write(" |___/\n\n");
    // sendData(socket, "Type 'help' for more information.");

    socket.on('data', function(data) {
        receiveData(socket, data);
    })

    socket.on('end', function() {
        closeSocket(socket);
    })
}

var server = net.createServer(newSocket);
server.listen(config.port);