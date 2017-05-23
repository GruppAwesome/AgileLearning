(function () {

  var sCourse;
  var app = angular.module('starter', ['ionic']);

  //Creates the controller
  app.controller('myCtrl', function ($scope, $ionicSideMenuDelegate, $http, $state, $rootScope) {

    $scope.sCourse = sCourse;

    $scope.getobject = function (thisobject) {
      sCourse = thisobject;
    }

    $http.get('schooldata/data.json').success(function (data) {
      $scope.data = data;
    });

    $scope.login = function () {

      var username = document.getElementById("usernameInput").value;
      var password = document.getElementById("passwordInput").value;

      $http.post('http://localhost:5000/api/users/login', {
        Username: username,
        Password: password
      })
        .success(function (data) {
          if (data != null && data != "") {
            $rootScope.rootData = data;
            $state.go('list');
          }
        });
    };

    $scope.showMyCourses = function () {

      $http.post('http://localhost:5000/api/courses/mycourses', {
        Username: $rootScope.rootData.user_name
      })
        .success(function (data) {
          if (data != null && data != "") {
            $rootScope.rootCourses = data;
          }
        });
    };

    $scope.showMyGrades = function () {

      $http.post('http://localhost:5000/api/users/grade', {
        Username: $rootScope.rootData.user_name
      })
        .success(function (data) {
          if (data != null && data != "") {
            $scope.grades = data;
          }
        });
    };

    $scope.showMyTodo = function () {

            $http.post('http://localhost:5000/api/users/todo', {
              Username: $rootScope.rootData.user_name
      })
        .success(function (data) {
          if (data != null && data != "") {
            $scope.todo = data;
          }
        });
    };

    $scope.showMySchedule = function () {

      $http.post('http://localhost:5000/api/courses/MySchedule', {
        course_name: sCourse.course_name
      })
        .success(function (data) {
          if (data != null && data != "") {
            $scope.schedule = data;

            $http.post('http://localhost:5000/api/courses/CourseAssignment', {
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
