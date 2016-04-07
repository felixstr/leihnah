angular.module('Leihnah').controller('ProfilObjectsController', function($scope, $http, $state, $uibModal, AuthenticationService, auth, CategoryService) {

	console.log('ProfilObjectsController');
	
	$scope.objects = '';
	
	
	$scope.loadObjects = function() {
		$http.get('api/object/own', {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				console.log('loadObjects', response);
				if (response.ok) {
					$scope.objects = response.objects;
				}
			})
			.error(function(error) {
				console.log(error);
			});
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
				}
			}
		});
		
		modalInstance.result.then(function () {
			$scope.loadObjects();
			
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.openModalObjectDelete = function(object) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
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
			
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.openModalObjectActivation = function(object) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			keyboard: false,
			size: 'medium',
			templateUrl: 'template/modal/activationObject.html',
			controller: 'ActivationObjectController',
			resolve: {
				currentObject: function () {
					return object;
				}
			}
		});
		
		modalInstance.result.then(function () {
			$scope.loadObjects();
			
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	$scope.loadObjects();


});