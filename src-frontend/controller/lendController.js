angular.module('Leihnah').controller('LendController', function($scope, $http, $stateParams, $window, $log, $timeout, AuthenticationService, auth, $uibModal, CategoryService, Piwik, $state) {
	Piwik.trackPageView($window.location.origin+'/lend/'+$stateParams.lendId);
	
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	
	// timeline height berrechnen. @todo: verbessern (resize)
	var setTimlineHeight = function() {
		var actionElement = document.querySelector(".actionBox").getBoundingClientRect();
		var containerElement = document.querySelector(".conversationContainer");
		
		var height = actionElement.top - containerElement.getBoundingClientRect().top + 10;
		document.querySelector(".timelinePast").setAttribute('style', "height: "+height+"px;");
		
		height = containerElement.clientHeight - 100;
		
		document.querySelector(".timeline").setAttribute('style', "height: "+height+"px;");
	}
	
	$scope.contentLoaded = function() {
		$timeout(function() {
			setTimlineHeight();
		}, 100);
	}
	
	
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
			
		}, function () {
			
			$scope.$parent.loadLends();
			$state.go('profil.lend');
			
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
					
					setTimlineHeight();
					
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