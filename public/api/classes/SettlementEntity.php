<?php
	class SettlementEntity {
	protected $id = 0;
	protected $name = '';
	protected $image = '';
	
	protected $error = false;
	
	protected $db;
	
	public static function factory($db) {
		return new SettlementEntity($db);
	}
	
	public function __construct($db) {
		$this->db = $db;
	}
	
	public function load() {	
		
		$sql = "
			SELECT 
				pk_settlement AS id,
				name,
				image
			FROM settlement
			WHERE 
				pk_settlement = :id
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$stmt->execute();
		
		$results = $stmt->fetchAll();
		if (count($results) == 1) {
			$this->loadRow($results[0]);
			
		} else {
			$this->error = true;
		}
		
		
		return $this;
	}
	
	public function loadRow($row) {
		$this->id = $row['id'];
		$this->name = $row['name'];
		$this->image = $row['image'];
			
		return $this;
	}
	
	public function add() {
					
		$sql = "
			INSERT INTO
				settlement
			SET
				name = :name,
				image = :image,
				createDate = NOW()
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':name', $this->name, PDO::PARAM_STR);
		$stmt->bindParam(':image', $this->categoryId, PDO::PARAM_STR);
		$execute_result = $stmt->execute();
		
		if ($execute_result === false) {
			$this->error = true;
		} else {
			$this->id = $this->db->lastInsertId();
		}
		
		return $this;
			
	}
	
	public function update() {
			
		$sql = "
			UPDATE
				settlement
			SET
				name = :name,
				image = :image,
				changeDate = NOW()
			WHERE
				pk_settlement = :id
		";

		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':name', $this->name, PDO::PARAM_STR);
		$stmt->bindParam(':image', $this->image, PDO::PARAM_STR);
		$execute_result = $stmt->execute();
		
		if ($execute_result === false) {
			$this->error = true;
		}
		
		return $this;
			
	}

	
	public function getId() { return $this->id; }
	public function getName() { return $this->name; }
	public function getImage() { return $this->image; }
	

	public function setId($value){ $this->id = $value; return $this;	}
	public function setName($value){ $this->name = $value; return $this; }
	public function setImage($value){ if ($value !== false) { $this->image = $value; } return $this;}

	
	
	public function toArray() { 
		
		
		$array = array(
			'id' => $this->id,	
			'name' => $this->name,	
			'image' => $this->image
		);
		
		
		return $array;
	}
}