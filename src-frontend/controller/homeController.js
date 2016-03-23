angular.module('Leihnah').controller('HomeController', function($scope, $http, $state, AuthenticationService, auth) {
	
	// Variables
	$scope.registerInfo = {
		username: undefined,
		password: undefined,
		usernameOk: true,
	}
	
	$scope.loginInfo = {
		username: undefined,
		password: undefined
	}
	
	// Function
	$scope.checkUsername = function() {
		console.log('check username: ', $scope.registerInfo.username);
		
		if ($scope.registerInfo.username != undefined) {
			$http.post('api/usernameexists', {
					username: $scope.registerInfo.username
				})
				.success(function(response) {
					console.log(response);
					if (response.usernameExists) {
						$scope.register.username.$setValidity("exists", false);
					} else {
						$scope.register.username.$setValidity("exists", true);
					}
					$scope.registerInfo.usernameOk = !response.usernameExists;
				})
				.error(function(error) {
					console.log(error);
				});
		}
		
	}
	
	$scope.registerUser = function() {
		var data = {
			username: $scope.registerInfo.username,
			password: $scope.registerInfo.password
		}
		
		$http.post('api/register', data)
			.success(function(response) {
				console.log(response);
				
				$scope.registerInfo.username = '';
				$scope.registerInfo.password = '';
				
				if (response.authenticated) {
					
					
					$scope.authenticated = true;
					AuthenticationService.setLocalToken(response.user.token);
					AuthenticationService.setUser(response.user);
					
					$state.go('objects');
					
				}
				
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

