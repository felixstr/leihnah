angular.module('AuthTest').controller('MainController', function($scope, $http, $state, AuthenticationService) {
	
	AuthenticationService.checkToken();
	
	$scope.logout = function() {
		var data = {
			token: AuthenticationService.getToken()
		}

		$http.post('api/logout.php', data)
			.success(function(response){
				console.log(response);
				localStorage.clear();
				$state.go('home');
			})
			.error(function(error) {
				console.log(error);
			});
	}
});