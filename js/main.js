
window.onload = function () {
    function down(ev) { //绑定键盘响应事件
        var ev = ev || event;
        json[ev.keyCode] = true;
    }
    function up(ev) {
        var ev = ev || event; /* 兼容写法 */
        json[ev.keyCode] = false;
        if (!bgm.ended) {
            bgm.play();
        }

    }
    function addEvent(ele, eventType, func) {  //封装绑定事件
        try {
            if (typeof ele === 'object' && ele !== undefined) {
                if (window.addEventListener) {
                    ele.addEventListener(eventType, func);
                }
                else {
                    ele.attachEvent('on' + eventType, func);/* 兼容ie写法 */
                }
            }
            else {
                throw new Error('对象不存在或者对象为空');
            }
        }
        catch (e) {
            console.log(e.message);
        }

    }
    
    function background() {
        img.style.top = img.offsetTop + 2 + 'px';
        if (img.offsetTop === 0) {
            img.style.top = '-9500px';
        }
        timer[1] = setTimeout(background, 30);
    }
    function gameStatus(status) {               /* 游戏结束算法或者暂停时的算法 */
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                clearInterval(arr[i][j].timer);
            }
        }
        for(var j=0;j<timer.length;j++){
            clearTimeout(timer[j]);
        }
        if (status === 'defeated') {
            bgm.src = 'audio/gameover.mp3';
            bgm.loop = false;
            h1[0].innerHTML = 'Gameover';
            h1[1].innerHTML = '您的最终得分为' + '<span style="color:red">' + grade + '</span>';
            btn.style.display = 'none';
        }
        else {
            bgm.src = 'audio/pause.mp3';
            bgm.loop = false;
            bgm.play();
            h1[0].innerHTML = '游戏暂停中';
        }

        mask.style.display = 'block';
        pause.style.display = 'block';

        document.removeEventListener('keyup', up);
        document.removeEventListener('keydown', down);

        json = {};

    }
    function continute(e) {      //点击继续后的算法
        var e = e || event;/* 兼容ie写法  */
        mask.style.display = 'none';
        pause.style.display = 'none';
        addEvent(document, 'keyup', up);
        addEvent(document, 'keydown', down);
        timer[0] = setTimeout(init, 500);
        timer[1] = setTimeout(background, 30);
        timer[2]=setTimeout(hp,10000);
        bgm.src = 'audio/bgm.mp3';
        bgm.loop = true;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (i === 0) {
                    if(arr[0][j].getThis().num===0){  arr[0][j].getThis().move(10, height - 15);}
                    else{
                        arr[0][j].getThis().move(2,height-20);
                    }
                  
                }
                if (i === 1) {
                    arr[1][j].getThis().move(10, 0);
                }
                if (i === 2) {
                    if (arr[2][j].getThis().num === 0) {
                        arr[2][j].getThis().move(3, height - 60);
                    }
                    if (arr[2][j].getThis().num === 1) {
                        arr[2][j].getThis().move(3, height - 30);
                    }

                }

            }
        }

        e.stopPropagation();//阻止冒泡
    }
    function Cell(top, left, src) { /* 基本类 */
        this.img = document.createElement('img');
        this.img.style.position = 'absolute';
        this.img.src = src;
        this.img.style.top = top;
        this.img.style.left = left;
        var that = this;
        this.img.getThis = function () {
            return that;
        };
        document.body.appendChild(this.img);

    }
    Cell.prototype.move = function (dir, target) {
        var img = this.img,
            flag = false,

            /* 先判断步长的正负 根据当前点与目标点距离 */
            dir = img.offsetTop < target ? dir : -dir;



        var dirY = img.offsetLeft <= player.img.offsetLeft ? 3 : -3;
        img.timer = setInterval(function () {
            //计算下一次移动到的位置

            var speed = img.offsetTop + dir;

            //计算下一步位置与目标点的距离，不能让其超过步长。超过直接等于。
            if (Math.abs(target - speed) < Math.abs(dir)) {
                speed = target;
            }
            //修改当前对象top移动。
            img.style.top = speed + 'px';
            if (img.offsetHeight !== 30 && img.offsetHeight !== 17) {
                var speedY = img.offsetLeft + dirY;
                if (speedY <= 0) {
                    speedY = 0;

                    flag = true;



                }
                if (speedY >= width - img.offsetWidth) {
                    speedY = width - img.offsetWidth;

                    flag = true;


                }
                img.style.left = speedY + 'px';

            }
            //到达目标点要从数组中剔除。
            if (speed === target || flag === true) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf(img) !== -1) {
                        arr[i].splice(arr[i].indexOf(img), 1);
                    }

                }
                // 清除掉该对象设置的定时器 
                img.parentNode.removeChild(img);
                clearInterval(img.timer);
            }
            new Check();

        }, 30);

    };
    function Diji(num, top, left, src) { /* 敌机类 */
        Cell.call(this, top, left, src);
        this.num = num;
        arr[2].push(this.img);



    }
    Diji.prototype = Cell.prototype;
    function Feiji(top, left, src) { /* 飞机类 */
        Cell.call(this, top, left, src);

    }

    function Bullet(num, top, left, src) {
        //子弹生成
        Cell.call(this, top, left, src);
        this.num = num;
        this.num === 1 ? arr[1].push(this.img) && this.move(15, 0) : arr[0].push(this.img) && this.move(10, height - this.img.offsetHeight);
    }

    Bullet.prototype = Cell.prototype;
    function Check() { //碰撞检测

        for (var i = 0; i < arr[0].length; i++) //判断敌方子弹是否命中
        {
            if (arr[0][i].offsetTop > player.img.offsetTop - arr[0][i].offsetHeight && arr[0][i].offsetTop < player.img.offsetTop + player.img.offsetHeight && arr[0][i].offsetLeft > player.img.offsetLeft - arr[0][i].offsetWidth && arr[0][i].offsetLeft < player.img.offsetLeft + player.img.offsetWidth) {
                arr[0][i].parentNode.removeChild(arr[0][i]);
                if (arr[0][i].getThis().num === 0) {
                    num--;
                }
                else {
                    blood.play();
                    num = num + 10;
                }
                clearInterval(arr[0][i].timer);
                arr[0].splice(i, 1);
                i--;


                if (num <= 0) {
                    num = 0;
                    gameStatus('defeated');
                }
            }


        }
        for (i = 0; i < arr[1].length; i++)      //判断玩家子弹是否命中
        {
            for (var j = 0; j < arr[2].length; j++) {
                if (arr[1][i].offsetTop > arr[2][j].offsetTop - 30 && arr[1][i].offsetTop < arr[2][j].offsetTop + 60 && arr[1][i].offsetLeft > arr[2][j].offsetLeft - 30 && arr[1][i].offsetLeft < arr[2][j].offsetLeft + 60) {
                    arr[1][i].parentNode.removeChild(arr[1][i]);
                    arr[2][j].parentNode.removeChild(arr[2][j]);
                    clearInterval(arr[1][i].timer);
                    clearInterval(arr[2][j].timer);
                    arr[1].splice(i, 1);
                    arr[2].splice(j, 1);
                    i--;
                    j--;
                    grade++;
                    break;


                }


            }



        }

    }
    function Watch(ele) {   /* 飞机移动的生成与检测页面的变化 */
        //键盘时间感应以及玩家的移动
        addEvent(document, 'keyup', up);
        addEvent(document, 'keydown', down);

        //检测当前页面变化
        document.onvisibilitychange = function () {

            if (document.hidden === true) {
                if (mask.style.display !== 'block') {
                    gameStatus();
                }

            }
        };
        setInterval(function () {
            if (json[88] === true) {
                new Bullet(1, ele.style.top, ele.offsetLeft + 15 + 'px', 'img/zidan.png');
                shot.play();

            }
        }, 200);
        setInterval(function () {
            var left = ele.offsetLeft - 20,
                top = ele.offsetTop - 20,
                right = ele.offsetLeft + 20,
                down = ele.offsetTop + 20;
            if (json[37] === true) { if (left < 0) { left = 0; } ele.style.left = left + 'px'; }
            if (json[38] === true) { if (top < 0) { top = 0; } ele.style.top = top + 'px'; }
            if (json[39] === true) { if (right > width - 60) { right = width - 60; } ele.style.left = right + 'px'; }
            if (json[40] === true) { if (down > height - 60) { down = height - 60; } ele.style.top = down + 'px'; }
            span[0].innerHTML = num;
            span[1].innerHTML = grade;
        }, 30);
    }
    function hp() {
        var blood = new Cell(Math.random() * 20 + 'px', Math.random() * (height - 30) + 'px', 'img/xue.png');
        arr[0].push(blood.img);
        blood.move(2, height - 20);
        timer[2]=setTimeout(hp,10000);
    }
    function init() {  //游戏元素的刷新
        //随机产生敌机 top 为零 left能到最右的位置是屏幕宽度减去敌机的占位宽。
        var type = Math.round(Math.random() * 100) % 2;
        if (type === 0) {
            new Diji(0, 0, Math.random() * (width - 60) + 'px', 'img/diji0.png').move(3, height - 60);
        }
        if (type === 1) {
            new Diji(1, 0, Math.random() * (width - 60) + 'px', 'img/diji1.png').move(3, height - 30);
        }

        //循环给所有飞机发射炮弹
        for (var i = 0; i < arr[2].length; i++) {
            if (arr[2][i].getThis().num === 0) {
                new Bullet(0, arr[2][i].offsetTop + 30 + 'px', arr[2][i].offsetLeft + 2 + 'px', 'img/zidan1.png');
                new Bullet(0, arr[2][i].offsetTop + 30 + 'px', arr[2][i].offsetLeft + 48 + 'px', 'img/zidan1.png');
            }
            if (arr[2][i].getThis().num === 1) {
                new Bullet(0, arr[2][i].offsetTop + 15 + 'px', arr[2][i].offsetLeft + 12 + 'px', 'img/zidan2.png');
            }

        }
        timer[0] = setTimeout(init, 1500);
    }
    var num = 10,//原始血量
        grade = 0,//原始得分
        player,//给玩家飞机的名字便于寻找
        arr = [[], [], []],//存储游戏中的元素信息为了检测子弹与飞机的变化
        json = {},//用来存储按键状态 {88:true}发射状态
        width = window.innerWidth || document.documentElement.clientWidth,//存放窗口宽度
        height = window.innerHeight || document.documentElement.clientHeight,//存放窗口高度
        span = document.getElementsByTagName('span'),
        mask = document.getElementById('mask'),
        pause = document.getElementById('pause'),
        pauseButton = document.getElementById('pause-button'),
        bgm = document.getElementById('bgm'),
        shot = document.getElementById('shot'),
        blood = document.getElementById('blood'),
        img = document.getElementById('img'),
        h1 = pause.getElementsByTagName('h1'),
        btn = pause.getElementsByTagName('a')[0],
        timer = [];

    addEvent(btn, 'click', continute);
    addEvent(pauseButton, 'click', gameStatus);
    player = new Feiji('500px', '500px', 'img/feiji.png');//玩家飞机的制造
    new Watch(player.img);//监控按键变化窗口变化
    timer[0] = setTimeout(init, 1500);//敌机的制造
    timer[1] = setTimeout(background, 30);
    timer[2]=setTimeout(hp, 10000);
};

















