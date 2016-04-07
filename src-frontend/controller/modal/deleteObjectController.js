angular.module('Leihnah').controller('DeleteObjectController', function($scope, $uibModalInstance, $http, currentObject, AuthenticationService) {
	
	console.log('currentobject', currentObject);
	
	$scope.currentObject = angular.copy(currentObject);
	
	$scope.delete = function () {

		var url = 'api/object/'+currentObject.id;
// 		console.log(url);
			
		$http.delete(url, {
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