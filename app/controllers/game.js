/**
 * Created by mgalli200 on 6/27/16.
 */


app.controller('gameCtrl', ['$scope', '$document', '$window', function($scope, $document, $window) {
    var myGamePiece;
    var asteroidList;
    var finishLine;
    var reset;
    var level;
    var twoPlayer;
    var gameAnimate = {
        value: false
    };

    function startGame() {
        level = 1;
        myGameArea.setup();
        myGameArea.start();
    }

    var populateAsteroids = function() {
        var row = 7;
        var col = 20;
        var y = myGameArea.getHeight() - 150;
        asteroidList = Array(row);
        //populate asteroids with random positions on screen
        for (var i = 0; i < row; i++) {
            asteroidList[i] = Array(col);
            y -= 80;
            var x = 0;
            for (var j = 0; j < col; j++) {
                var top = y;
                var randSpace = parseInt(Math.random() * 50) + 100;
                var left = 0;
                if (j != 0) {
                    left = randSpace + x;
                }
                x = left;
                var randScale = Math.random() * 0.2 + 0.1;
                var width = 175 * randScale;
                var height = 188 * randScale;
                var img = "app/images/asteroid.jpg";
                var comp = new ComponentImg(width, height, img, left, top);
                comp.loadImage();
                comp.show();
                asteroidList[i][j] = comp;
            }
        }
    }

     var ComponentImg = function(width, height, image, x, y) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageLink = image;
        this.imageObject = new Image(width, height);
        this.isLoaded = false;
    }

    function addFunctionsToComponentImg() {
        ComponentImg.prototype.initialShow = function (){
            this.imageObject.src = this.imageLink;
            var self = this;
            this.imageObject.onload = function () {
                self.isLoaded = true;
                ctx = myGameArea.context;
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(self.imageObject, self.x, self.y, this.width, this.height);
            }
        }

        ComponentImg.prototype.show = function () {
            var img = this.imageObject;
            var x = this.x;
            var y = this.y;
            if (this.isLoaded) {
                ctx = myGameArea.context;
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, x, y, this.width, this.height);
            }
        }
        ComponentImg.prototype.loadImage = function () {
            var self = this;
            this.imageObject.src = this.imageLink;
            this.imageObject.onload = function() {
                self.isLoaded = true;
            }
        }
    }

    function ComponentText(text, x, y, size, color) {
        context = myGameArea.context;
        context.fillStyle = color;
        context.font = size + "px monospace";
        context.fillText(text, x, y);
    }

    function ComponentLine (width, color, x, y) {
        ctx = myGameArea.context;
        ctx.moveTo(x,y);
        ctx.lineTo(x+ width, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function Instructions() {
        var screenWidth = myGameArea.getWidth();
        var screenHeight = myGameArea.getHeight();
        var w = screenWidth * .7;
        var h = screenHeight * .7;
        var wOffset = (screenWidth - w)  / 2;
        var hOffset = (screenHeight - h) / 2;
        ctx = myGameArea.context;
        ComponentText("Instructions:", wOffset + 20, hOffset + 40, 20, '#FF0000');
        ComponentText("Use the arrow keys to navigate.", wOffset + 20, hOffset + 60, 20, '#FF0000');
        ComponentText("Avoid the asteroids in order to make it across the finish line.", wOffset + 20, hOffset + 80, 20, '#FF0000');
        ComponentText("Press 'p' anytime during the game to pause", wOffset + 20, hOffset + 100, 20, '#FF0000');
        ComponentText("Press 'q' or 'esc' anytime during the game to quit", wOffset + 20, hOffset + 120, 20, '#FF0000');
        ComponentText("Press 's', enter or the space bar to start!", wOffset + 20, hOffset + 140, 20, '#FF0000');
        ctx.beginPath();
        ctx.fillStyle = 'rgba(40, 40, 40, 0.9)';
        ctx.fillRect(wOffset, hOffset, w, h);
        ctx.closePath();
        ctx.stroke();
    }

    function createGamePiece() {
        var x = myGameArea.getWidth() / 2;
        var y = myGameArea.getHeight() - 100;
        var width = 30;
        var height = 20;
        myGamePiece = new ComponentImg(width, height, "app/images/falcon.jpg", x, y);
        myGamePiece.loadImage();
    }

    var myGameArea = {
        canvas: document.getElementById("myCanvas"),
        setup: function() {
            this.context = this.canvas.getContext('2d');
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.context.globalCompositeOperation = 'destination-over';
            addFunctionsToComponentImg();
        },
        start: function() {
            reset = false;
            populateAsteroids();
            createGamePiece();
            Instructions();
            drawBoard();
            window.addEventListener('keydown',gameLogic);
        },
        getHeight: function () {
            return this.canvas.offsetHeight;
        },
        getWidth: function() {
            return this.canvas.offsetWidth;
        },
        clear: function() {
            this.context.clearRect(0, 0, this.getWidth(), this.getHeight());
        }
    }

    function animate() {
        if (gameAnimate.value) {
            var fps = 30;
            setTimeout(function() {
                requestAnimFrame(function () {
                    if (!reset) {
                        updateGameArea();
                    }
                }, 1000/fps);
            });
        }
    }

    function gameLogic(e) {
        var code = e.keyCode;
        console.log(code);
        if (code == 83 || code == 32 || code == 13) {
            window.removeEventListener('keydown', gameLogic);
            window.addEventListener('keydown', keyController);
            window.requestAnimFrame = (function (callback) {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame
            })();
            reset = false;
            gameAnimate.value = true;
            animate();
        }
    }

    function keyController(e) {
        //check the key code
        var width = myGameArea.getWidth();
        var height = myGameArea.getHeight();
        switch (e.keyCode) {
            case 27:
                //'esc'
                if (gameAnimate.value) {
                    gameAnimate.value = false;
                    restartGame();
                    reset = true;
                    return;
                }
                return;
            case 32:
                //space
                if (!gameAnimate.value) {
                    gameAnimate.value = true;
                    animate();
                }
                break;
            case 37:
                //left arrow
                if (gameAnimate.value) {
                    if (myGamePiece.x >= 15) {
                        myGamePiece.x -= 15;
                    }
                }
                break;
            case 38:
                //up arrow
                if (gameAnimate.value) {
                    if (myGamePiece.y >= 35) {
                        myGamePiece.y -= 15;
                    }
                }
                break;
            case 39:
                //right arrow
                if (gameAnimate.value) {
                    if (myGamePiece.x < width - 65) {
                        myGamePiece.x += 15;
                    }
                }
                break;
            case 40:
                //down arrow
                if (gameAnimate.value) {
                    if (myGamePiece.y < height - 105) {
                        myGamePiece.y += 15;
                    }
                }
                break;
            case 80:
                //'p'
                gameAnimate.value = false;
                break;
            case 81:
                //'q'
                if (gameAnimate.value) {
                    gameAnimate.value = false;
                    restartGame();
                    reset = true;
                    return;
                }
                break;
            case 83:
                //'s'
                if (!gameAnimate.value) {
                    gameAnimate.value = true;
                    animate();
                }
                break;
            default:
                break;
        }
        crossedFinish();
    }

    function restartGame() {
        window.removeEventListener('keydown', keyController);
        myGameArea.clear();
        myGameArea.start();
    }

    function drawBoard() {
        var x = myGameArea.getWidth() / 2;
        finishLine = new ComponentLine(myGameArea.getWidth(), '#FF0000', 0, 50);
        finishText = new ComponentText("Finish Line", x - 50, 45, 20, '#FF0000');
        myGamePiece.show();
    }

    function updateGameArea() {
        if (!reset) {
            myGameArea.clear();
            var screenWidth = myGameArea.getWidth();
            var numCols = asteroidList[0].length;
            var isCollision = false;
            for (var row = 0; row < asteroidList.length; row++) {
                for (var col = 0; col < asteroidList[0].length; col++) {
                    var currComponent = asteroidList[row][col];
                    if (currComponent.x > screenWidth + 200) {
                        var randScale = Math.random() * 0.2 + 0.1;
                        var width = 175 * randScale;
                        var height = 188 * randScale;
                        currComponent.width = width;
                        currComponent.height = height;
                        var neighborComp = asteroidList[row][(col + 1) % numCols];
                        currComponent.x = neighborComp.x - (parseInt(Math.random() * 50) + 100);
                    } else {
                        currComponent.x++;
                    }
                    currComponent.show();
                    isCollision = collisionCheck(currComponent.x, myGamePiece.x, currComponent.y, myGamePiece.y,
                        currComponent.width, myGamePiece.width, currComponent.height, myGamePiece.height);
                    if (isCollision) {
                        gameAnimate.value = false;
                        alert("YOU LOSE!");
                        restartGame();
                        return;
                    }
                }
            }
            drawBoard();
            animate();
        }
    }

    function collisionCheck(x1, x2, y1, y2, width1, width2, height1, height2) {
        var borders = (y1 + height1 == y2 && x1 >= x2 && x1 <= x2 + width2) || (y1 == y2 + height2 &&
            x1 >= x2 && x1 <= x2 + width2) || (x1 == x2 + width2 && y1 >= y2 && y1 <= y2 + width2) ||
            (x1 + width1 == x2 && y1 >= y2 && y1 <= y2 + height2);
        var topLeftCorner = x1 >= x2 && x1 <= x2 + width2 && y1 >= y2 && y1 <= y2 + height2;
        var topRightCorner = x1 + width1 >= x2 && x1 + width1 <= x2 + width2 && y1 >= y2 && y1 <= y2 + height2;
        var bottomLeftCorner = x1 + width1 >= x2 && x1 + width1 <= x2 + width2 && y1 + height1 >= y2 && y1 + height1 <= y2 + height2;
        var bottomRightCorner = x1 >= x2 && x1 <= x2 + width2 && y1 + height1 >= y2 && y1 + height1 <= y2 + height2;
        return borders || topLeftCorner || topRightCorner || bottomLeftCorner || bottomRightCorner;
    }

    function crossedFinish() {
        if (myGamePiece.y + myGamePiece.height <= 50) {
            gameAnimate.value = false;
            alert("YOU WIN!");
            restartGame();
            reset = true;
        }
    }

    startGame();
}]);


