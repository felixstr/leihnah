angular.module('Leihnah').controller('ProfilBaseController', function($scope, $http, $state, AuthenticationService, auth) {

	console.log('ProfilBaseContainer');

	$scope.currentNeighbor = { accountName: 'Beni' };
	
	
	
	$scope.loadCurrentNeighbor = function() {
		$http.get('api/neighbor', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				console.log(response);
				if (response.ok) {
					$scope.currentNeighbor = response;
				}
			})
			.error(function(error) {
				console.log(error);
			});
	}
	
	$scope.loadCurrentNeighbor();

});