//Instance
var sidebarClosed = true;

var app = angular.module("myApp", ["ngRoute"]);
app.controller('myCtrl', function ($scope, $http, $rootScope, $location) {

  // var myURL = "http://weboholics-001-site4.htempurl.com"; // remote release
  var myURL = "http://localhost:5000"; //local dev

  $scope.loginError = false;
  $scope.feedbackAlternatives = ["DÅLIGT", "MELLAN", "BRA"];
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
          if (response.data.user_type == 'student') {
            $location.url('/dashboard');
            alert("student")  
          }
          else if(response.data.user_type == 'teacher'){
            $location.url('/teacherDashboard');
            alert("teacher");

          }


        } else {
          $scope.loginError = true;
          $("#loginError").fadeIn("slow");
        }
      });
  };

  $scope.getobject = function (thisobject) {
    $scope.chosenObject = thisobject;
  }

  $scope.resetTheFeedback = function (thisobject) {

    $http.get(myURL + '/api/users/ResetFeedback', {

    })
  };

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

  //Checks if the user has voted
  $scope.HasVoted = function () {
    $http.post(myURL + '/api/users/HasVoted', {
      user_id: $rootScope.rootData.user_id
    })
      .then(function (response) {
        if (response.data != null && response.data != "") {

          //If the user has voted
          $scope.hasVotedToday = response.data;

        } else {

          //If the user hasn't voted
          $scope.hasVotedToday = "no";

        }
      });
  };

  //The daily feedback
  $scope.SendFeedback = function (theVote) {
    $http.post(myURL + '/api/users/SendFeedback', {
      feedback_vote: theVote,
      user_id: $rootScope.rootData.user_id
    })
      .then(function (response) {
        $scope.hasVotedToday = response.data;

      });
  };

  // Leave attendance
  $scope.leaveAttendance = function () {
    var theCode = document.getElementById("codeInput").value;

    $http.post(myURL + '/api/attendence/presence', {
      coursecode_code: theCode,
      username: $rootScope.rootData.user_name
    })
      .then(function (response) {
        $scope.courseName = response.data[0].course_name;
        if (response.data != null && response.data != "") {
          var message = "Du är närvarande på kursen " + $scope.courseName;
          showToast(true, message);
        }
        else {
          var message = "Ingen närvaro för kod " + theCode;
          showToast(false, message);
        }
      });
  };

  // show toast message
  var showToast = function (success, message) {
    var toast = document.getElementById("snackbar");

    if (success) {
      toast.className = "show success";
    }
    else {
      toast.className = "show failure";
    }

    toast.innerHTML = message;
    setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 5000);
  }



  $(window).resize(function () {
    if (!sidebarClosed) {
      $('#sidebar').animate({
        width: 'toggle'
      }, 350);
      $('#sidebar-btn').animate({
        right: 0
      }, 0);
      sidebarClosed = true;
    }
  });

  // Leave evaluation
  $scope.leaveEvaluation = function () {
    $http.post(myURL + '/api/users/leaveEvaluation', {
      user_id: $rootScope.rootData.user_id
    })
    /*  .then(function (response) {
          if (response.data != null && response.data != "") {
            var message = "Din veckoutvärdering är skickad " ;
            showToast(true, message);
          }
          else {
            var message = "Något blev fel med veckoutväderingen " ;
            showToast(false, message);
          }*/
  };






  $scope.sidebarMenu = function () {
    var documentWidth = $(document).width();
    if (documentWidth > 500) {
      documentWidth *= 0.3;
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
    .when("/teacherDashboard", {
      templateUrl: "templates/teacherDashboard.html"
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
    })
    .when("/attendance", {
      templateUrl: "templates/attendance.html"

    })
    .when("/evaluation", {
      templateUrl: "templates/evaluation.html"
    });

});
