angular.module('AuthTest').controller('AddItemController', function($scope, Upload, $timeout, AuthenticationService) {
	
	AuthenticationService.checkToken();
	
	$scope.addInfo = {
		text: '',
		uploadedImage: undefined,
		picFile: undefined
	}
	
	$scope.uploadPic = function() {
		$scope.addInfo.picFile.upload = Upload.upload({
			url: 'api/upload.php',
			data: {
				file: $scope.addInfo.picFile,
				text: $scope.addInfo.text
			}
		})
		.then(
			function(response) {
				console.log(response);
				
				$scope.addInfo = {
					text: '',
					uploadedImage: 'assets/img/'+response.data.filename,
					picFile: undefined
				}
/*
				
				$timeout(function() {
					file.result = response.data;
				});
*/
			}, 
			function(response) {
				if (response.status > 0) {
					$scope.errorMsg = response.status+': '+response.data;
				}
			}, 
			function(progress) {
				$scope.addInfo.picFile.progress = Math.min(100, parseInt(100.0 * progress.loaded / progress.total));
			}
		);
	}
});