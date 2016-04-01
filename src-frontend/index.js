require('./index.scss');
require('./modal.scss');
require('./responsive.scss');

require('angular');
require('ui-router');
require('angular-ui-bootstrap');
require('ng-file-upload');

var appModule = require('./main.js');

require('./controller/homeController.js');
require('./controller/mainController.js');
require('./controller/objectsController.js');
require('./controller/neighborController.js');
require('./controller/wishlistController.js');
require('./controller/profilController.js');
require('./controller/profilBaseController.js');
require('./controller/profilObjectsController.js');
require('./controller/modal/editProfilController.js');
require('./controller/modal/editObjectController.js');
require('./controller/modal/editPasswordController.js');
require('./service/authenticationService.js');
require('./service/categoryService.js');

angular.element(document).ready(function () {  
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});

