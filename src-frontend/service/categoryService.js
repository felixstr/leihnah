angular.module('Leihnah').service('CategoryService', function($http, AuthenticationService) {
	var self = this;
	
	self.categories = null;
	
	self.loadCategories = function(callback) {
// 		console.log('loadCategories', self.categories == null);
		
		if (self.categories != null) {
			callback(self.categories);
		} else {

			$http.get('api/category', {
					headers: { 'auth-token': AuthenticationService.getLocalToken() }
				})
				.success(function(response) {
// 					console.log('loadCategories', response);
					if (response.ok) {
						self.categories = response.categories;
						callback(self.categories);
					}
				})
				.error(function(error) {
					console.log(error);
				});
		}
	}
	
	
});