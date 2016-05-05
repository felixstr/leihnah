angular.module('Leihnah').controller('ProfilLendController', function($scope, $http, $state, $window, $uibModal, $log, $timeout, $document, AuthenticationService, auth, CategoryService, Piwik, PageVisibilityService) {
	Piwik.trackPageView($window.location.origin+'/profil/lend');
			
	$timeout(function() {
		PageVisibilityService.showProfil();
	},100);
	
	$scope.goLend = function(id) {
		PageVisibilityService.hide();		
		
		$timeout(function() {
			$document.scrollToElement($("body"), 0, 300);
		}, 300);
		
		$timeout(function() {
			$state.go('lend', {lendId: id});
		}, 700);

	}

});