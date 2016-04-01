<?php
abstract class Mapper {
	protected $db;
	protected $logger;
	
	public function __construct($db, $logger = false) {
		$this->db = $db;
		$this->logger = $logger;
	}
	
	
}