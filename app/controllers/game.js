/**
 * Created by mgalli200 on 6/27/16.
 */
var Asteriod = function(posTop, posLeft, scale, image) {
    this.posTop = posTop;
    this.posLeft = posLeft;
    this.scale = scale;
    this.show = true;
    this.img = image;
}

app.controller('gameCtrl', ['$scope', '$document', '$window', function($scope, $document, $window) {
    var screenHeight = window.innerHeight;
    var screenWidth = window.innerWidth;
    console.log("width " + screenWidth);
    console.log("half width " + screenWidth / 2);
    $scope.darth = {
        top: screenHeight - 175,
        left: screenWidth / 2,
        img: "app/images/falcon.jpg"
    };

    //function to check if spaceship is on the screen
    var onScreen = function(top, left) {
        return top > 0 && left > 0;
    }

    var move = function() {
        //move spaceship
        $scope.falconStyle = "top: " + $scope.darth.top + "px; left: " + $scope.darth.left + "px";
    }

    $scope.showAsteroid = function (top, left, scale) {
        //move asteroid
         return "top: " + top + "px; left: " + left + "px; transform: scale(" + scale + "," + scale + ");";
    }

    //initial falcon position
    $scope.falconStyle = "top: " + $scope.darth.top + "px; left: " + $scope.darth.left + "px; position: absolute; width: 50; height: 50";
    //choose a number of asteroids between 15 & 25
    var row = 5;
    var col = 20;
    //create new list for asteroids
    $scope.listAsteroids = Array(row);
    var started = false;
    var topRows = screenHeight - 200;
    //populate asteroids with random positions on screen
    for (var i = 0; i < row; i++) {
        $scope.listAsteroids[i] = Array(col);
        topRows -= 100;
        var leftCols = 0;
        for (var j = 0; j < col; j++) {
            var top = topRows;
            var randSpace = parseInt(Math.random() * 50) + 50;
            var left = 0;
            if (j != 0) {
                left = randSpace + leftCols;
            }
            leftCols = left;
            var scale = Math.random() * 0.2 + 0.1;
            var img = "app/images/asteroid.jpg";
            var newAst = new Asteriod(top, left, scale, img);
            $scope.listAsteroids[i][j] = newAst;
        }
    }

    var velocity = 10;
    var falconImg = new Image();
    falconImg.src = $scope.darth.img;
    var falconScale = 0.2;
    var falconW = falconImg.width * falconScale;
    var falconH = falconImg.height * falconScale;
    console.log("HEIGHT " + falconH);
    console.log("WIDTH " + falconW);
    var asteroidImg = new Image();
    asteroidImg.src = "app/images/asteroid.jpg";
    var asteroidW = asteroidImg.width;
    var asteroidH = asteroidImg.height;
    var collision = function() {
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                var falconTop = $scope.darth.top;
                var falconLeft = $scope.darth.left;
                var falconBottom = falconTop + falconH;
                var falconRight = falconLeft + falconW;

                var curr = $scope.listAsteroids[i][j];
                var asteroidTop = curr.posTop;
                var asteroidLeft = curr.posLeft;
                var asteroidBottom = asteroidTop + (asteroidH * curr.scale);
                var asteroidRight = asteroidLeft + (asteroidW * curr.scale);

                var leftTop = falconLeft > asteroidLeft && falconLeft < asteroidRight && falconTop > asteroidTop
                    && falconTop < asteroidBottom;
                var rightTop = falconRight > asteroidLeft && falconRight < asteroidRight && falconTop > asteroidTop
                    && falconTop < asteroidBottom;
                var leftBottom = falconLeft > asteroidLeft && falconLeft < asteroidRight && falconBottom > asteroidTop
                    && falconBottom < asteroidBottom;
                var rightBottom = falconRight > asteroidLeft && falconRight < asteroidRight && falconBottom > asteroidTop
                    && falconBottom < asteroidBottom;

               /* console.log("FALCON DIMENSIONS: \n" + "top: " + falconTop + "\nleft: " + falconLeft + "\nbottom: " +
                    falconBottom + "\nright: " + falconRight);
                console.log("ASTEROID DIMENSIONS: \n" + "top: " + asteroidTop + "\nleft: " + asteroidLeft + "\nbottom: " +
                    asteroidBottom + "\nright: " + asteroidRight);*/
                if (leftTop || rightTop || leftBottom || rightBottom) {
                    console.log("COLLISION");
                }
            }
        }
    }


    $scope.playGame = function (event) {
         if (event.keyCode == 38 && !$scope.started) {
             $scope.started = true;
         } else if ($scope.started) {
            switch (event.keyCode) {
                case 37:
                    var shifted = $scope.darth.left - velocity;
                    if (onScreen($scope.darth.top, shifted)) {
                        $scope.darth.left -= velocity;
                        move();
                    }
                    break;
                case 38:
                    var shifted = $scope.darth.top - velocity;
                    if (onScreen(shifted, $scope.darth.left)) {
                        $scope.darth.top -= velocity;
                        move();
                    }
                    break;
                case 39:
                    var shifted = $scope.darth.left + velocity;
                    if (onScreen($scope.darth.top, shifted)) {
                        $scope.darth.left += velocity;
                        move();
                    }
                    break;
                case 40:
                    var shifted = $scope.darth.top + velocity;
                    if (onScreen(shifted, $scope.darth.left)) {
                        $scope.darth.left += velocity;
                        move();
                    }
                    break;
                default:
                    break;
            }
             collision();
         }
    }
}]);


