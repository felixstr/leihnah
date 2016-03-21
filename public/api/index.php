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
    
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::initialize($this->db, $this->logger);
    
	$userinfo = Authentication::getUserInfo();

		
	$newResponse = $response->withJson($userinfo);
	
    return $newResponse;
});

/**
* login mit username und passwort
*/
$app->post('/login', function (Request $request, Response $response) {
	$this->logger->addInfo("body", $request->getParsedBody());
	$requestBody = $request->getParsedBody();
    
    Authentication::setCredentials($requestBody['username'], $requestBody['password']);
    Authentication::initialize($this->db, $this->logger);
    
	$userinfo = Authentication::getUserInfo();
		
	$newResponse = $response->withJson($userinfo);

	
    return $newResponse;
});


/**
* logout user
*/
$app->post('/logout', function (Request $request, Response $response) {
	$this->logger->addInfo("body", $request->getParsedBody());
	$requestBody = $request->getParsedBody();
    
    Authentication::setToken($request->getHeader('auth-token'));
    Authentication::initialize($this->db, $this->logger);
    Authentication::logout();
    
	$userinfo = Authentication::getUserInfo();
	
	
		
	$newResponse = $response->withJson($userinfo);

	
    return $newResponse;
});

$app->run();