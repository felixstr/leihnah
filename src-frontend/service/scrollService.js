angular.module('Leihnah').service('ScrollService', function($document, $state, $log) {
	var self = this;
	
	self.lastState = '';
	self.lastScrollPosition = 0;
	
	self.update = function() {
		self.lastScrollPosition = $document.scrollTop();
		
		
		$log.debug('self.lastScrollPosition', self.lastScrollPosition);
		
	}
	self.updateState = function() {
		self.lastState = $state.current.name;
		
		$log.debug('self.lastState', self.lastState);
	}	
	
});