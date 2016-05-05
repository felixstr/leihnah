angular.module('Leihnah').controller('MainController', function($scope, $http, $state, $window, $log, $location, $interval, $document, $timeout, AuthenticationService, ContextBoxService, auth, CategoryService, resize, PageVisibilityService, ScrollService) {
	
	if (AuthenticationService.authenticated && $state.is("landingpage")) {
		$state.go('objects');
	}
	if (!AuthenticationService.authenticated) {
		$state.go('landingpage');
	}
	
	$scope.contextBox = ContextBoxService;		
	$scope.state = $state;
	$scope.window = $window;
	
	$scope.fadeout = false;

	$scope.pageVisibility = PageVisibilityService;

	
	
	$scope.lastObjectId = 0; // @todo: needet?
	$scope.scrollPosition = 0;
	$scope.backState = '';
	
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
		categoryName: '',
		showResults: false,
		showSmallHead: false,
		filteredObjects: []
	}
	$scope.resetFilter = function() {
		$scope.filter = {
			search: '',
			category: null,
			categoryName: '',
			showResults: false,
			showSmallHead: false
		};
	}
	$scope.openResults = function() {
		
		
		if ($scope.filter.category == null) {
			$scope.contextBox.setFilterCategory('all');
		}
	}
	
	$scope.closeResults = function() {

		$scope.filter.showResults = false;
		
		$timeout(function() {
			$scope.filter.showSmallHead = false;
			
			$scope.filter.search = ''; 
			if ($scope.filter.category != null) {
				$scope.contextBox.setFilterCategory(null);
			}
		}, 400);
		
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
				field: 'createDate',
				reverse: true
			},
			{ 
				id: 'popular', 
				name: 'Beliebtester', 
				field: 'viewCount',
				reverse: true
			},
			{ 
				id: 'neighbor', 
				name: 'Bewohner', 
				field: 'neighbor.accountName',
				reverse: false
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

				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	}
	
/*
	$interval(function() {
		$log.debug('loaditerator');
		$scope.loadObjects();
	}, 10000);
*/
	
	/*
	$scope.allObjectImagesLoaded = false;
	var checkLoadedImages 
	*/
// 	$scope.loadObjects();
	
	
	// categories
	CategoryService.loadCategories(function(categories) {
		$scope.categories = categories;
	});

	// watch if authentication is changed	
	$scope.$watch(function() { return AuthenticationService.authenticated; }, function(newVal, oldVal) {
		$log.debug('authentication has changed');
		
		$scope.authenticated = AuthenticationService.authenticated;
		$scope.loadCurrentNeighbor();
		$scope.loadObjects();
		
		CategoryService.loadCategories(function(categories) {
			$scope.categories = categories;
		});
	});
	
	// profilMenu
	$scope.showProfilMenu = function(event) {
	    ContextBoxService.setTargetElement(event.currentTarget);
	    ContextBoxService.setHorizontalAlign('right');
	    ContextBoxService.setId('profil');	    
	    ContextBoxService.show();
    }
	

	// current neighbor
	$scope.currentNeighbor = '';
	$scope.profilImageBG = {};
	$scope.loadCurrentNeighbor = function() {
		$http.get('api/neighbor', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
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
	    if ($window.innerWidth > 624) {
		    $('body').removeClass('screen-small');	
		    $scope.showMobile = false;
			$scope.showDesktop = true;
	    } else {
		    $('body').addClass('screen-small');
		    $scope.showMobile = true;
			$scope.showDesktop = false;
			
	    }
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
		
		if (!isHamburgerChild && isContentChild && $scope.mobileNav == 'show') {
			event.preventDefault();
			$scope.toggleMobileNav();
		}
		
    }
	
	$scope.openObject = function(objectId) {
		PageVisibilityService.hide();

		ScrollService.update();
		
		$timeout(function() {
			$document.scrollToElement($("body"), 0, 300);
		}, 400);
		
		$timeout(function() {
			$state.go('object', {objectId: objectId});
		}, 1000);
		
	}
	
	$scope.goPageObjects = function() {
		$scope.closeResults(); 
		$scope.loadObjects();
		if (!$state.is('objects')) {
			PageVisibilityService.hide();
			$timeout(function() {
				$state.go('objects');
			}, 300);
		}
	}
	
	$scope.contextBox.goPageProfil = function(page) {
		if (!$state.includes('profil')) {
			$log.debug('hidecontent');
			PageVisibilityService.hide();
		}
		if (!$state.is(page)) {
			PageVisibilityService.hideProfil();
			$timeout(function() {
				$state.go(page);
			}, 1000);
		}
	}
	
	/*
	$interval(function() {
		$scope.loadLends();
	}, 10000);
	*/
	
});