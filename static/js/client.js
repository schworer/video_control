var socket = new io.Socket(null,
                           {port:8001, rememberTransport:false});

var play = null;
socket.connect();
socket.on('connect', function (msg) {
    play = msg;
    console.log('connected: %s', play);
});

socket.on('message', function(msg) {
    if (msg == 'play') {
        play = true;
        $('video')[0].play();
    } else {
        play = false;
        $('video')[0].pause();
    }
    console.log(msg);
});

var camera, scene, renderer;
init();
setInterval(loop, 1000/60);

function init() {
    camera = new THREE.Camera(75,
                window.innerWidth/window.innerHeight,
                1,
                10000);

    camera.position.z = 1000;
    scene = new THREE.Scene();

    // plot each pixel in 
    for (var i = 0; i < 1000; i++) {
        var particle = new THREE.Particle(
                new THREE.ParticleCircleMaterial(
                    { color: Math.random() * 0x808080 + 0x808080 } 
                )
                );
        particle.position.x = Math.random() * 2000 - 1000;
        particle.position.y = Math.random() * 2000 - 1000;
        particle.position.z = Math.random() * 2000 - 1000;
        particle.scale.x = particle.scale.y = Math.random() * 10 + 5;
        scene.addObject(particle);
    }
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function loop() {
    date = new Date();
    time = date.getTime();
    if (play == true) {
        for (i=0, il = scene.objects.length; i < il; i++) {
            particle = scene.objects[i];
            particle.scale.x = particle.scale.y += 1*(Math.sin(time)+Math.random(i));
        }
    }
    //renderer.render(scene, camera);
}

