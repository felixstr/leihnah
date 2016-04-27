angular.module('Leihnah').controller('ObjectDetailController', function($scope, $http, $stateParams, $window, $log, $document, $timeout, $window, AuthenticationService, ContextBoxService, auth, $uibModal, CategoryService, Piwik, $state, ContextmenuService) {
	Piwik.trackPageView($window.location.origin+'/object/'+$stateParams.objectId);
	
// 	document.body.scrollTop = document.documentElement.scrollTop = 0;
	
	$scope.$parent.lastObjectId = $stateParams.objectId; // @todo: needet?
	
	
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();
	
	

	// borrow request	
	$scope.systemRequest = {
		active: true || ($window.location.host == 'localhost' || $window.location.host == '192.168.1.101'),
// 		active: ($window.location.host == 'localhost' || $window.location.host == '192.168.1.101'),
		message: '',
		firstGetSuggestion: '2016-04-18',
		lastGetSuggestion: '2016-04-18',
		lastBackSuggestion: '2016-04-29',
		firstBackSuggestion: '2016-04-19',
		suggestions: [
			{
				date: '2016-04-19',
				type: 'get',
				times: [
					{ from: '15', to: '18'},
					{ from: '19', to: '20'}
				],
				valid: true
			},
			{
				date: '2016-04-20',
				type: 'get',
				times: [
					{ from: '09', to: '12'},
					{ from: '18', to: '21'}
				],
				valid: true
			},
			{
				date: '2016-04-29',
				type: 'back',
				times: [
					{ from: '09', to: '12'},
					{ from: '18', to: '21'}
				],
				valid: true
			}
		]
	};

	$scope.systemRequest.suggestions = [];
	$scope.systemRequest.firstGetSuggestion = '';
	$scope.systemRequest.lastGetSuggestion = '';
	$scope.systemRequest.lastBackSuggestion = '';
	$scope.systemRequest.firstBackSuggestion = '';
	
	
	$scope.sendRequest = function() {
		$log.debug('sendRequest: request', $scope.systemRequest);
		
		var data = $scope.systemRequest;
		data.suggestions = $scope.cleanedSuggestions;
		data.objectId = $scope.object.id;
// 		$log.debug('data', data);
		
		var url = 'api/lend/start';
			
		
		$http.post(url, data, {
			headers: { 'auth-token': AuthenticationService.getLocalToken() }
		})
		.success(function(response) {
			$log.debug('sendRequest: response', response);
			
			$state.go('borrow', {borrowId: response.borrowId});
			
		})
		.error(function(error) {
			$log.debug(error);
		});
			
		
	}
	
	$scope.selectedDay = {
		date: '',
		type: 'get',
		times: [
			{ from: '', to: '' }
		]
	}
	
	$scope.timeOption = [
		{ from: '07', to: '08' },
		{ from: '08', to: '09' },
		{ from: '09', to: '10' },
		{ from: '10', to: '11' },
		{ from: '11', to: '12' },
		{ from: '12', to: '13' },
		{ from: '13', to: '14' },
		{ from: '14', to: '15' },
		{ from: '15', to: '16' },
		{ from: '16', to: '17' },
		{ from: '17', to: '18' },
		{ from: '18', to: '19' },
		{ from: '19', to: '20' },
		{ from: '20', to: '21' },
		{ from: '21', to: '22' }
	];
	
	
	var getDateString = function(date) {
		var month = (date.getMonth()+1);
		month = (month < 10 ? '0'+month : month);
		var day = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
		var dateString = date.getFullYear()+'-'+month+'-'+day;
		
		return dateString;
	}
	
	$scope.change = function(type) {
		var currentDate = $scope.dt;
		$log.debug('changed2', currentDate);
		
		
		var dateString = getDateString(currentDate);
// 		$log.debug(dateString);
		
		// suggestion
		var suggestion = {
			date: dateString,
			type: type,
			times: []
		};
		
		$log.debug('suggestion', suggestion);
		
		angular.forEach($scope.systemRequest.suggestions, function(value, key) {
			$log.debug(value);
			if (value.date == dateString) {
				$log.debug(value);
				suggestion = angular.copy(value);
			}
		});
		
		$scope.selectedDay = suggestion;
		
		$timeout(function() {
		
			$document.scrollToElement($("#calendar-"+type+" button.btn.active"), 20, 500);
			
			// timpicker box
		    ContextBoxService.setTargetElement($("#calendar-"+type+" button.btn.active"));
		    ContextBoxService.setHorizontalAlign('right');
		    ContextBoxService.setId('timepicker');	    
		    ContextBoxService.show();
		    ContextBoxService.onClose(function() {
			    var calendar = document.querySelector("#requestContent");
				$document.scrollToElement(angular.element(calendar), 20, 500);
		    });
		    ContextBoxService.dt = $scope.dt;
		    ContextBoxService.timeOption = $scope.timeOption;
   
			
		}, 5);
		
		$log.debug($scope.selectedDay);

		
	}
	
	
	$scope.contextBox.isTimeActive = function(currentTime) {
		var result = false;
		angular.forEach($scope.selectedDay.times, function(time, keyT) {
			if (currentTime.from >= time.from && currentTime.to <= time.to) {
				result = true;
			}
		});
		
		return result;
		
	}

	
	$scope.contextBox.timeClicked = function(clickedTime, type) {
		$log.debug('time', clickedTime);
		$log.debug('type', clickedTime);
		
		$log.debug('selectedDay1', $scope.selectedDay);
		
		var add = true;
		var addPosition = 0;
		angular.forEach($scope.selectedDay.times, function(time, keyT) {
			if (time.to == clickedTime.to) {
				add = false;
				$scope.selectedDay.times.splice(keyT,1);
			}
			
			if (clickedTime.to > time.to) {
				addPosition = keyT+1;
			}
			
		});
		
		if (add) {
			$scope.selectedDay.times.splice(addPosition, 0, clickedTime);
		}
		
		$scope.updateSuggestion();
		
		$log.debug('selectedDay2', $scope.selectedDay);
		
	}
	
	$scope.updateSuggestion = function() {
		$log.debug('updateSuggestion', $scope.selectedDay);
		var selectedDay = angular.copy($scope.selectedDay);
		

		
		if (selectedDay.times.length > 0) {
			selectedDay.valid = true;

		} else {

			selectedDay.valid = false;
		}
		
// 		$log.debug('selectedDay', selectedDay);
		
		
		
		$log.debug('systemRequest.suggestions1', $scope.systemRequest);
		
		var newDay = true;
		var newPosition = 0;
		angular.forEach($scope.systemRequest.suggestions, function(value, key) {
			$log.debug('sug', value);
			
			if ($scope.selectedDay.type == value.type) {
			
				if (value.date == $scope.selectedDay.date) {
					
					$scope.systemRequest.suggestions[key] = selectedDay;
					
					if ($scope.selectedDay.times.length == 0 || $scope.selectedDay.times[0] == 'none') {
						$scope.systemRequest.suggestions.splice(key, 1);
// 						$log.debug('delete');
					}
					
					newDay = false;
				}
				
				if ($scope.selectedDay.date > value.date) {
					newPosition = key+1;
				}
				
			}
			
		});
		
		if (newDay && $scope.selectedDay.times.length > 0 && $scope.selectedDay.times[0].to != 'none') {
			$scope.systemRequest.suggestions.splice(newPosition, 0, selectedDay);
		}
		
		cleanSuggestions();
		
		calculateEnds();
		
		renderDatepicker();
		
		$scope.checkValidRequest();
		
		$log.debug('systemRequest.suggestion2', $scope.systemRequest);
	}
	
	$scope.cleanedSuggestions = [];
	
	var cleanSuggestions = function() {
		var oldOrder = angular.copy($scope.systemRequest.suggestions);
		$scope.cleanedSuggestions = [];
		
		angular.forEach(oldOrder, function(suggestion, key) {
			$log.debug('befor: ', suggestion);
			var times = [];
			angular.forEach(suggestion.times, function(time, keyT) {
				if (times.length == 0) {
					times.push(time);
				} else {
/*
					$log.debug('times[times.length-1]', times[times.length-1]);
					$log.debug('times[times.length-1].to', times[times.length-1].to);
					$log.debug('time.from', time.from);
*/
					
					if (times[times.length-1].to == time.from) {
						times[times.length-1].to = time.to;
					} else {
						times.push(time);
					}
				}
				
			});
			
			$scope.cleanedSuggestions.push({
				date: suggestion.date,
				type: suggestion.type,
				times: times
			})
			
		});
		
		$log.debug('scope.cleanedSuggestions: ', $scope.cleanedSuggestions);
	}
	
	var calculateEnds = function() {
		$scope.systemRequest.firstGetSuggestion = '';
		$scope.systemRequest.lastGetSuggestion = '';
		$scope.systemRequest.firstBackSuggestion = '';
		$scope.systemRequest.lastBackSuggestion = '';
		
		angular.forEach($scope.systemRequest.suggestions, function(value, key) {
			if (value.type == 'get') {
				if ($scope.systemRequest.firstGetSuggestion == '' || new Date(value.date) < new Date($scope.systemRequest.firstGetSuggestion)) {
					$scope.systemRequest.firstGetSuggestion = value.date;
				}
				if ($scope.systemRequest.lastGetSuggestion == '' || new Date(value.date) > new Date($scope.systemRequest.lastGetSuggestion)) {
					$scope.systemRequest.lastGetSuggestion = value.date;
				}
			} else if (value.type == 'back') {
				if ($scope.systemRequest.lastBackSuggestion == '' || new Date(value.date) > new Date($scope.systemRequest.lastBackSuggestion)) {
					$scope.systemRequest.lastBackSuggestion = value.date;
				}
				if ($scope.systemRequest.firstBackSuggestion == '' || new Date(value.date) < new Date($scope.systemRequest.firstBackSuggestion)) {
					$scope.systemRequest.firstBackSuggestion = value.date;
				}
			}
		});
	}


	var getDayClass = function(data) {
		
// 		$log.debug('getDayClass', data);
		
		var date = data.date
		var dateString = getDateString(data.date);
		var result = '';
		
		angular.forEach($scope.systemRequest.suggestions, function(value, key) {
			if (value.date == dateString && value.valid) {
				result = 'suggestion_'+value.type;
			}
		});
		
		if (new Date(dateString) >= new Date($scope.systemRequest.lastGetSuggestion) && new Date(dateString) <= new Date($scope.systemRequest.firstBackSuggestion)) {
			result += ' suggestion_between';
		}
		if (
			(new Date(dateString) >= new Date($scope.systemRequest.firstGetSuggestion) && new Date(dateString) <= new Date($scope.systemRequest.lastGetSuggestion)) 
			|| (new Date(dateString) <= new Date($scope.systemRequest.lastBackSuggestion) && new Date(dateString) >= new Date($scope.systemRequest.firstBackSuggestion)) 
		) {
			result += ' suggestion_between_ends';
		}
		
		if (new Date(dateString).setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
			result += ' today';
		}
		
// 		$log.debug('getDayClass', result);
				
		return result;
	}
	
	var isDisabledBack = function(data) {
// 		$log.debug(data);
		var result = false;
		var dateString = getDateString(data.date);
		if (new Date(dateString) <= new Date($scope.systemRequest.lastGetSuggestion)) {
			result = true;
		}


		return result;
	}
	
	var isDisabledGet = function(data) {
// 		$log.debug(data);
		var result = false;
		var dateString = getDateString(data.date);
		if (new Date(dateString) >= new Date($scope.systemRequest.firstBackSuggestion)) {
			result = true;
		}


		return result;
	}
	
	
	$scope.calendarOptionsGet = {
		customClass: getDayClass,
		dateDisabled: isDisabledGet,
		minDate: new Date(),
		showWeeks: false,
		maxMode: 'day',
		shortcutPropagation: false,
		startingDay: 1
	};
	
	$scope.calendarOptionsBack = {
		customClass: getDayClass,
		dateDisabled: isDisabledBack,
		minDate: new Date(),
		showWeeks: false,
		maxMode: 'day',
		shortcutPropagation: false,
		startingDay: 1
	};
	
	
	var renderDatepicker = function() {
		$scope.$broadcast('refreshDatepickers');
	}
	
	$scope.validRequest = false;
	$scope.checkValidRequest = function() {
		var result = $scope.systemRequest.firstGetSuggestion != '' && $scope.systemRequest.firstBackSuggestion != '' && $scope.systemRequest.message != '';
		
		$log.debug('systemRequest', $scope.systemRequest);
		$log.debug('validRequest1', result);
		if (result) {
			result = 
				$scope.systemRequest.preferredContact_fixnetPhone == 'yes' || 
				$scope.systemRequest.preferredContact_person1_mail == 'yes' || 
				$scope.systemRequest.preferredContact_person1_phone == 'yes' || 
				$scope.systemRequest.preferredContact_person2_mail == 'yes' || 
				$scope.systemRequest.preferredContact_person2_phone == 'yes';
		}
		
		$log.debug('validRequest2', result);
		
		$scope.validRequest = result;
		
		
	}
	$scope.checkValidRequest();
	
	
	// step navigation
	$scope.currentStep = 'step1';
	$scope.next = function() {
		if ($scope.currentStep == 'step1') {
			$scope.currentStep = 'step2';
		} else {
			$scope.currentStep = 'step3';
		}
		
		Piwik.trackPageView($window.location.origin+'/object/'+$stateParams.objectId+'/request/'+$scope.currentStep);
	}
	$scope.back = function() {
		if ($scope.currentStep == 'step2') {
			$scope.currentStep = 'step1';
		} else {
			$scope.currentStep = 'step2';
		}
		
		Piwik.trackPageView($window.location.origin+'/object/'+$stateParams.objectId+'/request/'+$scope.currentStep);
	}
	
	
	// edit object	
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
	
	
	// object data
	$scope.object = '';
	$scope.images = [];
	$scope.profilImageBG = {};
	$scope.loadObject = function() {
		$http.get('api/object/'+$stateParams.objectId, {
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				$log.debug('loadObject', response);
				if (response.ok) {
					$scope.object = response.objects;
					
					$scope.object.directContactTypes = [];
					if ($scope.object.directContact_fixnetPhone || $scope.object.directContact_person1_phone || $scope.object.directContact_person2_phone) {
						$scope.object.directContactTypes.push('Telefon');
					}
					if ($scope.object.directContact_person1_phone || $scope.object.directContact_person2_phone) {
						$scope.object.directContactTypes.push('SMS');
					}
					if ($scope.object.directContact_person1_mail || $scope.object.directContact_person2_mail) {
						$scope.object.directContactTypes.push('eMail');
					}
					
					$scope.images = [];
					if ($scope.object.image_1 != '') {
						$scope.images.push($scope.object.image_1);
					}
					if ($scope.object.image_2 != '') {
						$scope.images.push($scope.object.image_2);
					}
					if ($scope.object.image_3 != '') {
						$scope.images.push($scope.object.image_3);
					}
					
					$scope.profilImageBG = {
						'background-image':'url('+($scope.object.neighbor.accountImage == '' ? 'assets/img/static/profil-default.svg' : 'assets/img/profil/'+$scope.object.neighbor.accountImage)+')'
					}
	
					
				}
			})
			.error(function(error) {
				$log.debug(error);
			});
	}
	$scope.loadObject();
	
	
	// track view
	var trackObjectView = function() {
		$http.post('api/trackobject/'+$stateParams.objectId,{},{
				headers: { 'auth-token': AuthenticationService.getLocalToken() }
			})
			.success(function(response) {
				$log.debug('trackObjectView', response);
			})
			.error(function(error) {
				$log.debug(error);
			});
	}
	trackObjectView();

});