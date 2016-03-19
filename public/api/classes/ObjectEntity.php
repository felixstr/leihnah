<?php
class ObjectEntity {
	protected $id;
	protected $name;
	protected $description;
	protected $condition;
	
	/**
	* Accept an array of data matching properties of this class
	* and create the class
	*
	* @param array $data The data to use to create
	*/
	public function __construct(array $data) {
		// no id if we're creating
		if(isset($data['id'])) {
			$this->id = $data['id'];
		}
		$this->name = $data['name'];
		$this->description = $data['description'];
		$this->condition = $data['condition'];
	}
	
	public function getId() { return $this->id; }
	public function getName() { return $this->name; }
	public function getDescription() { return $this->description; }
	public function getCondition() { return $this->condition; }
	
	public function toArray() { 
		$array = array(
			'id' => $this->id,	
			'name' => $this->name,	
			'description' => $this->description,	
			'condition' => $this->condition	
		);
		
		return $array;
	}
}