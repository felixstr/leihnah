angular.module('Leihnah').service('CategoryService', function($http, $log, AuthenticationService) {
	var self = this;
	
	self.categories = null;
	
	self.loadCategories = function(callback) {
// 		$log.debug('loadCategories', self.categories == null);
/*
		
		if (self.categories != null) {
			callback(self.categories);
		} else {
*/

			$http.get('api/category', {
					headers: { 'auth-token': AuthenticationService.getLocalToken() }
				})
				.success(function(response) {
// 					$log.debug('loadCategories', response);
					if (response.ok) {
						self.categories = response.categories;
						callback(self.categories);
					}
				})
				.error(function(error) {
					$log.debug(error);
				});
// 		}
	}
	
	self.getName = function(id) {
		for (var i = 0; i < self.categories.length; i++) {
			if (self.categories[i].id == id) {
				return self.categories[i].name;
			}
		}
		
		return null;
	}
	
	
});