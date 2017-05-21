//Instance
var sidebarClosed = true;

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
      .then(function (response) {
        if (response.data) {
          $rootScope.rootData = response.data;
          $location.url('/dashboard');
        }
        else{
          alert("Something odd happened, did you really write the correct login info?");
        }
      });
  };

  $scope.showMyCourses = function () {

    $http.post('http://localhost:5000/api/courses/mycourses', {
        Username: $rootScope.rootData.user_name
      })
      .then(function (response) {
        if (response.data) {
          $rootScope.rootCourses = response.data;
        }
      });

  };

  $scope.sidebarMenu = function () {
    var documentWidth = $(document).width();
    if (documentWidth > 500) {
      documentWidth *= 0.2;
    }
    $('#sidebar').animate({
      width: documentWidth
    }, 0);
    $('#sidebar').animate({
      width: 'toggle'
    }, 350);

    if (sidebarClosed) {
      $('#sidebar-btn').animate({
        right: documentWidth
      }, 0);
    } else {
      $('#sidebar-btn').animate({
        right: 0
      }, 10);
    }
    sidebarClosed = !sidebarClosed;
  };

});

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "templates/login.html"
    })
    .when("/dashboard", {
      templateUrl: "templates/dashboard.html"

    })
    .when("/selectedcourse", {
      templateUrl: "templates/selectedcourse.html"
    })
    .when("/courses", {
      templateUrl: "templates/courses.html"
    })
    .when("/grades", {
      templateUrl: "templates/grades.html"
    });

});
