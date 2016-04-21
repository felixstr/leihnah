angular.module('Leihnah').controller('EditProfilPersonController', function($scope, $uibModalInstance, $http, $log, currentNeighbor, AuthenticationService, person) {
	
	$log.debug('currentneighbor', currentNeighbor);
	
	$scope.currentNeighbor = angular.copy(currentNeighbor);
	
	if (person == 1) {
		$scope.person = {
			number: person,
			firstName: $scope.currentNeighbor.person1_firstName,
			lastName: $scope.currentNeighbor.person1_lastName,
			mail: $scope.currentNeighbor.person1_mail,
			mailPublic: $scope.currentNeighbor.person1_mailPublic,
			phonePublic: $scope.currentNeighbor.person1_phonePublic,
			phone: $scope.currentNeighbor.person1_phone
		}
	} else {
		$scope.person = {
			number: person,
			firstName: $scope.currentNeighbor.person2_firstName,
			lastName: $scope.currentNeighbor.person2_lastName,
			mail: $scope.currentNeighbor.person2_mail,
			mailPublic: $scope.currentNeighbor.person2_mailPublic,
			phone: $scope.currentNeighbor.person2_phone,
			phonePublic: $scope.currentNeighbor.person2_phonePublic
		}
	}
	
	
	$scope.save = function () {
		$log.debug('save: load');
		
		$log.debug($scope.person);
		
		var data = {};
		if (person == 1) {
			data.person1_firstName = $scope.person.firstName;
			data.person1_lastName = $scope.person.lastName;
			data.person1_mail = $scope.person.mail;
			data.person1_mailPublic = $scope.person.mailPublic;
			data.person1_phone = $scope.person.phone;
			data.person1_phonePublic = $scope.person.phonePublic;
		} else {
			data.person2_firstName = $scope.person.firstName;
			data.person2_lastName = $scope.person.lastName;
			data.person2_mail = $scope.person.mail;
			data.person2_mailPublic = $scope.person.mailPublic;
			data.person2_phone = $scope.person.phone;
			data.person2_phonePublic = $scope.person.phonePublic;
		}
		
			
		$http.post('api/neighbor', data, {
			headers: { 'auth-token': AuthenticationService.getLocalToken() }
		})
		.success(function(response) {
			
			$scope.currentNeighbor = response.neighbor;
			$uibModalInstance.close(response.neighbor);
			
		})
		.error(function(error) {
			$log.debug(error);
		});
			
	
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});