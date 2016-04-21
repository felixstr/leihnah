angular.module('Leihnah').controller('ObjectDetailController', function($scope, $http, $stateParams, $window, $log, $document, $timeout, $window, AuthenticationService, auth, $uibModal, CategoryService, Piwik, $state, ContextmenuService) {
	Piwik.trackPageView($window.location.origin+'/object/'+$stateParams.objectId);
	
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	
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
		data.objectId = $scope.object.id;
		$log.debug('data', data);
		
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
		],
		chooseType: true
	}
	
	$scope.timeOption = [
		{ time: 'none', label: 'Auswahl' },
		{ time: '07', label: '07:00' },
		{ time: '08', label: '08:00' },
		{ time: '09', label: '09:00' },
		{ time: '10', label: '10:00' },
		{ time: '11', label: '11:00' },
		{ time: '12', label: '12:00' },
		{ time: '13', label: '13:00' },
		{ time: '14', label: '14:00' },
		{ time: '15', label: '15:00' },
		{ time: '16', label: '16:00' },
		{ time: '17', label: '17:00' },
		{ time: '18', label: '18:00' },
		{ time: '19', label: '19:00' },
		{ time: '20', label: '20:00' },
		{ time: '21', label: '21:00' },
		{ time: '22', label: '22:00' },
		{ time: '23', label: '23:00' },
		{ time: '00', label: '00:00' },
		{ time: '01', label: '01:00' },
		{ time: '02', label: '02:00' },
		{ time: '03', label: '03:00' },
		{ time: '04', label: '04:00' },
		{ time: '05', label: '05:00' },
		{ time: '06', label: '06:00' },
	];
	
	
	var getDateString = function(date) {
		var month = (date.getMonth()+1);
		month = (month < 10 ? '0'+month : month);
		var day = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
		var dateString = date.getFullYear()+'-'+month+'-'+day;
		
		return dateString;
	}
	
	$scope.change = function() {
		var currentDate = $scope.dt;
		$log.debug('changed2', currentDate);
		
		
		var dateString = getDateString(currentDate);
		$log.debug(dateString);
		
		// type
		var type = 'get';
		var chooseType = true;
		var currentD = new Date(dateString);
		$log.debug('currentD', currentD);
		$log.debug('firstGetSuggestion', $scope.systemRequest.firstGetSuggestion);
		$log.debug('check', (currentD < new Date($scope.systemRequest.firstGetSuggestion)));
		if ($scope.systemRequest.lastGetSuggestion != '' && currentD < new Date($scope.systemRequest.lastGetSuggestion)) {
			type = 'get';
			chooseType = false;
		}
		if ($scope.systemRequest.firstBackSuggestion != '' && currentD > new Date($scope.systemRequest.firstBackSuggestion)) {
			type = 'back';
			chooseType = false;
		}
		
		// suggestion
		var suggestion = {
			date: dateString,
			type: type,
			times: [
				{ from: 'none', to: 'none' }
			],
			chooseType: chooseType
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
			var activeElement = document.querySelector("button.btn.active");
			var boxDay = activeElement.getBoundingClientRect();
			var boxCalendar = document.querySelector("#calendar").getBoundingClientRect();
// 			$log.debug('activeElement', boxDay);
			var left = (activeElement.offsetWidth/2) + boxDay.left - boxCalendar.left;
			var top = activeElement.offsetHeight + boxDay.top - boxCalendar.top;
			
			document.querySelector("#timepicker").setAttribute('style', "left: "+left+"px; top: "+top+"px");
			
			ContextmenuService.current = 'timepicker';
			
		}, 5);
		
		$log.debug($scope.selectedDay);
	}
	
	$scope.switchType = function() {
		$scope.selectedDay.type = $scope.selectedDay.type == 'get' ? 'back' : 'get';
	
		$scope.updateSuggestion();
	}
	
	$scope.timeSelectChanged = function(time, type) {
		var intFrom = parseInt(time.from);
		var intTo = parseInt(time.to);
		
		var from = intFrom.toString();
		var to = intTo.toString();
		
		
		if (type == 'from') {
			if (time.to == 'none' || intTo <= intFrom) {
				if (intFrom < 23) {
					to = (intFrom + 1).toString();
				} else {
					to = '0';
				}
			}
		} else {
			
			$log.debug('intFrom', intFrom);
			$log.debug('intTo', intTo);
			
			if (time.from == 'none' || intTo <= intFrom) {
				if (intTo < 23 && intTo > 0) {
					from = (intTo-1).toString();
				} else if (intTo > 0) {
					from = '1';
				} else {
					from = '23';
				}
			}
		
		}
		
		time.to = (to.length == 1 ? '0'+to : to);
		time.from = (from.length == 1 ? '0'+from : from);
		
		
		$log.debug(time);
		$scope.updateSuggestion();
	}
	
	$scope.updateSuggestion = function() {
		$log.debug('updateSuggestion', $scope.selectedDay);
		var selectedDay = angular.copy($scope.selectedDay);
		

		
		if (selectedDay.times.length > 0 && selectedDay.times[0].from != 'none' && selectedDay.times[0].to != 'none') {
			selectedDay.valid = true;

		} else {

			selectedDay.valid = false;
		}
		
// 		$log.debug('selectedDay', selectedDay);
		
		var newDay = true;
		
		
		$log.debug('systemRequest.suggestions1', $scope.systemRequest);
		
		angular.forEach($scope.systemRequest.suggestions, function(value, key) {
			$log.debug('sug', value);
			if (value.date == $scope.selectedDay.date) {
				$scope.systemRequest.suggestions[key] = selectedDay;
				
				if ($scope.selectedDay.times.length == 0 || $scope.selectedDay.times[0] == 'none') {
					$scope.systemRequest.suggestions.splice(key, 1);
					$log.debug('delete');
				}
				
				newDay = false;
			}
			
			
		});
		
		if (newDay && $scope.selectedDay.times.length > 0 && $scope.selectedDay.times[0].to != 'none') {
			$scope.systemRequest.suggestions.push(selectedDay);
		}
		
		calculateEnds();
		
		renderDatepicker();
		
		$scope.checkValidRequest();
		
		$log.debug('systemRequest.suggestion2', $scope.systemRequest);
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
	
	$scope.addTimeRow = function() {
		var from = 'none';
		var to = 'none';
		
		if ($scope.selectedDay.times.length > 0) {
			var lastTo = parseInt($scope.selectedDay.times[$scope.selectedDay.times.length-1].to);
			
			
			if (lastTo < 22) {
				from = (lastTo+2).toString();
				to = (lastTo+3).toString();
			
			}
			$log.debug(lastTo);
		}
		$scope.selectedDay.times.push({ from: from, to: to });
		
		$scope.updateSuggestion();
	}
	
	$scope.deleteTimeRow = function(index) {
		$scope.selectedDay.times.splice(index, 1);
			
		$scope.updateSuggestion();
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
		
// 		$log.debug('getDayClass', result);
				
		return result;
	}
	var isDisabled = function(data) {
// 		$log.debug(data);
		return false;
	}
	

	
	
	$scope.calendarOptions = {
		customClass: getDayClass,
		dateDisabled: isDisabled,
		minDate: new Date(),
		showWeeks: false,
		maxMode: 'day',
		shortcutPropagation: false,
		startingDay: 1
	};
	
	
	var renderDatepicker = function() {
		$scope.dt = new Date($scope.dt.getTime() + 1);
	}
	
	$scope.validRequest = false;
	$scope.checkValidRequest = function() {
		$scope.validRequest = $scope.systemRequest.firstGetSuggestion != '' && $scope.systemRequest.firstBackSuggestion != '' && $scope.systemRequest.message != '';
		
		$log.debug('validRequest', $scope.validRequest);
	}
	$scope.checkValidRequest();
	
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