/**
 * Created by mgalli200 on 6/14/16.
 */
app.controller('myCtrl', ['$scope', "$mdSidenav", function ($scope, $mdSidenav) {
    $scope.title = "Welcome to the VADER Intern Page Summer 2016";
    $scope.page = ' Home ';
    $scope.menuClick = function () {
        $mdSidenav('sidenav').toggle();
        document.getElementById('menu').blur();
    };

    $scope.menuClose = function ($event) {
        $mdSidenav('sidenav').toggle();
        $scope.page = event.target.innerHTML;
        if ($scope.page != ' Home ') {
            $scope.title = "VADER Interns Summer 2016";
            $scope.mainTitleStyle = "padding-top:150";
        } else {
            $scope.title = "Welcome to the VADER Intern Page Summer 2016";
            $scope.mainTitleStyle = "padding-top:0";
        }
    }

}]);