angular.module('Leihnah').service('AuthenticationService', function($http, $log, $state) {
	var self = this;
	
	self.currentUser = null;
// 	self.authenticationChecked = false;
	self.authenticated = false;
	
	self.checkAuthentication = function(callback) {
		/*
		if (false && self.authenticationChecked) {
// 			$log.debug('authentication already checked');
			if (self.currentUser === null) {
				callback(false);
			} else {
				callback(true, self.currentUser);
			}
		} else {
			$log.debug('checkAuthentication: loadUserInfo');
		
			
		}
		*/
		
		self.loadUserInfo(callback);

	}
	
	self.getLocalToken = function() {
		var token = null;

		try {
	        if (localStorage['token']) {
// 				$log.debug(localStorage['token']);
				token = JSON.parse(localStorage['token']);
			}
	    } catch (e) {
	        console.warn('no token', e);
	    }
		
		
		return token;
	}
	
	self.loadUserInfo = function(callback) {
		$http.get('api/userinfo', {
			headers: { 'auth-token': self.getLocalToken() }
		})
		.success(function(response) {
			$log.debug('userinfo-response', response);
			if (response.authenticated) {
				self.currentUser = response.user;
				self.authenticated = true;
				if (callback !== undefined) {
					callback(true, self.currentUser);
				}
			} else {
				self.currentUser = null;
				self.authenticated = false;
				
				if (callback !== undefined) {
					callback(false);
				}
			}
		});
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
	
});