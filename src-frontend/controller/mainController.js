angular.module('Leihnah').controller('MainController', function($scope, $http, $state, AuthenticationService, auth) {
	console.log('MainController');
	
	
	if (AuthenticationService.authenticated && $state.is('home')) {
		$state.go('objects')
	}
	
	$scope.$watch(function() { return AuthenticationService.authenticated; }, function(newVal, oldVal) {
		console.log('changed');
		$scope.authenticated = AuthenticationService.authenticated;
	});
	
	
	$scope.logoutUser = function() {
	
		$http.post('api/logout', {
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