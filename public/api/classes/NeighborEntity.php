<?php
class NeighborEntity {
	protected $id;
	protected $name;
	
	protected $db;
	
	public static function factory($db) {
		return new NeighborEntity($db);
	}
	
	public function __construct($db) {
		$this->db = $db;
	}
	
	public function initialize() {	
		$sql = "
			SELECT 
				pk_neighbor AS id,
				name,
				token
			FROM neighbor
			WHERE pk_neighbor = :id
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$stmt->execute();
		
		$results = $stmt->fetchAll();
		if (count($results) == 1) {
			$this->name = $results[0]['name'];
			$this->token = $results[0]['token'];
			$this->id = $results[0]['id'];
		}
		
		
		return $this;
	}
	
	public function setId($id) { $this->id = $id; return $this; }
	
	public function getId() { return $this->id; }
	public function getName() { return $this->name; }
	
	public function toArray() { 
		$array = array(
			'id' => $this->id,	
			'name' => $this->name,
			'token' => $this->token
		);
		
		return $array;
	}
}