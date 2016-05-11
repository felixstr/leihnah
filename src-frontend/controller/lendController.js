angular.module('Leihnah').controller('LendController', function($scope, $http, $stateParams, $window, $log, $timeout, $document, AuthenticationService, auth, $uibModal, CategoryService, Piwik, $state, ContextBoxService, PageVisibilityService) {
	Piwik.trackPageView($window.location.origin+'/lend/'+$stateParams.lendId);
	
// 	document.body.scrollTop = document.documentElement.scrollTop = 0;
	
	// states
	$scope.states = {
		showBottomBackBar: false,
		showBottomGetBar: false,
		expired: false
	}
	var initStates = function() {
		$scope.states.showBottomBackBar = $scope.currentLend.confirmedDatetime != null && !$scope.currentLend.backPast && ($scope.currentLend.state != 'closed' || $scope.currentLend.closedType == 'successful');
		$scope.states.showBottomGetBar = $scope.currentLend.confirmedDatetime != null && !$scope.currentLend.getPast && $scope.currentLend.state != 'closed';
		$scope.states.expired = ($scope.currentLend.confirmedDatetime == null && $scope.currentLend.state != 'closed') && new Date($scope.currentLend.timeSuggestions.get[0].date).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0);
		
/*
		$log.debug('states-frist', new Date($scope.currentLend.timeSuggestions.get[0].date).setHours(0,0,0,0));
		$log.debug('states-now', new Date().setHours(0,0,0,0));
		
*/
// 		$log.debug('states', $scope.states);
	}
	
	
	$(window).on('scroll', function() {
/*
		$log.debug($document.scrollTop());
		$log.debug($('.conversationContainer').offset());
		$log.debug($('.conversationContainer').offset().top - $('.topBar').height() - $('header').height());
*/

		if ($('.conversationContainer').length > 0) {
			if ($document.scrollTop() > $('.conversationContainer').offset().top - $('.topBar').height() - $('header').height()) {
				$('body').addClass('scroll-conversation');
			} else {
				$('body').removeClass('scroll-conversation');
			}
		}
		
		
	});
	
	
	var initScrollTo = function() {
// 		$log.debug('currentState', $scope.currentLend.state);
/*
		$log.debug('expired', $scope.states.expired);
		$log.debug('containerMain', $("#containerMain").height());
		$log.debug('$window.innerHeight', $window.innerHeight);
*/
		
		if ($scope.states.expired) {
			$document.scrollTo(0, $("#containerMain").height() - $window.innerHeight, 500);
		} else if ($scope.currentLend.state == 'request') {
// 			$document.scrollToElement($(".messageItem"), 50, 500);
		} else {
			$document.scrollToElement($(".actionBox"), ($(window).height() / 2), 500);
		}
	}
	
	var setTimelineHeight = function() {
		var height= 0;
		
		if ($scope.states.expired) {
			height = $('.messageExpired').position().top;
		} else if ($scope.currentLend.state == 'request' || $scope.currentLend.state == 'direct' || $scope.currentLend.state == 'confirmed' || $scope.currentLend.state == 'closed') {
			height = $('.actionBox').position().top + 20;
		} else if ($scope.currentLend.state == 'answered') {
			height = $('#answerMessage').position().top - 7;
		} 
		
		$('.timelinePast').css({ 'height': height+'px' });
		
		height = $('.conversationContainer').height() - 80;
		$('.timeline').css({ 'height': height+'px' });
		
			
	}
	
	$(window).on('resize', function() { 
		$scope.$apply(function() {
	       setTimelineHeight();
	    });	
	});
	
	$scope.openModalCheckData = function(object) {
		var modalInstance = $uibModal.open({
// 			backdrop: 'static',
// 			keyboard: false,
			size: 'medium',
			templateUrl: 'template/modal/lendCheckData.html',
			controller: 'LendCheckDataController',
			resolve: {
				currentLend: function () {
					return $scope.currentLend;
				}
			}
		});
		
		modalInstance.result.then(function () {
			
			$scope.$parent.loadLends();
			loadLend();
			
		}, function (type) {
			
			if (type == 'close') {
			
				$scope.$parent.loadLends();
				$state.go('profil.lend');
			}
			
// 			$log.debug('Modal dismissed at: ' + new Date());
		});
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
					return $scope.currentLend;
				},
				kind: function () {
					return 'lend';
				}
			}
		});
		
		modalInstance.result.then(function () {
			
			$scope.$parent.loadLends();
			$state.go('profil.lend');
			
		}, function () {
// 			$log.debug('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.showContactData = function() {
		ContextBoxService.setTargetElement($("a.contact"));
	    ContextBoxService.setHorizontalAlign('right');
	    ContextBoxService.setId('lendContact');	  
	    ContextBoxService.show();
	    
	    ContextBoxService.currentLend = $scope.currentLend;
	    ContextBoxService.person = $scope.currentLend.neighborBorrow;
	    ContextBoxService.dataAll = false;
	    
	}
	
	$scope.currentLend = '';
	var loadLend = function() {
		$http.get('api/lend/'+$stateParams.lendId, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
// 				$log.debug('loadLend', response);
				if (response.ok) {
					$scope.currentLend = response.lend;
					
					initStates();
										
					$scope.borrowProfilImageBG = {
						'background-image':'url('+($scope.currentLend.neighborBorrow.accountImage == '' ? 'assets/img/static/profil-default.svg' : 'assets/img/profil/'+$scope.currentLend.neighborBorrow.accountImage)+')'
					};
					
					$scope.objectImageBG = {
						'background-image':'url(assets/img/object/'+$scope.currentLend.object.image_1+')'
					};
					
					$scope.myProfilImageBG = {
						'background-image':'url('+($scope.$parent.currentNeighbor.accountImage == '' ? 'assets/img/static/profil-default.svg' : 'assets/img/profil/'+$scope.$parent.currentNeighbor.accountImage)+')'
					};
					
					PageVisibilityService.show();
					
					$timeout(function() {
						setTimelineHeight();
						initScrollTo();
						
					}, 800);					
					
				} else {
					$state.go('profil.lend');
				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	};
	loadLend();
	
	
	$scope.goBack = function() {
		PageVisibilityService.hide();
		$timeout(function() {
			$state.go('profil.lend');
		}, 1000);
		
	}

});