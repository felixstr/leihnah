angular.module('Leihnah').controller('ObjectDetailController', function($scope, $http, $stateParams, AuthenticationService, auth) {

	console.log('ObjectDetailController')	
	
	$scope.object = '';
	
	$stateParams.objectId;
	
	$scope.loadObject = function() {
		$http.get('api/object/'+$stateParams.objectId, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				console.log('loadObject', response);
				if (response.ok) {
					$scope.object = response.objects;
				}
			})
			.error(function(error) {
				console.log(error);
			});
	}
	
	$scope.loadObject();

});