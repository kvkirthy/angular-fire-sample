
angular.module("messageBoard", ['ui.router', 'firebase'])
.constant("messageBoardReference", {})
.config(function($stateProvider, $urlRouterProvider, messageBoardReference){

	messageBoardReference.firebase = new Firebase("https://venckimessageboard.firebaseio.com/");
	messageBoardReference.connStatusRef = new Firebase("https://venckimessageboard.firebaseio.com/.info/connected");


	$stateProvider
		.state('home',{
	      url: "/home",
	      templateUrl: "templates/message-board-home.html",
	      controller:'homeController'
	    })
	    .state('email', {
	      url: "/email",
	      templateUrl: "templates/email-messages.html",
	      controller:'emailController'	
	    })

	$urlRouterProvider.otherwise("/home");

})
.controller("connectionStatusController", function($scope, $firebaseObject, messageBoardReference){
	$scope.connectionStatus = $firebaseObject(messageBoardReference.connStatusRef);
})
.controller('homeController', function($scope, messageBoardReference, $firebaseArray, $firebaseObject){

	$scope.loginWithFacebook = function(){
		messageBoardReference.firebase.authWithOAuthPopup("facebook", function(error, authData){
			if(error){
				alert("Error logging in with Facebook");				
			}else{
				if(authData && authData.facebook && authData.facebook.displayName){
					$scope.author = authData.facebook.displayName;
					$scope.$apply();
				}
			}
		});
	};

	$scope.messageList = $firebaseArray(messageBoardReference.firebase);

	$scope.deleteMessage  = function(message){
		$scope.messageList.$remove(message);
	}

	$scope.postMessage = function(){
		$scope.messageList.$add({
			author: $scope.author,
			message: $scope.newMessage
		});

		$scope.newMessage = "";
	}

})

.controller('emailController', function($scope, $firebaseObject){

	var reference = new Firebase("https://venckimessageboard.firebaseio.com/email");
	var firebaseObj = $firebaseObject(reference);
	firebaseObj.$bindTo($scope, "emailMessage");

})

;