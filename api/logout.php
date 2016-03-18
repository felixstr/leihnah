<?php
	include('./config/connection.php');
	$data = json_decode(file_get_contents('php://input'));
	
	$token = $data->token;
	
	$q = "UPDATE user SET token = NULL WHERE token = :token";
	$query = $db->prepare($q);
	$execute = $query->execute(array(
		':token' => $token
	));
	
	echo json_encode(array('logged-out' => true));
?>
