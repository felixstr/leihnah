<?php
class ObjectViewEntity {
	protected $object = null;

	protected $error = false;
	
	protected $db;
	
	public static function factory($db) {
		return new ObjectViewEntity($db);
	}
	
	public function __construct($db) {
		$this->db = $db;
	}
	
	/**
	* trackt objekt nur alle 5minuten vom gleichen user
	*/
	public function track() {
		
		$userId = Authentication::getUser()->getId();
		$objectId = $this->object->getId();
		
		$sql = "
			SELECT
				datetime
			FROM
				view
			WHERE
				fk_object = :objectId AND
				fk_user = :userId
			ORDER BY
				datetime DESC
			LIMIT 1
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
		$stmt->bindParam(':objectId', $objectId, PDO::PARAM_INT);
		$execute_result = $stmt->execute();
		$results = $stmt->fetchAll();
		
		
		$check = false;
		if (count($results) != 0){
			$date = strtotime($results[0]['datetime']);

			$compare = strtotime("-1 minutes");
			
			if ($date < $compare) {
				$check = true;
			}
		}
		
		if ((count($results) == 0 || $check)){
		
			$sql = "
				INSERT INTO
					view
				SET
					fk_object = :objectId,
					fk_user = :userId,
					datetime = NOW()
			";
			$stmt = $this->db->prepare($sql);
			
			$stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
			$stmt->bindParam(':objectId', $objectId, PDO::PARAM_INT);
			$execute_result = $stmt->execute();
			
			if ($execute_result === false) {
				$this->error = true;
			} 
		
		}
		
		return $this;
			
	}
	
	public function set($object) { $this->object = $object; return $this; }
}