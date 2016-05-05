<?php
class LendEntity {
	protected $id = 0;
	protected $state = '';
	protected $objectId = 0;
	protected $userBorrowId = 0;
	protected $userLendId = 0;

	protected $lendText = '';
	protected $lendDatetime = '';
	
	protected $preferredContact_fixnetPhone = false;
	protected $preferredContact_person1_mail = false;
	protected $preferredContact_person1_phone = false;
	protected $preferredContact_person2_mail = false;
	protected $preferredContact_person2_phoen = false;	
	
	protected $requestText = '';
	protected $timeSuggestions = null;
	
	protected $answerText = null;
	protected $answerDatetime = null;
	
	protected $getDatetime = null;
	protected $backDatetime = null;
	protected $inTime = false;
	protected $getPast = false;
	protected $backPast = false;
	
	protected $confirmedDatetime = null;
	
	protected $directContactDatetime = false;
	
	protected $closedType = null;
	protected $closedText = '';
	protected $closedDatetime = '';
	
	protected $postitId = null;
	
	protected $neighborBorrowEntity = null;
	protected $objectEntity = null;
	protected $postitEntity = null;
	
	protected $error = false;
	
	protected $db;
	
	public static function factory($db) {
		return new LendEntity($db);
	}
	
	public function __construct($db) {
		$this->db = $db;
	}
	
	public function load() {	
		
		$sql = "
			SELECT 
				*,
				pk_lend AS id,
				fk_object AS objectId,
				fk_userBorrow AS userBorrowId,
				fk_userLend AS userLendId,
				fk_postit AS postitId,
				(NOW() between getDatetime and backDatetime) AS inTime,
				(NOW() >= getDatetime) AS getPast,
				(NOW() > backDatetime) AS backPast
			FROM lend
			WHERE 
				pk_lend = :id AND
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
		$this->state = $row['state'];
		$this->objectId = $row['objectId'];
		$this->userBorrowId = $row['userBorrowId'];
		$this->userLendId = $row['userLendId'];
		$this->requestText = $row['requestText'];
		$this->requestDatetime = $row['requestDatetime'];
		
		$this->preferredContact_fixnetPhone = $row['preferredContact_fixnetPhone'];
		$this->preferredContact_person1_mail = $row['preferredContact_person1_mail'];
		$this->preferredContact_person1_phone = $row['preferredContact_person1_phone'];
		$this->preferredContact_person2_mail = $row['preferredContact_person2_mail'];
		$this->preferredContact_person2_phone = $row['preferredContact_person2_phone'];
				
		$this->answerText = $row['answerText'];
		$this->answerDatetime = $row['answerDatetime'];
		$this->getDatetime = $row['getDatetime'];
		$this->backDatetime = $row['backDatetime'];
		$this->inTime = $row['inTime'];
		$this->getPast = $row['getPast'];
		$this->backPast = $row['backPast'];
		
		$this->confirmedDatetime = $row['confirmedDatetime'];
		$this->directContactDatetime = $row['directContactDatetime'];
		
		$this->closedText = $row['closedText'];
		
		$this->closedDatetime = $row['closedDatetime'];
		$this->closedType = $row['closedType'];
		$this->postitId = $row['postitId'];
		
		
		$this->neighborBorrowEntity = NeighborEntity::factory($this->db)
			->setUserId($this->userBorrowId)
			->load();
		
		$this->objectEntity = ObjectEntity::factory($this->db)
			->setId($this->objectId)
			->load();
		
		$this->neighborLendEntity = NeighborEntity::factory($this->db)
			->setUserId($this->userLendId)
			->load();
/*
		
		$this->postitEntity = ObjectEntity::factory($this->db)
			->setId($this->postitId)
			->load();
*/
			
		$this->timeSuggestions = $this->loadTimeSuggestions();
		
		return $this;
	}
	
	public function request() {
					
		$sql = "
			INSERT INTO
				lend
			SET
				fk_object = :objectId,
				fk_userBorrow = :userBorrowId,
				fk_userLend = :userLendId,
				requestText = :requestText,
				requestDatetime = NOW(),
				preferredContact_fixnetPhone = :preferredContact_fixnetPhone,
				preferredContact_person1_mail = :preferredContact_person1_mail,
				preferredContact_person1_phone = :preferredContact_person1_phone,
				preferredContact_person2_mail = :preferredContact_person2_mail,
				preferredContact_person2_phone = :preferredContact_person2_phone,
				deleted = 0,
				state = 'request',
				changeDate = NOW()
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':objectId', $this->objectId, PDO::PARAM_INT);
		$stmt->bindParam(':userBorrowId', $this->userBorrowId, PDO::PARAM_INT);
		$stmt->bindParam(':userLendId', $this->userLendId, PDO::PARAM_INT);
		$stmt->bindParam(':requestText', $this->requestText, PDO::PARAM_STR);
		$stmt->bindParam(':preferredContact_fixnetPhone', $this->preferredContact_fixnetPhone, PDO::PARAM_INT);
		$stmt->bindParam(':preferredContact_person1_mail', $this->preferredContact_person1_mail, PDO::PARAM_INT);
		$stmt->bindParam(':preferredContact_person1_phone', $this->preferredContact_person1_phone, PDO::PARAM_INT);
		$stmt->bindParam(':preferredContact_person2_mail', $this->preferredContact_person2_mail, PDO::PARAM_INT);
		$stmt->bindParam(':preferredContact_person2_phone', $this->preferredContact_person2_phone, PDO::PARAM_INT);
		$execute_result = $stmt->execute();
		
