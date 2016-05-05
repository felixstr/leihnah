angular.module('Leihnah').controller('ObjectsController', function($scope, $http, $state, $window, $log, $uiViewScroll, $document, $timeout, AuthenticationService, auth, CategoryService, ContextBoxService, ScrollService, Piwik, PageVisibilityService) {
	
	Piwik.trackPageView($window.location.origin+'/objects');
	
	$scope.state = $state;
	

	$timeout(function() {
		PageVisibilityService.show();
	}, 300);
	
	$timeout(function() {
		
/*
		$log.debug('ScrollService.lastState', ScrollService.lastState);
		$log.debug('ScrollService.lastScrollPosition', ScrollService.lastScrollPosition);
*/
		
		if (ScrollService.lastState == 'object' && $scope.filter.showResults) {
			$document.scrollTo(0, ScrollService.lastScrollPosition);
		}
		
		
	}, 300);
	
		
// 	$scope.showCategories = false;
	
// 	$log.debug('$scope.filter', $scope.filter);
	
	$scope.headerImages = ['abc.jpg', 'barivox.jpg', 'heissleim.jpg', 'schwimmweste.jpg', 'teigwaren.jpg', 'ukulele.jpg', 'schleifmaschine.jpg'];
	$scope.headerImages = ['header-ukulele.jpg'/*, 'header-teigwaren.jpg'*/, 'header-stoepsel.jpg', 'header-schneeschuhe.jpg', 'header-bohrmaschine.jpg', 'header-spiel1.jpg', 'header-strom.jpg', 'header-waage.jpg', 'header-barivox.jpg', 'header-heissleim.jpg', 'header-ente.jpg'];
	$scope.headerImage = $scope.headerImages[Math.floor(Math.random() * $scope.headerImages.length)];
/*
	$scope.headerImage = 'header-ukulele.jpg';
	$scope.headerImage = 'header-teigwaren.jpg';
	$scope.headerImage = 'header-stoepsel.jpg';
	$scope.headerImage = 'header-schneeschuhe.jpg';
	$scope.headerImage = 'header-bohrmaschine.jpg';
	$scope.headerImage = 'header-spiel1.jpg';
	$scope.headerImage = 'header-strom.jpg';
	$scope.headerImage = 'header-waage.jpg';
	$scope.headerImage = 'header-barivox.jpg';
	$scope.headerImage = 'header-heissleim.jpg';
	$scope.headerImage = 'header-ente.jpg';
*/

	
	// OrderMenu
	$scope.showOrderMenu = function(event) {
	    ContextBoxService.setTargetElement(event.currentTarget);
	    ContextBoxService.setHorizontalAlign('right');
	    ContextBoxService.setId('orderMenu');	    
	    ContextBoxService.show();
    }
    
    // CategoryMenu
	$scope.showCategoryMenu = function(event) {
	    ContextBoxService.setTargetElement(event.currentTarget);
	    ContextBoxService.setHorizontalAlign('right');
	    ContextBoxService.setId('categoryMenu');
	    ContextBoxService.setFullBelow(624);	    
	    ContextBoxService.show();
	    ContextBoxService.categories = $scope.categories;
	    ContextBoxService.view = $scope.filter.showResults ? 'filtered' : 'default';
	    ContextBoxService.onLoad(function(){
		    $document.scrollToElement($('#contextBoxWrap'), 165, 300);
	    });

// 	    
    }
    
	$scope.contextBox.changeOrder = function(id) {
		
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		
		for (var i = 0; i < $scope.order.items.length; i++) {
			if ($scope.order.items[i].id == id) {
				$scope.order.current = $scope.order.items[i];
			}
		}
			
		
		
	}
	/*
	$scope.toggleCategories = function() {
		$scope.showCategories = !$scope.showCategories;
	}
	*/
	
	$scope.contextBox.setFilterCategory = function(id) {
		$scope.filter.category = id;
		
		
		if (id == null) {
			$scope.filter.categoryName = '';
		} else if (id == 'all') {
			$scope.filter.categoryName = 'Alle';
			
		} else {
			$scope.filter.categoryName = CategoryService.getName(id);
		}
		
		if ($scope.filter.categoryName != '') {
			Piwik.trackPageView($window.location.origin+'/objects/kategorie:'+$scope.filter.categoryName);
			
			$document.scrollTo(0, 0, 300);
			
			$timeout(function() {
				$scope.filter.showSmallHead = true;
				$scope.filter.showResults = true;
				
			}, 300);
			
			
			
		}
		

		
		$log.debug('scope.filter', $scope.filter);
	}
	
	$scope.filterResults = function(element) {
// 		$log.debug('element', element);
		
		
		
		var result = false;
		var searchText = $scope.filter.search.toLowerCase();
		
		if (searchText.length > 0 && $scope.filter.category == null) {
			$scope.contextBox.setFilterCategory('all');
		}
		
// 		$log.debug('searchText', searchText);
// 		$log.debug('name', element.name.toLowerCase());
		var check1 = element.name.toLowerCase().indexOf(searchText);
		var check2 = element.nameAlternatives.toLowerCase().indexOf(searchText);
		
		var check3 = true;
		if ($scope.filter.category != null && $scope.filter.category != 'all') {
			check3 = (element.categoryId == $scope.filter.category);
		}
/*
		$log.debug('name', element.name.toLowerCase());
		$log.debug('scope.filter.category', $scope.filter.category);
		$log.debug('check3', check3);
*/
		if ((check1 >= 0 || check2 >= 0) && check3) {
			result = true;
		}
		
		
		
		
		return result;
	}
	
	


	
	
	
	
	
	
	
	// openObject
	
	$scope.openObjectNew = function(objectId) {
		PageVisibilityService.hide();

		ScrollService.update();
		
		$timeout(function() {
			$document.scrollToElement($("body"), 0, 300);
		}, 300);
		
		$timeout(function() {
			$scope.contextBox.changeOrder('newest'); 
			$scope.contextBox.setFilterCategory('all'); 
			$state.go('object', {objectId: objectId});
		}, 700);
		
	}
	$scope.openObjectPopular = function(objectId) {
		PageVisibilityService.hide();

		ScrollService.update();
		
		$timeout(function() {
			$document.scrollToElement($("body"), 0, 300);
		}, 300);
		
		$timeout(function() {
			$scope.contextBox.changeOrder('popular'); 
			$scope.contextBox.setFilterCategory('all'); 
			$state.go('object', {objectId: objectId});
		}, 700);
		
	}
	
	/*
	$timeout(function() {
		$('.img').each(function(i, item){ 
			$log.info($(item).css('background-image')) 
		});
	},5000);
	*/
	
	
});