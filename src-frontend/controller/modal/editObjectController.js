angular.module('Leihnah').controller('EditObjectController', function($scope, $uibModalInstance, $http, $log, currentObject, AuthenticationService, Upload, categories, currentNeighbor) {
	
	$log.debug('currentobject', currentObject);
	$log.debug('currentNeighbor', currentNeighbor);
	
	$scope.currentNeighbor = angular.copy(currentNeighbor);
	$scope.formDisabled = false;
		
	$scope.currentObject = {
		categoryId: '8', // sonstiges
		active: true,
		image_1: '',
		image_2: '',
		image_3: '',
		name: '',
		nameAlternatives: '',
		description: '',
		damage: '',
		gift: false,
		directContact_person1_mail: 'no',
		directContact_person1_phone: 'no',
		directContact_person2_mail: 'no',
		directContact_person2_phone: 'no',
		directContact_fixnetPhone: 'no'
	};
	
	$scope.objectImage = {
		image_1: undefined,
		image_2: undefined,
		image_3: undefined
	}
	
	if (currentObject !== undefined) {
		$scope.currentObject = angular.copy(currentObject);
		$scope.currentObject.categoryId = currentObject.categoryId.toString();
		$scope.currentObject.directContact_fixnetPhone = $scope.currentObject.directContact_fixnetPhone == true ? 'yes' : 'no'; 
		$scope.currentObject.directContact_person1_mail = $scope.currentObject.directContact_person1_mail == true ? 'yes' : 'no'; 
		$scope.currentObject.directContact_person1_phone = $scope.currentObject.directContact_person1_phone == true ? 'yes' : 'no'; 
		$scope.currentObject.directContact_person2_mail = $scope.currentObject.directContact_person2_mail == true ? 'yes' : 'no'; 
		$scope.currentObject.directContact_person2_phone = $scope.currentObject.directContact_person2_phone == true ? 'yes' : 'no'; 
		
		$scope.currentObject.directContactFlag = ( 
			$scope.currentObject.directContact_fixnetPhone == 'yes' || 
			$scope.currentObject.directContact_person1_mail == 'yes' || 
			$scope.currentObject.directContact_person1_phone == 'yes' || 
			$scope.currentObject.directContact_person2_mail == 'yes' || 
			$scope.currentObject.directContact_person2_phone== 'yes' ) ? 'yes' : 'no';
	} else {
		$scope.currentObject.directContactFlag = 'yes';
	}
	
	$scope.categories = angular.copy(categories);
	$log.debug('categories', categories);
	/*
	if ($scope.categories[0].id != 0 && $scope.currentObject.categoryId == 0) {
		$scope.categories.splice(0, 0, {id: 0, name: '-- Auswahl --'});
	}
	*/
	
	$log.debug('scope.categories', $scope.categories);
	
	$scope.updateCategory = function() {
		$log.debug('categoryid', $scope.currentObject.categoryId);
		if ($scope.currentObject.categoryId == '0') {
			$scope.editObject.category.$setValidity("notSelected", false);
		} else {
			$scope.editObject.category.$setValidity("notSelected", true);
		}
	}
	
	$scope.deletePic = function(number) {
		
		if (number == 1) {
			$scope.objectImage.image_1 = $scope.objectImage.image_2;
			$scope.objectImage.image_2 = $scope.objectImage.image_3;
			$scope.objectImage.image_3 = undefined;
			$scope.currentObject.image_1 = $scope.currentObject.image_2;
			$scope.currentObject.image_2 = $scope.currentObject.image_3;
			$scope.currentObject.image_3 = '';
		}
		if (number == 2) {
			$scope.objectImage.image_2 = $scope.objectImage.image_3;
			$scope.objectImage.image_3 = undefined;
			$scope.currentObject.image_2 = $scope.currentObject.image_3;
			$scope.currentObject.image_3 = '';
		}
		if (number == 3) {
			$scope.objectImage.image_3 = undefined;
			$scope.currentObject.image_3 = '';
		}
		
	}
	
	$scope.save = function () {
		$log.debug('save: currentObject', $scope.currentObject);
		$scope.formDisabled = true;
		
		var data = $scope.currentObject;
		data.contacts = $scope.contacts;
		
		$log.debug('data', data);
		
		var url = 'api/object'+(currentObject == undefined ? '' : '/'+currentObject.id);
		$log.debug(url);
			
		$log.debug('save: scope.objectImage', $scope.objectImage);
			
		if ($scope.objectImage.image_1 === undefined && $scope.objectImage.image_2 === undefined && $scope.objectImage.image_3 === undefined) {
			$log.debug('save: no fileupload');
			
			$http.post(url, data, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				
				$uibModalInstance.close();
				
			})
			.error(function(error) {
				$log.debug(error);
			});
			
		} else {
			
			data.upload_1 = $scope.objectImage.image_1;
			data.upload_2 = $scope.objectImage.image_2;
			data.upload_3 = $scope.objectImage.image_3;
			
			Upload.upload({
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
						$log.debug(response.data);
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