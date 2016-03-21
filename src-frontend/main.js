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
		.state('profil', {
			url: '/profil',
			controller: 'ProfilController',
			templateUrl: 'template/profil.html',
			parent: 'layout'
		});
});

app.run(function($rootScope, $state, $transitions, AuthenticationService) {
	console.log('run');
	
	$transitions.onBefore({ to: 'home' }, function($state) {
		
		console.log('tra', $state.current);
		
// 		console.log(AuthenticationService.isAuthenticated());
						
		return AuthenticationService.isAuthenticated() ? $state.target('objects') : true;
	});
	
	var toHome = function($state) {	
		
		console.log('auth', AuthenticationService.isAuthenticated());
		
		return AuthenticationService.isAuthenticated() ? true : $state.target('home');
	};
	
	$transitions.onBefore({ to: 'objects' }, toHome);
	$transitions.onBefore({ to: 'profil' }, toHome);
	

});