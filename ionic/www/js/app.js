(function(){

var app = angular.module('starter', ['ionic']);

var user1 = 'Micke';


//Creates the controller
app.controller('myCtrl', function($scope, $http, $state){
$http.get('schooldata/data.json').success(function(data){
  $scope.data = data;
});
$scope.myuser;

 $scope.login = function() {
        
        $scope.myuser = user1;
        var username = document.getElementById("usernameInput").value;
        var password = document.getElementById("passwordInput").value;

        $http.post('http://localhost:5000/api/users/login', {Username: username,Password:password})
        .success(function (data) {
       
         $scope.mydata = data;
        
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