angular.module('Leihnah').controller('HomeController', function($scope, $http, $state, $log, AuthenticationService, auth) {
	
	// Variables
	$scope.fail = null;
	
	$scope.loginInfo = {
		username: '',
		password: ''
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
					
					$scope.fail = null;
					
				} else {
// 					$log.debug('fail', response.failure);
					
					$scope.fail = response.failure;
					if (response.failure == 'credentials') {
						$scope.loginInfo.password = '';
// 						angular.element('.elPassword').trigger('focus');
					}
					if (response.failure == 'unkown' || response.failure == 'inactive') {
						$scope.loginInfo.password = '';
						$scope.loginInfo.username = '';
					}
				}
				
			})
			.error(function(error) {
				$log.debug(error);
			});
	}
	
	
	
});

