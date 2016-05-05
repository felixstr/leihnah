angular.module('Leihnah').controller('LendCheckDataController', function($scope, $uibModalInstance, $http, $log, $uibModal, AuthenticationService, currentLend, ContextBoxService) {
	
// 	$log.debug('currentLend', currentLend);
	$scope.contextBox = ContextBoxService;
	
	$scope.currentLend = angular.copy(currentLend);
	
	$scope.formInfo = {
		validAnswer: false,
		dateStatus: 'none',
		showBox: '',
		activeGet: {
			date: '',
			time: ''
		},
		activeBack: {
			date: '',
			time: ''
		},
		noFindingGet: false,
		noFindingBack: false
	}
	
	$scope.checkData = {
		message: '',
		getDatetime: '',
		backDatetime: ''
	}
	
	$log.debug('$scope.checkData', $scope.checkData);
	
	
	$scope.showBoxBack = function(event) {
// 		$scope.formInfo.showBox = 'back';
		
		ContextBoxService.setTargetElement(event.currentTarget);
	    ContextBoxService.setHorizontalAlign('right');
	    ContextBoxService.setId('boxBack');	    
	    ContextBoxService.setOnlyTopAlign(true);	    
		ContextBoxService.setCenterToElement($('.modalBody'));	
	    ContextBoxService.show();
	    ContextBoxService.currentLend = $scope.currentLend;
	    ContextBoxService.formInfo = $scope.formInfo;
		
		
	}
	
	$scope.showBoxGet = function(event) {
		
		ContextBoxService.setTargetElement(event.currentTarget);
	    ContextBoxService.setHorizontalAlign('right');
	    ContextBoxService.setId('boxGet');	 
	    ContextBoxService.setOnlyTopAlign(true);	    
		ContextBoxService.setCenterToElement($('.modalBody'));   
	    ContextBoxService.show();
	    ContextBoxService.currentLend = $scope.currentLend;
	    ContextBoxService.formInfo = $scope.formInfo;
	    
	}
	
	$scope.contextBox.selectTime = function(type, date, time) {
		$scope.formInfo.showBox = '';

		if (date == 'none') {
			$scope.formInfo.dateStatus = 'no';
			
			if (type == 'get') {
				$scope.formInfo.activeGet = { date: '', time: '' };
				$scope.formInfo.noFindingGet = true;
				$scope.checkData.getDatetime = '';
			} else {
				$scope.formInfo.activeBack = { date: '', time: '' };
				$scope.formInfo.noFindingBack = true;
				$scope.checkData.backDatetime = '';
			}
			
		} else {

			
			if (type == 'get') {
				$scope.formInfo.activeGet = { date: date, time: time };
				$scope.checkData.getDatetime = date+' '+time+':00';
				$scope.formInfo.noFindingGet = false;
			} else {
				$scope.formInfo.activeBack = { date: date, time: time };
				$scope.checkData.backDatetime = date+' '+time+':00';
				$scope.formInfo.noFindingBack = false;
			}
		}
		
		if ($scope.checkData.getDatetime != '' && $scope.checkData.backDatetime != '') {
			$scope.formInfo.dateStatus = 'yes';
		}
		
		
		if ($scope.formInfo.dateStatus == 'yes') {
			$scope.formInfo.validAnswer = true;
		}
		
		ContextBoxService.hide();
		
		$log.debug($scope.checkData);
	}
	
	$scope.answerRequest = function() {
		
		var data = {
			getDatetime: '2016-04-30 15:00:00',
			backDatetime: '2016-05-10 12:30:00',
			message: 'Klappt bestens! Bei änderungen möglichst frühzeitig informieren.'
		};
		data = $scope.checkData;
		
		$log.debug('data', data);
		
		var url = 'api/lend/answer/'+$scope.currentLend.id;			
		
		$http.post(url, data, {
			headers: { 'auth-token': AuthenticationService.getLocalToken() }
		})
		.success(function(response) {
			$log.debug('sendAnswer: response', response);
			
			if (response.ok) {
				$uibModalInstance.close();
			}
			
		})
		.error(function(error) {
			$log.debug(error);
		});
			
		
	}
	
	$scope.openModalClose = function(object) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
			size: 'medium',
			templateUrl: 'template/modal/lendClose.html',
			controller: 'LendCloseController',
			resolve: {
				currentLend: function () {
					return $scope.currentLend;
				},
				kind: function () {
					return 'lend';
				}
			}
		});
		
		modalInstance.result.then(function () {

			$uibModalInstance.dismiss('close');
			
		}, function () {
			$log.debug('Modal dismissed at: ' + new Date());
		});
	}
	
	
	$scope.directContact = function() {
		
		var url = 'api/lend/direct/'+$scope.currentLend.id;			
		
		$http.post(url, {}, {
			headers: { 'auth-token': AuthenticationService.getLocalToken() }
		})
		.success(function(response) {
			$log.debug('sendAnswer: response', response);
			
			if (response.ok) {
				$uibModalInstance.close();
			}
			
		})
		.error(function(error) {
			$log.debug(error);
		});
			
		
	}
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});