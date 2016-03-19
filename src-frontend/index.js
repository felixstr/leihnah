require('./index.scss');

require('angular');
require('ui-router');
require('ng-file-upload');

var appModule = require('./main.js');

require('./controller/loginController.js');
require('./controller/mainController.js');
require('./controller/addItemController.js');
require('./service/authenticationService.js');

angular.element(document).ready(function () {  
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});

