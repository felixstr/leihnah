angular.module('Leihnah').controller('BorrowController', function($scope, $http, $stateParams, $window, $log, $timeout, AuthenticationService, auth, $uibModal, $document, CategoryService, Piwik, $state, resize, ContextBoxService, PageVisibilityService) {
	Piwik.trackPageView($window.location.origin+'/borrow/'+$stateParams.borrowId);
	
// 	document.body.scrollTop = document.documentElement.scrollTop = 0;
	
	// states
	$scope.states = {
		showBottomBackBar: false,
		showBottomGetBar: false,
		expired: false
	}
	var initStates = function() {
		$scope.states.showBottomBackBar = $scope.currentBorrow.confirmedDatetime != null && ($scope.currentBorrow.state != 'closed' || $scope.currentBorrow.closedType == 'successful') && !$scope.currentBorrow.backPast;
		$scope.states.showBottomGetBar = $scope.currentBorrow.confirmedDatetime != null && !$scope.currentBorrow.getPast && $scope.currentBorrow.state != 'closed';
		$scope.states.expired = $scope.currentBorrow.confirmedDatetime == null && new Date($scope.currentBorrow.timeSuggestions.get[0].date).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0);
	}
	
	
	
	$scope.openModalClose = function(object) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
			size: 'medium',
			templateUrl: 'template/modal/lendClose.html',
			controller: 'LendCloseController',
			resolve: {
				currentLend: function () {
					return $scope.currentBorrow;
				},
				kind: function () {
					return 'borrow';
				}
			}
		});
		
		modalInstance.result.then(function () {
			
			$scope.$parent.loadLends();
			loadBorrow();
			
		}, function () {
			$log.debug('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.openModalConfirm = function(object) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
			size: 'medium',
			templateUrl: 'template/modal/lendConfirm.html',
			controller: 'LendConfirmController',
			resolve: {
				currentLend: function () {
					return $scope.currentBorrow;
				}
			}
		});
		
		modalInstance.result.then(function () {
			PageVisibilityService.hide();
			
			$scope.$parent.loadLends();
			loadBorrow();
			
			
		}, function () {
			$log.debug('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.showContactData = function() {
		ContextBoxService.setTargetElement($("a.contact"));
	    ContextBoxService.setHorizontalAlign('right');
	    ContextBoxService.setId('lendContact');	    
	    ContextBoxService.show();
	    ContextBoxService.currentLend = $scope.currentBorrow;
	    ContextBoxService.person = $scope.currentBorrow.neighborLend;
	    ContextBoxService.dataAll = true;
	}
	
	var initScrollTo = function() {
	
		if ($scope.states.expired) {
			$document.scrollTo(0, $("#containerMain").height() - $window.innerHeight, 500);
		} else {
			$document.scrollToElement($(".actionBox"), ($(window).height() / 2), 500);
		}
		
		
	}
	
	var setTimelineHeight = function() {
		var height= 0;
			
		if ($scope.states.expired) {
			height = $('.messageExpired').position().top;
		} else if ($scope.currentBorrow.state == 'request') {
			height = 70;
			height = $('.actionBox').position().top + 20;
		} else if ($scope.currentBorrow.state == 'direct') {
			height = $('#directContactMessage').position().top + 20;
		} else if ($scope.currentBorrow.state == 'answered' || $scope.currentBorrow.state == 'confirmed' || $scope.currentBorrow.state == 'closed') {
			height = $('.actionBox').position().top + 20;
		}
		
		$log.debug('height', height);
		
		
		$('.timelinePast').css({ 'height': height+'px' });
		
		
		height = $('.conversationContainer').height() - 80;
		
		$('.timeline').css({ 'height': height+'px' });
		
	}
	
	resize($scope).call(function() { 
		$scope.$apply(function() {
	       setTimelineHeight();
	    });	
	});
		
	$scope.openModalObject = function(object) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
			size: 'medium',
			templateUrl: 'template/modal/editObject.html',
			controller: 'EditObjectController',
			resolve: {
				currentObject: function () {
					return object;
				},
				categories: function($q, CategoryService){
					var deferred = $q.defer();
					
					CategoryService.loadCategories(function(categories) {
						deferred.resolve(categories);
					}); 
									
					return deferred.promise;
				},
				currentNeighbor : function() {
					return $scope.$parent.currentNeighbor;
				}
			}
		});
		
		modalInstance.result.then(function () {
			$scope.loadObject();
			$scope.$parent.loadObjects();
			CategoryService.loadCategories(function(categories) {
				$scope.$parent.categories = categories;
			});
			
		}, function () {
			$log.debug('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.currentBorrow = '';
	var loadBorrow = function() {
		$http.get('api/lend/'+$stateParams.borrowId, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				$log.debug('loadBorrow', response);
				if (response.ok) {
					$scope.currentBorrow = response.lend;
					
					initStates();
										
					$scope.lendProfilImageBG = {
						'background-image':'url('+($scope.currentBorrow.neighborLend.accountImage == '' ? 'assets/img/static/profil-default.svg' : 'assets/img/profil/'+$scope.currentBorrow.neighborLend.accountImage)+')'
					};
					
					$scope.objectImageBG = {
						'background-image':'url(assets/img/object/'+$scope.currentBorrow.object.image_1+')'
					};
					
					$scope.myProfilImageBG = {
						'background-image':'url('+($scope.$parent.currentNeighbor.accountImage == '' ? 'assets/img/static/profil-default.svg' : 'assets/img/profil/'+$scope.$parent.currentNeighbor.accountImage)+')'
					};
					
					PageVisibilityService.show();
					
					$timeout(function() {
						setTimelineHeight();
						initScrollTo();
						
					}, 300);	
					
				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	};
	loadBorrow();
	
	$scope.goBack = function() {
		PageVisibilityService.hide();
		$timeout(function() {
			$state.go('profil.borrow');
		}, 1000);
		
	}

});