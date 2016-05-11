require('./index.scss');
require('./animation.scss');
require('./modal.scss');
require('./responsive.scss');
require('./angular-carousel.scss');

require('./img/placeholder-load.jpg');
require('./img/placeholder-notfound.png');
require('./img/placeholder-notUploaded.png');
require('./img/leihnah-logo.svg');
require('./img/leihnah-logo-negativ.svg');
require('./img/profil-default.svg');
require('./img/garten.jpg');
require('./img/spielzeuge.jpg');
require('./img/baby-kind.jpg');
require('./img/haushalt.jpg');
require('./img/medien.jpg');
require('./img/sport-freizeit.jpg');
require('./img/werkzeuge.jpg');
require('./img/sonstiges.jpg');
require('./img/lp-inspiration-teigwarenmaschine.jpg');
require('./img/lp-inspiration-ukulele.jpg');
require('./img/lp-inspiration-stoepsel.jpg');
require('./img/lp-inspiration-schneeschuhe.jpg');
require('./img/lp-inspiration-bohrmaschine.jpg');
require('./img/lp-inspiration-siedler.jpg');
require('./img/lp-inspiration-waage.jpg');
require('./img/lp-inspiration-barrivox.jpg');
require('./img/lp-inspiration-heissleim.jpg');
require('./img/lp-inspiration-ente.jpg');
require('./img/lp-inspiration-naehmaschiene.jpg');

require('./img/lp-statement-entsafter.jpg');
require('./img/lp-statement-naehmaschine.jpg');
require('./img/lp-statement-heckenschere.jpg');
require('./img/lp-settlement-tiergarten.jpg');
require('./img/lp-settlement-neubuehl.jpg');
require('./img/lp-settlement-riedtli.jpg');
require('./img/lp-header.jpg');
require('./img/lp-header-1.jpg');
require('./img/lp-header-2.jpg');
require('./img/lp-header-3.jpg');
require('./img/lp-header-4.jpg');
require('./img/lp-header-5.jpg');
require('./img/lp-header-6.jpg');
require('./img/lp-header-7.jpg');
require('./img/header-ukulele.jpg');
require('./img/header-teigwaren.jpg');
require('./img/header-stoepsel.jpg');
require('./img/header-schneeschuhe.jpg');
require('./img/header-bohrmaschine.jpg');
require('./img/header-spiel1.jpg');
require('./img/header-strom.jpg');
require('./img/header-waage.jpg');
require('./img/header-barivox.jpg');
require('./img/header-heissleim.jpg');
require('./img/header-ente.jpg');
require('./img/header-naehmaschiene.jpg');
require('./img/header-info.jpg');

require('./img/apple-touch-icon.png');


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
// require('ng-parallax');

require('./angular-parallax.js');
require('./angular-piwik.js');
require('./angular-locale_de-ch.js');
require('./datepicker.decorator.js');
require('./angular-preload-image.min.js');

var appModule = require('./main.js');

require('./controller/landingPageController.js');
require('./controller/mainController.js');
require('./controller/objectsController.js');
require('./controller/objectDetailController.js');
require('./controller/borrowController.js');
require('./controller/lendController.js');
require('./controller/neighborController.js');
require('./controller/infoController.js');
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
require('./controller/modal/deleteLendController.js');
require('./service/authenticationService.js');
require('./service/categoryService.js');
require('./service/contextBoxService.js');
require('./service/scrollService.js');
require('./service/pageVisibilityService.js');

angular.element(document).ready(function () {  
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});

