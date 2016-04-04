angular.module('Leihnah').controller('EditProfilController', function($scope, $uibModalInstance, $http, currentNeighbor, AuthenticationService, Upload) {
	
	console.log('currentneighbor', currentNeighbor);
	
	$scope.currentNeighbor = angular.copy(currentNeighbor);
	
	$scope.profilImage = {
		uploadedImage: undefined,
		file: undefined
	}
	
	
	$scope.save = function () {
		console.log('save: load');
		
		var data = $scope.currentNeighbor;
		console.log('scope.profilImage.file', $scope.profilImage.file)
		if ($scope.profilImage.file == undefined) {
			
			$http.post('api/neighbor', data, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				
				$scope.currentNeighbor = response.neighbor;
				$uibModalInstance.close(response.neighbor);
				
			})
			.error(function(error) {
				console.log(error);
			});
			
		} else {
			
			data.upload = $scope.profilImage.file;
			
			$scope.profilImage.file.upload = Upload.upload({
				url: 'api/neighbor',
				method: 'POST', // PUT funktioniert nicht mit slim
				headers: { 'auth-token': AuthenticationService.getLocalToken() },
				data: data
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
		}
// 		
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});