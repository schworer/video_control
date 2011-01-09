$(window).keypress(function (event) {
    if (event.which == 32) {
        play ^= 1;
        if (play == true) {
            socket.send('play');
        } else {
            socket.send('pause');
        }
    }
});

