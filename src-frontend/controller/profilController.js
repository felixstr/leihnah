angular.module('Leihnah').controller('ProfilController', function($scope, $http, $state, $log, AuthenticationService, auth, $timeout, PageVisibilityService) {

// 	$log.debug('ProfilContainer');
	
	$scope.$parent.closeResults();
	
	$timeout(function() {
		PageVisibilityService.show();
	},50);
	
	

});