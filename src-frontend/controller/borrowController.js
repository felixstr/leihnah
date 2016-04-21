angular.module('Leihnah').controller('BorrowController', function($scope, $http, $stateParams, $window, $log, $timeout, AuthenticationService, auth, $uibModal, CategoryService, Piwik, $state) {
	Piwik.trackPageView($window.location.origin+'/borrow/'+$stateParams.borrowId);
	
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	
	
	
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
			$state.go('profil.borrow');
			
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
			
			$scope.$parent.loadLends();
			loadBorrow();
			
			$timeout(function() {
				setTimlineHeight();
			}, 100);
			
		}, function () {
			$log.debug('Modal dismissed at: ' + new Date());
		});
	}
	

	
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
										
					$scope.lendProfilImageBG = {
						'background-image':'url('+($scope.currentBorrow.neighborLend.accountImage == '' ? 'assets/img/static/profil-default.svg' : 'assets/img/profil/'+$scope.currentBorrow.neighborLend.accountImage)+')'
					};
					
					$scope.objectImageBG = {
						'background-image':'url(assets/img/object/'+$scope.currentBorrow.object.image_1+')'
					};
					
					$scope.myProfilImageBG = {
						'background-image':'url('+($scope.$parent.currentNeighbor.accountImage == '' ? 'assets/img/static/profil-default.svg' : 'assets/img/profil/'+$scope.$parent.currentNeighbor.accountImage)+')'
					};
					
				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	};
	loadBorrow();

});