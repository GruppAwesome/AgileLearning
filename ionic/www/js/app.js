(function () {

  var sCourse;
  var app = angular.module('starter', ['ionic', 'ngCordova']);


  // var myURL = "http://weboholics-001-site4.htempurl.com"; // remote release
  var myURL = "http://localhost:5000"; //local dev

  //Creates the controller
  app.controller('myCtrl', function ($scope, $ionicSideMenuDelegate, $http, $state, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, $timeout) {

    //Init
    $scope.sCourse = sCourse;
    $scope.feedbackAlternatives = ["DÅLIGT", "MELLAN", "BRA"];
    $scope.loginError = false;

    $scope.questionaire = {
      'question1': '',
      'question2': '',
      'question3': '',
      'freetext1': '',
      'freetext2': ''
    };

    //Recciving the JSONS
    $http.get("../schooldata/questionaire.json")
      .then(function (response) {
        $scope.questionJson = response.data;
      });

    $http.get('schooldata/data.json').success(function (data) {
      $scope.data = data;
    });

    //The barcoderscanner    
    $scope.scan = function () {
      var detachBarcodeScannerBackHandler = $ionicPlatform.registerBackButtonAction(function () {
        detachBarcodeScannerBackHandler();
      }, 1000);

      $cordovaBarcodeScanner.scan().then(function (barcodeData) {
        $scope.sendAttendance(barcodeData.text);

        if (!barcodeData.cancelled) {
          detachBarcodeScannerBackHandler();
        }
      }, function (error) { console.log(error); });
    }

    //Logout function
    $scope.logout = function () {
      $rootScope.rootData = null;
    };

    //Grabs the object and put it into the a variabel
    $scope.getobject = function (thisobject) {
      sCourse = thisobject;

    }

    $scope.goToEval = function () {
      $state.go('evaluation');
    }
    //Tempfunctions that reset the feedbackValues in the database
    $scope.resetTheFeedback = function () {
      $http.get(myURL + '/api/users/ResetFeedback', {
      })
    }

    $scope.resetTheWeekFeedback = function () {
      $http.get(myURL + '/api/users/ResetWeekFeedback', {
      })
    }

    //Some login action
    $scope.login = function () {

      var username = document.getElementById("usernameInput").value;
      var password = document.getElementById("passwordInput").value;

      $http.post(myURL + '/api/users/login', {
        Username: username,
        Password: password

      })
        .success(function (data) {
          if (data != null && data != "") {
            $rootScope.rootData = data;

            if (data.user_type == 'student') {

              $state.go('list');
            }
            else if (data.user_type == 'teacher') {
              $state.go('teacher');
            }
          } else {
            showToast(false, "Inloggningen misslyckades.");
          }
        });
    };

    //SQL requests (We are aware that alot of these could be integrated into each other)
    $scope.showMyCourses = function () {

      $http.post(myURL + '/api/courses/mycourses', {
        Username: $rootScope.rootData.user_name
      })
        .success(function (data) {
          if (data != null && data != "") {
            $rootScope.rootCourses = data;
          }
        });
    };

    $scope.sendAttendance = function (theCode) {

      $http.post(myURL + '/api/attendence/presence', {
        coursecode_code: theCode,
        username: $rootScope.rootData.user_name
      })
        .then(function (response) {
          if (response.data.length > 0) {
            $scope.courseName = response.data[0].course_name;
            var msg = "Du är närvarande på kursen " + $scope.courseName;
            showToast(true, msg);
          }
          else {
            var msg = "Ingen närvaro för kod " + theCode;
            showToast(false, msg);
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

    $scope.sendEvaluation = function (questionaire) {

      $http.post(myURL + '/api/users/Sendweeklyfeedback', {
        weekly_q1: questionaire.question1,
        weekly_q2: questionaire.question2,
        weekly_q3: questionaire.question3,
        weekly_free_text1: questionaire.freetext1,
        weekly_free_text2: questionaire.freetext2,
        weekly_uid: $rootScope.rootData.user_id
      })

      //All I wanted was to refresh a state so the weeklyfeedback would go away
      $timeout(function () {
        $state.go('list', {}, { reload: true });
        }, 200);
      var msg = "Tack för din utvärdering!";
      showToast(true, msg);
    };

    $scope.showWeekFeedback = function () {
      $http.post(myURL + '/api/Users/ShowWeekFeedback', {
        username: $rootScope.rootData.user_name
      })
        .success(function (data) {
          if (data != null && data != "") {

            //The data over what he voted for this week(No idea if this data is necessary else hola @ ya boys)
            $scope.showWeeklyFeedback = data;
          }
          else {

            //If the data is null this girl/dude needs to vote.
            $scope.showWeeklyFeedback = null;
          }

        });
    };

    $scope.showMyGrades = function () {

      $http.post(myURL + '/api/users/grade', {
        Username: $rootScope.rootData.user_name
      })
        .success(function (data) {
          if (data != null && data != "") {
            $scope.grades = data;
          }
        });
    };

    $scope.showMyTodo = function () {

      $http.post(myURL + '/api/users/todo', {
        Username: $rootScope.rootData.user_name
      })
        .success(function (data) {
          if (data != null && data != "") {
            $scope.todo = data;
          }
        });
    };

    $scope.showMySchedule = function () {

      $http.post(myURL + '/api/courses/MySchedule', {
        course_name: sCourse.course_name
      })
        .success(function (data) {
          if (data != null && data != "") {
            $scope.schedule = data;

            $http.post(myURL + '/api/courses/CourseAssignment', {
              course_name: sCourse.course_name
            })
              .success(function (data) {
                if (data != null && data != "") {
                  $scope.assignment = data;
                }
              });
          }
        });
    };

    $scope.HasVoted = function () {
      $http.post(myURL + '/api/users/HasVoted', {
        user_id: $rootScope.rootData.user_id
      })
        .success(function (data) {
          if (data != null && data != "") {

            //If the user has voted
            $scope.hasVotedToday = data;

          } else {

            //If the user hasn't voted
            $scope.hasVotedToday = "no";

          }
        });
    };

    $scope.SendFeedback = function (theVote) {
      $http.post(myURL + '/api/users/SendFeedback', {
        feedback_vote: theVote,
        user_id: $rootScope.rootData.user_id
      })
        .success(function (data) {
          $scope.hasVotedToday = data;

        });
    };

    $scope.getDailyFeedbackAverage = function () {
      $http.get(myURL + '/api/users/DailyFeedbackAverage')
        .success(function (data) {
          $scope.dailyFeedbackAverage = data;

          console.log(data);
          showCharts();
          new QRCode(document.getElementById("qrcode"), "xxx");
        });
    };

    //Sidemenu
    $scope.toggleRight = function () {
      $ionicSideMenuDelegate.toggleRight()
    }

    //Toastfunction
    var showToast = function (successful, message) {
      var toast = document.getElementById("snackbar");
      toast.innerHTML = message;
      var flavour = "";
      toast.classList.add('show');
      if (successful) {
        toast.classList.add('success');
        flavour = "success";
      } else {
        toast.classList.add('error');
        flavour = "error";
      }
      setTimeout(function () {
        toast.classList.remove('show');
        toast.classList.remove(flavour);
      }, 3000);
    }

    //Cleaning the dateobject since it came back 2001-01-01 00:00:00  
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

    //The cool chart
    var showCharts = function () {
      var dates = cleanFeedbackdate($scope.dailyFeedbackAverage);
      var averages = cleanAvg($scope.dailyFeedbackAverage)
      var ctx = document.getElementById("dailyChart").getContext('2d');
      var dailyChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'average daily feedback',
            data: averages,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)'
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

  });

  //Router
  app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('start', {
      url: '/start',
      templateUrl: 'myviews/start.html',
      controller: 'myCtrl'
    });

    $stateProvider.state('list', {
      url: '/list',
      templateUrl: 'myviews/list.html',
      controller: 'myCtrl'
    });

    $stateProvider.state('teacher', {
      url: '/teacher',
      templateUrl: 'myviews/teacher.html',
      controller: 'myCtrl'
    });

    $stateProvider.state('grades', {
      url: '/grades',
      templateUrl: 'myviews/grades.html',
      controller: 'myCtrl'
    });

    $stateProvider.state('assignments', {
      url: '/assignments',
      templateUrl: 'myviews/assignments.html',
      controller: 'myCtrl'
    });

    $stateProvider.state('attendance', {
      url: '/attendance',
      templateUrl: 'myviews/attendance.html',
      controller: 'myCtrl'
    });

    $stateProvider.state('courses', {
      url: '/courses',
      templateUrl: 'myviews/courses.html',
      controller: 'myCtrl'
    });

    $stateProvider.state('evaluation', {
      url: '/evaluation',
      templateUrl: 'myviews/evaluation.html',
      controller: 'myCtrl'
    });

    $stateProvider.state('selectedcourse', {
      url: '/selectedcourse',
      templateUrl: 'myviews/selectedcourse.html',
      controller: 'myCtrl'
    });

    //Standard redirection
    $urlRouterProvider.otherwise('/start');

  });

  app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });
}());
