// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])



.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('myCtrl', function ($scope, $state, $ionicSideMenuDelegate, $http, $rootScope) {
   $http.get('schooldata/data.json')
    .success(function (data) {
      $scope.data = data;
    });
    /*Nytt 13.46 14/5*/
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

         $http.post('http://localhost:5000/api/courses/mycourses', {
          course_status: "Active",

        })
        .success(function (data) {
            $rootScope.rootCourses = data;

        });

    }; //Login function

    $scope.login2 = function () {
      $http.post('http://localhost:5000/api/courses/mycourses', {
          course_status: "Active"
        })

      .success(function (data) {
            $rootScope.rootCourses = data;
            $state.go('courses');

        });

    }



    /*Nytt 13.46 14/5*/
  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight()
  }
})
 

.config(function($stateProvider, $urlRouterProvider) {


        $stateProvider
            .state('start', { //variabeln
                url: '/start', //addressen finns i variabeln
                templateUrl: 'templates/start.html', //innehållet och all material finns i t.url
                controller: 'myCtrl'
            })

            .state('list', { //variabeln
                url: '/list', //addressen finns i variabeln
                templateUrl: 'templates/list.html', //innehållet och all material finns i t.url
                controller: 'myCtrl'
            })
            .state('courses', { //variabeln
                url: '/courses', //addressen finns i variabeln
                templateUrl: 'templates/courses.html', //innehållet och all material finns i t.url
                controller: 'myCtrl'
            })

        $urlRouterProvider.otherwise('/start'); //Vår start sida
    });
