var play = false;
var curTime = 0.0;
var volume = 1.0;

var express = require('express'),
    fs = require('fs');
    io = require('socket.io');

var app = express.createServer();
app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyDecoder());
    app.use(app.router);
    app.use(express.staticProvider(__dirname + '/static'));
});

app.get('/', function(req, res) {

    // based on the user agent, serve a different index
    var userAgentString = req.headers['user-agent'];
    userAgentString = userAgentString.toLowerCase();
    var mobile_safari = ((userAgentString.indexOf('iphone')!=-1));
    if (mobile_safari == true) {
        fs.readFile(__dirname+'/static/index-iphone.html', 'utf8', function(err, data) {
            res.send(data);
        });
    } else {
        fs.readFile(__dirname+'/static/index.html', 'utf8', function(err, data) {
            res.send(data);
        });
    }
});

var socket = io.listen(app);
socket.on('connection', function(client) {

    // this pattern taken from creationix's hexes examples
    var cmds = {
        play: function (data) {
            socket.broadcast(JSON.stringify(['play', curTime]));
            play = true;
        },
        pause: function (data) {
            play = false;
            curTime = data;
            socket.broadcast(JSON.stringify(['pause', curTime]));
        },
        volume: function (data) {
            volume = data;
            // broadcast a command to set the volume
            socket.broadcast(JSON.stringify(['volume', data]));
        },
        init: function (client) {
            init_data = {
                play: play,
                time: curTime,
                vol: volume
            }
            command = ['init', init_data];
            client.send(JSON.stringify(command));
        }
    }

    client.on('message', function(msg) {

        // when a client connects, it sends an init command to the
        // server, when we receive it here, send over the state data.
        if (msg == 'init') {
            cmds[msg](client);
        } else {
            msg = JSON.parse(msg);
            command = msg[0];
            data = msg[1];
            if (cmds.hasOwnProperty(command)) {
                console.log(command);
                cmds[command](data);
            } else {
                console.error('invalid command ' + command);
            }
        }
    });
});

var PORT = process.env.PORT || 8001;
app.listen(PORT);
console.log('server running at http://localhost:%s/', PORT);

