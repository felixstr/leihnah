var app = angular.module('Leihnah', ["ui.router", 'ui.bootstrap', "ngFileUpload", 'piwik', 'ngSanitize', 'angular-carousel', 'ngTouch', 'angularMoment', 'ngAnimate']); 
module.exports = app;
 
 
app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $logProvider, $windowProvider) {
/*
	
	$analyticsProvider.firstPageview(true); 
	$analyticsProvider.withAutoBase(true);
	$analyticsProvider.virtualPageviews(false);
*/
	
	if ($windowProvider.$get().location.host != 'localhost' && $windowProvider.$get().location.host != '192.168.1.101') {
		$logProvider.debugEnabled(false);
	}
	
	
	$urlRouterProvider.otherwise("/landingpage");

	$stateProvider
		.state('layout', {
			controller: 'MainController',
			templateUrl: 'template/layout.html',
			abstract: true,
			resolve: {
				auth: function($q, $timeout, AuthenticationService){
					var deferred = $q.defer();
					
					AuthenticationService.checkAuthentication(function(authenticated, user) {
						deferred.resolve(authenticated);
					}); 
					
/*
					$timeout(function(){
                    deferred.resolve("ok");
                 }, 5000);
*/
					
					return deferred.promise;
				}
			}
		})
		.state('home', {
			url: '/home',
			controller: 'HomeController',
			templateUrl: 'template/home.html',
			parent: 'layout'		
		})
		.state('landingpage', {
			url: '/landingpage',
			controller: 'LandingPageController',
			templateUrl: 'template/landingPage.html'
		})
		.state('objects', {
			url: '/objects',
			controller: 'ObjectsController',
			templateUrl: 'template/objects.html',
			parent: 'layout'
		})
		.state('object', {
			url: '/object/:objectId',
			controller: 'ObjectDetailController',
			templateUrl: 'template/objectDetail.html',
			parent: 'layout'
		})
		.state('neighbor', {
			url: '/neighbor',
			controller: 'NeighborController',
			templateUrl: 'template/neighbor.html',
			parent: 'layout'
		})
		.state('wishlist', {
			url: '/wishlist',
			controller: 'WishlistController',
			templateUrl: 'template/wishlist.html',
			parent: 'layout'
		})
		.state('profil', {
			url: '/profil',
			controller: 'ProfilController',
			templateUrl: 'template/profil.html',
			parent: 'layout'
		})
		.state('profil.base', {
			url: '/base',
			controller: 'ProfilBaseController',
			templateUrl: 'template/profilBase.html',
			parent: 'profil'
		})
		.state('profil.objects', {
			url: '/objects',
			controller: 'ProfilObjectsController',
			templateUrl: 'template/profilObjects.html',
			parent: 'profil'
		})
		.state('profil.borrow', {
			url: '/borrow',
			controller: 'ProfilBorrowController',
			templateUrl: 'template/profilBorrow.html',
			parent: 'profil'
		})
		.state('profil.lend', {
			url: '/lend',
			controller: 'ProfilLendController',
			templateUrl: 'template/profilLend.html',
			parent: 'profil'
		})
		.state('borrow', {
			url: '/borrow/:borrowId',
			controller: 'BorrowController',
			templateUrl: 'template/borrow.html',
			parent: 'layout'
		})
		.state('lend', {
			url: '/lend/:lendId',
			controller: 'LendController',
			templateUrl: 'template/lend.html',
			parent: 'layout'
		})
		.state('register', {
			url: '/register',
			controller: 'RegisterController',
			templateUrl: 'template/register.html',
			parent: 'layout'
		});
});

app.run(function($rootScope, $state, $transitions, $window, $log, $templateCache, AuthenticationService, ContextmenuService, Piwik, amMoment) {
	
	amMoment.changeLocale('de');
/*
	

	$transitions.onBefore({to: '**'}, function($window, Piwik, $state) {
		$log.debug('state-current', $state.current);
// 		
		
		
	});
	
*/

	$transitions.onBefore({ to: 'home' }, function($state) {								
		return AuthenticationService.isAuthenticated() ? $state.target('objects') : true;
	});
	
/*
	var toHome = function($state) {	
		$log.debug('toHome', AuthenticationService.authenticationChecked);
		var result = true;
		if (!AuthenticationService.isAuthenticated()) {
			result = $state.target('home');
		}
				
		return result;
	};
*/
	
	var toHome = function($q){
		var deferred = $q.defer();
				
		AuthenticationService.checkAuthentication(function(authenticated, user) {
			if (authenticated) {
				deferred.resolve(true);
			} else {
				deferred.resolve($state.target('home'));
			}
		}); 
		
		return deferred.promise;
	}
	
	$transitions.onBefore({ to: 'objects' }, toHome);
	$transitions.onBefore({ to: 'object' }, toHome);
	$transitions.onBefore({ to: 'neighbor' }, toHome);
	$transitions.onBefore({ to: 'wishlist' }, toHome);
	$transitions.onBefore({ to: 'profil' }, toHome);
	$transitions.onBefore({ to: 'profil.base' }, toHome);
	$transitions.onBefore({ to: 'profil.objects' }, toHome);
	
	
	
	
});
