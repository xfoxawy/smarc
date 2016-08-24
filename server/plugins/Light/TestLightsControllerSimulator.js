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
    var points = ['0','1','2'];

    if(/^o\d,\d/.test(cleanData))
    {
        var arr = cleanData.split(',');
        var point = arr[0].substr(1,1);
        var status = Number(arr[1]);
        if(points.indexOf(point))
        {
            var newStatus = 1 - status ;
            sendData(socket,'OK');
            var out = "I" + point + ',' + newStatus;            
            setTimeout(function(){
                sendData(socket,out);
                out = '';
            }, 500);
        }
        else
        {
            sendData(socket,"notfound");
        }
        return;
    }
    switch ( cleanData ) {    
        case 'r':
            output += "I0,0-I1,0-I2,1\n";
            sendData(socket, output);
            break;
        case 'quit':
        case 'exit':
            socket.end('Goodbye!\n');
            break;
        case 'help':
            output += "These shell commands are defined internally. Type 'help' to see this list.\n";
            output += "Type 'help ' for more information about a particular command.\n";

            output += "\n";
            output += "Commands:\n";
            output += " Turn On : O(n),1 as n is the point address \n";
            output += " Turn Off : O(n),0 as n is the point address \n";
            output += " exit : Exit the Simulator\n";
            output += " help : Display this help text\n";
            output += " quit : Exit the Simulator\n";
            sendData(socket, output);
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
}

/*
* Callback method executed when a new TCP socket is opened.
*/
function newSocket(socket) {
    sockets.push(socket);
    socket.write("\n");
    socket.write("Lights Telnet Controller Simulator by Foxawy@Smarc\n");
    socket.write("\n");
    socket.write(" .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  \r\n");
    socket.write("| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. | \r\n");
    socket.write("| |    _______   | || | ____    ____ | || |      __      | || |  _______     | || |     ______   | | \r\n");
    socket.write("| |   /  ___  |  | || ||_   \  /   _|| || |     /  \     | || | |_   __ \    | || |   .' ___  |  | | \r\n");
    socket.write("| |  |  (__ \_|  | || |  |   \/   |  | || |    / /\ \    | || |   | |__) |   | || |  / .'   \_|  | | \r\n");
    socket.write("| |   '.___`-.   | || |  | |\  /| |  | || |   / ____ \   | || |   |  __ /    | || |  | |         | | \r\n");
    socket.write("| |  |`\____) |  | || | _| |_\/_| |_ | || | _/ /    \ \_ | || |  _| |  \ \_  | || |  \ `.___.'\  | | \r\n");
    socket.write("| |  |_______.'  | || ||_____||_____|| || ||____|  |____|| || | |____| |___| | || |   `._____.'  | | \r\n");
    socket.write("| |              | || |              | || |              | || |              | || |              | | \r\n");
    socket.write("| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' | \r\n");
    socket.write(" '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  \r\n");
    socket.write("\n\n");
    sendData(socket, "Type 'help' for more information.");

    socket.on('data', function(data) {
        receiveData(socket, data);
    })

    socket.on('end', function() {
        closeSocket(socket);
    })
}

var server = net.createServer(newSocket);
server.listen(config.port);