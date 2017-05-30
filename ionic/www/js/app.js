(function () {

  var sCourse;
  var app = angular.module('starter', ['ionic']);

  //var myURL = "http://weboholics-001-site4.htempurl.com"; // remote release
  var myURL = "http://localhost:5000"; //local dev

  //Creates the controller
  app.controller('myCtrl', function ($scope, $ionicSideMenuDelegate, $http, $state, $rootScope) {

    $scope.sCourse = sCourse;
    $scope.feedbackAlternatives = ["DÅLIGT", "MELLAN", "BRA"];
    $scope.loginError = false;
    $scope.getobject = function (thisobject) {
      sCourse = thisobject;
    }

    //Tempfunction that reset the feedbackValues in the database
    $scope.resetTheFeedback = function (thisobject) {

      $http.get(myURL + '/api/users/ResetFeedback', {

      })

    }

    $http.get('schooldata/data.json').success(function (data) {
      $scope.data = data;
    });


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
            $state.go('list');
          } else {
            $scope.loginError = true;
          }
        });
    };

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

       $scope.CheckAttendenceCode = function () {

      $http.post(myURL + '/api/attendence/presence', {
        coursecode_code: 'xxxs'
        })
        .success(function (data) {
          if (data != null && data != "") {
            
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

    //Checks if the user has voted
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

    //The daily feedback
    $scope.SendFeedback = function (theVote) {
      $http.post(myURL + '/api/users/SendFeedback', {
          feedback_vote: theVote,
          user_id: $rootScope.rootData.user_id
        })
        .success(function (data) {
          $scope.hasVotedToday = data;

        });
    };

    $scope.toggleRight = function () {
      $ionicSideMenuDelegate.toggleRight()
    }

  });

  //My lovely router that redirection myviews
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

    $stateProvider.state('courses', {
      url: '/courses',
      templateUrl: 'myviews/courses.html',
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
