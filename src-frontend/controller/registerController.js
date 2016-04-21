angular.module('Leihnah').controller('RegisterController', function($scope, $http, $state, $log, AuthenticationService, auth) {
	
	// Variables
	$scope.registerInfo = {
		username: undefined,
		password: undefined,
		usernameOk: true,
	}
	
	// Function
	$scope.checkUsername = function() {
		$log.debug('check username: ', $scope.registerInfo.username);
		
		if ($scope.registerInfo.username != undefined) {
			$http.post('api/usernameexists', {
					username: $scope.registerInfo.username
				})
				.success(function(response) {
					$log.debug(response);
					if (response.usernameExists) {
						$scope.register.username.$setValidity("exists", false);
					} else {
						$scope.register.username.$setValidity("exists", true);
					}
					$scope.registerInfo.usernameOk = !response.usernameExists;
				})
				.error(function(error) {
					$log.debug(error);
				});
		}
		
	}
	
	$scope.registerUser = function() {
		var data = {
			username: $scope.registerInfo.username,
			password: $scope.registerInfo.password,
			person1_firstName: $scope.registerInfo.person1_firstName
		}
		
		$http.post('api/register', data)
			.success(function(response) {
				$log.debug(response);
				
				
				
				if (response.saved) {
					
/*
					
					$scope.authenticated = true;
					AuthenticationService.setLocalToken(response.user.token);
					AuthenticationService.setUser(response.user);
					
*/
					$scope.registerInfo.username = '';
					$scope.registerInfo.password = '';
					$scope.registerInfo.person1_firstName = '';
					
				}
				
			})
			.error(function(error) {
				$log.debug(error);
			});
	}
		
	
});

