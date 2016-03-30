<?php
/*
	
	echo print_r($_FILES);
	echo print_r($_POST);
	echo print_r($_GET);
	
*/
	$filename = $_FILES['file']['name'];
	$tags = $_POST['text'];
	$destination = '../assets/img/'.$filename;
	move_uploaded_file( $_FILES['file']['tmp_name'] , $destination );
	
	echo json_encode(array('filename' => $filename));
?>
