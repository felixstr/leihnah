angular.module('Leihnah').controller('ObjectsController', function($scope, $http, $state, $window, $log, $uiViewScroll, $document, $timeout, AuthenticationService, auth, CategoryService, ContextBoxService, ScrollService, Piwik) {
	
	Piwik.trackPageView($window.location.origin+'/objects');
	
	$scope.state = $state;
	$scope.showCategories = false;
	
	$scope.headerImages = ['abc.jpg', 'barivox.jpg', 'heissleim.jpg', 'schwimmweste.jpg', 'teigwaren.jpg', 'ukulele.jpg', 'schleifmaschine.jpg'];
	$scope.headerImage = $scope.headerImages[Math.floor(Math.random() * $scope.headerImages.length)];
// 	$scope.headerImage = 'schleifmaschine.jpg';

	
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
	    ContextBoxService.setNoPositionBelow(624);	    
	    ContextBoxService.show();
	    ContextBoxService.categories = $scope.categories;
	    ContextBoxService.view = ($scope.filter.search.length > 0 || $scope.filter.category != null) ? 'filtered' : 'default';
	    ContextBoxService.onLoad(function(){
		    $document.scrollToElement($('#contextBoxWrap'), 80, 300);
	    });

// 	    
    }
    
	$scope.contextBox.changeOrder = function(id) {
		$log.debug(id);
		
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		
		for (var i = 0; i < $scope.order.items.length; i++) {
			if ($scope.order.items[i].id == id) {
				$log.debug($scope.order.items[i].id);
				$scope.order.current = $scope.order.items[i];
			}
		}
		
	}
	
	$scope.toggleCategories = function() {
		$scope.showCategories = !$scope.showCategories;
	}
	
	$scope.contextBox.setFilterCategory = function(id) {
		$scope.filter.category = id;
		
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		
		if (id == null) {
			$scope.filter.categoryName = '';
		} else if (id == 'all') {
			$scope.filter.categoryName = 'Alle';
		} else {
			$scope.filter.categoryName = CategoryService.getName(id);
		}
		
		if ($scope.filter.categoryName != '') {
			Piwik.trackPageView($window.location.origin+'/objects/kategorie:'+$scope.filter.categoryName);
		}

		$scope.showCategories = false;
		$scope.contextmenu.hide();
		
		$log.debug('scope.filter', $scope.filter);
	}
	
	$scope.filterResults = function(element) {
// 		$log.debug('element', element);
		
		
		
		var result = false;
		var searchText = $scope.filter.search.toLowerCase();
		
		if (searchText.length > 0 && $scope.filter.category == null) {
			$scope.setFilterCategory('all');
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
	
	

	

	
	
	$timeout(function() {

		if (ScrollService.lastState == 'object') {
			$document.scrollTo(0, ScrollService.lastScrollPosition);
		}
		
		
	}, 100);
	
	
	
	
	// openObject
	$scope.openObject = function(objectId) {
		$scope.fadeout = true;

		ScrollService.update();
		
		$timeout(function() {
			$document.scrollToElement($("body"), 0, 300);
		}, 500);
		
		$timeout(function() {
			$state.go('object', {objectId: objectId});
		}, 800);
		
	}
});