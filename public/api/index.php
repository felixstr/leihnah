<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'src/vendor/autoload.php';


ini_set('memory_limit', '256m');

spl_autoload_register(function ($classname) {
// 	echo $classname.' '.class_exists($classname);
	if ($classname != 'Box') {
    	require ("classes/" . $classname . ".php");
    }
});

require 'config.inc.php';

$app = new \Slim\App(["settings" => $config]);

$container = $app->getContainer();

$container['logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler("logs/app.log");
    $logger->pushHandler($file_handler);
    return $logger;
};

$container['db'] = function ($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO("mysql:host=" . $db['host'] . ";dbname=" . $db['dbname'], $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->query('SET NAMES utf8');
    return $pdo;
};

$container['mailer'] = function ($c) {
    $mailer = $c['settings']['mail'];
    
    $phpMailer = new PHPMailer();
    
// 	$phpMailer->SMTPDebug = 2;                               // Enable verbose debug output

	$phpMailer->isSMTP();                                      // Set mailer to use SMTP
	$phpMailer->Host = 'mail.cyon.ch';  // Specify main and backup SMTP servers
	$phpMailer->SMTPAuth = true;                               // Enable SMTP authentication
	$phpMailer->Username = 'mailer@leihnah.ch';                 // SMTP username
	$phpMailer->Password = $mailer['pass'];                           // SMTP password
// 	$phpMailer->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
	$phpMailer->Port = 587;  
    
    return $phpMailer;
};


/**
* falls angemeldet, wird aktueller benutzer zurückgegeben.
*/
$app->get('/userinfo', function (Request $request, Response $response) {
    $this->logger->addInfo("header", $request->getHeader('auth-token'));
//     $this->logger->addInfo("method", array($request->getMethod()));
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
	$userinfo = Authentication::getUserInfo();

		
	$newResponse = $response->withJson($userinfo);
	
    return $newResponse;
});

/**
* überprüft ob username bereits vorhanden ist.
*/
$app->post('/usernameexists', function (Request $request, Response $response) {
    $requestBody = $request->getParsedBody();
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
	
// 	echo empty($requestBody['username']);
	
    $usernameOk = false;
    if (isset($requestBody['username']) && !empty($requestBody['username'])) {
    	$usernameOk = Authentication::usernameOk($requestBody['username']);
    }
    
	$newResponse = $response->withJson(array('usernameExists' => !$usernameOk));
	
    return $newResponse;
});

/**
* register
*/
$app->post('/register', function (Request $request, Response $response) {
	$this->logger->addInfo("body", $request->getParsedBody());
	$requestBody = $request->getParsedBody();
	
	Authentication::initialize($this->db, $this->logger);
	
	$userId = UserEntity::factory($this->db)
		->setName($requestBody['username'])
		->setPassword($requestBody['password'])
		->setActive(false)
		->add();
	
	$result = array('saved' => $userId !== false);
	
	
	if ($userId) {
		$neighborAdded = NeighborEntity::factory($this->db)
			->setUserId($userId)
			->setAccountName($requestBody['person1_firstName'])
			->add();
		
/*
		
		Authentication::setCredentials($requestBody['username'], $requestBody['password']);
		Authentication::login($this->db, $this->logger);
    
		$result = Authentication::getUserInfo();
*/
	}
				
	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

/**
* new password and username
*/
$app->put('/user', function (Request $request, Response $response) {
	$this->logger->addInfo("body", $request->getParsedBody());
	$requestBody = $request->getParsedBody();
	
// 	echo print_r($requestBody);
	
	Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
    $result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    $result['ok'] = UserEntity::factory($this->db)
			->setId(Authentication::getUser()->getId())
			->load()
			->setName($requestBody['name'])
			->setPasswordNew($requestBody['passwordNew'])
			->setPasswordNewRepeat($requestBody['passwordNewRepeat'])
			->setPasswordOld($requestBody['passwordOld'])
			->update();
    }
	
	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

/**
* login mit username und passwort
*/
$app->post('/login', function (Request $request, Response $response) {
	$this->logger->addInfo("body", $request->getParsedBody());
	$requestBody = $request->getParsedBody();
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setCredentials($requestBody['username'], $requestBody['password']);
    Authentication::login();
    
    
    
	$userinfo = Authentication::getUserInfo();
		
	$newResponse = $response->withJson($userinfo);

	
    return $newResponse;
});


/**
* logout user
*/
$app->post('/logout', function (Request $request, Response $response) {
	$this->logger->addInfo("auth-token", $request->getHeader('auth-token'));
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    Authentication::logout();
    
	$userinfo = Authentication::getUserInfo();
	
	
		
	$newResponse = $response->withJson($userinfo);

	
    return $newResponse;
});

/**
* falls angemeldet, wird aktueller oder anch id aufgelöster nachbar (profil) zurückgegeben.
*/
$app->get('/neighbor[/{id}]', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("header", $request->getHeader('auth-token'));
//     $this->logger->addInfo("method", array($request->getMethod()));
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
    $result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    if (isset($args['id'])) {
		    $id = $args['id'];
	    } else {
		    $id = Authentication::getUser()->getId();
	    }
	    $this->logger->addInfo("id", array($id));
	    
	    $neighbor = NeighborEntity::factory($this->db)
			->setUserId($id)
			->load()
			->toArray();
			
		if (is_array($neighbor)) {
			$result = $neighbor;
			$result['ok'] = true;
		}
		
    }

		
	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

/**
* falls angemeldet, wird aktueller oder anch id aufgelöster nachbar (profil) updated.
*/
$app->post('/neighbor[/{id}]', function (Request $request, Response $response, $args) {
//     $this->logger->addInfo("header", $request->getHeader('auth-token'));
//     $this->logger->addInfo("method", array($request->getMethod()));
    $requestBody = $request->getParsedBody();
    $body = $request->getBody();
    $this->logger->addInfo("requestBody", array($requestBody));
//     $this->logger->addInfo("body", array($body));
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
    $result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    if (isset($args['id'])) {
		    $id = $args['id'];
	    } else {
		    $id = Authentication::getUser()->getId();
	    }
// 	    $this->logger->addInfo("id", array($id));
		ImageMapper::initialize(new Imagine\Gd\Imagine(), $_FILES, 'profil', $id);
		$filename = ImageMapper::make();
		
// 		echo $filename;
	    
	    $neighbor = NeighborEntity::factory($this->db)
			->setUserId($id)
			->load();
		
		if (isset($requestBody['accountName'])) {
			$neighbor
				->setAccountName($requestBody['accountName'])
				->setAccountImage($filename)
				->setAddress($requestBody['address'])
				->setFixnetPhone($requestBody['fixnetPhone'])
				->setDescriptionAvailable($requestBody['descriptionAvailable'])
				->setDescription($requestBody['description']);
				
		} else if (isset($requestBody['person1_firstName'])) {
			$neighbor
				->setPerson1_firstName($requestBody['person1_firstName'])
				->setPerson1_lastName($requestBody['person1_lastName'])
				->setPerson1_mail($requestBody['person1_mail'])
				->setPerson1_mailPublic($requestBody['person1_mailPublic'])
				->setPerson1_phone($requestBody['person1_phone'])
				->setPerson1_phonePublic($requestBody['person1_phonePublic']);
		} else if (isset($requestBody['person2_firstName'])) {
			$neighbor
				->setPerson2_firstName($requestBody['person2_firstName'])
				->setPerson2_lastName($requestBody['person2_lastName'])
				->setPerson2_mail($requestBody['person2_mail'])
				->setPerson2_mailPublic($requestBody['person2_mailPublic'])
				->setPerson2_phone($requestBody['person2_phone'])
				->setPerson2_phonePublic($requestBody['person2_phonePublic']);
		}
		$neighbor_array = $neighbor
			->update()
			->toArray();
			
		if (is_array($neighbor_array)) {
			$result['neighbor'] = $neighbor_array;
			$result['ok'] = true;
		}
		
    }

		
	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

/**
* falls angemeldet, wird aktueller oder anch id aufgelöstes objekt zurückgegeben.
*/
$app->get('/object[/{id}]', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("header", $request->getHeader('auth-token'));
//     $this->logger->addInfo("method", array($request->getMethod()));
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
    $result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    if (isset($args['id'])) {
		    if ($args['id'] == 'own') {
			    // eigene gegenstände
			    $objects = ObjectMapper::factory($this->db)
			    	->getByUserId(Authentication::getUser()->getId());
			    
			    
		    } else {
			    
			    // bestimmtes objekt zurückgeben

			    $objects = ObjectEntity::factory($this->db)
					->setId($args['id'])
					->enableLoadReservedDates()
					->load()
					->toArray();
		    }
	    } else {
		    $objectMapper = ObjectMapper::factory($this->db)
		    	->setSettlementId(Authentication::getUser()->isSuperUser() ? null : Authentication::getUser()->getSettlementId())
		    	->setSortDesc();
		    
		    // alle objekte zurückgeben
		    $objects = $objectMapper->get();
		    
		    $result['objectsNew'] = $objectMapper
		    	->setLimit(8)
		    	->get();
		    

		    $result['objectsPopular'] = $objectMapper
		    	->setOrderByViewCount()
		    	->get();
		    
		    $result['objectsFavorites'] = $objectMapper
		    	->setOrderByName()
		    	->setLimit(4)
		    	->get();
		    	
	    }

	    
			
		if (is_array($objects)) {
			$result['objects'] = $objects;
			$result['ok'] = true;
		}
		
    }

// 	echo print_r($result);	
		
	$newResponse = $response->withJson($result);
// 	$newResponse = $response->withJson($result, null, JSON_NUMERIC_CHECK);
	
    return $newResponse;
});

/**
* falls angemeldet, wird aktueller oder anch id aufgelöstes objekt updated.
*/
$app->post('/object[/{id}]', function (Request $request, Response $response, $args) {
//     $this->logger->addInfo("header", $request->getHeader('auth-token'));
//     $this->logger->addInfo("method", array($request->getMethod()));
    $requestBody = $request->getParsedBody();
//     $this->logger->addInfo("requestBody", array($requestBody));
//     $this->logger->addInfo("body", array($body));
    
//     echo print_r($requestBody);
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
//     echo $requestBody['description'];
    $result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    if (isset($args['id'])) {
		    // update
		    $object = ObjectEntity::factory($this->db)
		    	->setId($args['id'])
		    	->load();
		    	
		    	
		    
	    } else {
		    // add
		    $id = Authentication::getUser()->getId();
		    
		    $object = ObjectEntity::factory($this->db)
		    	->setUserId($id)
		    	->setActive(true)
		    	->add();
		    
	    }
/*
	    echo print_r($_FILES);
	    echo 'userId: '.$object->getUserId();
*/
	    
	    if ($object->getUserId() == Authentication::getUser()->getId()) {
/*
		    echo isset($requestBody['active']) ? 'ja' : 'ein';
		    
*/
// 		    echo print_r($requestBody);
		    
		    ImageMapper::initialize(new Imagine\Gd\Imagine(), $_FILES, 'object', $object->getId());
			$filenames = ImageMapper::make();
			
// 			echo print_r($filenames);
/*
			echo '<br>test'.((isset($requestBody['directContact_fixnetPhone']) && $requestBody['directContactFlag'] == 1) ? 'true' : 'false');
			echo '<br>test'.(($requestBody['directContactFlag'] == true) ? 'true' : 'false');
*/
			
		    $object
				->setActive($requestBody['active'])
				->setCategoryId($requestBody['categoryId'])
				->setImage_1(isset($filenames['image_1']) && !empty($filenames['image_1']) ? $filenames['image_1'] : $requestBody['image_1'])
				->setImage_2(isset($filenames['image_2']) && !empty($filenames['image_2']) ? $filenames['image_2'] : $requestBody['image_2'])
				->setImage_3(isset($filenames['image_3']) && !empty($filenames['image_3']) ? $filenames['image_3'] : $requestBody['image_3'])
				->setName($requestBody['name'])
				->setNameAlternatives($requestBody['nameAlternatives'])
				->setDescription($requestBody['description'])
				->setDamage($requestBody['damage'])
				->setGift(isset($requestBody['gift']));
			
			if (isset($requestBody['directContactFlag'])) {
				
				$directFlag = ($requestBody['directContactFlag'] == 'yes');

				$object
					->setDirectContact_fixnetPhone(isset($requestBody['directContact_fixnetPhone']) && $directFlag ? $requestBody['directContact_fixnetPhone'] : false)
					->setDirectContact_person1_mail(isset($requestBody['directContact_person1_mail']) && $directFlag ? $requestBody['directContact_person1_mail'] : false)
					->setDirectContact_person1_phone(isset($requestBody['directContact_person1_phone']) && $directFlag ? $requestBody['directContact_person1_phone'] : false)
					->setDirectContact_person2_mail(isset($requestBody['directContact_person2_mail']) && $directFlag ? $requestBody['directContact_person2_mail'] : false)
					->setDirectContact_person2_phone(isset($requestBody['directContact_person2_phone']) && $directFlag ? $requestBody['directContact_person2_phone'] : false);
			}
			
			$object_arr = $object
				->update()
				->load()
				->toArray();
			
			
			
			if (is_array($object_arr)) {
				$result['object'] = $object_arr;
				$result['ok'] = true;
			}
			
			
		
		}
		
    }

	$this->logger->addInfo("result", $result);	
	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

/**
* falls angemeldet und eigenes objekt, dieses löschen.
*/
$app->delete('/object[/{id}]', function (Request $request, Response $response, $args) {
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();

    $result['ok'] = false;
    if (Authentication::isAuthenticated()) {

	    if (isset($args['id'])) {
		    // update
		    $result['ok'] = ObjectEntity::factory($this->db)
		    	->setId($args['id'])
		    	->load()
		    	->delete();
	    } 
		
    }

	$newResponse = $response->withJson($result);
	
    return $newResponse;
});


/**
* falls angemeldet, werden alle kategorien zurück gegeben.
*/
$app->get('/category', function (Request $request, Response $response, $args) {
//     $this->logger->addInfo("header", $request->getHeader('auth-token'));
//     $this->logger->addInfo("method", array($request->getMethod()));
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
    $result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    $categories = CategoryMapper::factory($this->db)
	    	->setSettlementId(Authentication::getUser()->isSuperUser() ? null : Authentication::getUser()->getSettlementId())
	    	->get();
		    	
			
		if (is_array($categories)) {
			$result['categories'] = $categories;
			$result['ok'] = true;
		}
		
    }

		
	$newResponse = $response->withJson($result, null, JSON_NUMERIC_CHECK);
	
    return $newResponse;
});


$app->get('/mail', function (Request $request, Response $response, $args) {

    
    $result['ok'] = false;
    
/*
    $mailer = MailMapper::factory($this->mailer)
    	->addAddress('fexfix@bluewin.ch', 'Felxi')
    	->setSubject('test')
    	->setBody('blaalbaa <b>asdfs</b> aslfddjs');
        
	
	if(!$mailer->send()) {
		$result['error'] = $mailer->getErrorInfo();
	} else {
		$result['ok'] = true;
	}
*/
	
	
	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

$app->post('/trackobject/{id}', function (Request $request, Response $response, $args) {
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
	
// 	echo Authentication::getUser()->isSuperUser() ? 'ja' : 'nein';
	
	$result['ok'] = false;
    if (Authentication::isAuthenticated() && !Authentication::getUser()->isSuperUser()) {
	    
	    $object = ObjectEntity::factory($this->db)
	    	->setId($args['id'])
	    	->load();
	    
	    if (Authentication::getUser()->getId() != $object->getUserId()) {
		    ObjectViewEntity::factory($this->db)
		    	->set($object)
		    	->track();
			$result['tracked'] = true;
	    } else {
		    $result['tracked'] = false;
	    }
	    		
		$result['ok'] = true;
    }
	

	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

$app->post('/lend/start', function (Request $request, Response $response, $args) {
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
	$requestBody = $request->getParsedBody();
// 	echo Authentication::getUser()->isSuperUser() ? 'ja' : 'nein';
// 	echo print_r($requestBody);
	
	$result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    $userLendId = ObjectEntity::factory($this->db)
	    	->setId($requestBody['objectId'])
	    	->load()
	    	->getUserId();
	    
	    $borrowId = LendEntity::factory($this->db)
		    ->setUserBorrowId(Authentication::getUser()->getId())
		    ->setUserLendId($userLendId)
	    	->setObjectId($requestBody['objectId'])
	    	->setRequestText($requestBody['message'])
	    	->setTimeSuggestions($requestBody['suggestions'])
	    	->setPreferredContact_fixnetPhone(isset($requestBody['preferredContact_fixnetPhone']) ? $requestBody['preferredContact_fixnetPhone'] : false)
			->setPreferredContact_person1_mail(isset($requestBody['preferredContact_person1_mail']) ? $requestBody['preferredContact_person1_mail'] : false)
			->setPreferredContact_person1_phone(isset($requestBody['preferredContact_person1_phone']) ? $requestBody['preferredContact_person1_phone'] : false)
			->setPreferredContact_person2_mail(isset($requestBody['preferredContact_person2_mail']) ? $requestBody['preferredContact_person2_mail'] : false)
			->setPreferredContact_person2_phone(isset($requestBody['preferredContact_person2_phone']) ? $requestBody['preferredContact_person2_phone'] : false)
	    	->request();
	    	
	    if ($borrowId > 0) {
			$result['ok'] = true;
			$result['borrowId'] = $borrowId;
	    } 
    }
	

	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

$app->post('/lend/answer/{id}', function (Request $request, Response $response, $args) {
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
	$requestBody = $request->getParsedBody();
// 	echo Authentication::getUser()->isSuperUser() ? 'ja' : 'nein';
// 	echo print_r($requestBody);
	
	$result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    $lendEntity = LendEntity::factory($this->db)
	    	->setId($args['id'])
	    	->load();
	    	
	    if ($lendEntity->getUserLendId() == Authentication::getUser()->getId()) {
	    
		    $answer = $lendEntity
			    ->setAnswerText($requestBody['message'])
			    ->setGetDatetime($requestBody['getDatetime'])
			    ->setBackDatetime($requestBody['backDatetime'])
		    	->answer()
		    	->load();
		    	
		    if (!$lendEntity->getError()) {
				$result['ok'] = true;
				$result['lend'] = $answer->toArray();
		    } 
		}
    }
	

	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

$app->post('/lend/direct/{id}', function (Request $request, Response $response, $args) {
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
	$requestBody = $request->getParsedBody();
// 	echo Authentication::getUser()->isSuperUser() ? 'ja' : 'nein';
// 	echo print_r($requestBody);
	
	$result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    $lendEntity = LendEntity::factory($this->db)
	    	->setId($args['id'])
	    	->load();
	    	
	    if ($lendEntity->getUserLendId() == Authentication::getUser()->getId()) {
	    
		    $direct = $lendEntity
		    	->directContact()
		    	->load();
		    	
		    if (!$lendEntity->getError()) {
				$result['ok'] = true;
				$result['lend'] = $direct->toArray();
		    } 
		}
    }
	

	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

$app->post('/lend/confirm/{id}', function (Request $request, Response $response, $args) {
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
	$requestBody = $request->getParsedBody();
// 	echo Authentication::getUser()->isSuperUser() ? 'ja' : 'nein';
// 	echo print_r($requestBody);
	
	$result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    $lendEntity = LendEntity::factory($this->db)
	    	->setId($args['id'])
	    	->load();
	    	
	    if ($lendEntity->getUserBorrowId() == Authentication::getUser()->getId()) {
	    
		    $confirm = $lendEntity
		    	->confirm()
		    	->load();
		    	
		    if (!$lendEntity->getError()) {
				$result['ok'] = true;
				$result['lend'] = $confirm->toArray();
		    } 
		}
    }
	

	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

$app->post('/lend/close/{id}', function (Request $request, Response $response, $args) {
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
	$requestBody = $request->getParsedBody();
// 	echo Authentication::getUser()->isSuperUser() ? 'ja' : 'nein';
/* 	echo print_r($requestBody); */
	
	$result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    $lendEntity = LendEntity::factory($this->db)
	    	->setId($args['id'])
	    	->load();
	    
	    
	    if ($requestBody['type'] == 'successful' && $lendEntity->getUserLendId() == Authentication::getUser()->getId()) {
	    
		    $close = $lendEntity
		    	->setClosedType('successful')
		    	->setClosedText($requestBody['feedback'])
		    	->close()
		    	->load();
		    	
		    
		} else if ($requestBody['type'] == 'stopped' && $lendEntity->getUserBorrowId() == Authentication::getUser()->getId()) {
			
			$close = $lendEntity
		    	->setClosedType('stopped')
		    	->setClosedText($requestBody['feedback'])
		    	->close()
		    	->load();
		    	
		} else if ($requestBody['type'] == 'refused' && $lendEntity->getUserLendId() == Authentication::getUser()->getId()) {
			
			$close = $lendEntity
		    	->setClosedType('refused')
		    	->setClosedText($requestBody['feedback'])
		    	->close()
		    	->load();
		    	
		} else if ($requestBody['type'] == 'canceled' && $lendEntity->getUserLendId() == Authentication::getUser()->getId()) {
			
			$close = $lendEntity
		    	->setClosedType('canceled')
		    	->setClosedText($requestBody['feedback'])
		    	->close()
		    	->load();
		    	
		}
		
		if (!$lendEntity->getError()) {
			$result['ok'] = true;
			$result['lend'] = $close->toArray();
	    } 
    }
	
	

	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

$app->get('/lend[/{id}]', function (Request $request, Response $response, $args) {
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
// 	echo Authentication::getUser()->isSuperUser() ? 'ja' : 'nein';
// 	echo print_r($requestBody);
	
	$result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    if (isset($args['id'])) {
	    
		    $lendEntity = LendEntity::factory($this->db)
			    ->setId($args['id'])
			    ->load();
			   
// 			echo $lendEntity->getError() == true ? 'error' : 'kein error';
			
			
			   
			if (!$lendEntity->getError() && ($lendEntity->getUserBorrowId() == Authentication::getUser()->getId() || $lendEntity->getObjectEntity()->getUserId() == Authentication::getUser()->getId())) {
				$result['ok'] = true;
				$result['lend'] = $lendEntity->toArray();
			}
		} else {
			
			$result['lends'] = LendMapper::factory($this->db)
		    	->setUserId(Authentication::getUser()->getId())
		    	->getLends();
		    
		    $result['borrows'] = LendMapper::factory($this->db)
		    	->setUserId(Authentication::getUser()->getId())
		    	->getBorrows();
			
			$result['ok'] = true;
		}
    }
	

	$newResponse = $response->withJson($result);
// 	$newResponse = $response->withJson($result, null, JSON_NUMERIC_CHECK);
	
    return $newResponse;
});

$app->run();