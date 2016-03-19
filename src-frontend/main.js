var app = angular.module('AuthTest', ["ui.router", "ngFileUpload"]); 
module.exports = app;
 
app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
	console.log('asdf3');	
/*
	$httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
*/
	
	$urlRouterProvider.otherwise("/home");

	$stateProvider
		.state('home', {
			url: '/home',
			controller: 'LoginController',
			templateUrl: 'template/login.html'
		})
		.state('application', {
			url: '/app',
			controller: 'MainController',
			templateUrl: 'template/application.html'
		})
		.state('add', {
			url: '/app/add',
			controller: 'AddItemController',
			templateUrl: 'template/addItem.html'
		});
});