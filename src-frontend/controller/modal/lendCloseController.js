angular.module('Leihnah').controller('LendCloseController', function($scope, $uibModalInstance, $http, $log, AuthenticationService, currentLend, kind) {
	
	$log.debug('currentLend', currentLend);
	$log.debug('kind', kind);
	
	$scope.currentLend = angular.copy(currentLend);
	
	$scope.formInfo = {
		otherNeighbor: (kind == 'borrow' ? $scope.currentLend.neighborLend : $scope.currentLend.neighborBorrow),
		feedbackPlaceholder: '',
		buttonText: ''
	}
	
	var type = '';
	if ($scope.currentLend.confirmedDatetime != null && $scope.currentLend.inTime) {
		type = 'successful';
		
		$scope.formInfo.titleText = 'Möchtest du die Verleihung wirklich abschliessen?';
		$scope.formInfo.feedbackPlaceholder = 'Teile '+$scope.formInfo.otherNeighbor.accountName+' mit, wie zurfrieden du mit der Verleihung bist';
		$scope.formInfo.buttonText = 'Verleihung abschliessen';
		
	} else if(($scope.currentLend.state == 'request' || $scope.currentLend.state == 'answered') && kind == 'borrow') {
		type = 'stopped';
		
		$scope.formInfo.titleText = 'Möchtest du die Anfrage wirklich abbrechen?';
		$scope.formInfo.feedbackPlaceholder = 'Teile '+$scope.formInfo.otherNeighbor.accountName+' mit, wieso du die Anfrage abbrichst';
		
		$scope.formInfo.buttonText = 'Anfrage abbrechen';
	} else if($scope.currentLend.state == 'request' && kind == 'lend') {
		type = 'refused';
		
		$scope.formInfo.titleText = 'Möchtest du die Anfrage wirklich ablehnen?';
		$scope.formInfo.feedbackPlaceholder = 'Teile '+$scope.formInfo.otherNeighbor.accountName+' mit, wieso du die Anfrage ablehnst';
		
		$scope.formInfo.buttonText = 'Anfrage ablehnen';
	} else if(($scope.currentLend.state == 'answered' || $scope.currentLend.state == 'confirmed')  && kind == 'lend') {
		type = 'canceled';
		
		$scope.formInfo.titleText = 'Möchtest du die Verleihung wirklich stornieren?';
		$scope.formInfo.feedbackPlaceholder = 'Teile '+$scope.formInfo.otherNeighbor.accountName+' mit, wieso du die Anfrage stornierst';
		
		$scope.formInfo.buttonText = 'Anfrage stornieren';
	}
	
	$scope.closeData = {
		objectNotBack: 'no',
		feedback: '',
		type: type,
		kind: kind
	}
	
	$log.debug('$scope.closeData', $scope.closeData);
	
	$scope.send = function () {
		$log.debug('send: send');
		
		var data = $scope.closeData;
		
		$http.post('api/lend/close/'+$scope.currentLend.id, data, {
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