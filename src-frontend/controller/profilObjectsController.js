angular.module('Leihnah').controller('ProfilObjectsController', function($scope, $http, $state, $window, $uibModal, $log, $timeout, ContextBoxService, AuthenticationService, auth, CategoryService, Piwik, PageVisibilityService) {
	Piwik.trackPageView($window.location.origin+'/profil/objects');
	
// 	$log.debug('ProfilObjectsController');
	
	$scope.objects = '';
	
	
	// profilMenu
	$scope.showObjectMenu = function(event, object) {
	    ContextBoxService.setTargetElement(event.currentTarget);
	    ContextBoxService.setHorizontalAlign('right');
	    ContextBoxService.setId('ownObjectMenu');	    
	    ContextBoxService.show();
	    ContextBoxService.object = object;
    }
	
	$scope.loadObjects = function() {
		$http.get('api/object/own', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
// 				$log.debug('loadObjects', response);
				if (response.ok) {
					$scope.objects = response.objects;
					
					$timeout(function() {
						PageVisibilityService.showProfil();
					},50);
					
				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	}
	

	$scope.contextBox.openModalObject = function(object) {
		$log.debug('obj', object); 
		var modalInstance = $uibModal.open({
// 			backdrop: 'static',
// 			keyboard: false,
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
					return $scope.$parent.$parent.currentNeighbor;
				}
			}
		});
		
		modalInstance.result.then(function () {
			$scope.loadObjects();
			$scope.$parent.$parent.loadObjects();
			CategoryService.loadCategories(function(categories) {
				$scope.$parent.$parent.categories = categories;
			});
			
		}, function () {
			$log.debug('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.contextBox.openModalObjectDelete = function(object) {
		var modalInstance = $uibModal.open({
// 			backdrop: 'static',
// 			keyboard: false,
			size: 'medium',
			templateUrl: 'template/modal/deleteObject.html',
			controller: 'DeleteObjectController',
			resolve: {
				currentObject: function () {
					return object;
				}
			}
		});
		
		modalInstance.result.then(function () {
			$scope.loadObjects();
			$scope.$parent.$parent.loadObjects();
			CategoryService.loadCategories(function(categories) {
				$scope.$parent.$parent.categories = categories;
			});
			
		}, function () {
			$log.debug('Modal dismissed at: ' + new Date());
		});
	}

	
	$scope.contextBox.activation = function (object) {

		var url = 'api/object/'+object.id;
		
		var data = object;
		data.active = !object.active;
			
		$http.post(url, data, {
			headers: { 'auth-token': AuthenticationService.getLocalToken() }
		})
		.success(function(response) {
			
			$scope.loadObjects();
			$scope.$parent.$parent.loadObjects();
			CategoryService.loadCategories(function(categories) {
				$scope.$parent.$parent.categories = categories;
			});
			
		})
		.error(function(error) {
			$log.debug(error);
		});
	
	};
	
	
	$scope.loadObjects();


});