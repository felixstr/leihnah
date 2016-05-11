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
				(NOW() between l.getDatetime and l.backDatetime) AS inTime,
				(NOW() >= l.getDatetime) AS getPast,
				(NOW() > l.backDatetime) AS backPast
			FROM lend AS l
			WHERE 
				lendDeleted = 0 AND 
				fk_userLend = :userLendId
			ORDER BY changeDate DESC, l.backDatetime
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
			
			$lendEntity = LendEntity::factory($this->db)->loadRow($row);
			
			if ($row['state'] == 'request') {
				$timesuggestions = $lendEntity->getTimeSuggestions();
				if ($timesuggestions['get'][0]['date'] <= date('Y-m-d H:i:s')) {
					$status = 'past';
				}
			}
				
			$results[$status][] = $lendEntity->toArray();
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
				(NOW() between l.getDatetime and l.backDatetime) AS inTime,
				(NOW() >= l.getDatetime) AS getPast,
				(NOW() > l.backDatetime) AS backPast
			FROM lend AS l
			WHERE 
				borrowDeleted = 0 AND 
				fk_userBorrow = :userBorrowId
			ORDER BY changeDate DESC, l.backDatetime
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
			
			
			$lendEntity = LendEntity::factory($this->db)->loadRow($row);
			
			if ($row['state'] == 'request') {
				$timesuggestions = $lendEntity->getTimeSuggestions();
				if ($timesuggestions['get'][0]['date'] <= date('Y-m-d H:i:s')) {
					$status = 'past';
				}
			}
			
			$results[$status][] = $lendEntity->toArray();
			
		}
		
		return $results;
	}
	
	public function setUserId($userId){ $this->userId = $userId; return $this;}
	
	public function checkUpdate() {
		$result = false;
		
		$sql = "
			SELECT 
				l.pk_lend AS id
			FROM lend AS l
			WHERE 
				l.changeDate > (NOW() - INTERVAL 10 SECOND)
		";
		$stmt = $this->db->prepare($sql);
		$stmt->execute();
		
		$results = $stmt->fetchAll();
		
		if (count($results) > 0) {
			$result = true;
		}
		
		
		return $result;
	}

}