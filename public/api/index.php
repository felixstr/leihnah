<?php


use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Imagine\Image\Box;
use Imagine\Image\Point;
use Imagine\Image\ImageInterface;

require 'src/vendor/autoload.php';

spl_autoload_register(function ($classname) {
    require ("classes/" . $classname . ".php");
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
    $usernameExits = Authentication::usernameExists($requestBody['username']);
    
	$newResponse = $response->withJson(array('usernameExists' => $usernameExits));
	
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
		->add();
	
	$result = array('saved' => $userId !== false);
	
	
	if ($userId) {
		$neighborAdded = NeighborEntity::factory($this->db)
			->setUserId($userId)
			->setAccountName($requestBody['person1_firstName'])
			->setPerson1_firstName($requestBody['person1_firstName'])
			->add();
		
		
		Authentication::setCredentials($requestBody['username'], $requestBody['password']);
		Authentication::login($this->db, $this->logger);
    
		$result = Authentication::getUserInfo();
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
	
	Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
    $result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    $result['ok'] = UserEntity::factory($this->db)
			->setId(Authentication::getUser()->getId())
			->load()
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
		
		$filename = false;
		if (isset($_FILES['file'])) {
			$filename = $id.rand(10,1000).$_FILES['file']['name'];
			$tmp_name = $_FILES['file']['tmp_name'];
			$destination = '../assets/img/'.$filename;
			$imagine = new Imagine\Gd\Imagine();
			$img = $imagine->open($tmp_name)
				->thumbnail(new Box(400,400), ImageInterface::THUMBNAIL_OUTBOUND); // THUMBNAIL_INSET
			
			$exif = exif_read_data($tmp_name);	
			$this->logger->addInfo("orientation", array($exif['Orientation']));
			if (!empty($exif['Orientation'])) {
				switch ($exif['Orientation']) {
					case 3:
						$img->rotate(180);
					break;
					case 6:
						$img->rotate(90);
					break;
					case 8:
						$img->rotate(-90);
					break;
				}
			}
			
			$img->save($destination);
		}
		
		
// 		
		
	    
	    $neighbor = NeighborEntity::factory($this->db)
			->setUserId($id)
			->load()
			->setAccountName($requestBody['accountName'])
			->setAccountImage($filename)
			->setAddress($requestBody['address'])
			->setFixnetPhone($requestBody['fixnetPhone'])
			->setDescription($requestBody['description'])
			->update()
			->toArray();
			
		if (is_array($neighbor)) {
			$result['neighbor'] = $neighbor;
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
			    $objects = ObjectMapper::factory($this->db)->getByUserId(Authentication::getUser()->getId());
			    
			    
		    } else {
			    
			    // bestimmtes objekt zurückgeben

			    $objects = ObjectEntity::factory($this->db)
					->setId($args['id'])
					->load()
					->toArray();
		    }
	    } else {
		    // alle objekte zurückgeben
		    $objects = ObjectMapper::factory($this->db)->get();
	    }

	    
			
		if (is_array($objects)) {
			$result['objects'] = $objects;
			$result['ok'] = true;
		}
		
    }

		
	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

/**
* falls angemeldet, wird aktueller oder anch id aufgelöstes objekt updated.
*/
$app->post('/object[/{id}]', function (Request $request, Response $response, $args) {
//     $this->logger->addInfo("header", $request->getHeader('auth-token'));
//     $this->logger->addInfo("method", array($request->getMethod()));
    $requestBody = $request->getParsedBody();
    $this->logger->addInfo("requestBody", array($requestBody));
//     $this->logger->addInfo("body", array($body));
    
    Authentication::initialize($this->db, $this->logger);
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::login();
    
    $result['ok'] = false;
    if (Authentication::isAuthenticated()) {
	    
	    if (isset($args['id'])) {
		    // update
	    } else {
		    // add
		    $id = Authentication::getUser()->getId();
		    
		    $object = ObjectEntity::factory($this->db)
		    	->setUserId($id)
		    	->add();
		    
	    }
// 	    $this->logger->addInfo("id", array($id));
		
		$filename = false;
		if (isset($_FILES['file1'])) {
			$filename = $object->getId().rand(10,1000).$_FILES['file1']['name'];
			$tmp_name = $_FILES['file1']['tmp_name'];
			$destination = '../assets/img/'.$filename;
			$imagine = new Imagine\Gd\Imagine();
			$img = $imagine->open($tmp_name)
				->thumbnail(new Box(400,400), ImageInterface::THUMBNAIL_OUTBOUND); // THUMBNAIL_INSET
			
			$exif = exif_read_data($tmp_name);	
// 			$this->logger->addInfo("orientation", array($exif['Orientation']));
			if (!empty($exif['Orientation'])) {
				switch ($exif['Orientation']) {
					case 3:
						$img->rotate(180);
					break;
					case 6:
						$img->rotate(90);
					break;
					case 8:
						$img->rotate(-90);
					break;
				}
			}
			
			$img->save($destination);
		}

	    
	    $object
			->setCategoryId($requestBody['categoryId'])
			->setImage_1($filename)
			->setName($requestBody['name'])
			->setDescription($requestBody['description'])
			->setDamage($requestBody['damage'])
			->setGift($requestBody['gift'])
			->update()
			->load()
			->toArray();
			
		if (is_array($object)) {
			$result['object'] = $object;
			$result['ok'] = true;
		}
		
    }

	$this->logger->addInfo("result", $result);	
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
	    
	    $categories = CategoryMapper::factory($this->db)->get();
			
		if (is_array($categories)) {
			$result['categories'] = $categories;
			$result['ok'] = true;
		}
		
    }

		
	$newResponse = $response->withJson($result);
	
    return $newResponse;
});

$app->run();