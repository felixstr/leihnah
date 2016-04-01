angular.module('Leihnah').controller('MainController', function($scope, $http, $state, AuthenticationService, auth) {
	console.log('MainController', $state.current);
	
	$scope.state = $state;
	
	
	if (AuthenticationService.authenticated && $state.is("home")) {
		$state.go('objects');
	}
	if (!AuthenticationService.authenticated && !$state.is("home")) {
		$state.go('home');
	}
	
	
	$scope.$watch(function() { return AuthenticationService.authenticated; }, function(newVal, oldVal) {
		console.log('changed');
		$scope.authenticated = AuthenticationService.authenticated;
	});
	
	
	$scope.logoutUser = function() {
		console.log('AuthenticationService.getLocalToken()', AuthenticationService.getLocalToken());
		$http.post('api/logout', '', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				if (!response.authenticated) {

					AuthenticationService.logout();
					
					$state.go('home');
				}
			})
			.error(function(error) {
				console.log(error);
			});
	}
	
	
});