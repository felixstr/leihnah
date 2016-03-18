<?php
	include('./config/connection.php');
	$data = json_decode(file_get_contents('php://input'));
	
	$username = $data->username;
	$password = $data->password;
	
	$userInfo = $db->query("SELECT password, email FROM user WHERE email = '$username'");
	$userInfo = $userInfo->fetchAll();
	$userInfo = $userInfo[0];
		
	$result = array('authenticated' => false, 'username' => '');
	
	$token = null;
	if (password_verify($password, $userInfo['password'])) {
		// logged in -> make token
// 		$token = $userInfo['email'].' | '.uniqid().uniqid().uniqid(); // @todo: better token
		$token = $userInfo['email'].'|'.bin2hex(openssl_random_pseudo_bytes(16));
		
		$q = "UPDATE user SET token = :token WHERE email = :email";
		$query = $db->prepare($q);
		$execute = $query->execute(array(
			':token' => $token,
			':email' => $userInfo['email']
		));
		
		$result['authenticated'] = true;
		$result['username'] = $userInfo['email'];
		$result['token'] = $token;
		
	}
		
	echo json_encode($result);
?>
