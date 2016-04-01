angular.module('Leihnah').controller('EditPasswordController', function($scope, $uibModalInstance, $http, AuthenticationService) {
			
	$scope.user = {
		passwordOld: '',
		passwordNew: '',
		passwordNewRepeat: ''
	}
	
	$scope.checkPasswords = function() {
		console.log($scope.user.passwordNew);
		if ($scope.user.passwordNew == $scope.user.passwordNewRepeat) {
			$scope.editPassword.passwordNewRepeat.$setValidity("same", true);
		} else {
			$scope.editPassword.passwordNewRepeat.$setValidity("same", false);
		}
	}
	
	
	$scope.save = function () {
		console.log('save: load');
		
		var data = $scope.user;
			
		$http.put('api/user', data, {
			headers: { 'auth-token': AuthenticationService.getLocalToken() }
		})
		.success(function(response) {
			console.log('save paswword', response);
			if (response.ok) {
				$uibModalInstance.close();
			} else {
				$scope.user = {
					passwordOld: '',
					passwordNew: '',
					passwordNewRepeat: ''
				}
				
				$scope.message = 'Dein altes Passwort war nicht korrekt.';
			}
			
		})
		.error(function(error) {
			console.log(error);
		});
			
		
// 		
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});