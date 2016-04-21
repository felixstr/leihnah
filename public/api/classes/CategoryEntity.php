<?php
class CategoryEntity {
	protected $id = 0;
	protected $name = '';
	protected $image = false;
	protected $count = 0;
	
	
	
	protected $error = false;
	
	protected $db;
	
	public static function factory($db) {
		return new CategoryEntity($db);
	}
	
	public function __construct($db) {
		$this->db = $db;
	}
	
	public function load() {	
		
		$sql = "
			SELECT 
				pk_category AS id,
				name,
				image
			FROM category
			WHERE pk_category = :id
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
		
		if (isset($row['count'])) {
			$this->count = $row['count'];
		}
			
		return $this;
	}
	
	public function add() {
					
		$sql = "
			INSERT INTO
				category
			SET
				name = :name,
				image = :image				
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':name', $this->name, PDO::PARAM_STR);
		$stmt->bindParam(':image', $this->image, PDO::PARAM_STR);
		return $stmt->execute();
			
	}
	
	public function update() {
		
			
		$sql = "
			UPDATE
				category
			SET
				name = :name,
				image = :image
			WHERE
				pk_category = :id
		";
		
// 		echo $sql;
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':name', $this->name, PDO::PARAM_STR);
		$stmt->bindParam(':image', $this->image, PDO::PARAM_STR);
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$execute_result = $stmt->execute();
		
		if ($execute_result === false) {
			$this->error = true;
		}
		
		return $this;
			
	}
	
	public function setId($id) { $this->id = $id; return $this; }
	public function setName($var) { $this->name = $var; return $this; }
	public function setImage($var) { if ($var !== false) { $this->image = $var; } return $this; }

	
	public function toArray() { 
		$result = null;
		
		if (!$this->error) {
			$result = array(
				'id' => $this->id,	
				'name' => $this->name,
				'image' => $this->image,
				'count' => $this->count
			);
		}
		
		return $result;
	}
}