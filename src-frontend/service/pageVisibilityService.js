angular.module('Leihnah').service('PageVisibilityService', function($log) {
	var self = this;
	
	self.showContent = true;
	self.showContentProfil = true;
	
	self.hide = function() {
		self.showContent = false;
		$('.containerLogo').addClass('load');
	}
	
	self.show = function() {
		self.showContent = true;
		$('.containerLogo').removeClass('load');
	}
	
	
	self.hideProfil = function() {
		self.showContentProfil = false;
		$('.containerLogo').addClass('load');
	}
	
	self.showProfil = function() {
		self.showContentProfil = true;
		$('.containerLogo').removeClass('load');
	}
			
	
});