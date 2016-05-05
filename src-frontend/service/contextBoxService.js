angular.module('Leihnah').service('ContextBoxService', function($log, resize) {
	var self = this;
	
	self.id = 0;
	self.visible = false;
	self.template = '';
	self.targetElement = null;
	self.horizontalAlign = 'left';
	self.verticalAlign = 'bottom';
	self.fullBelow = 0;
	self.onlyTopAlign = false;
	self.centerToElement = false;
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
		self.callbackClosed();
		self.visible = false;
		self.targetElement = null;
		self.id = 0;
		self.callbackLoaded = function() {};
		self.callbackClosed = function() {};
		self.template = '';
		self.fullBelow = 0;
		self.onlyTopAlign = false;
		self.centerToElement = false;
		
		$('body').removeClass('contextBox-full');
	}
	
	self.setTargetElement = function(element) {
		self.targetElement = element;
	}
	
	self.setFullBelow = function(width) {
		self.fullBelow = width;
	}
	self.setOnlyTopAlign = function(value) {
		self.onlyTopAlign = value;
	}
	self.setCenterToElement = function(value) {
		self.centerToElement = value;
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
		
		if (self.onlyTopAlign && self.centerToElement) {
			
			if (self.verticalAlign == 'bottom') {
				top += $(self.targetElement).outerHeight();
			}
			
			var boxLeft = self.centerToElement.offset().left;

			$('#contextBoxWrap').css({
				top: top+'px',
				left: boxLeft+'px'
			});
			
			$('#contextBoxWrap > .arrow').css({
				left: (left - boxLeft) + 'px'
			});
			
		} else if (windowWidth < self.fullBelow) {
			$('#contextBoxWrap').removeAttr('style');
			$('body').addClass('contextBox-full');
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
			
			$('body').removeClass('contextBox-full');
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