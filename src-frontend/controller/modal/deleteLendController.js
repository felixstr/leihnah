angular.module('Leihnah').controller('DeleteLendController', function($scope, $uibModalInstance, $http, $log, currentLend, AuthenticationService) {
	
// 	$log.debug('currentobject', currentObject);
	
	$scope.currentLend = angular.copy(currentLend);
	
	$scope.delete = function () {

		var url = 'api/lend/'+currentLend.id;
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