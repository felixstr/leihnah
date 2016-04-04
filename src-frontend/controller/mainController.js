angular.module('Leihnah').controller('MainController', function($scope, $http, $state, AuthenticationService, ContextmenuService, auth) {
	console.log('MainController', $state.current);
	
	$scope.state = $state;
	
	$scope.contextmenu = ContextmenuService;
	
	
	if (AuthenticationService.authenticated && $state.is("home")) {
		$state.go('objects');
	}
	if (!AuthenticationService.authenticated && !$state.is("home")) {
		$state.go('home');
	}
	
	
	$scope.$watch(function() { return AuthenticationService.authenticated; }, function(newVal, oldVal) {
		console.log('changed');
		$scope.authenticated = AuthenticationService.authenticated;
		$scope.loadCurrentNeighbor();
	});
	
	$scope.$watch(function() { return ContextmenuService.current; }, function(newVal, oldVal) {
		console.log('current changed');
		$scope.contextmenu = ContextmenuService;
	});
	
	
	$scope.currentNeighbor = '';
	
	$scope.loadCurrentNeighbor = function() {
		$http.get('api/neighbor', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				console.log('loadCurrentNeighbor', response);
				if (response.ok) {
					$scope.currentNeighbor = response;
				}
			})
			.error(function(error) {
				console.log(error);
			});
	}
	
	$scope.loadCurrentNeighbor();
	
	
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