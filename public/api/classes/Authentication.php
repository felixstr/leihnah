<?php
class Authentication {
	private static $db = null;
	private static $logger = null;
	
	private static $authenticated = false;
	private static $token = null;
	private static $username = null;
	private static $password = null;
	
	private static $neighbor = null;
	

	public static function initialize($db, $logger) {
		self::$logger = $logger;
		self::$db = $db;
		
		self::$logger->debug(self::$token);
		
		if (!is_null(self::$username) && !is_null(self::$password)) {
			
			$sql = "
				SELECT 
					pk_neighbor AS id,
					name,
					password
				FROM neighbor
				WHERE name = :name
			";
			$stmt = self::$db->prepare($sql);
			$stmt->bindParam(':name', self::$username, PDO::PARAM_STR);
			$stmt->execute();
			
			$results = $stmt->fetchAll();
			if (count($results) == 1) {
				
				if (password_verify(self::$password, $results[0]['password'])) {
					self::$logger->info('password-verified', array(self::$password));
					$token = $results[0]['name'].'|'.bin2hex(openssl_random_pseudo_bytes(16));
					
					$sql = "
						UPDATE 
							neighbor
						SET
							token = :token
						WHERE name = :name
					";
					$stmt = self::$db->prepare($sql);
					$stmt->bindParam(':name', self::$username, PDO::PARAM_STR);
					$stmt->bindParam(':token', $token, PDO::PARAM_STR);
					$stmt->execute();
					
					self::$authenticated = true;
					self::$neighbor = NeighborEntity::factory(self::$db)
						->setId($results[0]['id'])
						->initialize();
										
				}
	
				
			} else if (count($results) > 1) {
				self::$logger->error('gleicher username: ', self::$username);
			}
			
		} else if (!is_null(self::$token)) {
			
			$sql = "
				SELECT 
					pk_neighbor AS id,
					name
				FROM neighbor
				WHERE token = :token
			";
			$stmt = self::$db->prepare($sql);
			$stmt->bindParam(':token', self::$token, PDO::PARAM_STR);
			$stmt->execute();
			
			$results = $stmt->fetchAll();
			if (count($results) == 1) {
				
				self::$authenticated = true;
				self::$neighbor = NeighborEntity::factory(self::$db)
					->setId($results[0]['id'])
					->initialize();
			}
		}
	}
	
	public static function logout() {
		if (!is_null(self::$token)) {
			
			$sql = "
				UPDATE
					neighbor
				SET 
					token = ''
			";
			$stmt = self::$db->prepare($sql);
			if ($stmt->execute()) {
				self::$authenticated = false;
				self::$neighbor = null;
			}
		}
	}
	
	public static function setToken($token) {
		if (is_array($token) && isset($token[0])) {
			self::$token = $token[0];
		}
	}
	
	public static function setCredentials($username, $password) {
		self::$username = $username;
		self::$password = $password;
	}
	
	public static function isAuthenticated() { return self::$authenticated; }
	
	public static function getNeighbor() {
		return self::$neighbor;
	}
	
	public static function getUserInfo() {
		return array(
			'authenticated' => self::isAuthenticated(),
			'user' => self::isAuthenticated() ? self::getNeighbor()->toArray() : null
			);
	}
	
}