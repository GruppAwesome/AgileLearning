//Instance
var sidebarClosed = true;

var app = angular.module("myApp", ["ngRoute"]);


app.controller('myCtrl', function ($scope, $http, $rootScope, $location) {

  var myURL = "http://weboholics-001-site4.htempurl.com"; // remote release
  // var myURL = "http://localhost:5000"; //local dev

  /* Automatic log-outer */
  (function () {
    if (!$rootScope.rootData) {
      $location.url('/');
    }
  })();

  $scope.loginError = false;
  $scope.feedbackAlternatives = ["DÅLIGT", "MELLAN", "BRA"];
  $http.get("../schooldata/data.json")
    .then(function (response) {
      $scope.data = response.data;
    });

  $http.get("../schooldata/questionaire.json")
    .then(function (response) {
      $scope.questionaire = response.data;
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
          }
          else if (response.data.user_type == 'teacher') {
            $location.url('/teacherDashboard');
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

  $scope.goToEval = function () {
    $location.url('/evaluation');
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

  $scope.HasVotedWeekly = function () {
    $http.post(myURL + '/api/users/ShowWeekFeedback', {
      // user_id: $rootScope.rootData.user_id
    })
      .then(function (response) {
        if (response.data != null && response.data != "") {
          $scope.weeklyChartData = response.data;
          showWeeklyCharts($scope.questionaire.multipleChoice, $scope.weeklyChartData);
        } else {
          console.log("oh no ");
        }
      });
  };


  $scope.ShouldVoteWeekly = function () {
    $http.post(myURL + '/api/users/ShouldVoteWeekly', {
      user_id: $rootScope.rootData.user_id
    })
      .then(function (response) {
        $scope.shouldVote = response.data;
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
        if (response.data != null && response.data != "") {
          $scope.courseName = response.data[0].course_name;
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

  $scope.logout = function () {
    $rootScope.rootData = null;
  };



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

  $scope.getDailyFeedbackAverage = function () {
    $http.get(myURL + '/api/users/DailyFeedbackAverage')
      .then(function (response) {
        if (response.data) {
          showDailyCharts(response.data);
        }
      });
  };

  $scope.getWeeklyFeedbackSum = function () {
    $http.get(myURL + '/api/users/WeeklyFeedbackSum')
      .then(function (response) {
        if (response.data) {
          $scope.weeklyFeedbackSum = response.data;
        }

      });
  };

  $scope.sendweeklyfeedback = function () {
    var q1 = document.forms["weekly"]["q1"].value;
    var q2 = document.forms["weekly"]["q2"].value;
    var q3 = document.forms["weekly"]["q3"].value;
    var f1 = document.forms["weekly"]["f1"].value;
    var f2 = document.forms["weekly"]["f2"].value;
    $http.post(myURL + '/api/users/Sendweeklyfeedback', {
      weekly_q1: q1,
      weekly_q2: q2,
      weekly_q3: q3,
      weekly_free_text1: f1,
      weekly_free_text2: f2,
      weekly_uid: $rootScope.rootData.user_id
    }).then(function (response) {
      if (response.data) {
        showToast(response.data, "Tack för hjälpen!");
        $location.url('/dashboard');
      } else {
        showToast(response.data, "Något gick fel...");
      }
    });
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
  var cleanFeedbackdate = function (objectArray) {
    var fba = [];
    for (var i = 0; i < objectArray.length; i++) {
      var fbd = objectArray[i].feedback_date.substr(0, 11);
      fba.push(fbd);
    }
    return fba;
  }

  var cleanAvg = function (objectArray) {
    var a = [];
    for (var i = 0; i < objectArray.length; i++) {
      var avg = objectArray[i].average - 1;
      a.push(avg);
    }
    return a;
  }
  var showDailyCharts = function (data) {
    var dates = cleanFeedbackdate(data);
    var averages = cleanAvg(data)
    var ctx = document.getElementById("dailyChart").getContext('2d');
    var dailyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'genomsnitt daglig feedback',
          data: averages,
          backgroundColor: [

            'rgba(255, 128, 8, 0.2)'
          ],
          borderColor: [
            'rgba(255,128,8,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  var cleanWeeklyData = function (questions, data) {
    var result = [
      {
        q: questions.q1
      },
      {
        q: questions.q2
      },
      {
        q: questions.q3
      }
    ];
    for (var q = 0; q < 3; q++) {
      var array = [0, 0, 0, 0, 0];
      var comparator;
      for (var i = 0; i < data.length; i++) {
        for (var a = 0; a < array.length; a++) {
          if (q == 0 && data[i].weekly_q1 == a) {
            array[a]++;
          }
          else if (q == 1 && data[i].weekly_q2 == a) {
            array[a]++;
          }
          else if (q == 2 && data[i].weekly_q3 == a) {
            array[a]++;
          }
        }
      }
      result[q].a = array;

    }
    return result;
  }

  $scope.randomQuote = function () {
    return $scope.questionaire.f1;
  }

  var showWeeklyCharts = function (questions, data) {
    var result = cleanWeeklyData(questions, data);
    var ctx = [
      document.getElementById("weeklyQ1Chart").getContext('2d'),
      document.getElementById("weeklyQ2Chart").getContext('2d'),
      document.getElementById("weeklyQ3Chart").getContext('2d')];
    for (var i = 0; i < ctx.length; i++) {
      var chart = new Chart(ctx[i], {
        type: 'bar',
        data: {
          labels: ["vet ej", 1, 2, 3, 4],
          datasets: [{
            label: 'Svar för "' + result[i].q + '"',
            data: result[i].a,
            backgroundColor: [
              'rgba(255, 128, 8, 0.2)',
              'rgba(255, 128, 8, 0.2)',
              'rgba(255, 128, 8, 0.2)',
              'rgba(255, 128, 8, 0.2)',
              'rgba(255, 128, 8, 0.2)'
            ],
            borderColor: [
              'rgba(255, 128, 8, 1)',
              'rgba(255, 128, 8, 1)',
              'rgba(255, 128, 8, 1)',
              'rgba(255, 128, 8, 1)',
              'rgba(255, 128, 8, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }
  }

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
