$(function() {
    var socket = new io.Socket(null,
                               {port:8001, rememberTransport:false});

    var play = null;
    var curTime = null;

    socket.connect();

    // tells the server that the client is ready for data
    socket.send('init');

    socket.on('message', function(msg) {
        console.log('received: ' + msg);
        msg = JSON.parse(msg);
        command = msg[0];
        data = msg[1];
        video = $('video').get(0);

        switch(command) {
            case 'play':
                if (data != null) {
                    video.currentTime = data;
                }
                // if this is the first time this message has been sent,
                // set to autoplay
                if (play == null) {
                    video.autoplay = true;
                } else {
                    video.play();
                }
                play = true;
                break;
            case 'pause':
                if (data != null) {
                    video.currentTime = data;
                }
                video.pause();
                play = false;
                break;
            case 'volume':
                if (data != null) {
                    video.volume = data;
                }
                break;
            case 'init':
                play = data['play'];
                curTime = data['time'];
                volume = data['volume'];
                video.currentTime = curTime;
                video.volume = volume;
                if (play == true) {
                    video.play();
                }
                break;
            default:
                console.log("this command no good: " + command);
        }
    });

    /*
    $(window).keypress(function (event) {
        if (event.which == 32) {
            // when spacebar is pressed, flip the state of play and send it and the
            // current time to the server
            play ^= 1;

            curTime = $('video')[0].currentTime;
            if (play == true) {
                socket.send(JSON.stringify(['play', curTime]));
            } else {
                socket.send(JSON.stringify(['pause', curTime]));
            }
        }
    });
    */
});
