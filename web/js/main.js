//Instance
var sidebarClosed = true;

var app = angular.module("myApp", ["ngRoute"]);
app.controller('myCtrl', function ($scope, $http, $rootScope, $location) {

  var myURL = "http://weboholics-001-site4.htempurl.com"; // remote release
  //var myURL = "http://localhost:5000"; //local dev

  $http.get("../schooldata/data.json")
    .then(function (response) {
      $scope.data = response.data;
    });

  $scope.login = function () {
    var username = document.getElementById("usernameInput").value;
    var password = document.getElementById("passwordInput").value;
    $http.post(myURL + '/api/users/login', {
      Username: username,
      Password: password
    })
      .then(function (response) {
        if (response.data) {
          $rootScope.rootData = response.data;
          $location.url('/dashboard');
        } else {
          alert("Something odd happened, did you really write the correct login info?");
        }
      });
  };

  $scope.getobject = function (thisobject) {
    $scope.chosenObject = thisobject;
  }

  $scope.showMyCourses = function () {
    $http.post(myURL + '/api/courses/mycourses', {
      Username: $rootScope.rootData.user_name
    })
      .then(function (response) {
        if (response.data) {
          $rootScope.rootCourses = response.data;
        }
      });
  };

  $scope.showMyTodo = function () {

    $http.post(myURL + '/api/users/todo', {
      Username: $rootScope.rootData.user_name
    })
      .then(function (response) {
        if (response.data) {
          $scope.todo = response.data;
        }
      });
  };

  $scope.showCourseInfo = function () {
    $http.post(myURL + '/api/courses/MySchedule', {
      course_name: $scope.chosenObject.course_name
    })
      .then(function (response) {
        if (response.data) {
          $scope.schedule = response.data;

          $http.post(myURL + '/api/courses/CourseAssignment', {
            course_name: $scope.chosenObject.course_name
          })
            .then(function (response) {
              if (response.data) {
                $scope.homework = response.data;
              }
            });
        }
      });
  };

  $scope.showMyGrades = function () {

    $http.post(myURL + '/api/users/grade', {
      Username: $rootScope.rootData.user_name
    })
      .then(function (response) {
        if (response.data) {
          $scope.grades = response.data;
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
    })
    .when("/assignments", {
      templateUrl: "templates/assignments.html"
    });

});
