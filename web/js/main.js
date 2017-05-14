var app = angular.module("myApp", ["ngRoute"]);
app.controller('myCtrl', function ($scope, $http, $rootScope, $location) {
  $http.get("../schooldata/data.json")
    .then(function (response) {
      $scope.data = response.data;
    });

  $scope.login = function () {
    var username = document.getElementById("usernameInput").value;
    var password = document.getElementById("passwordInput").value;
    $http.post('http://localhost:5000/api/users/login', {
        Username: username,
        Password: password
      })
      .then(function (data) {
        if (data != null && data != "") {
          $rootScope.rootData = data.data;
          $location.url('/dashboard');
        }
      });

        $http.post('http://localhost:5000/api/courses/mycourses', {
          course_status: "Active",

        })
        .then(function (data) {
            $rootScope.rootCourses = data.data;

        });
  };
});

app.config(function ($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl: "templates/login.html"
  })
  .when("/dashboard", {
    templateUrl: "templates/dashboard.html"
  });
});