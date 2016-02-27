var container = document.getElementById('container'),
    middlediv = container.children[0],
    button = middlediv.children[0],
    game = {
        score: 0,
        colors: [],
        speed: 2000,
        colorToFind: [],
        chrono: 30,
        passedTime: 0,
        init: function () {
            this.nextColor();
        },
        randomNumber: function () {
            return Math.floor(Math.random() * 255);
        },
        randomColor: function () {
            var red,
                green,
                blue,
                array = [];

            array[0] = red = this.randomNumber();
            array[1] = green = this.randomNumber();
            array[2] = blue = this.randomNumber();

            this.colors.push(array);
        },
        setCountdown: function () {
            middlediv.innerHTML = '<p>Find this color</p>';
            var self = this;
            var countdown = setTimeout(function () {
                self.suggestColors();
            }, self.speed);
        },
        setColor: function () {
            this.randomColor();
            this.colorToFind = this.colors[0];
            container.style.backgroundColor = 'rgb(' + this.colors[0][0] + ',' + this.colors[0][1] + ',' + this.colors[0][2] + ')';
        },
        nextColor: function () {
            this.colors = [];
            this.colorToFind = [];
            this.speed -= 10;
            this.setColor();
            this.setCountdown();
        },
        shuffleColors: function (o) {
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        },
        suggestColors: function () {
            var self = this;
            this.passedTime = 0;
            middlediv.innerHTML = '<div class="chrono">' + this.chrono.toFixed(1) + ' ' + this.score + '</div>';
            container.style.backgroundColor = '';
            for (var i = 0; i < 11; i++) {
                this.randomColor();
            }
            this.colors = this.shuffleColors(this.colors);
            for (var i = 0; i < 12; i++) {
                middlediv.innerHTML += '<div class="circle" style="background: rgb(' + this.colors[i][0] + ',' + this.colors[i][1] + ',' + this.colors[i][2] + ')"></div>';
            }
            var count = setInterval(function () {
                if (self.chrono <= 0.1) {
                    clearInterval(count);
                    self.gameOver();
                } else {
                    self.passedTime += 0.1;
                    self.chrono -= 0.1;
                    document.getElementsByClassName('chrono')[0].innerHTML = self.chrono.toFixed(1) + ' ' + self.score;
                }
            }, 100);
            this.checkAnswer(count);
        },
        checkAnswer: function (interval) {
            var circles = document.getElementsByClassName('circle'),
                self = this;

            for (var i = 0; i < this.colors.length; i++) {
                circles[i].addEventListener('touchend', function () {
                    if (this.style.backgroundColor === 'rgb(' + self.colorToFind[0] + ', ' + self.colorToFind[1] + ', ' + self.colorToFind[2] + ')') {
                        if (self.passedTime < 0.5) {
                            self.score += 25;
                        } else if (self.passedTime < 1) {
                            self.score += 10;
                        } else if (self.passedTime < 2) {
                            self.score += 5;
                        } else {
                            self.score += 1;
                        }
                        this.style.backgroundColor = "#FFF";
                        this.innerHTML = '<i class="fa fa-check"></i>';
                    } else {
                        self.chrono -= 3;
                        this.style.backgroundColor = "#FFF";
                        this.innerHTML = '<i class="fa fa-times"></i>';
                    }
                    clearInterval(interval);
                    setTimeout(function () {
                        if (this.chrono <= 0.1) {
                            this.gameOver();
                        } else {
                            self.nextColor();
                        }
                    }, 500);
                });
            }
        },
        gameOver: function () {
            middlediv.innerHTML = '<p>Game over !</p><p>Score : ' + this.score + '</p>';
        }
    };

button.addEventListener('touchend', function () {
    game.init();
});
