$(window).keypress(function (event) {
    if (event.which == 32) {
        // when spacebar is pressed, flip the state of play and send it
        // to the server
        play ^= 1;
        if (play == true) {
            socket.send('play');
        } else {
            socket.send('pause');
        }
    }
});

