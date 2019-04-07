<?php
    ob_start();
    include('templates/index.phtml');
    $output = ob_get_clean();
	echo $output;
?>