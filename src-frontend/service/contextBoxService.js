angular.module('Leihnah').service('ContextBoxService', function($log, resize) {
	var self = this;
	
	self.id = 0;
	self.visible = false;
	self.template = '';
	self.targetElement = null;
	self.horizontalAlign = 'left';
	self.verticalAlign = 'bottom';
	self.noPositionBelow = 0;
	self.callbackLoaded = function() {};
	self.callbackClosed = function() {};

	
	self.setId = function(id) {
		self.template = 'template/contextBox/'+id+'.html';
		self.id = id;
	}
	self.show = function() {
		self.visible = true;
	}
	
	self.hide = function() {
		self.visible = false;
		self.targetElement = null;
		self.id = 0;
		self.callbackLoaded = function() {};
		self.template = '';
	}
	
	self.setTargetElement = function(element) {
		self.targetElement = element;
	}
	
	self.setNoPositionBelow = function(width) {
		self.noPositionBelow = width;
	}
	self.setVerticalAlign = function(direction) {
		self.verticalAlign = direction;
	}
	self.setHorizontalAlign = function(direction) {
		self.horizontalAlign = direction;
	}
	self.onLoad = function(callback) {
		self.callbackLoaded = callback;
	}
	self.onClose = function(callback) {
		self.callbackClosed = callback;
	}
	
	self.setPositions = function() {
		var left = $(self.targetElement).offset().left;
		var top = $(self.targetElement).offset().top;
		var windowWidth = $(window).width();
		
		if (windowWidth < self.noPositionBelow) {
			$('#contextBoxWrap').removeAttr('style');
		} else {
		
			if (self.horizontalAlign == 'right') {
				left += $(self.targetElement).outerWidth();
			}
			if (self.verticalAlign == 'bottom') {
				top += $(self.targetElement).outerHeight();
			}
			
			$('#contextBoxWrap').css({
				top: top+'px',
				left: left+'px'
			});
		
		}
	}
	
	self.loaded = function() {
		self.setPositions();
		self.callbackLoaded();
	}
	
	$(window).resize(function() {
		
		if (self.targetElement != null) {
			self.setPositions();
		}
	});
	
	
});