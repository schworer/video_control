var Connect = require('connect'),
    io = require('socket.io');

var PORT = process.env.PORT || 8001;


var server = Connect.createServer(
        Connect.staticProvider(__dirname + '/static')
);

var socket = io.listen(server);

socket.on('connection', function(client) {
    // this pattern taken from creationix's hexes examples
    var cmds = {
        play: function () {
            socket.broadcast('play');
        },
        pause: function () {
            socket.broadcast('pause');
        }
    }

    client.on('message', function(command) {
        if (cmds.hasOwnProperty(command)) {
            console.log(command);
            cmds[command]();
        } else {
            console.error('invalid command ' + command);
        }
    });
});

server.listen(PORT);
console.log('server running at http://localhost:%s/', PORT);

