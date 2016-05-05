angular.module('Leihnah').service('ScrollService', function($document, $state, $log) {
	var self = this;
	
	self.lastState = '';
	self.lastScrollPosition = 0;
	
	self.update = function() {
		self.lastScrollPosition = $document.scrollTop();
			
	}
	self.updateState = function() {
		self.lastState = $state.current.name;
		
	}	
	
	
	var position = $(window).scrollTop();
	
	if (position > 145) {
		$('body').removeClass('scroll-header').addClass('scroll-body');
	} else {
		$('body').addClass('scroll-header').removeClass('scroll-body');
	}
	
	$(window).scroll(function() {
		
		var scroll = $(window).scrollTop();
		
		
		
// 		$log.debug(position - scroll);
		
		
		if (position - scroll > 0 || position - scroll < -50) {
			if (scroll > position) {
				$('body').addClass('scroll-down').removeClass('scroll-up');
			} else {
				$('body').removeClass('scroll-down').addClass('scroll-up');
			}
		
		}
		if (position - scroll > 50 || position - scroll < -50) {
			position = scroll;
		}
		
		if (scroll > 145) {
			$('body').removeClass('scroll-header').addClass('scroll-body');
		} else {
			$('body').addClass('scroll-header').removeClass('scroll-body');
		}
		
	});
	
	
});