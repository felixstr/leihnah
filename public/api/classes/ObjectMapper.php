<?php
class ObjectMapper extends Mapper {
	
	public static function factory($db) {
		return new ObjectMapper($db);
	}
	
	public function getByUserId($userId) {
		$sql = "
			SELECT 
				*,
				pk_object AS id,
				fk_user AS userId,
				fk_category AS categoryId
			FROM object
			WHERE 
				fk_user = :userId AND
				deleted = 0
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
		$stmt->execute();
		
		
		$results = array();
		while($row = $stmt->fetch()) {
			$results[] = ObjectEntity::factory($this->db)
				->loadRow($row)
				->toArray();
		}
		
		return $results;
	}
	
	public function get() {
		$sql = "
			SELECT 
				*,
				pk_object AS id,
				fk_user AS userId,
				fk_category AS categoryId
			FROM object
			WHERE deleted = 0 AND active = 1
		";
		$stmt = $this->db->prepare($sql);
		$stmt->execute();
		
		
		$results = array();
		while($row = $stmt->fetch()) {
			$results[] = ObjectEntity::factory($this->db)
				->loadRow($row)
				->toArray();
		}
		
		return $results;
	}
}