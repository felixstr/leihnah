<?php


use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

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

$app->get('/objects', function (Request $request, Response $response) {
    $this->logger->addInfo("header", $request->getHeaders());
    
    $mapper = new ObjectMapper($this->db, $this->logger);
    $objects = $mapper->getObjects();

	$newResponse = $response->withJson($objects);
	
    return $newResponse;
});


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
			->initialize()
			->toArray();
			
		if (is_array($neighbor)) {
			$result = $neighbor;
			$result['ok'] = true;
		}
		
    }

		
	$newResponse = $response->withJson($result);
	
    return $newResponse;
});



$app->run();