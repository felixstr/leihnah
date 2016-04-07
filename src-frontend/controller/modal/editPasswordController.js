angular.module('Leihnah').controller('EditPasswordController', function($scope, $uibModalInstance, $http, AuthenticationService) {
	
	$scope.message = null;
	
	$scope.user = angular.copy(AuthenticationService.getUser());
	
	$scope.user.passwordOld = '';
	$scope.user.passwordNew = '';
	$scope.user.passwordNewRepeat = '';
	
	console.log('user', $scope.user);
	
	$scope.checkPasswords = function() {
		console.log($scope.user.passwordNew);
		if (($scope.user.passwordNew == '' && $scope.user.passwordNewRepeat == '') || ($scope.user.passwordNew == $scope.user.passwordNewRepeat)) {
			$scope.editUser.passwordNewRepeat.$setValidity("same", true);
		} else {
			$scope.editUser.passwordNewRepeat.$setValidity("same", false);
		}
	}
	
	$scope.checkUsername = function() {
		console.log('check username: ', $scope.user.name);
		
		$http.post('api/usernameexists', {
				username: $scope.user.name
			},{
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				console.log(response);
				if (response.usernameExists) {
					$scope.editUser.name.$setValidity("exists", false);
				} else {
					$scope.editUser.name.$setValidity("exists", true);
				}
// 				$scope.registerInfo.usernameOk = !response.usernameExists;
			})
			.error(function(error) {
				console.log(error);
			});
		
		
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
			console.log(error);
		});
			
		
// 		
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	

});