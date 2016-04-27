require('./index.scss');
require('./animation.scss');
require('./modal.scss');
require('./responsive.scss');
require('./angular-carousel.scss');

require('./img/placeholder-load.jpg');
require('./img/placeholder-notfound.png');
require('./img/leihnah-logo.svg');
require('./img/leihnah-logo-negativ.svg');
require('./img/profil-default.svg');
require('./img/ukulele.jpg');
require('./img/abc.jpg');
require('./img/teigwaren.jpg');
require('./img/barivox.jpg');
require('./img/schleifmaschine.jpg');
require('./img/naehmaschine.jpg');
require('./img/garten.jpg');
require('./img/spielzeuge.jpg');
require('./img/baby-kind.jpg');
require('./img/haushalt.jpg');
require('./img/medien.jpg');
require('./img/sport-freizeit.jpg');
require('./img/werkzeuge.jpg');
require('./img/sonstiges.jpg');
require('./img/lp-schwimmweste.jpg');
require('./img/lp-heissleim.jpg');
require('./img/lp-schneeschuhe.jpg');
require('./img/lp-abc.jpg');
require('./img/lp-barivox.jpg');
require('./img/lp-teigwarenmaschine.jpg');
require('./img/lp-ukulele.jpg');
require('./img/lp-naehmaschine.jpg');
require('./img/lp-statement-entsafter.jpg');
require('./img/lp-statement-naehmaschine.jpg');
require('./img/lp-statement-heckenschere.jpg');
require('./img/lp-settlement-tiergarten.jpg');
require('./img/lp-settlement-neubuel.jpg');
require('./img/lp-settlement-riedtli.jpg');
require('./img/lp-header-1.jpg');
require('./img/lp-header-2.jpg');
require('./img/lp-header-3.jpg');
require('./img/lp-header-4.jpg');
require('./img/lp-header-5.jpg');
require('./img/lp-header-6.jpg');
require('./img/lp-header-7.jpg');


require('angular');
require('ui-router');
require('angular-ui-bootstrap');

require('ng-file-upload');
require('angular-sanitize');
require('angular-carousel');
require('angular-touch');
require('angular-moment');
require('angular-animate');
require('angular-scroll');
require('angular-resize');

require('./angular-piwik.js');
require('./angular-locale_de-ch.js');
require('./datepicker.decorator.js');
require('./angular-preload-image.min.js');

var appModule = require('./main.js');

require('./controller/homeController.js');
require('./controller/landingPageController.js');
require('./controller/mainController.js');
require('./controller/objectsController.js');
require('./controller/objectDetailController.js');
require('./controller/borrowController.js');
require('./controller/lendController.js');
require('./controller/neighborController.js');
require('./controller/wishlistController.js');
require('./controller/registerController.js');
require('./controller/profilController.js');
require('./controller/profilBaseController.js');
require('./controller/profilObjectsController.js');
require('./controller/profilLendController.js');
require('./controller/profilBorrowController.js');
require('./controller/modal/editProfilController.js');
require('./controller/modal/editProfilPersonController.js');
require('./controller/modal/editObjectController.js');
require('./controller/modal/deleteObjectController.js');
require('./controller/modal/activationObjectController.js');
require('./controller/modal/editPasswordController.js');
require('./controller/modal/lendCloseController.js');
require('./controller/modal/lendCheckDataController.js');
require('./controller/modal/lendConfirmController.js');
require('./service/authenticationService.js');
require('./service/categoryService.js');
require('./service/contextmenuService.js');
require('./service/contextBoxService.js');
require('./service/scrollService.js');

angular.element(document).ready(function () {  
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});

