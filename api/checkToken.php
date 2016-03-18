<?php
	include('./config/connection.php');
	$data = json_decode(file_get_contents('php://input'));
	
	$token = $data->token;
	
	$check = $db->query("SELECT email FROM user WHERE token = '$token'");
	$check = $check->fetchAll();
	
	$result = array('authenticated' => false, 'username' => '');
	if (count($check) == 1) {
		$result['authenticated'] = true;
		$result['username'] = $check[0]['email'];
	}
		
	
	echo json_encode($result);
?>
