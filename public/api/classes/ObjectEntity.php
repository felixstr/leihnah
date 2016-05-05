<?php
class ObjectEntity {
	protected $id = 0;
	protected $userId = 0;
	protected $categoryId = 0;
	protected $active = 0;
	protected $name = '';
	protected $nameAlternatives = '';
	protected $description = '';
	protected $damage = '';
	protected $gift = false;
	protected $image_1 = false;
	protected $image_2 = false;
	protected $image_3 = false;
	
	protected $categoryEntity = null;
	protected $neighborEntity = null;
	
	protected $directContact_fixnetPhone = false;
	protected $directContact_person1_mail = false;
	protected $directContact_person1_phone = false;
	protected $directContact_person2_mail = false;
	protected $directContact_person2_phoen = false;
	
	protected $createDate = '';
	
	protected $viewCount = 0;
	
	protected $flagReservedDates = false;
	protected $reservedDates = [];
	
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
				*,
				pk_object AS id,
				fk_user AS userId,
				fk_category AS categoryId
			FROM object
			WHERE 
				pk_object = :id AND
				deleted = 0
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
		$this->active = $row['active'];
		$this->name = $row['name'];
		$this->nameAlternatives = $row['nameAlternatives'];
		$this->description = $row['description'];
		$this->damage = $row['damage'];
		$this->gift = $row['gift'];
		$this->image_1 = $row['image_1'];
		$this->image_2 = $row['image_2'];
		$this->image_3 = $row['image_3'];
		$this->directContact_fixnetPhone = $row['directContact_fixnetPhone'];
		$this->directContact_person1_mail = $row['directContact_person1_mail'];
		$this->directContact_person1_phone = $row['directContact_person1_phone'];
		$this->directContact_person2_mail = $row['directContact_person2_mail'];
		$this->directContact_person2_phone = $row['directContact_person2_phone'];
		$this->createDate = $row['createDate'];
		
		if (isset($row['viewCount'])) {	
			$this->viewCount = $row['viewCount'];
		}
		
		$this->neighborEntity = NeighborEntity::factory($this->db)
			->setUserId($this->userId)
			->load();
		
		$this->categoryEntity = CategoryEntity::factory($this->db)
			->setId($this->categoryId)
			->load();
			
		if ($this->flagReservedDates) {
			$this->reservedDates = $this->loadReservedDates();
		}
			
		return $this;
	}
	
	private function loadReservedDates() {
		$result = array();
		
		$sql = "
			SELECT 
				pk_lend as lendId,
				DATE_FORMAT(getDatetime, '%Y-%m-%d') as getDatetime,
				DATE_FORMAT(backDatetime, '%Y-%m-%d') as backDatetime
			FROM lend
			WHERE 
				fk_object = :id AND 
				getDatetime IS NOT NULL AND
				backDatetime >= NOW() AND 
				state != 'closed' AND
				deleted = 0
			ORDER BY getDatetime
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$stmt->execute();
		
		while($row = $stmt->fetch()) {
			$result = array_merge($result, $this->getDates($row['getDatetime'], $row['backDatetime']));	
		}
		
// 		echo print_r($result);	
		
		return $result;
	}
	
	private function getDates($startTime, $endTime) {
	    $day = 86400;
	    $format = 'Y-m-d';
	    $startTime = strtotime($startTime);
	    $endTime = strtotime($endTime);
	    $numDays = round(($endTime - $startTime) / $day) + 1;

	    $days = array();
	
	    for ($i = 0; $i < $numDays; $i++) {
	        $days[] = date($format, ($startTime + ($i * $day)));
	    }
	
	    return $days;
	}
	
	public function add() {
					
		$sql = "
			INSERT INTO
				object
			SET
				fk_user = :userId,
				active = :active,
				createDate = NOW(),
				deleted = 0
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':userId', $this->userId, PDO::PARAM_INT);
		$stmt->bindParam(':active', $this->active, PDO::PARAM_INT);
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
				active = :active,
				name = :name,
				nameAlternatives = :nameAlternatives,
				description = :description,
				damage = :damage,
				gift = :gift,
				image_1 = :image_1,
				image_2 = :image_2,
				image_3 = :image_3,
				directContact_fixnetPhone = :directContact_fixnetPhone,
				directContact_person1_mail = :directContact_person1_mail,
				directContact_person1_phone = :directContact_person1_phone,
				directContact_person2_mail = :directContact_person2_mail,
				directContact_person2_phone = :directContact_person2_phone,
				changeDate = NOW(),
				deleted = 0
			WHERE
				pk_object = :id
		";
		
/*
		echo $sql;
		echo $this->name;
*/
		
