angular.module('Leihnah').controller('EditObjectController', function($scope, $uibModalInstance, $http, currentObject, AuthenticationService, Upload, categories) {
	
	console.log('currentobject', currentObject);
	
	$scope.currentObject = {
		categoryId: '0',
		active: true,
		image_1: '',
		image_2: '',
		image_3: '',
		name: '',
		description: '',
		damage: '',
		gift: false
	};
	
	$scope.objectImage = {
		image_1: undefined,
		image_2: undefined,
		image_3: undefined
	}
	
	if (currentObject !== undefined) {
		$scope.currentObject = angular.copy(currentObject);
		$scope.currentObject.categoryId = currentObject.category.id;
	}
	
	$scope.categories = categories;
	if ($scope.categories[0].id != 0) {
		$scope.categories.splice(0, 0, {id: '0', name: '-- Auswahl --'});
	}

	
	console.log('categories', categories);
	
	$scope.updateCategory = function() {
		console.log('categoryid', $scope.currentObject.categoryId);
		if ($scope.currentObject.categoryId == '0') {
			$scope.editObject.category.$setValidity("notSelected", false);
		} else {
			$scope.editObject.category.$setValidity("notSelected", true);
		}
	}
	
// 	$scope.updateCategory();
	
	$scope.save = function () {
		console.log('save: load', $scope.currentObject);
		console.log('save: objectImage', $scope.objectImage);
		
		var data = $scope.currentObject;
		var url = 'api/object'+(currentObject == undefined ? '' : '/'+currentObject.id);
		console.log(url);
			
		if ($scope.objectImage.image_1 == undefined && $scope.objectImage.image_2 == undefined && $scope.objectImage.image_3 == undefined) {
			
			
			$http.post(url, data, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				
				$uibModalInstance.close();
				
			})
			.error(function(error) {
				console.log(error);
			});
			
		} else {
			
			data.upload_1 = $scope.objectImage.image_1;
			data.upload_2 = $scope.objectImage.image_2;
			data.upload_3 = $scope.objectImage.image_3;
			
			$scope.objectImage.image_1.upload = Upload.upload({
				url: url,
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
// 					$scope.objectImage.image_1.progress = Math.min(100, parseInt(100.0 * progress.loaded / progress.total));
				}
			);
		}
// 		
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});