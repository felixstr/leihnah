angular.module('Leihnah').controller('MainController', function($scope, $http, $state, $window, $log, $location, $interval, $document, AuthenticationService, ContextmenuService, ContextBoxService, auth, CategoryService, resize) {
	
	if (AuthenticationService.authenticated && $state.is("home")) {
		$state.go('objects');
	}
	if (!AuthenticationService.authenticated) {
		$state.go('landingpage');
	}
	
	$scope.contextBox = ContextBoxService;		
	$scope.state = $state;
	$scope.window = $window;
	
	$scope.fadeout = false;
		
	
	$scope.lastObjectId = 0; // @todo: needet?
	$scope.scrollPosition = 0;
	
	// lends and borrows
	$scope.lends = [];
	$scope.borrows = [];
	$scope.loadLends = function() {
		$http.get('api/lend', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				$log.debug('load lends', response);
				if (response.ok) {
					$scope.lends = response.lends;
					$scope.borrows = response.borrows;
				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	}
	$scope.loadLends();
	
	
	// list filter and order
	$scope.filter = {
		search: '',
		category: null,
		categoryName: ''
	}
	$scope.resetFilter = function() {
		$scope.filter = {
			search: '',
			category: null,
			categoryName: ''
		};
		
		$location.hash('');
	}
	$scope.order = {
		items: [
			{ 
				id: 'abc', 
				name: 'Alphabeth',
				field: 'name',
				reverse: false
			},
			{ 
				id: 'newest', 
				name: 'Neuster', 
				field: 'id',
				reverse: true
			},
			{ 
				id: 'popular', 
				name: 'Beliebtester', 
				field: 'viewCount',
				reverse: true
			}			
		]
	}
	$scope.order.current = $scope.order.items[0];
	

	// objects list
	$scope.objects = '';
	$scope.loadObjects = function() {
		$log.debug('main-controller: loadObjects');
		
		$http.get('api/object', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				$log.debug('loadObjects', response);
				if (response.ok) {
					$scope.objects = response.objects;
					$scope.objectsNew = response.objectsNew;
					$scope.objectsPopular = response.objectsPopular;
					$scope.objectsFavorites = response.objectsFavorites;
					$log.debug('scope.objects', $scope.objects);
				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	}
	$scope.loadObjects();
	
	
	// categories
	CategoryService.loadCategories(function(categories) {
		$scope.categories = categories;
	});

	// watch if authentication is changed	
	$scope.$watch(function() { return AuthenticationService.authenticated; }, function(newVal, oldVal) {
		$log.debug('changed');
		$scope.authenticated = AuthenticationService.authenticated;
		$scope.loadCurrentNeighbor();
		$scope.loadObjects();
		CategoryService.loadCategories(function(categories) {
			$scope.categories = categories;
		});
	});
	
	// profilMenu
	$scope.showProfilMenu = function(event) {
	    $log.debug(event.currentTarget);
	    
	    ContextBoxService.setTargetElement(event.currentTarget);
	    ContextBoxService.setHorizontalAlign('right');
	    ContextBoxService.setId('profil');	    
	    ContextBoxService.show();
    }
	
	// watch if contextmenu has changed
	$scope.contextmenu = ContextmenuService;
	$scope.$watch(function() { return ContextmenuService.current; }, function(newVal, oldVal) {
		$log.debug('current changed');
		$scope.contextmenu = ContextmenuService;
	});
	
	// current neighbor
	$scope.currentNeighbor = '';
	$scope.profilImageBG = {};
	$scope.loadCurrentNeighbor = function() {
		$http.get('api/neighbor', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				$log.debug('loadCurrentNeighbor', response);
				if (response.ok) {
					$scope.currentNeighbor = response;
					
					$scope.profilImageBG = {
						'background-image':'url('+($scope.currentNeighbor.accountImage == '' ? 'assets/img/static/profil-default.svg' : 'assets/img/profil/'+$scope.currentNeighbor.accountImage)+')'
					}
					
				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	}
	$scope.loadCurrentNeighbor();
	
	// logout function
	$scope.logoutUser = function() {
		$log.debug('AuthenticationService.getLocalToken()', AuthenticationService.getLocalToken());
		$http.post('api/logout', '', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				if (!response.authenticated) {

					AuthenticationService.logout();
					
					$state.go('landingpage');
				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	}
	
	
	// resize: check if mobile oder desktop view
	$scope.showMobile = false;
	$scope.showDesktop = false;
	resize($scope).call(function() { 
		$scope.$apply(function() {
	       setResponsveVisibility();
	    });	
	});
    var setResponsveVisibility = function() {
	    $log.debug('showMobile', $scope.showMobile);
	    $log.debug('resized', $window.innerWidth);
	    if ($window.innerWidth > 624) {
		    $scope.showMobile = false;
			$scope.showDesktop = true;
	    } else {
		    $scope.showMobile = true;
			$scope.showDesktop = false;
			
	    }
	    
	    $log.debug('showDesktop', $scope.showDesktop);
    }
    setResponsveVisibility();
	
	// mobile
	$scope.mobileNav = 'hide';
	$scope.toggleMobileNav = function() {
		if ($scope.mobileNav == 'hide') {
			$scope.mobileNav = 'show';
		} else {
			$scope.mobileNav = 'hide';
		}
	};
	
	
	
	$document.on('touchend', function(event) {
		$scope.$apply(function() {
			checkNavCloseClick(event);
		});
		
		
    });
    var checkNavCloseClick = function(event) {
		
		var isContentChild = $("#outherContentWrap").find($(event.target)).size() > 0;
		var isHamburgerChild = $(event.target)[0] == $("button.hamburger")[0] || $("button.hamburger").find($(event.target)).size() > 0;
		$log.debug(isContentChild);
		
		
		$log.debug($(event.target)[0]);
		$log.debug($("button.hamburger")[0]);
		$log.debug('isHamburger', isHamburgerChild);
		$log.debug('isContentChild', isContentChild);
		
		if (!isHamburgerChild && isContentChild && $scope.mobileNav == 'show') {
			$scope.toggleMobileNav();
		}
		
		/*
		var outherContentWrap = document.querySelector("#outherContentWrap");
		$log.debug(outherContentWrap.find(document.querySelector("nav")));
		*/
		/*
		if ($scope.mobileNav == 'show') {
		$scope.toggleMobileNav();
		}
		*/
    }
	
	
	/*
	$interval(function() {
		$scope.loadLends();
	}, 10000);
	*/
	
});