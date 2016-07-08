app.controller('miaCtrl', function($scope) {
    $scope.images = ["miaImage", "img1", "img2", "img3"];
    $scope.currentImg = 0;
    $scope.miaImage = "http://cdn.bgr.com/2015/11/darth-vader-daily-life-4.jpg?w=624";
    $scope.img1 = "http://i2.wp.com/cdn.bgr.com/2015/08/darth-vader.jpg?w=625";
    $scope.img2 = "http://digitalspyuk.cdnds.net/16/04/768x384/landscape-1453994837-movies-star-wars-darth-vader.jpg";
    $scope.img3 = "http://images.huffingtonpost.com/2015-06-16-1434479379-3365706-VaderXD.jpg";
    $scope.nextClick = function() {
        $scope.currentImg = ($scope.currentImg + 1) % 4;
        console.log(typeof($scope.currentImg));
    };
    $scope.prevClick = function() {
        $scope.currentImg = ($scope.currentImg - 1 + 4) % 4;
        console.log(typeof($scope.currentImg));
    };
});