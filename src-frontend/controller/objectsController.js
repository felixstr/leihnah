angular.module('Leihnah').controller('ObjectsController', function($scope, $http, $state, AuthenticationService, auth) {

	console.log('ObjectsController')	
	
	$scope.objects = '';
	$scope.state = $state;
	
	$scope.loadObjects = function() {
		$http.get('api/object', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				console.log('loadObjects', response);
				if (response.ok) {
					$scope.objects = response.objects;
					console.log('scope.objects', $scope.objects);
				}
			})
			.error(function(error) {
				console.log(error);
			});
	}
	
	$scope.loadObjects();

});