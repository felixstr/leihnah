angular.module('Leihnah').controller('EditPasswordController', function($scope, $uibModalInstance, $http, $log, AuthenticationService) {
	
	$scope.message = null;
	
	$scope.user = angular.copy(AuthenticationService.getUser());
	
	$scope.user.passwordOld = '';
	$scope.user.passwordNew = '';
	$scope.user.passwordNewRepeat = '';
	
// 	$log.debug('user', $scope.user);
	
	$scope.checkPasswords = function() {
// 		$log.debug($scope.user.passwordNew);
		if (($scope.user.passwordNew == '' && $scope.user.passwordNewRepeat == '') || ($scope.user.passwordNew == $scope.user.passwordNewRepeat)) {
			$scope.editUser.passwordNewRepeat.$setValidity("same", true);
		} else {
			$scope.editUser.passwordNewRepeat.$setValidity("same", false);
		}
	}
	
	$scope.checkUsername = function() {
// 		$log.debug('check username: ', $scope.user.name);
		
		if ($scope.user.name == undefined || $scope.user.name.length < 3) {
			$scope.editUser.name.$setValidity("minlength", false);
			$scope.editUser.name.$setValidity("exists", true);
		} else {
			$scope.editUser.name.$setValidity("minlength", true);
			
			$http.post('api/usernameexists', {
					username: $scope.user.name
				},{
					headers: { 'auth-token': AuthenticationService.getLocalToken() }
				})
				.success(function(response) {
					$log.debug(response);
					if (response.usernameExists) {
						$scope.editUser.name.$setValidity("exists", false);
					} else {
						$scope.editUser.name.$setValidity("exists", true);
					}
	// 				$scope.registerInfo.usernameOk = !response.usernameExists;
				})
				.error(function(error) {
					$log.debug(error);
				});
		}
		
	}
	
	
	$scope.save = function () {
// 		$log.debug('save: load');
		
		var data = $scope.user;
			
		$http.put('api/user', data, {
			headers: { 'auth-token': AuthenticationService.getLocalToken() }
		})
		.success(function(response) {
// 			$log.debug('save paswword', response);
			if (response.ok) {
				AuthenticationService.loadUserInfo();
				
				$uibModalInstance.close();
			} else {
				
				$scope.user = angular.copy(AuthenticationService.getUser());
				$scope.user.passwordOld = '';
				$scope.user.passwordNew = '';
				$scope.user.passwordNewRepeat = '';
				
				$scope.message = 'Das Passwort war nicht korrekt';
			}
			
		})
		.error(function(error) {
			$log.debug(error);
		});
			
		
// 		
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});