
function setVolume(video, volume) {
    video.get(0).volume = volume;
    //kvideo.attr('volume', volume);

    //ensure volume is less than 1 and greater than zero
    volume = Math.max(Math.min(volume, 1.0), 0.0);
    console.log('setting volume to ' + volume);
    $('#volume').text(Math.round(volume*10)/10);
}

function setTime(video, time) {
    console.log('video: ' + video.get(0).currentTime);
    //video.attr('currentTime', time);
    video.get(0).currentTime = time;
    $('#currentTime').text(time);
}

function getTime(video) {
    return video.attr('currentTime');
}

function playVideo(video) {
    video.get(0).play();
    var counter = setInterval(function () {
        $('#currentTime').text(getTime(video));
    }, 100);
    play = true;
}

function pauseVideo(video) {
    video.get(0).pause();
    socket.send(JSON.stringify(['time', getTime(video)]));
    play = false;
}

function initialize_controller() {
    play = null;
    curTime = null;
    volume = null;

    socket = new io.Socket(null, {port:80, rememberTransport:false});
    socket.connect();

    // tells the server that the client is ready for data
    socket.send('init');
    socket.on('message', function(msg) {
        console.log('received: ' + msg);
        msg = JSON.parse(msg);
        command = msg[0];
        data = msg[1];
        video = $('video');

        switch(command) {
            case 'play':
                if (data != null) {
                    setTime(video, data);
                }
                playVideo(video);
                break;
            case 'pause':
                if (data != null) {
                    setTime(video, data);
                }
                pauseVideo(video);
                break;
            case 'volume':
                if (data != null) {
                    setVolume(video, data);
                }
                break;
            case 'time':
                if (data != null) {
                    setTime(video, data);
                }
                break;
            case 'init':
                play = data['play'];
                volume = data['vol'];
                curTime = data['time'];

                // set time and volume
                setTime(video, data['time']);
                setVolume(video, volume);

                if (play == true) {
                    video.play();
                }

                break;
            default:
                console.log("this command no good: " + command);
        }
    });
}

// wait until the window is fully loaded before running video related stuff
//

$(function (){
    // once the video's metadata has been loaded, initialize the vid controller
    $('video').bind('loadedmetadata', initialize_controller);
});
//$(window).load(initialize);

