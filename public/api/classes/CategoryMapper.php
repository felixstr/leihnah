<?php
class CategoryMapper extends Mapper {
	
	private $settlementId = 1;
	private $restriction = false;
	
	public static function factory($db) {
		return new CategoryMapper($db);
	}
	
	public function get() {
		$sql = "
			SELECT 
				category.*,
				pk_category AS id,
				count(`pk_object`) AS count
			FROM category
			LEFT JOIN object AS o ON
				o.`fk_category` = `pk_category` AND
				o.`image_1` != '' AND
				o.`active` = 1 AND
				o.`deleted` = 0
			JOIN user AS u ON
				o.`fk_user` = u.`pk_user`
			
			".($this->restriction && $this->settlementId != null ? 'WHERE u.fk_settlement = :settlementId' : '')."
			
			GROUP BY `pk_category`
			ORDER BY `position`
		";
		$stmt = $this->db->prepare($sql);
		if ($this->restriction && $this->settlementId != null) {
			$stmt->bindParam(':settlementId', $this->settlementId, PDO::PARAM_INT);
		}
		$stmt->execute();
		
		
		$results = array();
		while($row = $stmt->fetch()) {
			$results[] = CategoryEntity::factory($this->db)
				->loadRow($row)
				->toArray();
		}
		
		return $results;
	}
	
	public function setSettlementId($value){ $this->settlementId = $value; return $this;}
}