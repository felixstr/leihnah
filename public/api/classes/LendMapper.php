<?php
class LendMapper extends Mapper {
	private $userId = 0;
	
	public static function factory($db) {
		return new LendMapper($db);
	}

	public function getLends() {
		$sql = "
			SELECT 
				l.*,
				l.pk_lend AS id,
				l.fk_object AS objectId,
				l.fk_userBorrow AS userBorrowId,
				l.fk_userLend AS userLendId,
				l.fk_postit AS postitId,
				(DATE(NOW()) between l.getDatetime and l.backDatetime) AS inTime,
				(DATE(NOW()) >= l.getDatetime) AS getPast,
				(DATE(NOW()) > l.backDatetime) AS backPast
			FROM lend AS l
			WHERE 
				deleted = 0 AND 
				fk_userLend = :userLendId
			ORDER BY changeDate DESC
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':userLendId', $this->userId, PDO::PARAM_INT);
		$stmt->execute();
		
		
		$results = array();
		$results['mark'] = 0;
		while($row = $stmt->fetch()) {


			if ($row['state'] == 'closed') {
				$status = 'past';
			} else {
				$status = 'current';
			}
			
			if ($row['state'] == 'request' || $row['state'] == 'direct') {
				$results['mark']++;
			}
			
			$results[$status][] = LendEntity::factory($this->db)
				->loadRow($row)
				->toArray();
		}
		
		return $results;
	}
	
	public function getBorrows() {
		$sql = "
			SELECT 
				l.*,
				l.pk_lend AS id,
				l.fk_object AS objectId,
				l.fk_userBorrow AS userBorrowId,
				l.fk_userLend AS userLendId,
				l.fk_postit AS postitId,
				(DATE(NOW()) between l.getDatetime and l.backDatetime) AS inTime,
				(DATE(NOW()) >= l.getDatetime) AS getPast,
				(DATE(NOW()) > l.backDatetime) AS backPast
			FROM lend AS l
			WHERE 
				deleted = 0 AND 
				fk_userBorrow = :userBorrowId
			ORDER BY changeDate DESC
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':userBorrowId', $this->userId, PDO::PARAM_INT);
		$stmt->execute();
		
		
		$results = array();
		$results['mark'] = 0;
		while($row = $stmt->fetch()) {
			
			
			if ($row['state'] == 'closed') {
				$status = 'past';
			} else {
				$status = 'current';
			}
			
			if ($row['state'] == 'answered') {
				$results['mark']++;
			}
			
			
			$results[$status][] = LendEntity::factory($this->db)
				->loadRow($row)
				->toArray();
		}
		
		return $results;
	}
	
	public function setUserId($userId){ $this->userId = $userId; return $this;}

}