angular.module('Leihnah').controller('EditProfilController', function($scope, $uibModalInstance, $http, currentNeighbor, AuthenticationService, Upload) {
	
	console.log('currentneighbor', currentNeighbor);
	
	$scope.currentNeighbor = angular.copy(currentNeighbor);
	
	$scope.profilImage = {
		uploadedImage: undefined,
		picFile: undefined
	}
	
	
	$scope.save = function () {
		console.log('save: load');
		
		var data = $scope.currentNeighbor;
		data.file = $scope.profilImage.file;

		$scope.profilImage.file.upload = Upload.upload({
			url: 'api/neighbor',
			method: 'POST', // PUT funktioniert nicht mit slim
			headers: { 'auth-token': AuthenticationService.getLocalToken() },
			data: {
				file: $scope.profilImage.file
			}
		})
		.then(
			function(response) {
				console.log(response);
				
				$scope.currentNeighbor = response.data.neighbor;
				$uibModalInstance.close(response.data.neighbor);
				
			}, 
			function(response) {
				if (response.status > 0) {
					$scope.errorMsg = response.status+': '+response.data;
				}
			}, 
			function(progress) {
				$scope.profilImage.file.progress = Math.min(100, parseInt(100.0 * progress.loaded / progress.total));
			}
		);
		
// 		
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});