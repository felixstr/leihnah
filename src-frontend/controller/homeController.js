angular.module('Leihnah').controller('HomeController', function($scope, $http, $state, AuthenticationService, auth) {
	console.log('HomeController');
	

	
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
	
	$http.get('api/objects', {
		headers: { 'auth-token': '234234234234324' },
	})
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
		
		
		$http.post('api/login', data)
			.success(function(response) {
				if (response.authenticated) {
					
					
					$scope.authenticated = true;
					AuthenticationService.setLocalToken(response.user.token);
					AuthenticationService.setUser(response.user);
					
					$state.go('objects');
					
				} else {
					console.log('wrong credentials');
				}
				
			})
			.error(function(error) {
				console.log(error);
			});
	}
	
	
	
});

