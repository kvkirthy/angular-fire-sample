
angular.module("messageBoard", ['ui.router', 'firebase'])
.constant("messageBoardReference", {})
.config(function($stateProvider, $urlRouterProvider, messageBoardReference){
	
	messageBoardReference.firebase = new Firebase("https://venckimessageboard.firebaseio.com/");
	messageBoardReference.connStatusRef = new Firebase("https://venckimessageboard.firebaseio.com/.info/connected");
//Firebase.goOffline();

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
	$scope.connectionStatus = $firebaseObject(new Firebase("https://venckimessageboard.firebaseio.com/.info/connected"));
})
.controller('homeController', function($scope, messageBoardReference, $firebaseArray, $firebaseObject){

	$scope.$watch('author',function(){
		messageBoardReference.user = $scope.author;
	});

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

.controller('emailController', function($scope, $firebaseObject, messageBoardReference){

	var firebaseObj = $firebaseObject(new Firebase("https://venckimessageboard.firebaseio.com/email").child(messageBoardReference.user));
	messageBoardReference.firebase.child(messageBoardReference.user).child("connectionStatus").onDisconnect().set("disconnected");

	firebaseObj.$bindTo($scope, "emailMessage");

})

;