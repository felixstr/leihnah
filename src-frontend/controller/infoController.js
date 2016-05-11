angular.module('Leihnah').controller('InfoController', function($scope, $window, $log, $timeout, Piwik, PageVisibilityService, AuthenticationService, auth) {
	Piwik.trackPageView($window.location.origin+'/info');
	
	$timeout(function() {
		PageVisibilityService.show();
	}, 500);

});