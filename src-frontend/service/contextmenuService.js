angular.module('Leihnah').service('ContextmenuService', function() {
	var self = this;
	
	self.current = null;
	
	self.show = function(id) {
		if (self.current == null) {
			self.current = id;
		} else {
			self.current = null;
		}
	}
	
	self.hide = function() {
		self.current = null;
	}
	
	
});