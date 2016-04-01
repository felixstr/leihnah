angular.module('Leihnah').controller('ObjectsController', function($scope, $http, $state, AuthenticationService, auth) {

	console.log('ObjectsController')	
	
	$scope.objects = '';
	
	$scope.loadObjects = function() {
		$http.get('api/object/1', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				console.log('loadObjects', response);
				if (response.ok) {
					$scope.objects = response;
				}
			})
			.error(function(error) {
				console.log(error);
			});
	}
	
	$scope.loadObjects();

});