		if ($execute_result === false) {
			$this->error = true;
		} else {
			$this->id = $this->db->lastInsertId();
		}
		
		$this->updateSuggestions();
		
		
		return $this->id;
			
	}
	
	public function updateSuggestions() {
		
		if ($this->id > 0 && $this->timeSuggestions != null) {
			
			// delete old suggestion
			$sql = "
				DELETE FROM lendTimeSuggestion WHERE fk_lend = :lendId
			";
			$stmt = $this->db->prepare($sql);
			$stmt->bindParam(':lendId', $this->id, PDO::PARAM_INT);
			$execute_result = $stmt->execute();
			
			
			// insert new suggestion
			$sql = "
				INSERT INTO
					lendTimeSuggestion
				SET
					fk_lend = :lendId,
					date = :date,
					start = :from,
					end = :to,
					type = :type
			";
			$stmt = $this->db->prepare($sql);
			$stmt->bindParam(':lendId', $this->id, PDO::PARAM_INT);
				
			foreach ($this->timeSuggestions as $value) {	
				$stmt->bindParam(':date', $value['date'], PDO::PARAM_STR);
				$stmt->bindParam(':type', $value['type'], PDO::PARAM_STR);
				
				foreach ($value['times'] as $time) {
					$from = $time['from'].':00:00';
					$to = $time['to'].':00:00';
					
					$stmt->bindParam(':from', $from, PDO::PARAM_STR);
					$stmt->bindParam(':to', $to, PDO::PARAM_STR);
					
					$stmt->execute();
				}
				
			}
			
		} else {
			$this->error = true;
		}
		
		
	}
	
	private function loadTimeSuggestions() {
		
		$sql = "
			SELECT 
				pk_lendTimeSuggestion AS id,
				fk_lend AS lendId,
				date,
				type,
				TIME_FORMAT(start, '%H') as start,
				TIME_FORMAT(end, '%H') as end,
				TIME_FORMAT(TIMEDIFF(end,start), '%H') AS hours
			FROM lendTimeSuggestion
			WHERE 
				fk_lend = :id
			ORDER BY
				date, start
		";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$stmt->execute();
		
		$result = array();
		$spanne = array();
		while($row = $stmt->fetch()) {
			for ($i = 0; $i < $row['hours']; $i++) {
				$hour = ($row['start']+$i);
				$time = ($hour < 10 ? '0'.$hour : $hour ).':00';
				
				$result[$row['type']][$row['date']][$time] = 'ok'; 
				
				$time = ($hour < 10 ? '0'.$hour : $hour ).':30';
				$result[$row['type']][$row['date']][$time] = 'ok'; 
				
				
			}
			
			$spanne[$row['type']][$row['date']][] = array(
				'start' => $row['start'],
				'end' => $row['end']
			);
		}
		
		$result2 = array();
		foreach ($result as $type => $value) {
			$dateSum = array();
			foreach ($value as $date => $value2) {
				$times = array();
				
				$dateSum['date'] = $date;
				$dateSum['durations'] = $spanne[$type][$date];
				foreach ($value2 as $time => $value3) {
					$times[] = $time;
				}
				$dateSum['times'] = $times;
				
				$result2[$type][] = $dateSum;
			}
			
			
		}
		
// 		echo print_r($spanne);
// 		echo print_r($result2);
// 		echo print_r($result);
		
		return $result2;

		

	}
	
	public function answer() {
			
		$sql = "
			UPDATE
				lend
			SET
				answerText = :answerText,
				answerDatetime = NOW(),
				getDatetime = :getDatetime,
				backDatetime = :backDatetime,
				deleted = 0,
				state = 'answered',
				changeDate = NOW()
			WHERE
				pk_lend = :id
		";
		
/*
		echo $sql;
		echo $this->name;
*/
		
// 		echo 'asdf'.$this->image_3;
		
		$stmt = $this->db->prepare($sql);
		
/*
		$description = strip_tags($this->description);
		$damage = strip_tags($this->damage);
*/
		
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$stmt->bindParam(':answerText', $this->answerText, PDO::PARAM_STR);
		$stmt->bindParam(':getDatetime', $this->getDatetime, PDO::PARAM_STR);
		$stmt->bindParam(':backDatetime', $this->backDatetime, PDO::PARAM_STR);
		$execute_result = $stmt->execute();
		
		if ($execute_result === false) {
			$this->error = true;
		}
		
		return $this;
			
	}
	
	
	public function confirm() {
			
		$sql = "
			UPDATE
				lend
			SET
				confirmedDatetime = NOW(),
				deleted = 0,
				state = 'confirmed',
				changeDate = NOW()
			WHERE
				pk_lend = :id
		";
		

		$stmt = $this->db->prepare($sql);
			
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$execute_result = $stmt->execute();
		
		if ($execute_result === false) {
			$this->error = true;
		}
		
		return $this;
			
	}
	
	public function directContact() {
			
		$sql = "
			UPDATE
				lend
			SET
				directContactDatetime = NOW(),
				deleted = 0,
				state = 'direct',
				changeDate = NOW()
			WHERE
				pk_lend = :id
		";
		

		$stmt = $this->db->prepare($sql);
			
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$execute_result = $stmt->execute();
		
		if ($execute_result === false) {
			$this->error = true;
		}
		
		return $this;
	}
	
	public function close() {
			
		$sql = "
			UPDATE
				lend
			SET
				closedDatetime = NOW(),
				closedText = :closedText,
				closedType = :closedType,
				deleted = 0,
				state = 'closed',
				changeDate = NOW()
			WHERE
				pk_lend = :id
		";
		

		$stmt = $this->db->prepare($sql);
			
		$stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
		$stmt->bindParam(':closedText', $this->closedText, PDO::PARAM_STR);
		$stmt->bindParam(':closedType', $this->closedType, PDO::PARAM_STR);
		$execute_result = $stmt->execute();
		
		if ($execute_result === false) {
			$this->error = true;
		}
		
		return $this;
	}
	
	public function delete() {
		$result = false;

		if ($this->objectEntity->getUserId() == Authentication::getUser()->getId()) {
		
			$sql = "
				UPDATE
					lend
				SET
					deleted = 1,
					deleteDate = NOW()
				WHERE
					pk_lend = :id
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
	
	public function getUserBorrowId() { return $this->userBorrowId; }
	public function getUserLendId() { return $this->userLendId; }
	public function getObjectEntity() { return $this->objectEntity; }
	public function getState() { return $this->state; }
	public function getTimeSuggestions() { return $this->timeSuggestions; }
	
	public function getError() { return $this->error == true; }

	public function setId($value){ $this->id = $value; return $this;	}
	public function setObjectId($value){ $this->objectId = $value; return $this;	}
	public function setUserBorrowId($value){ $this->userBorrowId = $value; return $this; }
	public function setUserLendId($value){ $this->userLendId = $value; return $this; }
	public function setRequestText($value){ $this->requestText = $value; return $this; }
	public function setPreferredContact_fixnetPhone($value) { $this->preferredContact_fixnetPhone = ($value == 'yes') ? 1 : 0; return $this;}
	public function setPreferredContact_person1_mail($value) { $this->preferredContact_person1_mail = ($value == 'yes') ? 1 : 0; return $this;}
	public function setPreferredContact_person1_phone($value) { $this->preferredContact_person1_phone = ($value == 'yes') ? 1 : 0; return $this;}
	public function setPreferredContact_person2_mail($value) { $this->preferredContact_person2_mail = ($value == 'yes') ? 1 : 0; return $this;}
	public function setPreferredContact_person2_phone($value) { $this->preferredContact_person2_phone = ($value == 'yes') ? 1 : 0; return $this;}
	public function setTimeSuggestions($value) { $this->timeSuggestions = $value; return $this;}
	
	public function setAnswerText($value){ $this->answerText = $value; return $this; }

	public function setGetDatetime($value){ $this->getDatetime = $value; return $this; }
	public function setBackDatetime($value){ $this->backDatetime = $value; return $this; }
	
	public function setClosedText($value){ $this->closedText = $value; return $this; }
	public function setClosedType($value){ $this->closedType = $value; return $this; }
		
	
	public function toArray() { 
		
		
		$array = array(
			'id' => $this->id,	
			'state' => $this->state,	
			'requestText' => $this->requestText,	
			'requestDatetime' => $this->requestDatetime,	
			'preferredContact_fixnetPhone' => $this->preferredContact_fixnetPhone == 1,
			'preferredContact_person1_mail' => $this->preferredContact_person1_mail == 1,
			'preferredContact_person1_phone' => $this->preferredContact_person1_phone == 1,
			'preferredContact_person2_mail' => $this->preferredContact_person2_mail == 1,
			'preferredContact_person2_phone' => $this->preferredContact_person2_phone == 1,
			'answerText' => $this->answerText,	
			'answerDatetime' => $this->answerDatetime,	
			'getDatetime' => $this->getDatetime,
			'backDatetime' => $this->backDatetime,
			'inTime' => $this->inTime == 1,
			'getPast' => $this->getPast == 1,
			'backPast' => $this->backPast == 1,
			'confirmedDatetime' => $this->confirmedDatetime,	
			'directContactDatetime' => $this->directContactDatetime,
			'closedText' => $this->closedText,
			'closedDatetime' => $this->closedDatetime,
			'closedType' => $this->closedType,
			'neighborBorrow' => $this->neighborBorrowEntity->toArray(),
			'neighborLend' => $this->neighborLendEntity->toArray(),
			'object' => $this->objectEntity->toArray(),
			'timeSuggestions' => $this->timeSuggestions
		);
		
		
		return $array;
	}
}