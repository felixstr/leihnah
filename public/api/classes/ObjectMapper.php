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
			WHERE fk_user = :userId
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
	
	/**
	* Get one ticket by its ID
	*
	* @param int $ticket_id The ID of the ticket
	* @return TicketEntity  The ticket
	*/
	/*
	public function getTicketById($ticket_id) {
	$sql = "SELECT t.id, t.title, t.description, c.component
	from tickets t
	join components c on (c.id = t.component_id)
	where t.id = :ticket_id";
	$stmt = $this->db->prepare($sql);
	$result = $stmt->execute(["ticket_id" => $ticket_id]);
	if($result) {
	return new TicketEntity($stmt->fetch());
	}
	}
	public function save(TicketEntity $ticket) {
	$sql = "insert into tickets
	(title, description, component_id) values
	(:title, :description,
	(select id from components where component = :component))";
	$stmt = $this->db->prepare($sql);
	$result = $stmt->execute([
	"title" => $ticket->getTitle(),
	"description" => $ticket->getDescription(),
	"component" => $ticket->getComponent(),
	]);
	if(!$result) {
	throw new Exception("could not save record");
	}
	}
	*/
}