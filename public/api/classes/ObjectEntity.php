<?php
class ObjectEntity {
	protected $id = 0;
	protected $userId = 0;
	protected $categoryId = 0;
	protected $name = '';
	protected $description = '';
	protected $damage = '';
	protected $gift = false;
	protected $image_1 = false;
	protected $image_2 = false;
	protected $image_3 = false;
	
	protected $categoryEntity = null;
	protected $neighborEntity = null;
	
	protected $error = false;
	
	protected $db;
	
	public static function factory($db) {
		return new ObjectEntity($db);
	}
	
	public function __construct($db) {
		$this->db = $db;
	}
	
	public function load() {	
		
		$sql = "
			SELECT 
				pk_object AS id,
				fk_user AS userId,
				fk_category AS categoryId,
				name,
				description,
				damage,
				gift,
				image_1,
				image_2,
				image_3
			FROM object
			WHERE pk_object = :id
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
		$this->userId = $row['userId'];
		$this->categoryId = $row['categoryId'];
		$this->name = $row['name'];
		$this->description = $row['description'];
		$this->damage = $row['damage'];
		$this->gift = $row['gift'];
		$this->image_1 = $row['image_1'];
		$this->image_2 = $row['image_2'];
		$this->image_3 = $row['image_3'];
		
		$this->neighborEntity = NeighborEntity::factory($this->db)
			->setUserId($this->userId)
			->load();
		
		$this->categoryEntity = CategoryEntity::factory($this->db)
			->setId($this->categoryId)
			->load();
			
		return $this;
	}
	
	public function add() {
					
		$sql = "
			INSERT INTO
				object
			SET
				fk_user = :userId,
				fk_category = :categoryId,
				name = :name,
				description = :description,
				damage = :damage,
				gift = :gift,
				image_1 = :image_1,
				image_2 = :image_2,
				image_3 = :image_3,
				createDate = NOW()
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':userId', $this->userId, PDO::PARAM_INT);
		$stmt->bindParam(':categoryId', $this->categoryId, PDO::PARAM_STR);
		$stmt->bindParam(':name', $this->name, PDO::PARAM_STR);
		$stmt->bindParam(':description', $this->description, PDO::PARAM_STR);
		$stmt->bindParam(':damage', $this->damage, PDO::PARAM_STR);
		$stmt->bindParam(':gift', $this->gift, PDO::PARAM_STR);
		$stmt->bindParam(':image_1', $this->image_1, PDO::PARAM_STR);
		$stmt->bindParam(':image_2', $this->image_2, PDO::PARAM_STR);
		$stmt->bindParam(':image_3', $this->image_3, PDO::PARAM_STR);
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
				object
			SET
				fk_category = :categoryId,
				name = :name,
				description = :description,
				damage = :damage,
				gift = :gift,
				image_1 = :image_1,
				image_2 = :image_2,
				image_3 = :image_3,
				changeDate = NOW()
			WHERE
				pk_object = :id
		";
		
/*
		echo $sql;
		echo $this->name;
*/
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$stmt->bindParam(':categoryId', $this->categoryId, PDO::PARAM_INT);
		$stmt->bindParam(':name', $this->name, PDO::PARAM_STR);
		$stmt->bindParam(':description', $this->description, PDO::PARAM_STR);
		$stmt->bindParam(':damage', $this->damage, PDO::PARAM_STR);
		$stmt->bindParam(':gift', $this->gift, PDO::PARAM_STR);
		$stmt->bindParam(':image_1', $this->image_1, PDO::PARAM_STR);
		$stmt->bindParam(':image_2', $this->image_2, PDO::PARAM_STR);
		$stmt->bindParam(':image_3', $this->image_3, PDO::PARAM_STR);
		$execute_result = $stmt->execute();
		
		if ($execute_result === false) {
			$this->error = true;
		}
		
		return $this;
			
	}
	
	public function getId() { return $this->id; }
	public function getCategoryId() { return $this->categoryId; }
	public function getName() { return $this->name; }
	public function getDescription() { return $this->description; }
	public function getDamage() { return $this->damage; }
	

	public function setId($value){ $this->id = $value; return $this;	}
	public function setUserId($value){ $this->userId = $value; return $this; }
	public function setCategoryId($value){ $this->categoryId = $value; return $this; }
	public function setName($value){ $this->name = $value; return $this; }
	public function setDescription($value){ $this->description = $value; return $this; }
	public function setDamage($value){ $this->damage = $value; return $this; }
	public function setGift($value){$this->gift = $value; return $this;}
	public function setImage_1($value){ if ($value !== false) { $this->image_1 = $value; } return $this;}
	public function setImage_2($value){ if ($value !== false) { $this->image_2 = $value; } return $this;}
	public function setImage_3($value){ if ($value !== false) { $this->image_3 = $value; } return $this;}

	
	
	public function toArray() { 
		
		
		$array = array(
			'id' => $this->id,	
			'name' => $this->name,	
			'description' => $this->description,	
			'damage' => $this->damage,
			'gift' => $this->gift == 1,
			'image_1' => $this->image_1,	
			'image_2' => $this->image_2,
			'image_3' => $this->image_3,
			'neighbor' => $this->neighborEntity->toArray(),
			'category' => $this->categoryEntity->toArray()
		);
		
/*
		echo 'asdf';
		echo print_r($array);
*/
		
		return $array;
	}
}