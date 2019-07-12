window.onload = function () {
    var prev = document.getElementById('prev');
        next = document.getElementById('next'),
        first = document.getElementById('first'),
        btn = document.getElementById('btn'),
        index = 0,
        arr = ['img/tipone.png', 'img/tiptwo.png', 'img/tipthree.png', 'img/tipfour.png', 'img/tipfive.png', 'img/tipsix.png'];
    prev.onclick = function () {
        index--;
        if (index === 0) {
            prev.style.display = 'none';
        }
        first.getElementsByTagName('img')[0].src = arr[index];

    };
    next.onclick = function () {
        index++;
        if (index === 1) {
            prev.style.display = 'block';
        }
        if (index > 5) {
            index = 5;
        }
        first.getElementsByTagName('img')[0].src = arr[index];
    };
    btn.onclick = function () {
        location.href = 'index.html';
    };
};