angular.module('Leihnah').controller('LandingPageController', function($scope, AuthenticationService, $state, $log, $window, $document, $http, $timeout, Piwik, ContextBoxService) {
	Piwik.trackPageView($window.location.origin+'/landingpage');
	
	$scope.contextBox = ContextBoxService;	

	
	var headerImages = ['lp-header-7.jpg'];
	var headerImage = headerImages[Math.floor(Math.random() * headerImages.length)];
	$scope.headerBG = 'assets/img/static/'+headerImage;
	
	
	$scope.inspirationImages = [
		'assets/img/static/lp-schwimmweste.jpg',
		'assets/img/static/lp-heissleim.jpg',
		'assets/img/static/lp-schneeschuhe.jpg',
		'assets/img/static/lp-abc.jpg',
		'assets/img/static/lp-teigwarenmaschine.jpg',
		'assets/img/static/lp-ukulele.jpg',
		'assets/img/static/lp-barivox.jpg',
		'assets/img/static/lp-naehmaschine.jpg'
		
	];
	
	$scope.statements = [
		{
			image: 'assets/img/static/lp-statement-heckenschere.jpg',
			text: '«Meine teure neue Heckenschere: ein wunderbares Werkzeug! Zum Glück hat auch der Nachbar grosse Freude daran. Nun hat sich der Kauf doppelt gelohnt!»'
		},
		{
			image: 'assets/img/static/lp-statement-entsafter.jpg',
			text: '«Da werden meine Kumpels staunen: Mein obligater End-of-Season-Brunch neu mit Fresh Juice aus Nachbars Entsafter!»'
		},
		{
			image: 'assets/img/static/lp-statement-naehmaschine.jpg',
			text: '«Die BERNINA meiner Nachbarin ist ausgeliehen perfekt für mich: Für die zwei Flicktermine im Jahr kann ich mir die eigene Maschine sparen!»'
		}
	];
	
	$scope.settlements = [
		{
			image: 'assets/img/static/lp-settlement-riedtli.jpg',
			text: 'Riedtli - Unterstrass'
		},
		{
			image: 'assets/img/static/lp-settlement-neubuel.jpg',
			text: 'Neubühl - Wollishofen'
		},
		{
			image: 'assets/img/static/lp-settlement-tiergarten.jpg',
			text: 'Im Tiergarten – Wiedikon'
		}
		
	];
	
	
	// show / hide footer on scroll
	$scope.showFooter = false;
	
	var setShowFooter = function(top) {
		if (top > $window.screen.height) {
			$scope.showFooter = true;
		} else {
			$scope.showFooter = false;
		}
	};
	
	$document.on('scroll', function() {
		$scope.$apply(function() {
	       setShowFooter($document.scrollTop());
	    });	
		
    });
    
    
    // login
    $scope.showLogin = function(from) {
	    var element = $('.buttons a');
	    
	    $document.scrollToElement($('body'), 20, 500);
	    
	    $timeout(function() {
		    ContextBoxService.setTargetElement(element);
		    ContextBoxService.setHorizontalAlign('right');
		    ContextBoxService.setId('login');
		    ContextBoxService.onLoad(function() {
			    $('form[name=login] input[type=text]').focus();
		    });
		    ContextBoxService.show();

	    }, from == 'bottom' ? 800 : 0);

    }
    
	$scope.fail = null;
	
	$scope.loginInfo = {
		username: '',
		password: ''
	}

	$scope.loginFormDisabled = false;
	$scope.loginUser = function() {
		$scope.loginFormDisabled = true;
		
		
		var data = {
			username: $scope.loginInfo.username,
			password: $scope.loginInfo.password
		}	
		
		$http.post('api/login', data)
			.success(function(response) {
				if (response.authenticated) {
					
					
					$scope.authenticated = true;
					AuthenticationService.setLocalToken(response.user.token);
					AuthenticationService.setUser(response.user);
					
					ContextBoxService.hide();
					$state.go('objects');
					
					$scope.fail = null;
					
				} else {
					$log.debug('fail', response.failure);
					$scope.loginFormDisabled = false;
					
					$scope.fail = response.failure;
					if (response.failure == 'credentials') {
						$scope.loginInfo.password = '';
// 						angular.element('.elPassword').trigger('focus');
					}
					if (response.failure == 'unkown' || response.failure == 'inactive') {
						$scope.loginInfo.password = '';
						$scope.loginInfo.username = '';
					}
				}
				
			})
			.error(function(error) {
				$log.debug(error);
			});
		
	}

	
});