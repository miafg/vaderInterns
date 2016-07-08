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
    $scope.darth = {
        top: screenHeight - 175,
        left: screenWidth / 3,
        img: "http://i.telegraph.co.uk/multimedia/archive/01962/falcon-2_1962145c.jpg"
    };

    //function to check if spaceship is on the screen
    var onScreen = function(top, left) {
        return top > 0 && left > 0;
    }

    var move = function() {
        //move spaceship
        $scope.falconStyle = "top: " + $scope.darth.top + "px; left: " + $scope.darth.left + "px";
    }

    var collision = function(top, left, scale) {

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
            var img = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Dawn-image-070911.jpg/220px-Dawn-image-070911.jpg";
            var newAst = new Asteriod(top, left, scale, img);
            $scope.listAsteroids[i][j] = newAst;
        }
    }

    var velocity = 10;

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
         }
    }
    console.log(document);
}]);


