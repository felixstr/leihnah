angular.module('AuthTest').service('AuthenticationService', ["$http", "$state", function($http, $state) {
	var self = this;
	self.checkToken = function() {
		var data = { token: self.getToken() };

		$http.post('./api/checkToken.php', data)
			.success(function(response) {
				console.log(response);
				if (!response.authenticated) {
					$state.go('home');
					console.log('logged-out');
				} else {
					console.log('logged-in');
				}
			})
			.error(function(error) {
				console.log(error);
			});

	}
	
	self.getToken = function() {
		var token = null;

		try {
	        if (localStorage['token']) {
				console.log(localStorage['token']);
				token = JSON.parse(localStorage['token']);
			}
	    } catch (e) {
	        console.log('invalid json string');
	    }
		
		
		return token;
	}
}]);