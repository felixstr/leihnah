<?php
class CategoryMapper extends Mapper {
	
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
				o.`active` = 1 AND
				o.`deleted` = 0
			GROUP BY `pk_category`
			ORDER BY `position`
		";
		$stmt = $this->db->prepare($sql);
		$stmt->execute();
		
		
		$results = array();
		while($row = $stmt->fetch()) {
			$results[] = CategoryEntity::factory($this->db)
				->loadRow($row)
				->toArray();
		}
		
		return $results;
	}
	

}