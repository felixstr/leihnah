angular.module('Leihnah').controller('LandingPageController', function($scope, AuthenticationService, $state, $log, $window, $interval, Piwik) {
	Piwik.trackPageView($window.location.origin+'/landingpage');
	
	/*
	if (AuthenticationService.authenticated && $state.is("landingpage")) {
		$state.go('objects');
	}
	if (!AuthenticationService.authenticated && !$state.is("landingpage")) {
		$state.go('landingpage');
	}
	*/
	
	var headerImages = ['lp-header-1.jpg'];
	var headerImage = headerImages[Math.floor(Math.random() * headerImages.length)];
	$scope.headerBGstyle = {
		'background-image': 'url(assets/img/static/'+headerImage+')'
	}
	
	$scope.inspirationImages = [
		{style: {'background-image': 'url(assets/img/static/lp-schwimmweste.jpg)'}},
		{style: {'background-image': 'url(assets/img/static/lp-heissleim.jpg)'}},
		{style: {'background-image': 'url(assets/img/static/lp-schneeschuhe.jpg)'}},
		{style: {'background-image': 'url(assets/img/static/lp-abc.jpg)'}},
		{style: {'background-image': 'url(assets/img/static/lp-teigwarenmaschine.jpg)'}},
		{style: {'background-image': 'url(assets/img/static/lp-ukulele.jpg)'}},
		{style: {'background-image': 'url(assets/img/static/lp-barivox.jpg)'}},
		{style: {'background-image': 'url(assets/img/static/lp-naehmaschine.jpg)'}}
		
	];
	
	$scope.statements = [
		{
			style: {'background-image': 'url(assets/img/static/lp-statement-heckenschere.jpg)'},
			text: '«Meine teure neue Heckenschere: ein wunderbares Werkzeug! Zum Glück hat auch der Nachbar grosse Freude daran. Nun hat sich der Kauf doppelt gelohnt!»'
		},
		{
			style: {'background-image': 'url(assets/img/static/lp-statement-entsafter.jpg)'},
			text: '«Da werden meine Kumpels staunen: Mein obligater End-of-Season-Brunch neu mit Fresh Juice aus Nachbars Entsafter!»'
		},
		{
			style: {'background-image': 'url(assets/img/static/lp-statement-naehmaschine.jpg)'},
			text: '«Die BERNINA meiner Nachbarin ist ausgeliehen perfekt für mich: Für die zwei Flicktermine im Jahr kann ich mir die eigene Maschine sparen!»'
		}
		
		
	];
	
	$scope.settlements = [
		{
			style: {'background-image': 'url(assets/img/static/lp-settlement-tiergarten.jpg)'},
			text: 'Im Tiergarten – Wiedikon'
		},
		{
			style: {'background-image': 'url(assets/img/static/lp-settlement-neubuel.jpg)'},
			text: 'Neubühl - Wollishofen'
		},
		{
			style: {'background-image': 'url(assets/img/static/lp-settlement-riedtli.jpg)'},
			text: 'Riedtli - Unterstrass'
		}
		
	];
	
	
	$scope.scroll = 0;
	
	$scope.showFooter = false;
	
	
	var scrollPosition = 11;

	angular.element($window).bind("scroll", function() {
		scrollPosition = this.pageYOffset;
	});
	
	$interval(function() {
		if (scrollPosition > $window.screen.height) {
			$scope.showFooter = true;
		} else {
			$scope.showFooter = false;
		}
	}, 5);

	
});