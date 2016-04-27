angular.module('Leihnah').controller('LendController', function($scope, $http, $stateParams, $window, $log, $timeout, $document, AuthenticationService, auth, $uibModal, CategoryService, Piwik, $state, resize) {
	Piwik.trackPageView($window.location.origin+'/lend/'+$stateParams.lendId);
	
// 	document.body.scrollTop = document.documentElement.scrollTop = 0;
	
	var setTimelineHeight = function() {
		var height= 0;
			
			if ($scope.currentLend.state == 'request' || $scope.currentLend.state == 'direct' || $scope.currentLend.state == 'confirmed' || $scope.currentLend.state == 'closed') {
				height = $('.actionBox').position().top + 45;
			} else if ($scope.currentLend.state == 'answered') {
				height = $('#answerMessage').position().top + 45;
			} 

			
			$log.debug('height', height);
			
			$('.timelinePast').css({ 'height': height+'px' });
			
			height = $('.conversationContainer').height();
			$('.timeline').css({ 'height': height+'px' });
			
	}
	
	resize($scope).call(function() { 
		$scope.$apply(function() {
	       setTimelineHeight();
	    });	
	});
	
	$scope.openModalCheckData = function(object) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
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
			
			$log.debug('Modal dismissed at: ' + new Date());
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
			$log.debug('Modal dismissed at: ' + new Date());
		});
	}
	
	
	$scope.currentLend = '';
	var loadLend = function() {
		$http.get('api/lend/'+$stateParams.lendId, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				$log.debug('loadLend', response);
				if (response.ok) {
					$scope.currentLend = response.lend;
										
					$scope.borrowProfilImageBG = {
						'background-image':'url('+($scope.currentLend.neighborBorrow.accountImage == '' ? 'assets/img/static/profil-default.svg' : 'assets/img/profil/'+$scope.currentLend.neighborBorrow.accountImage)+')'
					};
					
					$scope.objectImageBG = {
						'background-image':'url(assets/img/object/'+$scope.currentLend.object.image_1+')'
					};
					
					$scope.myProfilImageBG = {
						'background-image':'url('+($scope.$parent.currentNeighbor.accountImage == '' ? 'assets/img/static/profil-default.svg' : 'assets/img/profil/'+$scope.$parent.currentNeighbor.accountImage)+')'
					};
					
					$timeout(function() {
						setTimelineHeight();
						$document.scrollToElement($(".actionBox"), 100, 500);
					}, 100);					
					
				} else {
					$state.go('profil.lend');
				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	};
	loadLend();

});