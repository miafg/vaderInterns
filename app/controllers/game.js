/**
 * Created by mgalli200 on 6/27/16.
 */


app.controller('gameCtrl', ['$scope', '$document', '$window', function($scope, $document, $window) {
    var myGamePiece;
    var secondGamePiece;
    var asteroidList;
    var finishLine;
    var bottomLine;
    var reset;
    var level;
    var levelText;
    var twoPlayer;
    var twoPlayerBox;
    var hasStarted;
    var bullets;
    var gameAnimate = {
        value: false
    };

    function startGame() {
        level = 1;
        twoPlayerBox = new CheckBox(150,32);
        myGameArea.canvas.addEventListener('mousedown', function(e) {
            var x = e.offsetX;
            var y = e.offsetY;
            if (x >= 150 && x <= 175 && y >= 32 && y <= 47) {
                twoPlayerBox.checked = !twoPlayerBox.checked;
                twoPlayerBox.update();
                gameAnimate.value = false;
                level = 1;
                restartGame();
                reset = true;
            }

        });
        myGameArea.setup();
        myGameArea.start();
    }

    var populateAsteroids = function() {
        var row = 7;
        var col;
        if (!twoPlayerBox.checked) {
            col = 5;
        } else {
            col = 20;
        }
        var y = myGameArea.getHeight() - 150;
        asteroidList = Array(row);
        //populate asteroids with random positions on screen
        for (var i = 0; i < row; i++) {
            asteroidList[i] = Array(col);
            y -= 85;
            var x = 0;
            for (var j = 0; j < col; j++) {
                var top = y;
                var scale = 150;
                var mandatorySpace = 150;
                if (!twoPlayerBox.checked) {
                    scale = 500 - (50 * level);
                    mandatorySpace =  300 - (10 * level);
                }
                var randSpace = parseInt(Math.random() * scale) + mandatorySpace;
                var left = x + randSpace;
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
        this.toDisplay = true;
    }

    var Bullet = function(x, y, move) {
        this.x = x;
        this.y = y;
        this.move = move;
    }

    function addFunctionsToComponents() {
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
        Bullet.prototype.draw = function () {
            ctx = myGameArea.context;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#FF0000';
            ctx.fill();
            ctx.closePath();
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

    function InstructionsSinglePlayer() {
        var screenWidth = myGameArea.getWidth();
        var screenHeight = myGameArea.getHeight();
        var w = screenWidth * .7;
        var h = screenHeight * .7;
        var wOffset = (screenWidth - w)  / 2;
        var hOffset = (screenHeight - h) / 2 - 32;
        ctx = myGameArea.context;
        ComponentText("Instructions:", wOffset + 20, hOffset + 40, 20, '#FF0000');
        ComponentText("Use the arrow keys to navigate.", wOffset + 20, hOffset + 60, 20, '#FF0000');
        ComponentText("Avoid the asteroids in order to make it across the finish line.", wOffset + 20, hOffset + 80, 20, '#FF0000');
        ComponentText("Press 'p' anytime during the game to pause", wOffset + 20, hOffset + 100, 20, '#FF0000');
        ComponentText("Press 'q' or 'esc' anytime during the game to quit", wOffset + 20, hOffset + 120, 20, '#FF0000');
        ComponentText("Press enter or the space bar to start!", wOffset + 20, hOffset + 140, 20, '#FF0000');
        ctx.beginPath();
        ctx.fillStyle = 'rgba(40, 40, 40, 0.9)';
        ctx.fillRect(wOffset, hOffset, w, h);
        ctx.closePath();
        ctx.stroke();
    }

    function InstructionsTwoPlayer() {
        var screenWidth = myGameArea.getWidth();
        var screenHeight = myGameArea.getHeight();
        var w = screenWidth * .7;
        var h = screenHeight * .7;
        var wOffset = (screenWidth - w)  / 2;
        var hOffset = (screenHeight - h) / 2 - 32;
        ctx = myGameArea.context;
        ComponentText("Instructions:", wOffset + 20, hOffset + 40, 20, '#FF0000');
        ComponentText("Player 1 (Falcon Ship): use 'a', 'w', 's' and 'd'", wOffset + 20, hOffset + 60, 20, '#FF0000');
        ComponentText("Player 2 (Tie Fighter): use arrow keys", wOffset + 20, hOffset + 80, 20, '#FF0000');
        ComponentText("Avoid the asteroids in order to make it across the finish line.", wOffset + 20, hOffset + 100, 20, '#FF0000');
        ComponentText("Press 'p' anytime during the game to pause", wOffset + 20, hOffset + 120, 20, '#FF0000');
        ComponentText("Press 'q' or 'esc' anytime during the game to quit", wOffset + 20, hOffset + 140, 20, '#FF0000');
        ComponentText("Press enter or the space bar to start!", wOffset + 20, hOffset + 160, 20, '#FF0000');
        ctx.beginPath();
        ctx.fillStyle = 'rgba(40, 40, 40, 0.9)';
        ctx.fillRect(wOffset, hOffset, w, h);
        ctx.closePath();
        ctx.stroke();
    }

    function LevelWindow() {
        var screenWidth = myGameArea.getWidth();
        var screenHeight = myGameArea.getHeight();
        var w = screenWidth * .7;
        var h = screenHeight * .7;
        var wOffset = (screenWidth - w)  / 2;
        var hOffset = (screenHeight - h) / 2 - 32;
        ctx = myGameArea.context;
        ComponentText("Level Up!", wOffset + w / 2 - 20, hOffset + 40, 20, '#FF0000');
        ctx.beginPath();
        ctx.fillStyle = 'rgba(40, 40, 40, 0.9)';
        ctx.fillRect(wOffset, hOffset, w, h);
        ctx.closePath();
        ctx.stroke();
    }

    function createTwoGamePieces() {
        var x1 = myGameArea.getWidth() / 2;
        var x2 = myGameArea.getWidth() / 2;
        var y1 = myGameArea.getHeight() - 100;
        var y2 = 20;
        var width = 30;
        var height = 20;
        myGamePiece = new ComponentImg(width, height, "app/images/falcon.jpg", x1, y1);
        myGamePiece.loadImage();
        secondGamePiece = new ComponentImg(width, height,"app/images/tiefighter.JPG" ,x2, y2);
        secondGamePiece.loadImage();
    }

    function createGamePiece() {
        var x = myGameArea.getWidth() / 2;
        var y = myGameArea.getHeight() - 100;
        var width = 30;
        var height = 20;
        myGamePiece = new ComponentImg(width, height, "app/images/falcon.jpg", x, y);
        myGamePiece.loadImage();
    }

    function CheckBox(x,y) {
        this.x = x;
        this.y = y;
        this.width = 15;
        this.height = 15;
        this.checked = false;
        this.update = function() {
            ctx = myGameArea.context;
            myGameArea.context.clearRect(this.x - 5, this.y - 5, 25, 21);
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.font = "26px sans-serif";
            if (this.checked) {
                ctx.fillStyle = '#FF0000';
                ctx.fillText('\u2715', this.x - 2, this.y + 16);
            }
        }
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
            addFunctionsToComponents();
        },
        start: function() {
            hasStarted = false;
            reset = false;
            bullets = [];
            populateAsteroids();
            if (twoPlayerBox.checked) {
                createTwoGamePieces();
                InstructionsTwoPlayer();
            } else {
                createGamePiece();
                if (level == 1) {
                    InstructionsSinglePlayer();
                } else {
                    LevelWindow();
                }
                addMoreAsteroids();
            }
            drawBoard();
            twoPlayerBox.update();
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

    function addMoreAsteroids() {
        var y = myGameArea.getHeight() - 150;
        for (var row = 0; row < asteroidList.length; row++) {
            y -= 85;
            var x = asteroidList[row][asteroidList[row].length - 1].x;
            for (var i = 0; i < 2; i++) {
                var top = y;
                var scale = 100;
                var mandatorySpace = 100;
                if (!twoPlayerBox.checked) {
                    scale = 500 - (50 * level);
                    mandatorySpace =  400 - (10 * level);
                }
                var randSpace = parseInt(Math.random() * scale) + mandatorySpace;
                var left = randSpace + x;
                x = left;
                var randScale = Math.random() * 0.2 + 0.1;
                var width = 175 * randScale;
                var height = 188 * randScale;
                var img = "app/images/asteroid.jpg";
                var comp = new ComponentImg(width, height, img, left, top);
                comp.loadImage();
                comp.show();
                asteroidList[row].push(comp);
            }
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
        if (code == 32 || code == 13) {
            hasStarted = true;
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
        var whoMoved;
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
                        whoMoved = "fal";
                    }
                }
                break;
            case 38:
                //up arrow
                if (gameAnimate.value) {
                    if (myGamePiece.y >= 35) {
                        myGamePiece.y -= 15;
                        whoMoved = "fal";
                    }
                }
                break;
            case 39:
                //right arrow
                if (gameAnimate.value) {
                    if (myGamePiece.x < width - 65) {
                        myGamePiece.x += 15;
                        whoMoved = "fal";
                    }
                }
                break;
            case 40:
                //down arrow
                if (gameAnimate.value) {
                    if (myGamePiece.y < height - 105) {
                        myGamePiece.y += 15;
                        whoMoved = "fal";
                    }
                }
                break;
            case 65:
                //'a'
                if (twoPlayerBox.checked && gameAnimate.value) {
                    if (secondGamePiece.x >= 15) {
                        secondGamePiece.x -= 15;
                        whoMoved = "tie";
                    }
                }
                break;
            case 68:
                //'d'
                if (twoPlayerBox.checked && gameAnimate.value) {
                    if (secondGamePiece.x < width - 65) {
                        secondGamePiece.x += 15;
                        whoMoved = "tie";
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
                if (twoPlayerBox.checked && gameAnimate.value) {
                    if (secondGamePiece.y < height - 105) {
                        secondGamePiece.y += 15;
                        whoMoved = "tie";
                    }
                }
                break;
            case 87:
                //'w'
                if (twoPlayerBox.checked && gameAnimate.value) {
                    if (secondGamePiece.y >= 35) {
                        secondGamePiece.y -= 15;
                        whoMoved = "tie";
                    }
                }
            default:
                break;
        }
        if (twoPlayerBox.checked) {
            if (whoMoved == "tie" && secondGamePiece.toDisplay) {
                addBullet(secondGamePiece.x + secondGamePiece.width / 2, secondGamePiece.y + secondGamePiece.height, 11);
            } else if (whoMoved == "fal" && myGamePiece.toDisplay) {
                addBullet(myGamePiece.x + myGamePiece.width / 2, myGamePiece.y, -11);
            }
        }
        crossedFinish();
    }

    function addBullet(x, y, move) {
        var newBullet = new Bullet(x, y, move);
        newBullet.draw();
        bullets.push(newBullet);
    }

    function restartGame() {
        window.removeEventListener('keydown', keyController);
        myGameArea.clear();
        myGameArea.start();
    }

    function drawBoard() {
        var x = myGameArea.getWidth() / 2;
        finishLine = new ComponentLine(myGameArea.getWidth(), '#FF0000', 0, 50);
        twoPlayer = new ComponentText("Two Player", 20, 45, 20, '#FF0000');
        twoPlayerBox.update();
        if (myGamePiece.toDisplay && twoPlayerBox.checked) {
            myGamePiece.show();
        } else if (!twoPlayerBox.checked) {
            myGamePiece.show();
            levelText = new ComponentText("Level: " + level, myGameArea.getWidth() - 130, 45, 20, '#FF0000');
        }

        if (twoPlayerBox.checked) {
            if (secondGamePiece.toDisplay) {
                secondGamePiece.show();
            }
            myGameArea.context.lineWidth = 3;
            bottomLine = new ComponentLine(myGameArea.getWidth(), '#FF0000', 0, myGameArea.getHeight() - 110);
        } else {
            if (hasStarted) {
                finishText = new ComponentText("Finish Line", x - 50, 45, 20, '#FF0000');
            }
        }
    }

    function updateGameArea() {
        if (!reset) {
            myGameArea.clear();
            var screenWidth = myGameArea.getWidth();
            var numCols = asteroidList[0].length;
            var isCollisionFalcon = false;
            var isCollisionTie = false;
            for (var row = 0; row < asteroidList.length; row++) {
                for (var col = numCols - 1; col >= 0; col--) {
                    var currComponent = asteroidList[row][col];
                    var offset = 1000;
                    if (!twoPlayerBox.checked) {
                        offset = 600;
                    }
                    if (currComponent.x > screenWidth + offset) {
                        var randScale = Math.random() * 0.2 + 0.1;
                        var width = 175 * randScale;
                        var height = 188 * randScale;
                        currComponent.width = width;
                        currComponent.height = height;
                        var neighborComp = asteroidList[row][(col + 1) % numCols];
                        var scale = 150;
                        var mandatoryOffset = 150;
                        if (!twoPlayerBox.checked) {
                            scale = 500 - (50 * level);
                            mandatoryOffset=  300 - (10 * level);
                        }
                        currComponent.x = neighborComp.x - (parseInt(Math.random() * scale) + mandatoryOffset);
                    } else {
                        if (!twoPlayerBox.checked) {
                            currComponent.x += 1+ level * .1;
                        } else {
                            currComponent.x++;
                        }
                    }
                    currComponent.show();
                    isCollisionFalcon = collisionCheck(currComponent.x, myGamePiece.x, currComponent.y, myGamePiece.y,
                        currComponent.width, myGamePiece.width, currComponent.height, myGamePiece.height);

                    if (twoPlayerBox.checked) {
                        isCollisionTie = collisionCheck(currComponent.x, secondGamePiece.x, currComponent.y, secondGamePiece.y,
                            currComponent.width, secondGamePiece.width, currComponent.height, secondGamePiece.height);
                        if (isCollisionTie) {
                            secondGamePiece.toDisplay = false;
                            if (!myGamePiece.toDisplay) {
                                alert("No one wins!");
                                restartGame();
                                return;
                            }
                        }
                        //check if any bullets have collided with the rocks
                        for (var k = 0; k < bullets.length; k++) {
                            var bulletCollision = collisionBullet(currComponent.x, bullets[k].x, currComponent.y, bullets[k].y, currComponent.width, currComponent.height);
                            if (bulletCollision) {
                                bullets.splice(k,1);
                            }
                        }
                    }
                    if (isCollisionFalcon) {
                        if (twoPlayerBox.checked) {
                            myGamePiece.toDisplay = false;
                            if (!secondGamePiece.toDisplay) {
                                alert("No one wins!");
                                restartGame();
                                return;
                            }
                        } else {
                            level = 1;
                            gameAnimate.value = false;
                            alert("YOU LOSE!");
                            restartGame();
                            return;
                        }
                    }
                }
            }
            //check two players have collided
            if (twoPlayerBox.checked) {
                if (collisionCheck(myGamePiece.x, secondGamePiece.x, myGamePiece.y, secondGamePiece.y,
                    myGamePiece.width, secondGamePiece.width, myGamePiece.height, secondGamePiece.height)) {
                    gameAnimate.value = false;
                    alert("Both players lose!");
                    restartGame();
                }
                for (var i = 0; i < bullets.length; i++) {
                    bullets[i].y += bullets[i].move;
                    bullets[i].draw();
                    var collisionFalcon = collisionBullet(myGamePiece.x, bullets[i].x, myGamePiece.y, bullets[i].y, myGamePiece.width, myGamePiece.height);
                    var collisionTie = collisionBullet(secondGamePiece.x, bullets[i].x, secondGamePiece.y, bullets[i].y, secondGamePiece.width, secondGamePiece.height);
                    if (collisionFalcon) {
                        myGamePiece.toDisplay = false;
                        if (!secondGamePiece.toDisplay) {
                            alert("No one wins!");
                            restartGame();
                            return;
                        } 
                    }
                    if (collisionTie) {
                        secondGamePiece.toDisplay = false;
                        if (!myGamePiece.toDisplay) {
                            alert("No one wins!");
                            restartGame();
                            return;
                        }
                    }
                }
            }

            drawBoard();
            animate();
        }
    }

    function collisionBullet(objX, x, objY, y, objWidth, objHeight) {
        return x >= objX && x <= objX + objWidth && y >= objY && y <= objY + objHeight;
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
        if (twoPlayerBox.checked) {
            if (myGamePiece.y + myGamePiece.height <= 50 && secondGamePiece.y >= myGameArea.getHeight() - 110) {
                gameAnimate.value = false;
                alert("TIE!");
                restartGame();
                reset = true;
            }
            if (secondGamePiece.y >= myGameArea.getHeight() - 110) {
                gameAnimate.value = false;
                alert("Tie Fighter Wins!");
                restartGame();
                reset = true;
            }
        }
        if (myGamePiece.y + myGamePiece.height <= 50) {
            gameAnimate.value = false;
            if (twoPlayerBox.checked) {
                alert("Falcon Wins!");
            } else {
                alert("You won level " + level);
                level++;
            }
            restartGame();
            reset = true;
        }
    }

    startGame();
}]);


