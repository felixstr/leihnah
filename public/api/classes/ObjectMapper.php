<?php
class ObjectMapper extends Mapper {
	
	private $orderBy = 'createDate';
	private $sort = 'ASC';
	private $limit = PHP_INT_MAX;
	
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
			ORDER BY createDate DESC
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
				o.*,
				o.pk_object AS id,
				o.fk_user AS userId,
				o.fk_category AS categoryId,
				count(`pk_view`) AS viewCount
			FROM object AS o
			LEFT JOIN view ON
				`fk_object` = `pk_object`
			WHERE deleted = 0 AND active = 1
			GROUP BY `pk_object`
			ORDER BY $this->orderBy $this->sort
			LIMIT :limit
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':limit', $this->limit, PDO::PARAM_INT);
		$stmt->execute();
		
// 		echo $this->limit;
		
		$results = array();
		while($row = $stmt->fetch()) {
// 			echo '<pre>'.print_r($row, true).'</pre>';
// 			echo $row['name'].'</br>';
			
			$results[] = ObjectEntity::factory($this->db)
				->loadRow($row)
				->toArray();
		}
		
		return $results;
	}
	
	public function setOrderByName(){ $this->orderBy = 'name'; return $this;}
	public function setOrderByViewCount(){ $this->orderBy = 'viewCount'; return $this;}
	public function setSortDESC(){ $this->sort = 'DESC'; return $this;}
	public function setLimit($value){ $this->limit = $value; return $this;}
}