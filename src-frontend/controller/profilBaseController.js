angular.module('Leihnah').controller('ProfilBaseController', function($scope, $http, $state, $window, $uibModal, $log, $timeout, ContextBoxService, AuthenticationService, auth, Piwik, PageVisibilityService) {
	Piwik.trackPageView($window.location.origin+'/profil/base');
	
	
	$timeout(function() {
		PageVisibilityService.showProfil();
	},50);
	
	
	// profilMenu
	$scope.showProfilEditMenu = function(event) {
	    ContextBoxService.setTargetElement(event.currentTarget);
	    ContextBoxService.setHorizontalAlign('right');
	    ContextBoxService.setId('profilEditMenu');	    
	    ContextBoxService.show();
    }
	
	$scope.contextBox.openModalProfilEdit = function() {
		var modalInstance = $uibModal.open({
			size: 'medium',
			templateUrl: 'template/modal/editProfil.html',
			controller: 'EditProfilController',
			animation: true,
			resolve: {
				currentNeighbor: function () {
					return $scope.currentNeighbor;
				}
			}
		});
		
		modalInstance.result.then(function (neighbor) {
			$scope.$parent.$parent.loadCurrentNeighbor();
			
		}, function () {
			$log.debug('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.contextBox.openModalProfilPerson = function(which) {
		var modalInstance = $uibModal.open({
			size: 'medium',
			templateUrl: 'template/modal/editProfilPerson.html',
			controller: 'EditProfilPersonController',
			resolve: {
				currentNeighbor: function () {
					return $scope.currentNeighbor;
				},
				person: function() {
					return which;
				}
			}
		});
		
		modalInstance.result.then(function (neighbor) {
			$scope.$parent.$parent.currentNeighbor = neighbor;
			
		}, function () {
			$log.debug('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.contextBox.openModalPasswordEdit = function() {
		var modalInstance = $uibModal.open({
			size: 'medium',
			templateUrl: 'template/modal/editPassword.html',
			controller: 'EditPasswordController'
		});
	}
	
	
	

});