angular.module('Leihnah').controller('DeleteObjectController', function($scope, $uibModalInstance, $http, $log, currentObject, AuthenticationService) {
	
	$log.debug('currentobject', currentObject);
	
	$scope.currentObject = angular.copy(currentObject);
	
	$scope.delete = function () {

		var url = 'api/object/'+currentObject.id;
// 		$log.debug(url);
			
		$http.delete(url, {
			headers: { 'auth-token': AuthenticationService.getLocalToken() }
		})
		.success(function(response) {
			
			$uibModalInstance.close();
			
		})
		.error(function(error) {
			$log.debug(error);
		});
	
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});