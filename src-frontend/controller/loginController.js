angular.module('AuthTest').controller('LoginController', function($scope, $http, $state) {
	console.log('LoginControllerrrr');
	
	// Variables
	$scope.signUpInfo = {
		username: undefined,
		password: undefined
	}
	
	$scope.loginInfo = {
		username: undefined,
		password: undefined
	}
	
/*
		$http.get('api/objects')
		.success(function(response) {
			console.log('objects', response);
		})
		.error(function(error) {
			console.log(error);
		});
		
*/
		
	
	// Function
	$scope.signUserUp = function() {
		var data = {
			username: $scope.signUpInfo.username,
			password: $scope.signUpInfo.password
		}
		
		$http.post('api/signup.php', data)
			.success(function(response) {
				console.log(response);
				localStorage.setItem('user', JSON.stringify({user: response[0].email }));
				$state.go('application');
				
			})
			.error(function(error) {
				console.log(error);
			});
	}
	
	$scope.loginUser = function() {
		var data = {
			username: $scope.loginInfo.username,
			password: $scope.loginInfo.password
		}
		
		
		$http.post('api/login.php', data)
			.success(function(response) {
				console.log(response);
				if (response.authenticated) {
					localStorage.setItem('token', JSON.stringify(response.token));
					$state.go('application');
				} else {
					console.log('wrong credentials');
				}
				
			})
			.error(function(error) {
				console.log(error);
			});
	}
	
});

