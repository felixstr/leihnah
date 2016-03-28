angular.module('Leihnah').service('AuthenticationService', ["$http", "$state", function($http, $state) {
	var self = this;
	
	self.currentUser = null;
	self.authenticationChecked = false;
	self.authenticated = false;
	
	self.checkAuthentication = function(callback) {
		if (self.authenticationChecked) {
			console.log('authentication already checked');
			if (self.currentUser === null) {
				callback(false);
			} else {
				callback(true, self.currentUser);
			}
		} else {
// 			console.log('check authentication - token: ', self.getLocalToken());
		
			var currentUser = null;
		
			$http.get('api/userinfo', {
				headers: { 'auth-token': self.getLocalToken() }
			})
			.success(function(response) {
				console.log('userinfo-response', response);
				if (response.authenticated) {
					self.currentUser = response.user;
					self.authenticated = true;
					callback(true, self.currentUser);
				} else {
					callback(false);
				}
			});
		
		}

	}
	
	self.getLocalToken = function() {
		var token = null;

		try {
	        if (localStorage['token']) {
// 				console.log(localStorage['token']);
				token = JSON.parse(localStorage['token']);
			}
	    } catch (e) {
	        console.warn('no token', e);
	    }
		
		
		return token;
	}
	
	self.getUser = function() {
		return self.currentUser;
	}
	
	self.isAuthenticated = function() {
		return self.authenticated;
	}
	
	self.setLocalToken = function(token) {
		localStorage.setItem('token', JSON.stringify(token));
	}
	
	self.setUser = function (user) {
		self.currentUser = user;
		self.authenticated = true;
	}
	
	
	self.logout = function() {
		self.authenticated = false;
		self.setLocalToken(null);
		self.currentUser = null;
	}
	
}]);