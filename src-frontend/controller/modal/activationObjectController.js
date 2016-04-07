angular.module('Leihnah').controller('ActivationObjectController', function($scope, $uibModalInstance, $http, currentObject, AuthenticationService) {
	
	console.log('currentobject', currentObject);
	
	$scope.currentObject = angular.copy(currentObject);
	
	$scope.activation = function () {

		var url = 'api/object/'+currentObject.id;
// 		console.log(url);
		
		var data = $scope.currentObject;
		data.active = !$scope.currentObject.active;
			
		$http.post(url, data, {
			headers: { 'auth-token': AuthenticationService.getLocalToken() }
		})
		.success(function(response) {
			
			$uibModalInstance.close();
			
		})
		.error(function(error) {
			console.log(error);
		});
	
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});