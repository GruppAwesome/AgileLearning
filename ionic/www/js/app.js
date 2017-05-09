(function(){

var app = angular.module('starter', ['ionic']);

var myinfo = "lol";

//Creates the controller
app.controller('myCtrl', function($scope, $http, $state, $rootScope){

$scope.myuser;
$scope.info = myinfo;


 $scope.login = function() {
        
      
        var username = document.getElementById("usernameInput").value;
        var password = document.getElementById("passwordInput").value;

        $http.post('http://localhost:5000/api/users/login', {Username: username,Password:password})
        .success(function (data) {
       
          if(data != null && data != ""){
         $rootScope.rootData = data;
         $state.go('list');

         

        
        }
    });
    };






});


//My lovely router that redirection myviews
app.config(function($stateProvider, $urlRouterProvider) {

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

  //Standard redirection
  $urlRouterProvider.otherwise('/start');

});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());