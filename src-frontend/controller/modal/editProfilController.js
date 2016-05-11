angular.module('Leihnah').controller('EditProfilController', function($scope, $uibModalInstance, $http, $log, currentNeighbor, AuthenticationService, Upload) {
	
	$scope.loaded = false;
	
	$scope.currentNeighbor = angular.copy(currentNeighbor);
	
	$scope.profilImage = {
		uploadedImage: undefined,
		file: undefined
	}
	
	
	$scope.save = function () {
// 		$log.debug('save: load');
		
		var data = $scope.currentNeighbor;
// 		$log.debug('scope.profilImage.file', $scope.profilImage.file)
		if ($scope.profilImage.file == undefined) {
			
			$http.post('api/neighbor', data, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
// 				$log.debug(response);
				$scope.currentNeighbor = response.neighbor;
				$uibModalInstance.close(response.neighbor);
				
			})
			.error(function(error) {
				$log.debug(error);
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
// 					$log.debug(response);
					
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

	$scope.loaded = true;

});