// 		echo 'asdf'.$this->image_3;
		
		$stmt = $this->db->prepare($sql);
		
		$description = strip_tags($this->description);
		$damage = strip_tags($this->damage);
		
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$stmt->bindParam(':categoryId', $this->categoryId, PDO::PARAM_INT);
		$stmt->bindParam(':name', $this->name, PDO::PARAM_STR);
		$stmt->bindParam(':nameAlternatives', $this->nameAlternatives, PDO::PARAM_STR);
		$stmt->bindParam(':active', $this->active, PDO::PARAM_INT);
		$stmt->bindParam(':description', $description, PDO::PARAM_STR);
		$stmt->bindParam(':damage', $damage, PDO::PARAM_STR);
		$stmt->bindParam(':gift', $this->gift, PDO::PARAM_STR);
		$stmt->bindParam(':image_1', $this->image_1, PDO::PARAM_STR);
		$stmt->bindParam(':image_2', $this->image_2, PDO::PARAM_STR);
		$stmt->bindParam(':image_3', $this->image_3, PDO::PARAM_STR);
		$stmt->bindParam(':directContact_fixnetPhone', $this->directContact_fixnetPhone, PDO::PARAM_INT);
		$stmt->bindParam(':directContact_person1_mail', $this->directContact_person1_mail, PDO::PARAM_INT);
		$stmt->bindParam(':directContact_person1_phone', $this->directContact_person1_phone, PDO::PARAM_INT);
		$stmt->bindParam(':directContact_person2_mail', $this->directContact_person2_mail, PDO::PARAM_INT);
		$stmt->bindParam(':directContact_person2_phone', $this->directContact_person2_phone, PDO::PARAM_INT);
		$execute_result = $stmt->execute();
		
		if ($execute_result === false) {
			$this->error = true;
		}
		
		return $this;
			
	}
	
	public function delete() {
		$result = false;

		if ($this->userId == Authentication::getUser()->getId()) {
		
			$sql = "
				UPDATE
					object
				SET
					deleted = 1,
					deleteDate = NOW()
				WHERE
					pk_object = :id
			";
			
			$stmt = $this->db->prepare($sql);
			$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
			$result = $stmt->execute();
			
			if ($result === false) {
				$this->error = true;
			}
		}
		
		return $result;
			
	}
	
	public function getId() { return $this->id; }
	public function getUserId() { return $this->userId; }
	public function getCategoryId() { return $this->categoryId; }
	public function getName() { return $this->name; }
	public function getDescription() { return $this->description; }
	public function getDamage() { return $this->damage; }
	

	public function setId($value){ $this->id = $value; return $this;	}
	public function setUserId($value){ $this->userId = $value; return $this; }
	public function setCategoryId($value){ $this->categoryId = $value; return $this; }
	public function setActive($value){ $this->active = $value ? 1 : 0; return $this; }
	public function setName($value){ $this->name = $value; return $this; }
	public function setNameAlternatives($value){ $this->nameAlternatives = $value; return $this; }
	public function setDescription($value){ $this->description = $value; return $this; }
	public function setDamage($value){ $this->damage = $value; return $this; }
	public function setGift($value){$this->gift = $value ? 1 : 0; return $this;}
	public function setImage_1($value){ $this->image_1 = $value; return $this;}
	public function setImage_2($value){  $this->image_2 = $value;  return $this;}
	public function setImage_3($value){  $this->image_3 = $value;  return $this;}

	public function setDirectContact_fixnetPhone($value) { $this->directContact_fixnetPhone = ($value == 'yes') ? 1 : 0; return $this;}
	public function setDirectContact_person1_mail($value) { $this->directContact_person1_mail = ($value == 'yes') ? 1 : 0; return $this;}
	public function setDirectContact_person1_phone($value) { $this->directContact_person1_phone = ($value == 'yes') ? 1 : 0; return $this;}
	public function setDirectContact_person2_mail($value) { $this->directContact_person2_mail = ($value == 'yes') ? 1 : 0; return $this;}
	public function setDirectContact_person2_phone($value) { $this->directContact_person2_phone = ($value == 'yes') ? 1 : 0; return $this;}
	
	public function enableLoadReservedDates() {  $this->flagReservedDates = true;  return $this; }
	
	public function toArray() { 
		
		
		$array = array(
			'id' => $this->id,	
			'name' => $this->name,	
			'nameAlternatives' => $this->nameAlternatives,	
			'active' => $this->active == 1,	
			'description' => $this->description,	
			'descriptionFormatted' => nl2br($this->description),	
			'damage' => $this->damage,
			'gift' => $this->gift == 1,
			'image_1' => $this->image_1,	
			'image_2' => $this->image_2,
			'image_3' => $this->image_3,
			'categoryId' => $this->categoryId,
			'directContact_fixnetPhone' => $this->directContact_fixnetPhone == 1,
			'directContact_person1_mail' => $this->directContact_person1_mail == 1,
			'directContact_person1_phone' => $this->directContact_person1_phone == 1,
			'directContact_person2_mail' => $this->directContact_person2_mail == 1,
			'directContact_person2_phone' => $this->directContact_person2_phone == 1,
			'neighbor' => $this->neighborEntity->toArray(),
			'category' => $this->categoryEntity->toArray(),
			'viewCount' => $this->viewCount,
			'createDate' => $this->createDate,
			'reservedDates' => $this->reservedDates
		);
		
		
		return $array;
	}
}