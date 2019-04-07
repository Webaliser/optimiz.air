<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST");
	header("Access-Control-Max-Age: 1000");
	header("Access-Control-Allow-Headers: x-requested-with, x-file-name, x-file-size, x-index, x-total, x-hash, Content-Type, origin, authorization, accept, client-security-token");

	$uploadFolder = realpath('./uploaded');

	$filename   = $_SERVER['HTTP_X_FILE_NAME'];
	$filesize   = $_SERVER['HTTP_X_FILE_SIZE'];
	$filetype   = $_SERVER['HTTP_X_FILE_TYPE'];
	$index      = intval($_SERVER['HTTP_X_INDEX']);
	$total      = intval($_SERVER['HTTP_X_TOTAL']);

	$input = fopen("php://input", "r");
	file_put_contents($uploadFolder . '/' . $filename, $input, FILE_APPEND);
	if ($index == $total) {
		$file = file_get_contents($uploadFolder . '/' . $filename);
		$file = base64_decode($file);
		file_put_contents($uploadFolder . '/' . $filename, $file);
		unset($file);
	}
	echo json_encode([
		"uploaded" => true,
		"chunk" => $index,
		"total" => $total,
		"name" => $filename
	]);
?>
