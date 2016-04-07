angular.module('Leihnah').controller('EditProfilPersonController', function($scope, $uibModalInstance, $http, currentNeighbor, AuthenticationService, person) {
	
	console.log('currentneighbor', currentNeighbor);
	
	$scope.currentNeighbor = angular.copy(currentNeighbor);

	if (person == 1) {
		$scope.person = {
			firstName: $scope.currentNeighbor.person1_firstName,
			lastName: $scope.currentNeighbor.person1_lastName,
			mail: $scope.currentNeighbor.person1_mail,
			phone: $scope.currentNeighbor.person1_phone
		}
	} else {
		$scope.person = {
			firstName: $scope.currentNeighbor.person2_firstName,
			lastName: $scope.currentNeighbor.person2_lastName,
			mail: $scope.currentNeighbor.person2_mail,
			phone: $scope.currentNeighbor.person2_phone
		}
	}
	
	
	$scope.save = function () {
		console.log('save: load');
		
		console.log($scope.person);
		
		var data = {};
		if (person == 1) {
			data.person1_firstName = $scope.person.firstName;
			data.person1_lastName = $scope.person.lastName;
			data.person1_mail = $scope.person.mail;
			data.person1_phone = $scope.person.phone;
		} else {
			data.person2_firstName = $scope.person.firstName;
			data.person2_lastName = $scope.person.lastName;
			data.person2_mail = $scope.person.mail;
			data.person2_phone = $scope.person.phone;
		}
		
			
		$http.post('api/neighbor', data, {
			headers: { 'auth-token': AuthenticationService.getLocalToken() }
		})
		.success(function(response) {
			
			$scope.currentNeighbor = response.neighbor;
			$uibModalInstance.close(response.neighbor);
			
		})
		.error(function(error) {
			console.log(error);
		});
			
	
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});