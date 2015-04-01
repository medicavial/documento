<?php

	$db_server = 'GEN';
	$db_name = 'MV';
	$db_usr = 'acceso';
	$db_pass = 'ACc3soMv';
	$dsn = "Driver={SQL Server Native Client 11.0};Server=$db_server;Database=$db_name;Trusted_Connection=yes;charset=UTF-8";
	$con = odbc_connect($dsn,'','');

	$$nombre_fichero = 'clientes.csv';

	
	$result = mysql_query("SHOW COLUMNS FROM ".$db_tabla."");
	$i = 0;
	if (mysql_num_rows($result) > 0) {
		while ($row = mysql_fetch_assoc($result)) {
			$salida_cvs .= $row['Field'].",";
			$i++;
		}
	}
	$salida_cvs .= "\n";
	$values = mysql_query("SELECT * FROM ".$db_tabla."");
	while ($rowr = mysql_fetch_row($values)) {
		for ($j=0;$j<$i;$j++) {
			$salida_cvs .= $rowr[$j].", ";
		}
		$salida_cvs .= "\n";
	}

	header("Content-type: application/vnd.ms-excel");
	header("Content-disposition: csv" . date("Y-m-d") . ".csv");
	header( "Content-disposition: filename=".$nombre_fichero.".csv");
	print $salida_cvs;
	exit;

?>