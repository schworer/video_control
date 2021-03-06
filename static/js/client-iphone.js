var socket = new io.Socket(null,{port:80, rememberTransport:false});

var play = null;
var curTime = null;
var volume = 1.0;

socket.connect();
socket.send('init');
socket.on('message', function(msg) {
        console.log('received ' + msg);
        msg = JSON.parse(msg);
        command = msg[0];
        data = msg[1];
        switch(command) {
            case 'init':
                play = data['play'];
                curTime = data['time'];
                volume = data['vol'];
                $('#volume').text(volume);
                break;
            case 'volume':
                volume = data;
                $('#volume').text(volume);
                break;
            case 'time':
                curTime = data;
                break
        }
});

socket.on('message', function(msg) {
    msg = JSON.parse(msg);
    command = msg[0];
    if (command == 'play') {
        play = true;
    } else {
        play = false;
    }
});

$.jQTouch({
    icon: 'jqtouch.png',
    statusBar: 'black-translucent',
    fullScreen: true,
    preloadImages: [
        './jqt/img/chevron.png',
        './jqt/img/whiteButton.png',
        './jqt/img/toggleOn.png',
        './jqt/img/back_button_clicked.png',
        './jqt/img/button_clicked.png'
    ]
});

$(function() {
    var counter = null;
    $('#downVol').tap(function() {
        if (volume >= 0.0) {
            volume -= 0.1;
        }
        console.log(volume);
        socket.send(JSON.stringify(['volume', volume]));
    });
    $('#upVol').tap(function() {
        if (volume <= 1.0) {
            volume += 0.1;
        }
        console.log(volume);
        socket.send(JSON.stringify(['volume', volume]));

    });
    $('#playButton').tap(function() {
        play ^= 1;
        if (play == false) {
            $(this).text('Play');
            socket.send(JSON.stringify(['pause', curTime]));
            clearInterval(counter);
        } else {
            $(this).text('Pause');
            counter = setInterval(function () {
                $('#curTime').text(curTime);
                curTime += 0.1;
            }, 10);

            socket.send(JSON.stringify(['play', curTime]));
        }
    });

    $('#resetButton').tap(function() {
        if (play == true) {
            $('#playButton').text('Play');
            clearInterval(counter);
        }

        play = false;
        curTime = 0.0;
        volume = 1.0;
        socket.send(JSON.stringify(['pause', curTime]));
        socket.send(JSON.stringify(['volume', volume]));
        $('#volume').text(volume);
        $('#curTime').text(curTime);
    });

    /*
    $('#volumeToggle').tap(function() {
        volume = volume ? 0.0 : 1.0;
        $('#volCheck').get(0).checked = volume;
        socket.send(JSON.stringify(['volume', volume]));
    });
    */
});
