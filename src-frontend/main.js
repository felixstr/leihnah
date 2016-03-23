var app = angular.module('Leihnah', ["ui.router", "ngFileUpload"]); 
module.exports = app;
 
 
app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
	
	$urlRouterProvider.otherwise("/home");

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
		.state('objects', {
			url: '/objects',
			controller: 'ObjectsController',
			templateUrl: 'template/objects.html',
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
		});
});

app.run(function($rootScope, $state, $transitions, AuthenticationService) {
	console.log('run');
	
	$transitions.onBefore({ to: 'home' }, function($state) {								
		return AuthenticationService.isAuthenticated() ? $state.target('objects') : true;
	});
	
	var toHome = function($state) {	
		var result = true;
		if (AuthenticationService.authenticationChecked && !AuthenticationService.isAuthenticated()) {
			result = $state.target('home');
		}
				
		return result;
	};
	
	$transitions.onBefore({ to: 'objects' }, toHome);
	$transitions.onBefore({ to: 'neighbor' }, toHome);
	$transitions.onBefore({ to: 'wishlist' }, toHome);
	$transitions.onBefore({ to: 'profil' }, toHome);

});