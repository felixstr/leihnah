angular.module('Leihnah').controller('ProfilBaseController', function($scope, $http, $state, $uibModal, AuthenticationService, auth) {

	console.log('ProfilBaseController');

	$scope.items = ['item1', 'item2', 'item3'];
	
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
	
	$scope.openModalProfilEdit = function() {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'template/modal/editProfil.html',
			controller: 'EditProfilController',
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});
		
		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	$scope.loadCurrentNeighbor();

});