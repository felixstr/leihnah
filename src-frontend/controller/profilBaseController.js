angular.module('Leihnah').controller('ProfilBaseController', function($scope, $http, $state, $uibModal, AuthenticationService, auth) {

	console.log('ProfilBaseController');

	
	
	$scope.openModalProfilEdit = function() {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
			size: 'medium',
			templateUrl: 'template/modal/editProfil.html',
			controller: 'EditProfilController',
			resolve: {
				currentNeighbor: function () {
					return $scope.currentNeighbor;
				}
			}
		});
		
		modalInstance.result.then(function (neighbor) {
			$scope.currentNeighbor = neighbor;
			
			
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.openModalPasswordEdit = function() {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
			size: 'medium',
			templateUrl: 'template/modal/editPassword.html',
			controller: 'EditPasswordController'/*,
			resolve: {
				currentNeighbor: function () {
					return $scope.currentNeighbor;
				}
			}*/
		});
		/*
		modalInstance.result.then(function (neighbor) {
			$scope.currentNeighbor = neighbor;
			
			
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
		*/
	}
	
	
	

});