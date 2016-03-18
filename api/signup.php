<?php
	include('./config/connection.php');
	$data = json_decode(file_get_contents('php://input'));
	
	$username = $data->username;
	$password = $data->password;
	
	$q = 'INSERT INTO user (email, password) VALUES (:email, :password)';
	$query = $db->prepare($q);
	
	$execute = $query->execute(array(
		':email' => $username,
		':password' => password_hash($password, PASSWORD_BCRYPT, array('cost' => 12))
	));
	
	echo json_encode($username);
?>
