window.onload = function () {
    var sound = document.getElementById('sound'),
        re = /chrome/i,
        btn = document.getElementsByTagName('a');
    if (re.test(navigator.userAgent)) {
        var sound1 = document.createElement('embed');
        sound1.src = 'audio/main.mp3';
        sound1.height = 0;
        sound1.width = 0;
        document.body.appendChild(sound1);
    }
    else {
        sound.src = 'audio/main.mp3';
    }

    for (let i = 0; i < btn.length; i++) {
        btn[i].onclick = function () {
            if(document.getElementsByTagName('embed')){
                document.body.removeChild(document.getElementsByTagName('embed')[0]);
            }
            this.onclick = null;
            sound.pause();
            sound.loop = false;
            sound.src = 'audio/button.mp3';
            sound.play();
            setInterval(function () {
                if (i === 0 && sound.ended) {
                    location.href = 'game.html';
                }
                if (i === 1 && sound.ended) {
                    location.href = 'tips.html';
                }
            }, 500);


        };
    }



}; 