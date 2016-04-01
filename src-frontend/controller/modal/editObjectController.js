angular.module('Leihnah').controller('EditObjectController', function($scope, $uibModalInstance, $http, currentObject, AuthenticationService, Upload, categories) {
	
	console.log('currentobject', currentObject);
	console.log('categories', categories);
	$scope.currentObject = angular.copy(currentObject);
	$scope.categories = categories;
	
		
	$scope.objectImage = {
		file1: undefined,
		file2: undefined,
		file3: undefined
	}
	
	
	$scope.save = function () {
		console.log('save: load', $scope.currentObject);
		
		var data = $scope.currentObject;
		data.categoryId = $scope.currentObject.category.id;

		if ($scope.objectImage.file1 == undefined) {
			
			$http.post('api/object', data, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				
				$uibModalInstance.close();
				
			})
			.error(function(error) {
				console.log(error);
			});
			
		} else {
			
			data.file1 = $scope.objectImage.file1;
			
			$scope.objectImage.file1.upload = Upload.upload({
				url: 'api/object',
				method: 'POST', // PUT funktioniert nicht mit slim
				headers: { 'auth-token': AuthenticationService.getLocalToken() },
				data: data
			})
			.then(
				function(response) {
					$uibModalInstance.close();					
				}, 
				function(response) {
					if (response.status > 0) {
						$scope.errorMsg = response.status+': '+response.data;
					}
				}, 
				function(progress) {
					$scope.objectImage.file1.progress = Math.min(100, parseInt(100.0 * progress.loaded / progress.total));
				}
			);
		}
// 		
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});