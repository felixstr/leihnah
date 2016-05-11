angular.module('Leihnah').controller('ObjectsController', function($scope, $http, $state, $window, $log, $uiViewScroll, $document, $timeout, $interval, AuthenticationService, auth, CategoryService, ContextBoxService, ScrollService, Piwik, PageVisibilityService) {
	
	Piwik.trackPageView($window.location.origin+'/objects');
	
	$scope.state = $state;
	

	$timeout(function() {
		PageVisibilityService.show();
	}, 300);
	
	$timeout(function() {
		
		
		if (ScrollService.lastState == 'object' && $scope.filter.showResults) {
			$document.scrollTo(0, ScrollService.lastScrollPosition);
		}
		
		
	}, 300);
	
		
	
	$scope.headerImages = ['header-ukulele.jpg', 'header-stoepsel.jpg', 'header-schneeschuhe.jpg', 'header-bohrmaschine.jpg', 'header-spiel1.jpg', 'header-strom.jpg', 'header-waage.jpg', 'header-barivox.jpg', 'header-heissleim.jpg', 'header-ente.jpg'];
	$scope.headerImage = $scope.headerImages[Math.floor(Math.random() * $scope.headerImages.length)];
// 	$scope.headerImage = 'header-naehmaschiene.jpg';
	
	
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
// 		    $document.scrollToElement($('#contextBoxWrap'), 165, 300);
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

	
	$scope.contextBox.setFilterCategory = function(id) {
		
// 		$log.debug('filter', $scope.filter);
		
		if ($scope.filter.category != null) {
			$scope.filter.showResultList = false;
			$timeout(function() {
				$scope.filter.category = id;
			}, 300);
			$timeout(function() {
				$scope.filter.showResultList = true;
			}, 600);
			
		} else {
			$scope.filter.category = id;
		}
		
		
		
		if (id == null) {
			$scope.filter.categoryName = '';
		} else if (id == 'all') {
			$scope.filter.categoryName = 'Alle';
			
		} else {
			$scope.filter.categoryName = CategoryService.getName(id);
		}
		
		if ($scope.filter.categoryName != '') {
			Piwik.trackPageView($window.location.origin+'/objects/kategorie:'+$scope.filter.categoryName);
			
			$document.scrollTo(0, 0, 0);
			
			$timeout(function() {
				$scope.filter.showSmallHead = true;
// 				$scope.filter.showResults = true;
				
			}, 300);
			$timeout(function() {
// 				$scope.filter.showSmallHead = true;
				$scope.filter.showResults = true;
				
			}, 0);
			
			
		}
		

		
// 		$log.debug('scope.filter', $scope.filter);
	}
	
	$scope.contextBox.openResults = function(categoryId, order) {
		$scope.filter.showResults = true;
		
		if (order != undefined) {
			$scope.contextBox.changeOrder(order);
		}
		
		if (categoryId != undefined) {
			$scope.contextBox.setFilterCategory(categoryId);
		} else {
			$scope.contextBox.setFilterCategory('all');
		}
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
	
	
	
	
	$interval(function() {
		$('.img, .profilImage').each(function(i, item){ 
			
			if ($(item).css('background-image').indexOf('placeholder-load.jpg') >= 0) {
				$log.info('vor', $(item).css('background-image'));
				$(item).css('background-image', 'url('+$(item).attr('preload-bg-image')+'?ts='+(Math.floor(Date.now() / 1000))+')');
				$log.info('nach', $(item).css('background-image'));
			}
		});
	},5000);
	
	
	
	
});