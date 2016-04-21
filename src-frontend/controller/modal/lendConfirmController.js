angular.module('Leihnah').controller('LendConfirmController', function($scope, $uibModalInstance, $http, $log, AuthenticationService, currentLend) {
	
	$log.debug('currentLend', currentLend);
	
	$scope.currentLend = angular.copy(currentLend);
	

	$scope.confirmData = {
		feedback: ''
	}
	
	$log.debug('$scope.closeData', $scope.closeData);
	
	$scope.send = function () {
		$log.debug('send: send');
		
		var data = $scope.closeData;
		
		$http.post('api/lend/confirm/'+$scope.currentLend.id, data, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				$log.debug(response);
				
				if (response.ok) {
					
					$uibModalInstance.close();
				}
				
			})
			.error(function(error) {
				$log.debug(error);
			});

	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});