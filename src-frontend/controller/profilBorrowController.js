angular.module('Leihnah').controller('ProfilBorrowController', function($scope, $http, $state, $window, $uibModal, $log, $timeout, $document, AuthenticationService, auth, CategoryService, Piwik, PageVisibilityService) {
	Piwik.trackPageView($window.location.origin+'/profil/borrow');
	
	$timeout(function() {
		PageVisibilityService.showProfil();	
	},50);
	
	$scope.goBorrow = function(id) {
		PageVisibilityService.hide();	
		
		$timeout(function() {
			$document.scrollToElement($("body"), 0, 300);
		}, 300);
		
		$timeout(function() {
			$state.go('borrow', {borrowId: id});
		}, 700);

	}
	
	
	
});