<?php

set_time_limit(3600);
ini_set('memory_limit', '-1');
date_default_timezone_set('America/Mexico_City'); //Ajustando zona horaria


require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

//inicializo arreglos para preparar la respuesta de salida
$traspasosResultado = array();
$valores = array();
$resultado = array();

//declaro una nueva aplicacion segun la ruta
$app = new \Slim\Slim();


function generaacceso($long=10) {
  
    $chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";  
    mt_srand((double)microtime()*1000000);   
    $i=0;  
    while ($i != $long) {  
        $rand=mt_rand() % strlen($chars);  
        $tmp=$chars[$rand];  
        $pass=$pass . $tmp;  
        $chars=str_replace($tmp, "", $chars);  
        $i++;  
    }  
    return strrev($pass);  

} 

function creaPDF($ruta,$archivo,$numeroarchivos){

	// Include the main TCPDF library (search for installation path).
	try {
		
		require_once('tcpdf/tcpdf.php');

		// create new PDF document
		$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

		// set header and footer fonts
		$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
		$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

		// set default monospaced font
		$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

		// set margins
		$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
		$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
		$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

		// set auto page breaks
		// $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

		// set image scale factor
		$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);


		// -------------------------------------------------------------------

		for ($i=1; $i = $numeroarchivos; $i++) { 

			$imagen = $ruta."\\".$archivo."ME02".$i.".jpg";

			if (file_exists($imagen)) {
				// add a page
				$pdf->AddPage();

				// set JPEG quality
				$pdf->setJPEGQuality(75);

				$pdf->SetXY(0, 15);
				$pdf->Image($imagen, '', '', 340, 400, '', '', 'T', false, 400, '', false, false, 1, false, false, false);

			}
			
		}
		
		// -------------------------------------------------------------------

		//Close and output PDF document
		$pdf->Output($ruta."\\".$archivo."ME02.pdf", 'F');

		return true;

	} catch (Exception $e) {
		
		return false;
	}

}


function generar_clave(){ 
       	$str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
		$cad = "";
		for($i=0;$i<12;$i++) {
		$cad .= substr($str,rand(0,62),1);
		}
		return $cad;

} 

function eliminarDirectorio($dirname,$only_empty=false) { 

	if (!is_dir($dirname))
	return false; 

	$dscan = array(realpath($dirname)); 
	$darr = array(); 

	while (!empty($dscan)) { 
	   $dcur = array_pop($dscan); 
	   $darr[] = $dcur; 
	   if ($d=opendir($dcur)) { 
	       while ($f=readdir($d)) { 
	           if ($f=='.' || $f=='..') 
	               continue; 
	           $f=$dcur.'/'.$f; 
	           if (is_dir($f)) 
	               $dscan[] = $f; 
	           else 
	               unlink($f); 
	       } 
	       closedir($d); 
	   } 
	} 

	$i_until = ($only_empty)? 1 : 0; 
   
	for ($i=count($darr)-1; $i>=$i_until; $i--) { 
	   echo "\nDeleting '".$darr[$i]."' ... "; 
	   if (rmdir($darr[$i])) 
	       echo "ok"; 
	   else 
	       echo "FAIL"; 
	} 

    return (($only_empty)? (count(scandir)<=2) : (!is_dir($dirname))); 

} 

function conectarActual(){

	$produccion = false;
	
	if ($produccion) {

		$db_server = 'GEN'; 
		$db_name = 'MV'; 


	}else{

		//Declaramos variables de conexion a SQL Server
		//Trusted_Connection=yes;
		$db_server = 'GEN';
		$db_name = 'MV2';

		$db_usr = 'acceso';
		$db_pass = 'ACc3soMv';

	}

	$dsn = "Driver={SQL Server Native Client 11.0};Server=$db_server;Database=$db_name;Trusted_Connection=yes;charset=UTF-8";

	$con = odbc_connect($dsn,'','');

	//regresa la conexion
	return $con;

}

//funcion para conectar a Mysql 
function conectarMySQL(){

	$dbhost="www.medicavial.net";
    $dbuser="medica_webusr";
    $dbpass="tosnav50";
    $dbname="medica_registromv";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

function BuscaDocumento($folio){

	 	$conexion = conectarActual();

	    if(!$conexion) {

		    die('Something went wrong while connecting to MSSQL');

		}else{
			

			$sql = "SELECT DOC_claveint FROM Documento WHERE DOC_folio = '$folio' ";

						// FLD_AROrec = $arearecibe, USU_rec = $usuariorecibe, FLD_fechaRec = '$fecha' 
						// USU_activo = $usuariorecibe

			$rs = odbc_exec($conexion,$sql); 

			$valor = odbc_result($rs,"DOC_claveint");

			return $valor;
		}

}

//funcion para sacar daatos de un archivos
function filedata($path) {
        // Vaciamos la caché de lectura de disco
        clearstatcache();
        // Comprobamos si el fichero existe
        $data["exists"] = is_file($path);
        // Comprobamos si el fichero es escribible
        $data["writable"] = is_writable($path);
        // Leemos los permisos del fichero
        $data["chmod"] = ($data["exists"] ? substr(sprintf("%o", fileperms($path)), -4) : FALSE);
        // Extraemos la extensión, un sólo paso
        $data["ext"] = substr(strrchr($path, "."),1);
        // Primer paso de lectura de ruta
        $data["path"] = array_shift(explode(".".$data["ext"],$path));
        // Primer paso de lectura de nombre
        $data["name"] = array_pop(explode("/",$data["path"]));
        // Ajustamos nombre a FALSE si está vacio
        $data["name"] = ($data["name"] ? $data["name"] : FALSE);
        // Ajustamos la ruta a FALSE si está vacia
        $data["path"] = ($data["exists"] ? ($data["name"] ? realpath(array_shift(explode($data["name"],$data["path"]))) : realpath(array_shift(explode($data["ext"],$data["path"])))) : ($data["name"] ? array_shift(explode($data["name"],$data["path"])) : ($data["ext"] ? array_shift(explode($data["ext"],$data["path"])) : rtrim($data["path"],"/")))) ;
        // Ajustamos el nombre a FALSE si está vacio o a su valor en caso contrario
        $data["filename"] = (($data["name"] OR $data["ext"]) ? $data["name"].($data["ext"] ? "." : "").$data["ext"] : FALSE);
        // Devolvemos los resultados
        return $data;
}

//funcion que retorna un arreglo del contenido en folder de folios Qualitas
function archivos($folio, $fecha){

	$MesNro = date('m', strtotime($fecha));
	$DiaNro = date('d', strtotime($fecha));
	$AnyoNro = date('Y', strtotime($fecha));
	

	if($MesNro=='01'){ 
		$MesNro="1"; 
	} 

	if($MesNro=='02'){ 
		$MesNro="2"; 
	} 

	if($MesNro=='03'){ 
		$MesNro="3"; 
	} 

	if($MesNro=='04'){ 
		$MesNro="4"; 
	} 

	if($MesNro=='05'){ 
		$MesNro="5"; 
	} 

	if($MesNro=='06'){ 
		$MesNro="6"; 
	} 

	if($MesNro=='07'){ 
		$MesNro="7"; 
	} 

	if($MesNro=='08'){ 
		$MesNro="8"; 
	} 

	if($MesNro=='09'){ 
		$MesNro="9"; 
	} 

	//$ruta = "C:\\Users\\salcala.MEDICAVIAL\\Desktop\\MV\\QUALITAS\\". $AnyoNro . "\\" . $MesNro . "\\". $folio;
	//ruta en producción
	$ruta = "\\\\Eaa\\RENAUT\\10\\". $AnyoNro . "\\" . $MesNro . "\\". $folio;


	$encontrados = array();

	//verifica 
	if (file_exists($ruta)){

		$directorio = opendir($ruta); //ruta actual

		$encontrados['QS_07'] = 0;
		$encontrados['ME_024'] = 0;
		$encontrados['ME_023'] = 0;
		$encontrados['ME_022'] = 0;
		$encontrados['ME_021'] = 0;
		$encontrados['GN_19'] = 0;
		$encontrados['QS07'] = 0;
		$encontrados['ME021'] = 0;
		$encontrados['ME022'] = 0;
		$encontrados['ME023'] = 0;
		$encontrados['ME024'] = 0;
		$encontrados['ME02'] = 0;
		$encontrados['GN19'] = 0;
		$encontrados['nombre'] = '';

		while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
		{
		    if (!is_dir($archivo))//verificamos si es o no un directorio
		    {	
		    	//originales

		    	if (preg_match('/QS_07.jpg/' , $archivo)) {
		    		$encontrados['QS_07'] = 1;
		    		//$encontrados['nombre'] = $archivo;
		    	}

		    	if (preg_match('/ME_024.jpg/' , $archivo) == 1) {
		    		$encontrados['ME_024'] = 1;
		    		//$encontrados['nombre'] = $archivo;
		    	}

		    	if (preg_match('/ME_023.jpg/' , $archivo) == 1) {
		    		$encontrados['ME_023'] = 1;
		    		//$encontrados['nombre'] = $archivo;
		    	}

		    	if (preg_match('/ME_022.jpg/' , $archivo) == 1) {
		    		$encontrados['ME_022'] = 1;
		    		//$encontrados['nombre'] = $archivo;
		    	}


		    	if (preg_match('/ME_021.jpg/' , $archivo) == 1) {
		    		$encontrados['ME_021'] = 1;
		    		//$encontrados['nombre'] = $archivo;
		    	}

		    	if (preg_match('/GN_19.jpg/' , $archivo) == 1) {
		    		$encontrados['GN_19'] = 1;
		    		//$encontrados['nombre'] = $archivo;
		    	}

		    	//comprimidas

		    	if (preg_match('/QS07.jpg/' , $archivo) == 1) {
		    		$encontrados['QS07'] = 1;
		    		$encontrados['nombre'] = $archivo;
		    	}

		    	if (preg_match('/ME021.jpg/' , $archivo) == 1) {
		    		$encontrados['ME021'] = 1;
		    		$encontrados['nombre'] = $archivo;
		    	}

		    	if (preg_match('/ME022.jpg/' , $archivo) == 1) {
		    		$encontrados['ME022'] = 1;
		    		$encontrados['nombre'] = $archivo;
		    	}

		    	if (preg_match('/ME023.jpg/' , $archivo) == 1) {
		    		$encontrados['ME023'] = 1;
		    		$encontrados['nombre'] = $archivo;
		    	}

		    	if (preg_match('/ME024.jpg/' , $archivo) == 1) {
		    		$encontrados['ME024'] = 1;
		    		$encontrados['nombre'] = $archivo;
		    	}


		    	if (preg_match('/GN19.jpg/' , $archivo) == 1) {
		    		$encontrados['GN19'] = 1;
		    		$encontrados['nombre'] = $archivo;
		    	}

		    	if (preg_match( '/ME02.pdf/' , $archivo) == 1) {
		    		$encontrados['ME02'] = 1;
		    		$encontrados['nombre'] = $archivo;
		    	}

		    }


		}

	}else{

		$encontrados['QS_07'] = 0;
		$encontrados['ME_024'] = 0;
		$encontrados['ME_023'] = 0;
		$encontrados['ME_022'] = 0;
		$encontrados['ME_021'] = 0;
		$encontrados['GN_19'] = 0;
		$encontrados['QS07'] = 0;
		$encontrados['ME021'] = 0;
		$encontrados['ME022'] = 0;
		$encontrados['ME023'] = 0;
		$encontrados['ME024'] = 0;
		$encontrados['ME02'] = 0;
		$encontrados['GN19'] = 0;
		$encontrados['nombre'] = 'No existe carpeta';
	}

	return $encontrados;

}
//modulo para subir info de sql server a mysql 

$app->get('/altainfoweb', function(){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		

		//primero la consulta a sql server 

		$sql = "SELECT *
				FROM Lesion";

		$rs= odbc_exec($conexion,$sql); 


		$i = 0;


		$db = conectarMySQL();

	    if(!$db) {

		    die('Something went wrong while connecting to MSSQL');

		}else{

			while (odbc_fetch_row($rs)){ 

				$LES_clave  = odbc_result($rs,"LES_clave");
				$LES_nombre  = odbc_result($rs,"LES_nombre");
				$LES_pagoTotMed  = odbc_result($rs,"LES_pagoTotMed");
				$LES_pagoUnoMed  = odbc_result($rs,"LES_pagoUnoMed");
				$LES_pagoDosMed  = odbc_result($rs,"LES_pagoDosMed");
				$LES_pagoTresMed  = odbc_result($rs,"LES_pagoTresMed");
				$LES_importeEmp  = odbc_result($rs,"LES_importeEmp");
				$LES_claveEmp  = odbc_result($rs,"LES_claveEmp");
				$LES_semanas  = odbc_result($rs,"LES_semanas");
				$TLE_claveint  = odbc_result($rs,"TLE_claveint");
				$LES_activa  = odbc_result($rs,"LES_activa");


				
				//consulta para Mysql 
				//$sql = "UPDATE Unidad SET LOC_claveint = :lesion WHERE Uni_clave = :clave;";
        		$sql = "INSERT INTO LesionMV (
        			LES_clave
					,LES_nombre
					,LES_pagoTotMed
					,LES_pagoUnoMed
					,LES_pagoDosMed
					,LES_pagoTresMed
					,LES_importeEmp
					,LES_claveEmp
					,LES_semanas
					,TLE_claveint
					,LES_activa
				) VALUES (:LES_clave,:LES_nombre,:LES_pagoTotMed,:LES_pagoUnoMed,:LES_pagoDosMed,:LES_pagoTresMed,:LES_importeEmp,:LES_claveEmp,:LES_semanas,:TLE_claveint,:LES_activa)";

		        $temporal = $db->prepare($sql);

		        // $temporal->bindParam("clave", $clave, PDO::PARAM_INT);
		        // $temporal->bindParam("nombre", $nombre, PDO::PARAM_STR);

		        $temporal->bindParam("LES_clave", $LES_clave, PDO::PARAM_STR);
		        $temporal->bindParam("LES_nombre", $LES_nombre, PDO::PARAM_STR);
		        $temporal->bindParam("LES_pagoTotMed", $LES_pagoTotMed);
		        $temporal->bindParam("LES_pagoUnoMed", $LES_pagoUnoMed);
		        $temporal->bindParam("LES_pagoDosMed", $LES_pagoDosMed);
		        $temporal->bindParam("LES_pagoTresMed", $LES_pagoTresMed);
		        $temporal->bindParam("LES_importeEmp", $LES_importeEmp);
		        $temporal->bindParam("LES_claveEmp", $LES_claveEmp, PDO::PARAM_STR);
		        $temporal->bindParam("LES_semanas", $LES_semanas, PDO::PARAM_INT);
		        $temporal->bindParam("TLE_claveint", $TLE_claveint, PDO::PARAM_INT);
		        $temporal->bindParam("LES_activa", $LES_activa, PDO::PARAM_INT);
		        
		        
		        if ($temporal->execute()){
		            $respuesta = array('respuesta' => "Los Datos se guardaron Correctamente");
		        }else{
		            $respuesta = array('respuesta' => "Los Datos No se Guardaron Verifique su Información");
		        }

			}

		}
		//echo odbc_fetch_row($rs);

		echo "Termino";


	}
	
});


$app->get('/documentos/folios', function(){

	$conexionSQLserver = conectarActual();

	$conexion = conectarMySQL();

	$sql = "SELECT 	Expediente.Exp_folio as folio, EXP_fechaCaptura as fechacaptura , CASE when FAC_fecha = '1900-01-01 00:00:00' then null ELSE FAC_fecha END as fechafactura, FAC_serie AS serie, FAC_folio as facfolio , 
			CASE WHEN  Expediente.Cia_clave IN(35,36,37) THEN 'MULTIASISTENCIA' ELSE Cia_nombrecorto END AS Cliente FROM Expediente 
			INNER JOIN ExpedienteInfo ON ExpedienteInfo.EXP_folio = Expediente.Exp_folio
			INNER JOIN Compania ON Compania.Cia_clave = Expediente.Cia_clave
			WHERE Exp_cancelado = 0 and Expediente.Uni_clave <> 8 and Exp_fecreg between '2014-08-01' and '2014-10-31 23:59:59' order by Cliente limit 0,10000";


	$result = $conexion->query($sql);


	//recorremos consulta
	foreach ($result as $valor) {

		//obtenemos parametros para buscar en las carpetas
		$cliente = $valor['Cliente'];
		$fechaCaptura = $valor['fechacaptura'];
		$folio = $valor['folio'];

		$serie = $valor['serie'];
		$serie = $valor['facfolio'];

		$MesNro = date('m', strtotime($fechaCaptura));
		$DiaNro = date('d', strtotime($fechaCaptura));
		$AnyoNro = date('Y', strtotime($fechaCaptura));
		

		if($MesNro=='01'){ 
			$MesNro="ENERO"; 
		} 

		if($MesNro=='02'){ 
			$MesNro="FEBRERO"; 
		} 

		if($MesNro=='03'){ 
			$MesNro="MARZO"; 
		} 

		if($MesNro=='04'){ 
			$MesNro="ABRIL"; 
		} 

		if($MesNro=='05'){ 
			$MesNro="MAYO"; 
		} 

		if($MesNro=='06'){ 
			$MesNro="JUNIO"; 
		} 

		if($MesNro=='07'){ 
			$MesNro="JULIO"; 
		} 

		if($MesNro=='08'){ 
			$MesNro="AGOSTO"; 
		} 

		if($MesNro=='09'){ 
			$MesNro="SEPTIEMBRE"; 
		} 

		if($MesNro=='10'){ 
			$MesNro="OCTUBRE"; 
		} 

		if($MesNro=='11'){ 
			$MesNro="NOVIEMBRE"; 
		} 

		if($MesNro=='12'){ 
			$MesNro="DICIEMBRE"; 
		} 

		$fechacapturalarga = $DiaNro . " " . strtolower($MesNro) . " " . $AnyoNro;

		$ruta = "\\\\Aaa\\g\\SOPORTES\\". $cliente . "\\". $AnyoNro . "\\" . $MesNro . "\\". $fechacapturalarga  . "\\". strtolower($folio);

		$ruta = "\\\\Eaa\\medica\\Facturas\\PDF\\". $AnyoNro . "\\". $MesNro  . "\\" . $cliente . "\\". $folio ;
		

		$rs= odbc_exec($conexionSQLserver,$sqlS); 


		//verifica si la ruta o archivo existe
		if (file_exists($ruta)) {

			//abrimos el directorio
			$directorio = opendir($ruta);
			
			echo "<-" .  $ruta . "-><br>";


			while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
			{
			    
			    if (!is_dir($archivo))//verificamos si es o no un directorio
			    {	
			    	
			    	echo $archivo . "<br>";

			    }


			}


		}


	}

});


//busca categorias para tickets en web 
$app->get('/archivos', function(){

	$MesNro = date('m', strtotime($fecha));
	$DiaNro = date('d', strtotime($fecha));
	$AnyoNro = date('Y', strtotime($fecha));
	

	if($MesNro=='01'){ 
		$MesNro="1"; 
	} 

	if($MesNro=='02'){ 
		$MesNro="2"; 
	} 

	if($MesNro=='03'){ 
		$MesNro="3"; 
	} 

	if($MesNro=='04'){ 
		$MesNro="4"; 
	} 

	if($MesNro=='05'){ 
		$MesNro="5"; 
	} 

	if($MesNro=='06'){ 
		$MesNro="6"; 
	} 

	if($MesNro=='07'){ 
		$MesNro="7"; 
	} 

	if($MesNro=='08'){ 
		$MesNro="8"; 
	} 

	if($MesNro=='09'){ 
		$MesNro="9"; 
	} 

	//$ruta = "C:\\Users\\salcala.MEDICAVIAL\\Desktop\\MV\\QUALITAS\\". $AnyoNro . "\\" . $MesNro . "\\". $folio;
	//ruta en producción
	$ruta = "\\\\Eaa\\RENAUT\\10\\". $AnyoNro . "\\" . $MesNro . "\\". $folio;


	$encontrados = array();
	$directorio = opendir($ruta); //ruta actual

	$encontrados['QS_07'] = 0;
	$encontrados['ME_024'] = 0;
	$encontrados['ME_023'] = 0;
	$encontrados['ME_022'] = 0;
	$encontrados['ME_021'] = 0;
	$encontrados['GN_19'] = 0;
	$encontrados['QS07'] = 0;
	$encontrados['ME021'] = 0;
	$encontrados['ME022'] = 0;
	$encontrados['ME023'] = 0;
	$encontrados['ME024'] = 0;
	$encontrados['ME02'] = 0;
	$encontrados['GN19'] = 0;

	while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
	{
	    if (!is_dir($archivo))//verificamos si es o no un directorio
	    {	
	    	//originales
	    	//preg_match realiza una comparación archivos por nombre y verifica que contenga el parametro 1
	    	if (preg_match('/QS_07.jpg/' , $archivo)) {
	    		$encontrados['QS_07'] = 1;
	    	}

	    	if (preg_match('/ME_024.jpg/' , $archivo) == 1) {
	    		$encontrados['ME_024'] = 1;
	    	}

	    	if (preg_match('/ME_023.jpg/' , $archivo) == 1) {
	    		$encontrados['ME_023'] = 1;
	    	}

	    	if (preg_match('/ME_022.jpg/' , $archivo) == 1) {
	    		$encontrados['ME_022'] = 1;
	    	}


	    	if (preg_match('/ME_021.jpg/' , $archivo) == 1) {
	    		$encontrados['ME_021'] = 1;
	    	}

	    	if (preg_match('/GN_19.jpg/' , $archivo) == 1) {
	    		$encontrados['GN_19'] = 1;
	    	}

	    	//comprimidas

	    	if (preg_match('/QS07.jpg/' , $archivo) == 1) {
	    		$encontrados['QS07'] = 1;
	    	}

	    	if (preg_match('/ME021.jpg/' , $archivo) == 1) {
	    		$encontrados['ME021'] = 1;
	    	}

	    	if (preg_match('/ME022.jpg/' , $archivo) == 1) {
	    		$encontrados['ME022'] = 1;
	    	}

	    	if (preg_match('/ME023.jpg/' , $archivo) == 1) {
	    		$encontrados['ME023'] = 1;
	    	}

	    	if (preg_match('/ME024.jpg/' , $archivo) == 1) {
	    		$encontrados['ME024'] = 1;
	    	}


	    	if (preg_match('/GN19.jpg/' , $archivo) == 1) {
	    		$encontrados['GN19'] = 1;
	    	}

	    	if (preg_match( '/ME02.pdf/' , $archivo) == 1) {
	    		$encontrados['ME02'] = 1;
	    	}

	    }


	}


	echo json_encode($encontrados) ;

});


$app->get('/altahospitalarios', function(){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT 
				  'H' + RIGHT('0000' + CAST(HOS_claveint as varchar),4) as HOS_claveint
				  ,PAS_folio
				  ,HOS_lesionado
				  ,HOS_edad
				  ,HOS_reporte
				  ,HOS_siniestro
				  ,HOS_fechaAtencion
				  ,HOS_fechaHospitalario
				  ,Hospitalario.UNI_claveint as UNI_claveint
				  ,Hospitalario.EMP_claveint as EMP_claveint
				  ,UNI_claveWeb
				  ,EMP_claveWeb
				  ,HOS_poliza
				  ,HOS_inciso
				  ,HOS_asegurado
				  ,HOS_horaIniRep
				  ,HOS_domicilio
				  ,RIE_clave
				  ,POS_clave
				  ,HOS_ajustador
				  ,HOS_ajustadorClave
				  ,HOS_quienReporta
				  ,HOS_quienAutoriza
				  ,HOS_trasladoA
				  ,HOS_ambulancia
				  ,HOS_motivoHos
				  ,HOS_observaciones
				  ,HOS_otros
				  ,HOS_horaFinRep
				  ,HOS_capturado
				  ,USU_capturo
				  ,HOS_fechaCaptura
				FROM Hospitalario
				inner join Unidad on Unidad.UNI_claveint = Hospitalario.Uni_claveint
				inner join Empresa on Empresa.EMP_claveint = Hospitalario.EMP_claveint";

		$rs= odbc_exec($conexion,$sql); 


		$i = 0;


		$db = conectarMySQL();

	    if(!$db) {

		    die('Something went wrong while connecting to MSSQL');

		}else{

			while (odbc_fetch_row($rs)){ 

				$clave  = odbc_result($rs,"HOS_claveint");
				$folio  = odbc_result($rs,"PAS_folio");
				$lesionado  = odbc_result($rs,"HOS_lesionado");
				$edad  = odbc_result($rs,"HOS_edad");
				$reporte  = odbc_result($rs,"HOS_reporte");
				$siniestro  = odbc_result($rs,"HOS_siniestro");
				$fechaAtencion  = odbc_result($rs,"HOS_fechaAtencion");
				$fechaHospitalario  = odbc_result($rs,"HOS_fechaHospitalario");
				$unidad  = odbc_result($rs,"UNI_claveWeb");
				$empresa = odbc_result($rs,"EMP_claveWeb");
				$poliza = odbc_result($rs,"HOS_poliza");
				$inciso = odbc_result($rs,"HOS_inciso");
				$asegurado = odbc_result($rs,"HOS_asegurado");
				$horaIniRep = odbc_result($rs,"HOS_horaIniRep");
				$domicilio = odbc_result($rs,"HOS_domicilio");
				$riesgo = odbc_result($rs,"RIE_clave");
				$posicion = odbc_result($rs,"POS_clave");
				$ajustador = odbc_result($rs,"HOS_ajustador");
				$ajustadorClave = odbc_result($rs,"HOS_ajustadorClave");
				$quienReporta = odbc_result($rs,"HOS_quienReporta");
				$quienAutoriza = odbc_result($rs,"HOS_quienAutoriza");
				$trasladoA = odbc_result($rs,"HOS_trasladoA");
				$ambulancia = odbc_result($rs,"HOS_ambulancia");
				$motivoHos = odbc_result($rs,"HOS_motivoHos");
				$observaciones = odbc_result($rs,"HOS_observaciones");
				$otros = odbc_result($rs,"HOS_otros");
				$horaFinRep = odbc_result($rs,"HOS_horaFinRep");
				// $valor28 = odbc_result($rs,"HOS_capturado");
				$usuario = odbc_result($rs,"USU_capturo");
				$fechaCaptura = odbc_result($rs,"HOS_fechaCaptura");
				$unidadMV  = odbc_result($rs,"UNI_claveint");
				$empresaMV = odbc_result($rs,"EMP_claveint");

				$sql = "INSERT INTO Hospitalario
                ( 
                   EXP_folio,         HOS_lesionado,         HOS_reporte,      HOS_siniestro,
                   HOS_fechaAtencion, HOS_fechaHospitalario, UNI_claveint,     EMP_claveint,
                   HOS_poliza,        HOS_inciso,            HOS_asegurado,    HOS_horaIniRep, 
                   HOS_domicilio,     RIE_claveInt,          POS_clave,        HOS_ajustador,
                   HOS_ajustadorClave,HOS_quienReporta,      HOS_quienAutoriza,HOS_trasladoA, 
                   HOS_ambulancia,    HOS_motivoHos,         HOS_observaciones,HOS_otros, 
                   HOS_horaFinRep,    USU_capturo, 			 HOS_edad, 		   HOS_fechaCaptura, 
                   HOS_clave,		  UNI_claveMV,			 EMP_claveMV
                )
                VALUES
                (  :folio,              :lesionado,              :reporte,            :siniestro,
                   :fechaAtencion,      :fechaHospitalario,      :unidad,             :empresa, 
                   :poliza,             :inciso,                 :asegurado,          :horaIniRep, 
                   :domicilio,          :riesgo,                 :posicion,           :ajustador,
                   :ajustadorClave,     :quienReporta,           :quienAutoriza,      :trasladoA,
                   :ambulancia,         :motivoHos,              :observaciones,      :otros,
                   :horaFinRep,         :usuario,                :edad,               :fechaCaptura,
                   :clave,				:unidadMV,				 :empresaMV	
                )";

		        $temporal = $db->prepare($sql);
		        $temporal->bindParam("folio", $folio, PDO::PARAM_STR, 10);
		        $temporal->bindParam("lesionado", $lesionado, PDO::PARAM_STR);
		        $temporal->bindParam("reporte", $reporte, PDO::PARAM_STR);
		        $temporal->bindParam("siniestro", $siniestro , PDO::PARAM_STR);
		        $temporal->bindParam("empresa", $empresa , PDO::PARAM_INT);
		        $temporal->bindParam("fechaAtencion", $fechaAtencion);
		        $temporal->bindParam("fechaHospitalario", $fechaHospitalario);
		        $temporal->bindParam("unidad", $unidad, PDO::PARAM_INT);
		        $temporal->bindParam("poliza", $poliza, PDO::PARAM_STR);
		        $temporal->bindParam("inciso", $inciso, PDO::PARAM_STR);
		        $temporal->bindParam("asegurado", $asegurado, PDO::PARAM_STR);
		        $temporal->bindParam("horaIniRep", $horaIniRep, PDO::PARAM_STR);
		        $temporal->bindParam("domicilio", $domicilio, PDO::PARAM_STR);
		        $temporal->bindParam("riesgo", $riesgo, PDO::PARAM_INT);
		        $temporal->bindParam("posicion", $posicion, PDO::PARAM_INT);
		        $temporal->bindParam("ajustador", $ajustador, PDO::PARAM_STR);
		        $temporal->bindParam("ajustadorClave", $ajustadorClave, PDO::PARAM_STR);
		        $temporal->bindParam("quienReporta", $quienReporta, PDO::PARAM_STR);
		        $temporal->bindParam("quienAutoriza", $quienAutoriza, PDO::PARAM_STR);
		        $temporal->bindParam("trasladoA", $trasladoA, PDO::PARAM_STR);
		        $temporal->bindParam("ambulancia", $ambulancia, PDO::PARAM_STR);
		        $temporal->bindParam("motivoHos", $motivoHos, PDO::PARAM_STR);
		        $temporal->bindParam("observaciones", $observaciones, PDO::PARAM_STR);
		        $temporal->bindParam("otros", $otros, PDO::PARAM_STR);
		        $temporal->bindParam("horaFinRep", $horaFinRep);
		        $temporal->bindParam("usuario", $usuario, PDO::PARAM_INT);
		        $temporal->bindParam("edad", $edad, PDO::PARAM_INT);
		        $temporal->bindParam("fechaCaptura", $fechaCaptura);
		        $temporal->bindParam("clave", $clave, PDO::PARAM_STR);
		        $temporal->bindParam("unidadMV", $unidadMV, PDO::PARAM_INT);
		        $temporal->bindParam("empresaMV", $empresaMV, PDO::PARAM_INT);

		        ///LOL

		        if ($temporal->execute()){
		            $respuesta = array('respuesta' => "Los Datos se guardaron Correctamente", 'clave' => $clave);
		        }else{
		            $respuesta = array('respuesta' => "Los Datos No se Guardaron Verifique su Información");
		        }

				

			}

		}
		//echo odbc_fetch_row($rs);


	}
	
});


$app->get('/altamovimientos', function(){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT AUM_clave
					  ,MOA_claveint
					  ,TIM_claveint
					  ,MOA_fecha
					  ,MOA_texto
					  ,USU_registro
					  ,MOA_fechaReg
					  ,MOA_claveAut
					  ,MOA_autorizado
				FROM MovimientoAut
				WHERE MOA_fechaReg BETWEEN '30/07/2014 14:20' AND '04/08/2014 11:55' ";

		$rs= odbc_exec($conexion,$sql); 

		$i = 0;


		$db = conectarMySQL();

	    if(!$db) {

		    die('Something went wrong while connecting to MSSQL');

		}else{

			while (odbc_fetch_row($rs)){ 

				$AUMClave  = odbc_result($rs,"AUM_clave");
				$MOAClave  = odbc_result($rs,"MOA_claveint");
				$TIMClave  = odbc_result($rs,"TIM_claveint");
				$fecha  = odbc_result($rs,"MOA_fecha");
				$texto  = odbc_result($rs,"MOA_texto");
				$usuario  = odbc_result($rs,"USU_registro");
				$fecharegistro  = odbc_result($rs,"MOA_fechaReg");
				$claveaut  = odbc_result($rs,"MOA_claveAut");
				
				$sql = "INSERT INTO MovimientoAut
		              (
		                   AUM_clave,
		                   MOA_claveint,
		                   TIM_claveint,
		                   MOA_fecha,
		                   MOA_texto,
		                   USU_registro,
		                   MOA_claveAut,
		                   MOA_autorizado,
		                   MOA_fechaReg
		              )   
		              VALUES
		              (
		                    :AUMClave,                     
		                    :MOAClave,
		                    :TIMClave,
		                    :fecha,
		                    :texto,
		                    :usuario,
		                    :claveaut,
		                    1,
		                    :fecharegistro
		              )";

		        $temporal = $db->prepare($sql);
		        $temporal->bindParam("AUMClave", $AUMClave, PDO::PARAM_STR, 5);
		        $temporal->bindParam("MOAClave", $MOAClave, PDO::PARAM_INT);
		        $temporal->bindParam("TIMClave", $TIMClave, PDO::PARAM_INT);
		        $temporal->bindParam("fecha", $fecha);
		        $temporal->bindParam("texto", $texto , PDO::PARAM_STR);
		        $temporal->bindParam("usuario", $usuario , PDO::PARAM_INT);
		        $temporal->bindParam("fecharegistro", $fecharegistro);
		        $temporal->bindParam("claveaut", $claveaut , PDO::PARAM_INT);

		        if ($temporal->execute()){
		            $respuesta = array('respuesta' => "Los Datos se guardaron Correctamente");
		        }else{
		            $respuesta = array('respuesta' => "Los Datos No se Guardaron Verifique su Información");
		        }

			}

		}
		//echo odbc_fetch_row($rs);


	}
	
});



$app->get('/', function(){
	
    //echo "Hola Mundo";
    //Trusted_Connection=yes;
    $db_usr = 'sa'; 
	$db_pass = 'ACc3soMv'; 
	$db_server = 'SISTEMAS4'; 
	$db_name = 'MV2';
	$dsn = "Driver={SQL Server Native Client 11.0};Server=$db_server;Database=$db_name;Trusted_Connection=yes;charset=UTF-8";
	$con = odbc_connect($dsn,$db_usr,$db_pass);

});


$app->post('/actualizaoriginal', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$folio =  $datos->folio; 
	$claveint =  $datos->documento;
    $usuario =  $datos->usuario; 
    $fecha =  $datos->fecha;  
    $remesa =  $datos->remesa; 
    $lesionado =  $datos->lesionado;
    $totalfactura = $datos->totalfactura;
    $factura = $datos->factura;

    if ($totalfactura == '') {
    	$totalfactura = 0;
    }

    //fechapago , folioFac, totalfac

    $hoy = date("H:i:s");
    $fecha = $fecha . " " . $hoy;
    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		

		$sql2 = "EXEC MV_DCU_ActualizaDocumento @claveint = $claveint, @lesionado = '$lesionado', @ambulancia = 0, @fechapago = '',  @originalfecha = '$fecha',  
				@usuario = $usuario, @remesa = '$remesa', @folioFac = '$factura', @totalFac = $totalfactura";

		$rs = odbc_exec($conexion,$sql2); 

		if ($rs){

		      $historico = altahistorial($usuario, $folio, 1, 1, $datos->fecha,2,'','','','',$claveint);
              $arr = array('respuesta' => 'Folio Actualizado Correctamente' , 'Historial' => $historico);
        }else {
              $arr = array('respuesta' => 'Error al Actualizar: '.odbc_error());
        }   

		echo json_encode($arr);

		// 

	}

});


//alta de un ticket
$app->post('/actualizaticket', function(){


	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$folioin  = $datos->folioIn;
	$folioweb  = $datos->folioweb;
	$cliente  = $datos->cliente;
	$unidad  = $datos->unidad;
	$etapa  = $datos->etapa;
	$categoria  = $datos->categoria;
	$subcategoria  = $datos->subcategoria;
	$status  = $datos->statusa;
	$asignado  = $datos->asignado;
	$fechaasignado  = $datos->fechaasignado;
	$notas  = $datos->notas;
	$comunicacion  = $datos->comunicacion;
	$fechacomunica  = $datos->fechacomunica;
	$usuario  = $datos->usuario;
	$usuariomv  = $datos->usuariomv;

	$fecha=date('Y-m-d H:i:s');

	$fechaasignado =  date('Y-m-d', strtotime(str_replace('/', '-', $fechaasignado))) . '00:00:00';
	$fechacomunica =  date('Y-m-d', strtotime(str_replace('/', '-', $fechacomunica))) . '00:00:00';


	$db = conectarMySQL();

	$documento = BuscaDocumento($folioweb);

    if(!$db) {

	    die('Something went wrong while connecting to MSSQL');

	}else{

    	

    	$query= "UPDATE TicketSeguimiento SET TCat_clave = :categoria , TSub_clave = :subcategoria, TSeg_fechaactualizacion = now(), Usu_actualiza=:usuario, 
                TStatus_clave = :status, TSeg_asignado = :asignado, TSeg_asignadofecha = :fechaasignado Where TSeg_clave =:foliointerno And Exp_folio = :folioweb";

        $stmt = $db->prepare($query);
        $stmt->bindParam("foliointerno", $folioin);
        $stmt->bindParam("folioweb", $folioweb);
        $stmt->bindParam("categoria", $categoria);
        $stmt->bindParam("status", $status);
        $stmt->bindParam("subcategoria", $subcategoria);
        $stmt->bindParam("asignado", $asignado);
        $stmt->bindParam("fechaasignado", $fechaasignado);
        $stmt->bindParam("usuario", $usuario);

        if ($stmt->execute()){

        	$historico = altahistorial($usuariomv, $folioweb, $etapa, 1, $fecha,9,$folioin,'','','',$documento);
            $respuesta = array('respuesta' => "Los Datos del Ticket Se Actualizaron Correctamente");
        }else{
            $respuesta = array('respuesta' => "Los Datos No se Guardaron Verifique su Información");
        }

        if($notas<>""){

            $qrynotas="INSERT INTO TicketNotas (TSeg_clave,Exp_folio,TN_descripcion,TN_fechareg,Usu_registro)
                 	  VALUES(:foliointerno,:folioweb,:notas,:fecha,:usuario)";

            $altanota = $db->prepare($qrynotas);
            $altanota->bindParam("foliointerno", $folioin);
            $altanota->bindParam("folioweb", $folioweb);
            $altanota->bindParam("notas", $notas);
            $altanota->bindParam("fecha", $fecha);
            $altanota->bindParam("usuario", $usuario);
            $altanota->execute();
            
        }
        
        // if($comunicacion<>""){
        //     $qrycomunicacion="INSERT INTO TicketComunicacion (TSeg_clave,Exp_folio,TC_descripcion,TC_correofecha,TC_fechareg,Usu_registro)
        //          			 VALUES(:foliointerno,:folioweb,:comunicacion,:comunicacionfecha,:fecha,:usuario)";
        //     $altanota = $db->prepare($qrycomunicacion);
        //     $altanota->bindParam("foliointerno", $folioin);
        //     $altanota->bindParam("folioweb", $folioweb);
        //     $altanota->bindParam("comunicacion", $comunicacion);
        //     $altanota->bindParam("comunicacionfecha", $fechacomunica);
        //     $altanota->bindParam("fecha", $fecha);
        //     $altanota->bindParam("usuario", $usuario);
        //     $altanota->execute();
        // }

        echo json_encode($respuesta);
        $db = null;
        

    }

});

//Se acepta el folio 
$app->post('/aceptaentrega', function(){


		$request = \Slim\Slim::getInstance()->request();
		$datos = json_decode($request->getBody());

		//datos para guardar historico
		$folio =  $datos->Folio; 
	    $etapa =  $datos->Etapa;
		$numentrega = $datos->Cantidad;

		$documento =  $datos->DOC_claveint; 
	    $areaentrega =  $datos->FLD_AROent; 
	    $usuarioentrega =  $datos->USU_ent;

	    $usuariorecibe =  $datos->USU_recibe; 
	    $arearecibe =  $datos->ARO_porRecibir;
	    $clave = $datos->FLD_claveint;


	    
	    $fecha = date("d/m/Y");
	    $hoy = date("H:i:s");
	    $fecha = $fecha . " " . $hoy;


	    $hoy = date("H:i:s");
	    $fecha = $fecha . " " . $hoy;
	    $conexion = conectarActual();

	    if(!$conexion) {

		    die('Something went wrong while connecting to MSSQL');

		}else{
			

			$sql = "UPDATE FlujoDoc SET FLD_AROrec = $arearecibe, USU_rec = $usuariorecibe,  FLD_porRecibir = 0, FLD_rechazado = 0, USU_recibe = NULL, ARO_porRecibir = NULL, 
					USU_activo = $usuariorecibe, ARO_activa = $arearecibe , FLD_fechaRec = CONVERT (datetime, GETDATE()) WHERE FLD_claveint = $clave";

						// FLD_AROrec = $arearecibe, USU_rec = $usuariorecibe, FLD_fechaRec = '$fecha' 
						// USU_activo = $usuariorecibe

			$rs = odbc_exec($conexion,$sql); 

			if ($rs){

				if ($arearecibe == 4) {

					$detalle = " -- juego de facturación --";

				}elseif ($arearecibe == 6) {

					$sqlPagos = "EXEC MV_FLD_InsertaRelacionPago @FLDClave= $clave, @folio= $folio, @etapa= $etapa ,@entrega = $numentrega";
					$rs = odbc_exec($conexion,$sqlPagos);
					$detalle = ""; 
				}
				else{
					$detalle = "";
				}
				
				$historico = altahistorial($usuariorecibe, $folio, $etapa, $numentrega, $fecha, 4 ,$detalle,$usuarioentrega,$areaentrega,$arearecibe,$documento);

	            $arr = array('respuesta' => 'Documento(s) aceptados Correctamente' , 'historial' => $historico);
	              
	        }else{

	            $arr = array('respuesta' => 'Error durante el proceso : '.odbc_error());

	        }   

			echo json_encode($arr); 

			// 

		}

});

//Se crea una nueva por que es para facturacion
$app->post('/altaentrega', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$folios =  $datos->folios; 
    $usuarioentrega =  $datos->usuarioentrega; 
    $areaentrega =  $datos->areaentrega; 
    $usuariorecibe =  $datos->usuariorecibe; 
    $arearecibe =  $datos->arearecibe;
    
    $fecha = date("d/m/Y");
    $hoy = date("H:i:s");
    $fecha = $fecha . " " . $hoy;


    $hoy = date("H:i:s");
    $fecha = $fecha . " " . $hoy;
    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		

		foreach ($folios as $foliodato) {

			//datos para guardar historico
			$folio =  $foliodato->Folio;
		    $etapa =  $foliodato->Etapa;
			$numentrega = $foliodato->Cantidad;
			$documento =  $foliodato->documento; 
		    $clave = $foliodato->FLD_claveint;
		    $observaciones = $foliodato->Observaciones;

			$sql = "EXEC MV_FLU_insertaflujo 
					@documento = $documento, 
					@usuarioentrega = $usuarioentrega, 
					@areaentrega = $areaentrega, 
					@usuariorecibe = $usuariorecibe, 
					@observaciones = '$observaciones',
					@arearecibe = $arearecibe";

			$rs = odbc_exec($conexion,$sql); 

			if ($rs){

				$detalle = "el juego de facturación en espera de ser aceptado";
				$sql = "UPDATE FlujoDoc SET FLD_envFac = 1, FLD_rechazado = 0 where DOC_claveint = $documento and FLD_formaRecep = 'O'";
				$rs2 = odbc_exec($conexion,$sql);
				
				$historico = altahistorialfactura($usuarioentrega, $folio, $etapa, $numentrega, $fecha, 3 ,$detalle,$usuariorecibe,$areaentrega,$arearecibe,$documento);
				

	            $arr = array('respuesta' => 'Documento(s) enviado Correctamente');
	              
	        }else{

	            $arr = array('respuesta' => 'Error durante el Guardado : '.odbc_error());

	        }   

		}

		echo json_encode($arr); 


	}

});

//alta de entregas de un area a otra se actualiza en el flujo
$app->post('/actualizaentrega', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	//datos para guardar historico
	$folios =  $datos->folios; 
    $usuarioentrega =  $datos->usuarioentrega; 
    $areaentrega =  $datos->areaentrega; 
    $usuariorecibe =  $datos->usuariorecibe; 
    $arearecibe =  $datos->arearecibe;
    
    $fecha = date("d/m/Y");
    $hoy = date("H:i:s");
    $fecha = $fecha . " " . $hoy;
    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		

		foreach ($folios as $foliodato) {

		    $folio =  $foliodato->Folio;
		    $etapa =  $foliodato->Etapa;
			$numentrega = $foliodato->Cantidad;
			$documento =  $foliodato->documento; 
		    $clave = $foliodato->FLD_claveint;
		    $observaciones = $foliodato->Observaciones;
			
			$sql = "UPDATE FlujoDoc SET USU_ent = $usuarioentrega, FLD_fechaEnt = '$fecha' , FLD_AROent = $areaentrega, ARO_porRecibir = $arearecibe, USU_recibe = $usuariorecibe, FLD_rechazado = 0, FLD_observaciones = '$observaciones'";

			//Si es archivo se autorecibe el documento con usuario recepcionautomatica que es 36 
			if ($arearecibe == 7) {
				$sql .= ", USU_rec = $usuariorecibe, FLD_fechaRec = '$fecha', FLD_AROrec = $arearecibe, ARO_Activa = $arearecibe, USU_activo = $usuariorecibe WHERE FLD_claveint = $clave";
				$detalle = "con autorecepcion del documento";
			}
			elseif ($arearecibe == 8) {
				$detalle = " se asigno por motivo de: " . $observaciones;
			}
			else{
				$sql = $sql . ", FLD_porRecibir = 1 WHERE FLD_claveint = $clave";
				$detalle = "en espera de ser aceptado";
			}

			$rs = odbc_exec($conexion,$sql); 

			if ($rs){


				  $historico = altahistorial($usuarioentrega, $folio, $etapa, $numentrega, $fecha, 3 ,$detalle,$usuariorecibe,$areaentrega,$arearecibe,$documento); 
	              $arr = array('respuesta' => 'Documento(s) enviado Correctamente', 'Historial' => $historico);
	              
	        }else {

	              $arr = array('respuesta' => 'Error durante el Guardado : '.odbc_error());
	        }

		}

		echo json_encode($arr); 

	}

});

//alta de un folio en fax
$app->post('/altafoliofax', function(){


	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

    $usuario =  $datos->usuario; 
    $folio =  $datos->folio; 
    $lesionado =  $datos->lesionado; 
    $unidad =  $datos->unidad; 
    $fecha =  $datos->fecha; 
    $empresa =  $datos->cliente; 
    $producto =  $datos->producto; 
    $escolaridad =  $datos->escolaridad; 
    $internet =  $datos->internet; 

    $hoy = date("H:i:s");
    $fecha = $fecha . " " . $hoy;
    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		

		$sql = "EXEC MV_DCU_CapturaFax @folio='$folio', @lesionado='$lesionado',  @unidad=$unidad, @ambulancia=0,  @faxfecha='$fecha',  
				@empresa=$empresa, @usuario=$usuario, @producto=$producto, @escolaridad=$escolaridad, @internet=$internet";

		$rs = odbc_exec($conexion,$sql); 

		if ($rs){

				$sql2 = "SELECT * FROM Documento where DOC_folio = '$folio'";
				$rs2 = odbc_exec($conexion,$sql2); 
				$documento = odbc_result($rs2,"DOC_claveint");

              	// $historico = altahistorial($usuario, $folio, $etapa, $numentrega, $datos->fecha, 2 ,'','','','',$documento);
				$historico = altahistorial($usuario, $folio, 1, 1, $fecha,1,'','','','',$documento);

				$arr = array('respuesta' => 'Folio Guardado Correctamente', 'historial' => $historico);

        }else {
              $arr = array('respuesta' => 'Error durante el Guardado: '.odbc_error());
        }   

		echo json_encode($arr); 

		// 

	}

});


//alta de un ticket
$app->post('/altaticket', function(){


	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$folioin  = $datos->folioIn;
	$folioweb  = $datos->folioweb;
	$cliente  = $datos->cliente;
	$unidad  = $datos->unidad;
	$etapa  = $datos->etapa;
	$categoria  = $datos->categoria;
	$subcategoria  = $datos->subcategoria;
	$status  = $datos->statusa;
	$asignado  = $datos->asignado;
	$fechaasignado  = $datos->fechaasignado;
	$notas  = $datos->notas;
	$comunicacion  = $datos->comunicacion;
	$fechacomunica  = $datos->fechacomunica;
	$usuario  = $datos->usuario;
	$usuariomv  = $datos->usuariomv;

	$documento = BuscaDocumento($folioweb);

	$fecha=date('Y-m-d H:i:s');

	$fechaasignado =  date('Y-m-d', strtotime(str_replace('/', '-', $fechaasignado))) . '00:00:00';
	$fechacomunica =  date('Y-m-d', strtotime(str_replace('/', '-', $fechacomunica))) . '00:00:00';

	$observaciones = array();

	if (isset($datos->diagnostico) && $datos->diagnostico == true) {
		array_push($observaciones,'DIAGNÓSTICO');
	};

	if (isset($datos->firma) && $datos->firma == true) {
		array_push($observaciones,'FIRMA DE LESIONADO');
	};

	if (isset($datos->notamedica) && $datos->notamedica == true) {
		array_push($observaciones,'FALTA NOTA MÉDICA');
	};

	if (isset($datos->finiquito) && $datos->finiquito == true) {
		array_push($observaciones,'SIN FINIQUITO');
	};

	if (isset($datos->refactura) && $datos->refactura == true) {
		array_push($observaciones,'REFACTURACIÓN');
	};

	if (isset($datos->pase) && $datos->pase == true) {
		array_push($observaciones,'PASE MÉDICO ALTERADO'); 
	};

	if (isset($datos->suministro) && $datos->suministro == true) {
		array_push($observaciones,'SUMINISTROS (MEDICAMENTO/ ÓRTESIS)');
	};

	if (isset($datos->identificacion) && $datos->identificacion == true) {
		array_push($observaciones,'IDENTIFICACIÓN OFICIAL');
	};

	if (isset($datos->verificacion) && $datos->verificacion == true) {
		array_push($observaciones,'VERIFICACIÓN DE FIRMAS');
	};

	if (isset($datos->notamedicain) && $datos->notamedicain == true) {
		array_push($observaciones,'NOTA MÉDICA INCOMPLETA');
	};

	if (isset($datos->informe) && $datos->informe == true) {
		array_push($observaciones,'INFORME AIG/CHARTI');
	};

	if (isset($datos->reverso) && $datos->reverso == true) {
		array_push($observaciones,'REVERSO DE IDENTIFICACIÓN');
	};

	if (isset($datos->verificapar) && $datos->verificapar == true) {
		array_push($observaciones,'VERIFICACIÓN DE PARENTESCO');
	};

	if (isset($datos->nocoincide) && $datos->nocoincide == true) {
		array_push($observaciones,'NO COINCIDE CON DOCUMENTACIÓN');
	};

	if (isset($datos->pasemedico) && $datos->pasemedico == true) {
		array_push($observaciones,'PASE MÉDICO EN COPIA');
	};

	if (isset($datos->nombrein) && $datos->nombrein == true) {
		array_push($observaciones,'NOMBRE INCORRECTO');
	};

	if (isset($datos->folioseg) && $datos->folioseg == true) {
		array_push($observaciones,'FOLIO DE SEGMENTACIÓN');
	};

	if (isset($datos->sinpase) && $datos->sinpase == true) {
		array_push($observaciones,'SIN PASE MÉDICO');
	};

	if (isset($datos->fueravigencia) && $datos->fueravigencia == true) {
		array_push($observaciones,'FUERA DE VIGENCIA');
	};

	if (isset($datos->sinpoliza) && $datos->sinpoliza == true) {
		array_push($observaciones,'SIN PÓLIZA');
	};

	if (isset($datos->sindeducible) && $datos->sindeducible == true) {
		array_push($observaciones,'SIN DEDUCIBLE');
	};

	if (isset($datos->sincuestionario) && $datos->sincuestionario == true) {
		array_push($observaciones,'SIN CUESTIONARIO');
	};

	if (isset($datos->firmamedico) && $datos->firmamedico == true) {
		array_push($observaciones,'FIRMA MÉDICO');
	};

	if (isset($datos->cruce) && $datos->cruce == true) {
		array_push($observaciones,'CRUCE ZIMA-MV');
	};

	$observaciones=implode(",",$observaciones);

	$db = conectarMySQL();

    if(!$db) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT * FROM TicketSeguimiento WHERE TSeg_clave='".$folioin."'";

		$result = $db->query($sql);
        $result->execute();
        $cuenta = $result->rowCount();

        if ($cuenta > 0) {
         	
         	$respuesta = array('respuesta' => 'Ya existe el folio interno intente guardar para generar el folio interno siguiente' );
         	
        }else{



        	$query="INSERT INTO TicketSeguimiento (TSeg_clave,Exp_folio,TSeg_etapa,TCat_clave,TSub_clave,TSeg_obs,TStatus_clave,Uni_clave,Cia_clave,TSeg_asignado,TSeg_asignadofecha,TSeg_fechareg,TSeg_fechaactualizacion,Usu_registro,Usu_actualiza)
                     VALUES(:foliointerno,:folioweb,:etapa,:categoria,:subcategoria,:observaciones,:status,:unidad,:cliente,:asignado,:fechaasignado,now(),now(),:usuario,:usuario2)";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam("foliointerno", $folioin);
            $stmt->bindParam("folioweb", $folioweb);
            $stmt->bindParam("etapa", $etapa);
            $stmt->bindParam("categoria", $categoria);
            $stmt->bindParam("subcategoria", $subcategoria);
            $stmt->bindParam("observaciones", $observaciones);
            $stmt->bindParam("status", $status);
            $stmt->bindParam("unidad", $unidad);
            $stmt->bindParam("cliente", $cliente);
            $stmt->bindParam("asignado", $asignado);
            $stmt->bindParam("fechaasignado", $fechaasignado);
            $stmt->bindParam("usuario", $usuario);
            $stmt->bindParam("usuario2", $usuario);

            if ($stmt->execute()){

            	$historico = altahistorial($usuariomv, $folioweb, $etapa, 1, $fecha,8,$folioin,'','','',$documento);
	            $respuesta = array('respuesta' => "Los Datos del Ticket Se Guardaron Correctamente con el folio:". $folioin);
	        }else{
	            $respuesta = array('respuesta' => "Los Datos No se Guardaron Verifique su Información");
	        }

	        if($notas<>""){

                $qrynotas="INSERT INTO TicketNotas (TSeg_clave,Exp_folio,TN_descripcion,TN_fechareg,Usu_registro)
                     	  VALUES(:foliointerno,:folioweb,:notas,:fecha,:usuario)";

                $altanota = $db->prepare($qrynotas);
	            $altanota->bindParam("foliointerno", $folioin);
	            $altanota->bindParam("folioweb", $folioweb);
	            $altanota->bindParam("notas", $notas);
	            $altanota->bindParam("fecha", $fecha);
	            $altanota->bindParam("usuario", $usuario);
	            $altanota->execute();
                
            }
            
            if($comunicacion<>""){
                $qrycomunicacion="INSERT INTO TicketComunicacion (TSeg_clave,Exp_folio,TC_descripcion,TC_correofecha,TC_fechareg,Usu_registro)
                     			 VALUES(:foliointerno,:folioweb,:comunicacion,:comunicacionfecha,:fecha,:usuario)";
                $altanota = $db->prepare($qrycomunicacion);
	            $altanota->bindParam("foliointerno", $folioin);
	            $altanota->bindParam("folioweb", $folioweb);
	            $altanota->bindParam("comunicacion", $comunicacion);
	            $altanota->bindParam("comunicacionfecha", $fechacomunica);
	            $altanota->bindParam("fecha", $fecha);
	            $altanota->bindParam("usuario", $usuario);
	            $altanota->execute();
            }

        }

        echo json_encode($respuesta);
        $db = null;
        

    }

});

//insertamos bit para que se ponga en no pagar hasta cobrar 
$app->post('/insertanpc', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	//datos para guardar historico
	$folio =  $datos->folio; 
    $etapa =  $datos->etapa;
	$numentrega = $datos->cantidad;

	$documento =  $datos->documento; 
    $usuarioentrega =  $datos->usuarioentrega; 
    $areaentrega =  $datos->areaentrega; 
    // '' =  $datos-''; 
    // $arearecibe =  $datos->arearecibe;
    $clave = $datos->clave;
    $observaciones = $datos->observaciones;
    
    $fecha = date("d/m/Y");
    $hoy = date("H:i:s");
    $fecha = $fecha . " " . $hoy;
    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "UPDATE FlujoDoc SET FLD_envNPC = 1 WHERE FLD_claveint = $clave";

		$rs = odbc_exec($conexion,$sql); 

		if ($rs){

			  $historico = altahistorial($usuarioentrega, $folio, $etapa, $numentrega, $fecha, 10 ,'','',$areaentrega,'',$documento); 
              $arr = array('respuesta' => 'Documento(s) enviado Correctamente', 'Historial' => $historico);
              
        }else {

              $arr = array('respuesta' => 'Error durante el Guardado : '.odbc_error());
        }   

		echo json_encode($arr); 

		// 

	}

});


//insertamos bit para que se quite de no pagar hasta cobrar
$app->post('/eliminanpc', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	//datos para guardar historico
	$folio =  $datos->folio; 
    $etapa =  $datos->etapa;
	$numentrega = $datos->cantidad;

	$documento =  $datos->documento; 
    $usuarioentrega =  $datos->usuarioentrega; 
    $areaentrega =  $datos->areaentrega; 
    // '' =  $datos-''; 
    // $arearecibe =  $datos->arearecibe;
    $clave = $datos->clave;
    $observaciones = $datos->observaciones;
    
    $fecha = date("d/m/Y");
    $hoy = date("H:i:s");
    $fecha = $fecha . " " . $hoy;
    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "UPDATE FlujoDoc SET FLD_envNPC = 0 WHERE FLD_claveint = $clave";

		$rs = odbc_exec($conexion,$sql); 

		if ($rs){

			  $historico = altahistorial($usuarioentrega, $folio, $etapa, $numentrega, $fecha, 11 ,'','',$areaentrega,'',$documento); 
              $arr = array('respuesta' => 'Documento(s) enviado Correctamente', 'Historial' => $historico);
              
        }else {

              $arr = array('respuesta' => 'Error durante el Guardado : '.odbc_error());
        }   

		echo json_encode($arr); 

		// 

	}

});

//alta de folio nuevo en original
$app->post('/altafoliooriginal', function(){


	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

    $usuario =  $datos->usuario; 
    $folio =  $datos->folio; 
    $etapa =  $datos->tipoDoc;
    $lesionado =  $datos->lesionado; 
    $unidad =  $datos->unidad; 
    $fecha =  $datos->fecha; 
    $empresa =  $datos->cliente; 
    $producto =  $datos->producto; 
    $remesa =  $datos->remesa; 
    $escolaridad =  $datos->escolaridad; 
    $internet =  $datos->internet; 
    $numentrega = $datos->numentrega;
    $totalfactura = $datos->totalfactura;
    $factura = $datos->factura;
    
    if ($totalfactura == '') {
    	$totalfactura = 0;
    }

    //fechapago , folioFac, totalfac

    $hoy = date("H:i:s");
    $fecha = $fecha . " " . $hoy;
    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		

		$sql = "EXEC MV_DCU_CapturaOriginal @folio = '$folio', @etapa = $etapa, @lesionado = '$lesionado',  @unidad = $unidad, @empresa = $empresa, @ambulancia = 0, @fechapago = NULL,  @originalfecha = '$fecha',  
				@usuario = $usuario, @remesa = '$remesa',@numentrega = $numentrega  , @producto = $producto, @folioFac = '$factura', @totalFac = $totalfactura, @escolaridad = $escolaridad, @internet = $internet ";

		$rs = odbc_exec($conexion,$sql); 

		if ($rs){


				$sql2 = "SELECT * FROM Documento where DOC_folio = '$folio'";
				$rs2 = odbc_exec($conexion,$sql2); 
				$documento = odbc_result($rs2,"DOC_claveint");

				$historico = altahistorial($usuario, $folio, $etapa, $numentrega, $datos->fecha, 2 ,'','','','',$documento);
				
				$arr = array('respuesta' => 'Folio Guardado Correctamente', 'Historial' => $historico);
              
        }else {
              $arr = array('respuesta' => 'Error durante el Guardado: '.odbc_error());
        }   

		echo json_encode($arr); 

	}

});

///Entrega areas de un query directo
$app->get('/areas', function(){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
	
		$rs= odbc_exec($conexion,"select * from AreaOperativa where ARO_activa = 1"); 


		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"ARO_claveint"));
	            $valor2 = utf8_encode(odbc_result($rs,"ARO_Nombre"));

	            //echo $valor1;
	            //echo $valor2;
				$traspasosResultado['calve'] = $valor1;
	            $traspasosResultado['nombre'] = $valor2;
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// 

	}

});

//Fundion para obtener el areaoperativa segun el usuario
$app->get('/areaoperativa/:usuario', function($usuario){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_FLU_ListaAreaOperativa @usuario = $usuario";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"ARO_claveint"));
	            $valor2 = utf8_encode(odbc_result($rs,"ARO_nombre"));

				$traspasosResultado['id'] = $valor1;
	            $traspasosResultado['nombre'] = $valor2;
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores); 
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}
		//Solo para testear las variables que quiero obtener de lo que estoy mandando
		//$arr = array('a' => $sql);
		//echo json_encode($arr);

		// 
	}

});

//busca categorias para tickets en web 
$app->get('/categorias', function(){

    $conexion = conectarMySQL();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT TCat_clave as Clave, TCat_nombre as Nombre FROM TicketCat order by TCat_clave";


		$result = $conexion->query($sql);
        $categorias = $result->fetchAll(PDO::FETCH_OBJ);
        $conexion = null;
        echo json_encode($categorias);

        

	}

});

//Entrega los clientes
$app->get('/empresas', function(){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
	
		$rs= odbc_exec($conexion,"EXEC MV_DCU_Empresas"); 


		$i = 0;

		//echo odbc_fetch_row($rs);

		while (odbc_fetch_row($rs)){ 

			$valor1 = odbc_result($rs,"emp_claveint");
            $valor2 = utf8_encode(odbc_result($rs,"emp_nombrecorto"));

            //echo $valor1;
            //echo $valor2;
			$traspasosResultado['id'] = $valor1;
            $traspasosResultado['nombre'] = $valor2;
			
			$valores[$i] = $traspasosResultado;
            $i++;

		}

		echo json_encode($valores);

		

	}

});

$app->get('/empresasweb', function(){

    $db = conectarMySQL();

    if(!$db) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT Cia_clave as Clave, Cia_nombrecorto as Nombre FROM Compania WHERE Cia_Activa='S' ORDER BY Cia_nombrecorto";

		$result = $db->query($sql);
        $empresas = $result->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($empresas);

        // 

    }

});

//Elimina la entrega cuando dependiendo el tipo se actualiza o se elimina
$app->post('/eliminaentrega/:tipo/:usuario', function($tipo,$usuario){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$clave = $datos->FLD_claveint;
	$folio = $datos->Folio;
	$etapa = $datos->Etapa;
	$cantidad = $datos->Cantidad;
	$area = $datos->ARO_porRecibir;
	$documento = $datos->DOC_claveint;
	$fecha = date("d/m/Y");

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		//verificamos la operacion a efectuar y asignamos la operacion al historial con $tipo
		if ($tipo == "facturacion") {
			$sql = "DELETE FROM FlujoDoc WHERE FLD_claveint = $clave";
			$tipo = 5;
		}else{
			$sql = "UPDATE FlujoDoc SET USU_ent = NULL, FLD_fechaEnt = NULL, FLD_porRecibir = 0, USU_recibe = NULL, ARO_porRecibir = NULL  WHERE FLD_claveint = $clave";
			$tipo = 5;
		}

		$rs= odbc_exec($conexion,$sql); 
		
		if ($rs){

		      $historico = altahistorial($usuario, $folio, $etapa, $cantidad, $fecha, $tipo,'','',$area,'',$documento);

              $arr = array('respuesta' => 'Folio(s) Removido Correctamente');

        }else {
              $arr = array('respuesta' => 'Error al Actualizar: '.odbc_error());
        }   
		

		echo json_encode($arr);

	}

});

//enlista los tipos de escolaridad disponibles
$app->get('/escolaridad', function(){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "MV_DCU_Escolaridad";

		$rs= odbc_exec($conexion, $sql); 


		$i = 0;

		//echo odbc_fetch_row($rs);

		while (odbc_fetch_row($rs)){ 

			$valor1 = utf8_encode(odbc_result($rs,"ESCclave"));
            $valor2 = utf8_encode(odbc_result($rs,"Nombre"));

            //echo $valor1;
            //echo $valor2;
			$traspasosResultado['id'] = $valor1;
            $traspasosResultado['nombre'] = $valor2;
			
			$valores[$i] = $traspasosResultado;
            $i++;

		}

		echo json_encode($valores);


		

	}

});

//facturas de qualitas formatos
$app->post('/facturasQualitas', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$valores = array();
	$fechaini = $datos->fechaini;
	$fechafin = $datos->fechafin;
	$producto = $datos->producto;

	$fechafin = $fechafin . ' 23:59:58.999';

    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{



		$sql = "EXEC MVQualitasWS @fechaini = '$fechaini', @fechafin = '$fechafin', @prodcuto = $producto";

		$rs= odbc_exec($conexion,$sql);

		// $resultado = odbc_prepare($conexión, $sql);
		// odbc_setoption($resultado, 2, 0, 350);
		// $rs = odbc_execute($resultado);

		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) {

			while (odbc_fetch_row($rs)){

				$valor1 = odbc_result($rs,"folioElectronico");
	            $valor2 = odbc_result($rs,"folioAdministradora");
	            $valor3 = odbc_result($rs,"folioSistema"); //odbc_result($rs,"fechafax"));
	            $valor4 = odbc_result($rs,"claveproovedor");
	            $valor5 = odbc_result($rs,"claveprestador"); //odbc_result($rs,"fechaoriginal"));
	            $valor6 = odbc_result($rs,"Siniestro");
	            $valor7 = odbc_result($rs,"Reporte");
	            $valor8 = odbc_result($rs,"Poliza");
	            $valor9 = utf8_encode(odbc_result($rs,"Lesionado"));
	            $valor15 = odbc_result($rs,"Afectado");
	            $valor10 = odbc_result($rs,"Cobertura");
	            $valor11 = odbc_result($rs,"Subtotal");
	            $valor12 = odbc_result($rs,"iva");
	            $valor13 = odbc_result($rs,"Descuento");
	            $valor14 = odbc_result($rs,"Total");
	            $valor16 = odbc_result($rs,"TipoUnidad");
	            $valor17 = odbc_result($rs,"FechaCaptura");
	            $valor18 = odbc_result($rs,"Unidad");

	            if ($valor6 != $valor7) {

	            	if ($valor10 != 99) {

	            		if ($valor5 == '07370') {


	            			if ($valor18 == 33) {

	            				$traspasosResultado['folioElectronico'] =  $valor1;
					            $traspasosResultado['folioAdministradora'] =  $valor2;
					            $traspasosResultado['folioSistema'] = $valor3;
					            $traspasosResultado['claveproovedor'] = $valor4;
					            $traspasosResultado['claveprestador'] =  $valor5;
					            $traspasosResultado['Siniestro'] =  $valor6;
					            $traspasosResultado['Reporte'] =  $valor7;
					            $traspasosResultado['Poliza'] = $valor8;
								$traspasosResultado['Lesionado'] = $valor9;
								$traspasosResultado['Afectado'] = $valor15;
								$traspasosResultado['Cobertura'] = $valor10;
								$traspasosResultado['Subtotal'] = $valor11;
								$traspasosResultado['iva'] = $valor12;
								$traspasosResultado['Descuento'] = $valor13;
								$traspasosResultado['Total'] = $valor14;
								$traspasosResultado['TipoUnidad'] = $valor16;
								$traspasosResultado['FechaCaptura'] = $valor17;

								$valores[$i] = $traspasosResultado;
					            $i++;
	            			}

	            		}else{

	            			$traspasosResultado['folioElectronico'] =  $valor1;
				            $traspasosResultado['folioAdministradora'] =  $valor2;
				            $traspasosResultado['folioSistema'] = $valor3;
				            $traspasosResultado['claveproovedor'] = $valor4;
				            $traspasosResultado['claveprestador'] =  $valor5;
				            $traspasosResultado['Siniestro'] =  $valor6;
				            $traspasosResultado['Reporte'] =  $valor7;
				            $traspasosResultado['Poliza'] = $valor8;
							$traspasosResultado['Lesionado'] = $valor9;
							$traspasosResultado['Afectado'] = $valor15;
							$traspasosResultado['Cobertura'] = $valor10;
							$traspasosResultado['Subtotal'] = $valor11;
							$traspasosResultado['iva'] = $valor12;
							$traspasosResultado['Descuento'] = $valor13;
							$traspasosResultado['Total'] = $valor14;
							$traspasosResultado['TipoUnidad'] = $valor16;
							$traspasosResultado['FechaCaptura'] = $valor17;


							$valores[$i] = $traspasosResultado;
				            $i++;

	            		}


	            	}

	            }

			}

			if (count($valores)>0) {
				echo json_encode($valores);
			}else{
				$arr = array('respuesta' => 'Datos No Encontrados');
				echo json_encode($arr);
			}

		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		//

	}

});


$app->get('/facturasQualitasConsulta/:folio', function($folio){

    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		

		$sql = "EXEC MVQualitasWSconsulta @folio = '$folio'";

		$rs= odbc_exec($conexion,$sql);

		// $resultado = odbc_prepare($conexión, $sql);
		// odbc_setoption($resultado, 2, 0, 350);
		// $rs = odbc_execute($resultado); 

		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = odbc_result($rs,"folioElectronico");
	            $valor2 = odbc_result($rs,"folioAdministradora");
	            $valor3 = odbc_result($rs,"folioSistema"); //odbc_result($rs,"fechafax"));
	            $valor4 = odbc_result($rs,"claveproovedor");
	            $valor5 = odbc_result($rs,"claveprestador"); //odbc_result($rs,"fechaoriginal"));
	            $valor6 = odbc_result($rs,"Siniestro");
	            $valor7 = odbc_result($rs,"Reporte");
	            $valor8 = odbc_result($rs,"Poliza");
	            $valor9 = utf8_encode(odbc_result($rs,"Lesionado"));
	            $valor15 = odbc_result($rs,"Afectado");
	            $valor10 = odbc_result($rs,"Cobertura");
	            $valor11 = odbc_result($rs,"Subtotal");
	            $valor12 = odbc_result($rs,"iva");
	            $valor13 = odbc_result($rs,"Descuento");
	            $valor14 = odbc_result($rs,"Total");
	            $valor16 = odbc_result($rs,"TipoUnidad");
	            $valor17 = odbc_result($rs,"FechaCaptura");
	            $valor18 = odbc_result($rs,"Unidad");
	            $valor19 = utf8_encode(odbc_result($rs,"Estatus"));
	            $valor20 = odbc_result($rs,"FechaRecepcion");
	            $valor21 = odbc_result($rs,"ID_asociado");
	            
	            $sql2 = "EXEC MVImgs_Datos @folio = '$folio'";
				$rs2 = odbc_exec($conexion,$sql2);

				$nombre = odbc_result($rs2,"Archivo");
				
				$nombre .= "(QS07.jpg,GN19.jpg,ME02.pdf)";


				$imagenes = archivos($folio, $valor17);



	            $traspasosResultado['folioElectronico'] =  $valor1;
	            $traspasosResultado['folioAdministradora'] =  $valor2;
	            $traspasosResultado['folioSistema'] = $valor3;
	            $traspasosResultado['claveproovedor'] = $valor4;
	            $traspasosResultado['claveprestador'] =  $valor5;
	            $traspasosResultado['Siniestro'] =  $valor6;
	            $traspasosResultado['Reporte'] =  $valor7;
	            $traspasosResultado['Poliza'] = $valor8;
				$traspasosResultado['Lesionado'] = $valor9;
				$traspasosResultado['Afectado'] = $valor15;
				$traspasosResultado['Cobertura'] = $valor10;
				$traspasosResultado['Subtotal'] = $valor11;
				$traspasosResultado['iva'] = $valor12;
				$traspasosResultado['Descuento'] = $valor13;
				$traspasosResultado['Total'] = $valor14;
				$traspasosResultado['TipoUnidad'] = $valor16;
				$traspasosResultado['FechaCaptura'] = $valor17;
				$traspasosResultado['Estatus'] = $valor19;
				$traspasosResultado['FechaRecepcion'] = $valor20;
				$traspasosResultado['ID_asociado'] = $valor21;
				$traspasosResultado['nombreArchivos'] = $nombre;
				$traspasosResultado['imagenes'] = $imagenes;

				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			if (count($valores)>0) {
				echo json_encode($valores);
			}else{
				$arr = array('respuesta' => 'Datos No Encontrados');
				echo json_encode($arr);
			}

		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// 

	}

});

//facturas de qualitas formatos 
$app->post('/facturasQualitasIncompleto', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$valores = array();
	$fechaini = $datos->fechaini;
	$fechafin = $datos->fechafin;

	$fechafin = $fechafin . ' 23:59:58.999';

    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		

		$sql = "EXEC MVQualitasWS @fechaini = '$fechaini', @fechafin = '$fechafin'";

		$rs= odbc_exec($conexion,$sql);

		// $resultado = odbc_prepare($conexión, $sql);
		// odbc_setoption($resultado, 2, 0, 350);
		// $rs = odbc_execute($resultado); 

		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = odbc_result($rs,"folioElectronico");
	            $valor2 = odbc_result($rs,"folioAdministradora");
	            $valor3 = odbc_result($rs,"folioSistema"); //odbc_result($rs,"fechafax"));
	            $valor4 = odbc_result($rs,"claveproovedor");
	            $valor5 = odbc_result($rs,"claveprestador"); //odbc_result($rs,"fechaoriginal"));
	            $valor6 = odbc_result($rs,"Siniestro");
	            $valor7 = odbc_result($rs,"Reporte");
	            $valor8 = odbc_result($rs,"Poliza");
	            $valor9 = utf8_encode(odbc_result($rs,"Lesionado"));
	            $valor15 = odbc_result($rs,"Afectado");
	            $valor10 = odbc_result($rs,"Cobertura");
	            $valor11 = odbc_result($rs,"Subtotal");
	            $valor12 = odbc_result($rs,"iva");
	            $valor13 = odbc_result($rs,"Descuento");
	            $valor14 = odbc_result($rs,"Total");
	            $valor16 = odbc_result($rs,"TipoUnidad");
	            $valor17 = odbc_result($rs,"FechaCaptura");
	            $valor18 = odbc_result($rs,"Unidad");

	            if ($valor6 == $valor7 || $valor10 == 99 || $valor15 == 99 || ($valor5 == '07370' && $valor18 != 33) ) {

            			$traspasosResultado['folioElectronico'] =  $valor1;
			            $traspasosResultado['folioAdministradora'] =  $valor2;
			            $traspasosResultado['folioSistema'] = $valor3;
			            $traspasosResultado['claveproovedor'] = $valor4;
			            $traspasosResultado['claveprestador'] =  $valor5;
			            $traspasosResultado['Siniestro'] =  $valor6;
			            $traspasosResultado['Reporte'] =  $valor7;
			            $traspasosResultado['Poliza'] = $valor8;
						$traspasosResultado['Lesionado'] = $valor9;
						$traspasosResultado['Afectado'] = $valor15;
						$traspasosResultado['Cobertura'] = $valor10;
						$traspasosResultado['Subtotal'] = $valor11;
						$traspasosResultado['iva'] = $valor12;
						$traspasosResultado['Descuento'] = $valor13;
						$traspasosResultado['Total'] = $valor14;
						$traspasosResultado['TipoUnidad'] = $valor16;
						$traspasosResultado['FechaCaptura'] = $valor17;
						if ($valor6 == $valor7) {
            				$traspasosResultado['Motivo'] = 'Siniestro igual a reporte';
            			}elseif ($valor10 == 99 || $valor15 == 99) {
            				$traspasosResultado['Motivo'] = 'Cobertura o Afectado Invalido';
            			}elseif ($valor5 == '07370' && $valor18 != 33) {
            				$traspasosResultado['Motivo'] = 'Falta Clave de Provedor Qualitas';
            			}

						$valores[$i] = $traspasosResultado;
			            $i++;
	            
	            }

			}

			if (count($valores)>0) {
				echo json_encode($valores);
			}else{
				$arr = array('respuesta' => 'Datos No Encontrados');
				echo json_encode($arr);
			}

		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// 

	}

});


//facturas de qualitas formatos 
$app->post('/facturasQualitasArchivos', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$valores = array();
	$fechaini = $datos->fechaini;
	$fechafin = $datos->fechafin;

	$fechafin = $fechafin . ' 23:59:58.999';

    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		

		$sql = "EXEC MVQualitasWSarchivos @fechaini = '$fechaini', @fechafin = '$fechafin'";

		$rs= odbc_exec($conexion,$sql);

		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = odbc_result($rs,"folioElectronico");
	            $valor2 = odbc_result($rs,"folioAdministradora");
	            $valor3 = odbc_result($rs,"folioSistema"); //odbc_result($rs,"fechafax"));
	            $valor4 = odbc_result($rs,"claveproovedor");
	            $valor5 = odbc_result($rs,"claveprestador"); //odbc_result($rs,"fechaoriginal"));
	            $valor6 = odbc_result($rs,"Siniestro");
	            $valor7 = odbc_result($rs,"Reporte");
	            $valor8 = odbc_result($rs,"Poliza");
	            $valor9 = utf8_encode(odbc_result($rs,"Lesionado"));
	            $valor15 = odbc_result($rs,"Afectado");
	            $valor10 = odbc_result($rs,"Cobertura");
	            $valor11 = odbc_result($rs,"Subtotal");
	            $valor12 = odbc_result($rs,"iva");
	            $valor13 = odbc_result($rs,"Descuento");
	            $valor14 = odbc_result($rs,"Total");
	            $valor16 = odbc_result($rs,"TipoUnidad");
	            $valor17 = odbc_result($rs,"FechaCaptura");
	            $valor18 = odbc_result($rs,"Unidad");

	            $imagenes = archivos($valor3, $valor17);

	            $sql2 = "EXEC MVImgs_Datos @folio = '$valor3'";
				$rs2 = odbc_exec($conexion,$sql2);

				$nombre = odbc_result($rs2,"Archivo");
				
				$nombre .= "(QS07.jpg,GN19.jpg,ME02.pdf)";



	            if ($valor6 != $valor7) {

	            	if ($valor10 != 99) {
	            		
	            		if ($valor5 == '07370') {


	            			if ($valor18 == 33) {

	            				

	            				$traspasosResultado['folioElectronico'] =  $valor1;
					            $traspasosResultado['folioAdministradora'] =  $valor2;
					            $traspasosResultado['folioSistema'] = $valor3;
					            $traspasosResultado['claveproovedor'] = $valor4;
					            $traspasosResultado['claveprestador'] =  $valor5;
					            $traspasosResultado['Siniestro'] =  $valor6;
					            $traspasosResultado['Reporte'] =  $valor7;
					            $traspasosResultado['Poliza'] = $valor8;
								$traspasosResultado['Lesionado'] = $valor9;
								$traspasosResultado['Afectado'] = $valor15;
								$traspasosResultado['Cobertura'] = $valor10;
								$traspasosResultado['Subtotal'] = $valor11;
								$traspasosResultado['iva'] = $valor12;
								$traspasosResultado['Descuento'] = $valor13;
								$traspasosResultado['Total'] = $valor14;
								$traspasosResultado['TipoUnidad'] = $valor16;
								$traspasosResultado['FechaCaptura'] = $valor17;
								$traspasosResultado['imagenes'] = $imagenes;
								$traspasosResultado['nombreArchivo'] = $nombre;

								$valores[$i] = $traspasosResultado;
					            $i++;
	            			}

	            		}else{

	            			$traspasosResultado['folioElectronico'] =  $valor1;
				            $traspasosResultado['folioAdministradora'] =  $valor2;
				            $traspasosResultado['folioSistema'] = $valor3;
				            $traspasosResultado['claveproovedor'] = $valor4;
				            $traspasosResultado['claveprestador'] =  $valor5;
				            $traspasosResultado['Siniestro'] =  $valor6;
				            $traspasosResultado['Reporte'] =  $valor7;
				            $traspasosResultado['Poliza'] = $valor8;
							$traspasosResultado['Lesionado'] = $valor9;
							$traspasosResultado['Afectado'] = $valor15;
							$traspasosResultado['Cobertura'] = $valor10;
							$traspasosResultado['Subtotal'] = $valor11;
							$traspasosResultado['iva'] = $valor12;
							$traspasosResultado['Descuento'] = $valor13;
							$traspasosResultado['Total'] = $valor14;
							$traspasosResultado['TipoUnidad'] = $valor16;
							$traspasosResultado['FechaCaptura'] = $valor17;
							$traspasosResultado['imagenes'] = $imagenes;
							$traspasosResultado['nombreArchivo'] = $nombre;

							$valores[$i] = $traspasosResultado;
				            $i++;

	            		}
	            		

	            	}
	            
	            }

			}

			if (count($valores)>0) {
				echo json_encode($valores);
			}else{
				$arr = array('respuesta' => 'Datos No Encontrados');
				echo json_encode($arr);
			}

		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// 

	}

});

//verifica que existan los archivos de cada folio
$app->post('/facturasQualitasVerifica', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());//recibimos los folios

	$correctos = array();
	$incorrectos = array();
	$archivos = array();
	$correctos = array();


	$Dia = date('d');
	$Mes = date('m');
	$Anyo = date('Y');


    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{

		$clave = generar_clave();
		$fechacarpeta =  $Dia . "-" . $Mes . "-" . $Anyo;
		$filename = "./facturas/archivo-". $fechacarpeta . "-". $clave . ".zip";
		$carpetaexporta = "api/facturas/archivo-". $fechacarpeta . "-". $clave . ".zip";

		// if (file_exists($filename)) {

		// 	if(unlink($filename)){
		// 	};
		// }

		$zip = new ZipArchive();
		$zip->open($filename, ZipArchive::CREATE);

		$pesototal = 14900000;//equivale a 15Mb peso total del zip
		$peso = 0;
		$pesofolio = 0;
		$maximofolios = 50;//maximo de folios por archivo
		$folio = 0;

		//verificamos folio x folio para ver si cumople con 
		foreach ($datos as $dato) {
			

			$folio = $dato->folioSistema;
			$fecha = $dato->FechaCaptura;

			$MesNro = date('m', strtotime($fecha));
			$DiaNro = date('d', strtotime($fecha));
			$AnyoNro = date('Y', strtotime($fecha));
			

			if($MesNro=='01'){ 
				$MesNro="1"; 
			} 

			if($MesNro=='02'){ 
				$MesNro="2"; 
			} 

			if($MesNro=='03'){ 
				$MesNro="3"; 
			} 

			if($MesNro=='04'){ 
				$MesNro="4"; 
			} 

			if($MesNro=='05'){ 
				$MesNro="5"; 
			} 

			if($MesNro=='06'){ 
				$MesNro="6"; 
			} 

			if($MesNro=='07'){ 
				$MesNro="7"; 
			} 

			if($MesNro=='08'){ 
				$MesNro="8"; 
			} 

			if($MesNro=='09'){ 
				$MesNro="9"; 
			} 


			$sql = "EXEC MVImgs_Datos @folio = '$folio'";
			$rs= odbc_exec($conexion,$sql);

			$nombre = odbc_result($rs,"Archivo");

			//$ruta = "C:\\Users\\salcala.MEDICAVIAL\\Desktop\\MV\\QUALITAS\\". $AnyoNro . "\\" . $MesNro . "\\". $folio;
			//ruta en producción
			$ruta = "\\\\Eaa\\RENAUT\\10\\". $AnyoNro . "\\" . $MesNro . "\\". $folio;

			$archivo1 = $ruta . "\\" . $nombre . "QS07.jpg";
			$archivo2 = $ruta . "\\" . $nombre . "GN19.jpg";
			$archivo3 = $ruta . "\\" . $nombre . "ME02.pdf";

			// if ($dato->TipoUnidad == 'Red') {
			// 	$archivo3 = $ruta . "\\" . $nombre . "ME02.jpg";
			// }else{
			// 	$archivo3 = $ruta . "\\" . $nombre . "ME02.pdf";
			// }
			

			if (file_exists($archivo1) && file_exists($archivo2) && file_exists($archivo3)) {


				if ($peso < $pesototal ) {

					if ($folio <= $maximofolios) {
						
						$pesoarchivo1 = filesize($archivo1);
						$pesoarchivo2 = filesize($archivo2);
						$pesoarchivo3 = filesize($archivo3);

						//sumamos el peso de los tres archivos del folio
						$pesofolio = $pesoarchivo1 + $pesoarchivo2 + $pesoarchivo3;
					    
					    $peso = $pesofolio + $peso;
						
						$rs= odbc_exec($conexion,$sql);

					    $zip->addFile($archivo1,$nombre . "QS07.jpg");
					    $zip->addFile($archivo2,$nombre . "GN19.jpg");
					    $zip->addFile($archivo3,$nombre . "ME02.pdf");

					    array_push($archivos, $dato);

					    $folio = $folio + 1;

					}

				}  

				array_push($correctos, $dato);
			   
			}else {

				
				array_push($incorrectos, $dato);

			}

		}

		$zip->close();
		$resultado = array('correctos' => $correctos,'incorrectos' => $incorrectos, 'archivo' =>  $carpetaexporta,'comprimidos' => $archivos);

		echo json_encode($resultado);

		
		
	}

});

//verifica archivos solicitados sin limite peso para fines de reporteo
$app->post('/facturasQualitasImagenes', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());//recibimos los folios

	$correctos = array();
	$incorrectos = array();
	$archivos = array();
	$correctos = array();


	$Dia = date('d');
	$Mes = date('m');
	$Anyo = date('Y');


    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{

		$clave = generar_clave();
		$fechacarpeta =  $Dia . "-" . $Mes . "-" . $Anyo;
		$filename = "./facturas/archivo-". $fechacarpeta . "-". $clave . ".zip";
		$carpetaexporta = "api/facturas/archivo-". $fechacarpeta . "-". $clave . ".zip";

		// if (file_exists($filename)) {

		// 	if(unlink($filename)){
		// 	};
		// }

		$zip = new ZipArchive();
		$zip->open($filename, ZipArchive::CREATE);

		$pesototal = 14900000;//equivale a 15Mb peso total del zip
		$peso = 0;
		$pesofolio = 0;
		$maximofolios = 50;//maximo de folios por archivo
		$folio = 0;

		//verificamos folio x folio para ver si cumople con 
		foreach ($datos as $dato) {
			

			$folio = $dato->folioSistema;
			$fecha = $dato->FechaCaptura;

			$MesNro = date('m', strtotime($fecha));
			$DiaNro = date('d', strtotime($fecha));
			$AnyoNro = date('Y', strtotime($fecha));
			

			if($MesNro=='01'){ 
				$MesNro="1"; 
			} 

			if($MesNro=='02'){ 
				$MesNro="2"; 
			} 

			if($MesNro=='03'){ 
				$MesNro="3"; 
			} 

			if($MesNro=='04'){ 
				$MesNro="4"; 
			} 

			if($MesNro=='05'){ 
				$MesNro="5"; 
			} 

			if($MesNro=='06'){ 
				$MesNro="6"; 
			} 

			if($MesNro=='07'){ 
				$MesNro="7"; 
			} 

			if($MesNro=='08'){ 
				$MesNro="8"; 
			} 

			if($MesNro=='09'){ 
				$MesNro="9"; 
			} 


			$sql = "EXEC MVImgs_Datos @folio = '$folio'";
			$rs= odbc_exec($conexion,$sql);

			$nombre = odbc_result($rs,"Archivo");

			//$ruta = "C:\\Users\\salcala.MEDICAVIAL\\Desktop\\MV\\QUALITAS\\". $AnyoNro . "\\" . $MesNro . "\\". $folio;
			//ruta en producción
			$ruta = "\\\\Eaa\\RENAUT\\10\\". $AnyoNro . "\\" . $MesNro . "\\". $folio;

			$archivo1 = $ruta . "\\" . $nombre . "QS07.jpg";
			$archivo2 = $ruta . "\\" . $nombre . "GN19.jpg";
			$archivo3 = $ruta . "\\" . $nombre . "ME02.pdf";

			// if ($dato->TipoUnidad == 'Red') {
			// 	$archivo3 = $ruta . "\\" . $nombre . "ME02.jpg";
			// }else{
			// 	$archivo3 = $ruta . "\\" . $nombre . "ME02.pdf";
			// }
			

			if (file_exists($archivo1) && file_exists($archivo2) && file_exists($archivo3)) {


				// if ($peso < $pesototal ) {

				// 	if ($folio <= $maximofolios) {
						
				$pesoarchivo1 = filesize($archivo1);
				$pesoarchivo2 = filesize($archivo2);
				$pesoarchivo3 = filesize($archivo3);

				//sumamos el peso de los tres archivos del folio
				$pesofolio = $pesoarchivo1 + $pesoarchivo2 + $pesoarchivo3;
			    
			    $peso = $pesofolio + $peso;
				
				$rs= odbc_exec($conexion,$sql);

			    $zip->addFile($archivo1,$nombre . "QS07.jpg");
			    $zip->addFile($archivo2,$nombre . "GN19.jpg");
			    $zip->addFile($archivo3,$nombre . "ME02.pdf");

			    array_push($archivos, $dato);

			    $folio = $folio + 1;

				// 	}

				// }  

				array_push($correctos, $dato);
			   
			}else {

				
				array_push($incorrectos, $dato);

			}

		}

		$zip->close();
		$resultado = array('correctos' => $correctos,'incorrectos' => $incorrectos, 'archivo' =>  $carpetaexporta,'comprimidos' => $archivos);

		echo json_encode($resultado);

		
		
	}

});

//facturas de qualitas enviadas pero no procesadas
$app->post('/facturasQualitasenviadas', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());


	$fechaini = $datos->fechaini;
	$fechafin = $datos->fechafin;

	$fechafin = $fechafin . ' 23:59:58.999';

    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		

		$sql = "SELECT EnviosQualitas.ENQ_claveint, ENQ_fechaenvio,ENQ_procesado, (SELECT COUNT(*) from DetalleEnvio where DetalleEnvio.ENQ_claveint = EnviosQualitas.ENQ_claveint) as Cuenta
				FROM EnviosQualitas  WHERE ENQ_fechaenvio BETWEEN '$fechaini' and '$fechafin'";

		$rs= odbc_exec($conexion,$sql);

		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 


	            $valor1 = odbc_result($rs,"ENQ_claveint");
	            $valor2 = odbc_result($rs,"ENQ_fechaenvio");
	            $valor3 = odbc_result($rs,"ENQ_procesado");
	            $valor4 = odbc_result($rs,"Cuenta");

				$traspasosResultado['id'] =  $valor1;
	            $traspasosResultado['fecha'] =  $valor2;
	            $traspasosResultado['procesado'] =  $valor3;
	            $traspasosResultado['folios'] =  $valor4;

	            $valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		

	}

});

//facturas de qualitas enviadas detalle de folios no procesados
$app->get('/facturasQualitasenviadas/:envio', function($envio){

    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		

		$sql = "EXEC MVQualitasWSenviado @idenvio = $envio";

		$rs= odbc_exec($conexion,$sql);

		// $resultado = odbc_prepare($conexión, $sql);
		// odbc_setoption($resultado, 2, 0, 350);
		// $rs = odbc_execute($resultado); 

		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = odbc_result($rs,"folioElectronico");
	            $valor2 = odbc_result($rs,"folioAdministradora");
	            $valor3 = odbc_result($rs,"folioSistema"); //odbc_result($rs,"fechafax"));
	            $valor4 = odbc_result($rs,"claveproovedor");
	            $valor5 = odbc_result($rs,"claveprestador"); //odbc_result($rs,"fechaoriginal"));
	            $valor6 = odbc_result($rs,"Siniestro");
	            $valor7 = odbc_result($rs,"Reporte");
	            $valor8 = odbc_result($rs,"Poliza");
	            $valor9 = utf8_encode(odbc_result($rs,"Lesionado"));
	            $valor15 = odbc_result($rs,"Afectado");
	            $valor10 = odbc_result($rs,"Cobertura");
	            $valor11 = odbc_result($rs,"Subtotal");
	            $valor12 = odbc_result($rs,"iva");
	            $valor13 = odbc_result($rs,"Descuento");
	            $valor14 = odbc_result($rs,"Total");
	            $valor16 = odbc_result($rs,"TipoUnidad");
	            $valor17 = odbc_result($rs,"FechaCaptura");
	            $valor18 = odbc_result($rs,"procesado");



				$traspasosResultado['folioElectronico'] =  $valor1;
	            $traspasosResultado['folioAdministradora'] =  $valor2;
	            $traspasosResultado['folioSistema'] = $valor3;
	            $traspasosResultado['claveproovedor'] = $valor4;
	            $traspasosResultado['claveprestador'] =  $valor5;
	            $traspasosResultado['Siniestro'] =  $valor6;
	            $traspasosResultado['Reporte'] =  $valor7;
	            $traspasosResultado['Poliza'] = $valor8;
				$traspasosResultado['Lesionado'] = $valor9;
				$traspasosResultado['Afectado'] = $valor15;
				$traspasosResultado['Cobertura'] = $valor10;
				$traspasosResultado['Subtotal'] = $valor11;
				$traspasosResultado['iva'] = $valor12;
				$traspasosResultado['Descuento'] = $valor13;
				$traspasosResultado['Total'] = $valor14;
				$traspasosResultado['TipoUnidad'] = $valor16;
				$traspasosResultado['FechaCaptura'] = $valor17;

				if ($valor18) {
					$traspasosResultado['Procesado'] = true;
				}else{
					$traspasosResultado['Procesado'] = false;
				}
				


				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
			// $datos = array();
			// while( $row = odbc_fetch_array($rs) ) { 
			//     $datos[] = $row; 
			// }

			// echo json_encode($datos);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// 

	}

});

$app->post('/facturasQualitasPrincipal', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		foreach ($datos as $folio) {

			$folio = $folio->folioSistema;
			$sql = "UPDATE Pase SET PAS_procQ = 0 WHERE PAS_folio = '$folio'";
			$rs= odbc_exec($conexion,$sql);

		}

		$arr = array('respuesta' => 'Datos actualizados correctamente');
		echo json_encode($arr);

	}

});

//facturas de qualitas enviadas detalle de folios no procesados
$app->get('/facturasQualitasProcesadas/:envio', function($envio){

    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		

		$sql = "EXEC MVQualitasWSenviado @idenvio = $envio";

		$rs= odbc_exec($conexion,$sql);

		// $resultado = odbc_prepare($conexión, $sql);
		// odbc_setoption($resultado, 2, 0, 350);
		// $rs = odbc_execute($resultado); 

		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = odbc_result($rs,"folioElectronico");
	            $valor2 = odbc_result($rs,"folioAdministradora");
	            $valor3 = odbc_result($rs,"folioSistema"); //odbc_result($rs,"fechafax"));
	            $valor4 = odbc_result($rs,"claveproovedor");
	            $valor5 = odbc_result($rs,"claveprestador"); //odbc_result($rs,"fechaoriginal"));
	            $valor6 = odbc_result($rs,"Siniestro");
	            $valor7 = odbc_result($rs,"Reporte");
	            $valor8 = odbc_result($rs,"Poliza");
	            $valor9 = utf8_encode(odbc_result($rs,"Lesionado"));
	            $valor15 = odbc_result($rs,"Afectado");
	            $valor10 = odbc_result($rs,"Cobertura");
	            $valor11 = odbc_result($rs,"Subtotal");
	            $valor12 = odbc_result($rs,"iva");
	            $valor13 = odbc_result($rs,"Descuento");
	            $valor14 = odbc_result($rs,"Total");
	            $valor16 = odbc_result($rs,"TipoUnidad");
	            $valor17 = odbc_result($rs,"FechaCaptura");
	            $valor18 = odbc_result($rs,"procesado");

	            if ($valor18) {

					$traspasosResultado['folioElectronico'] =  $valor1;
		            $traspasosResultado['folioAdministradora'] =  $valor2;
		            $traspasosResultado['folioSistema'] = $valor3;
		            $traspasosResultado['claveproovedor'] = $valor4;
		            $traspasosResultado['claveprestador'] =  $valor5;
		            $traspasosResultado['Siniestro'] =  $valor6;
		            $traspasosResultado['Reporte'] =  $valor7;
		            $traspasosResultado['Poliza'] = $valor8;
					$traspasosResultado['Lesionado'] = $valor9;
					$traspasosResultado['Afectado'] = $valor15;
					$traspasosResultado['Cobertura'] = $valor10;
					$traspasosResultado['Subtotal'] = $valor11;
					$traspasosResultado['iva'] = $valor12;
					$traspasosResultado['Descuento'] = $valor13;
					$traspasosResultado['Total'] = $valor14;
					$traspasosResultado['TipoUnidad'] = $valor16;
					$traspasosResultado['FechaCaptura'] = $valor17;
					$traspasosResultado['Procesado'] = true;
					
					$valores[$i] = $traspasosResultado;
		            $i++;
	            	
	            }


			}

			echo json_encode($valores);
		
		}else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// 

	}

});

//facturas de qualitas enviadas y procesadas es decir aceptadas por qualitas
$app->post('/facturasQualitasprocesadas', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());


	$fechaini = $datos->fechaini;
	$fechafin = $datos->fechafin;

	$fechafin = $fechafin . ' 23:59:58.999';

    //$conexion = conectarActual();

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		

		$sql = "EXEC MVQualitasWSprocesado @fechaini = '$fechaini', @fechafin = '$fechafin'";

		$rs= odbc_exec($conexion,$sql);

		// $resultado = odbc_prepare($conexión, $sql);
		// odbc_setoption($resultado, 2, 0, 350);
		// $rs = odbc_execute($resultado); 

		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"folioElectronico"));
	            $valor2 = utf8_encode(odbc_result($rs,"folioAdministradora"));
	            $valor3 = utf8_encode(odbc_result($rs,"folioSistema")); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor4 = utf8_encode(odbc_result($rs,"claveproovedor"));
	            $valor5 = utf8_encode(odbc_result($rs,"claveprestador")); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor6 = utf8_encode(odbc_result($rs,"Siniestro"));
	            $valor7 = utf8_encode(odbc_result($rs,"Reporte"));
	            $valor8 = utf8_encode(odbc_result($rs,"Poliza"));
	            $valor9 = utf8_encode(odbc_result($rs,"Lesionado"));
	            $valor10 = odbc_result($rs,"Cobertura");
	            $valor11 = odbc_result($rs,"Subtotal");
	            $valor12 = odbc_result($rs,"iva");
	            $valor13 = odbc_result($rs,"Descuento");
	            $valor14 = odbc_result($rs,"Total");
	            $valor15 = odbc_result($rs,"Afectado");
	            $valor16 = odbc_result($rs,"clave");



				$traspasosResultado['folioElectronico'] =  $valor1;
	            $traspasosResultado['folioAdministradora'] =  $valor2;
	            $traspasosResultado['folioSistema'] = $valor3;
	            $traspasosResultado['claveproovedor'] = $valor4;
	            $traspasosResultado['claveprestador'] =  $valor5;
	            $traspasosResultado['Siniestro'] =  $valor6;
	            $traspasosResultado['Reporte'] =  $valor7;
	            $traspasosResultado['Poliza'] = $valor8;
				$traspasosResultado['Lesionado'] = $valor9;
				$traspasosResultado['Cobertura'] = $valor10;
				$traspasosResultado['Subtotal'] = $valor11;
				$traspasosResultado['iva'] = $valor12;
				$traspasosResultado['Descuento'] = $valor13;
				$traspasosResultado['Total'] = $valor14;
				$traspasosResultado['Afectado'] = $valor15;
				$traspasosResultado['clave'] = $valor16;


				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
			// $datos = array();
			// while( $row = odbc_fetch_array($rs) ) { 
			//     $datos[] = $row; 
			// }

			// echo json_encode($datos);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// 

	}

});

//inserta el motivo de rechazo del portal de qualitas 
$app->post('/facturasQualitasRechazosQ', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$fechaini = $datos->fechaini;
	$fechafin = $datos->fechafin;

	$fechafin = $fechafin . ' 23:59:58.999';

    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{

		$sql = "EXEC MVQualitasWSrechazado @fechaini = '$fechaini', @fechafin = '$fechafin'";

		$rs= odbc_exec($conexion,$sql);

		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = odbc_result($rs,"folioElectronico");
	            $valor2 = odbc_result($rs,"folioAdministradora");
	            $valor3 = odbc_result($rs,"folioSistema"); 
	            $valor4 = odbc_result($rs,"claveproovedor");
	            $valor5 = odbc_result($rs,"claveprestador"); 
	            $valor6 = odbc_result($rs,"Siniestro");
	            $valor7 = odbc_result($rs,"Reporte");
	            $valor8 = odbc_result($rs,"Poliza");
	            $valor9 = utf8_encode(odbc_result($rs,"Lesionado"));
	            $valor15 = odbc_result($rs,"Afectado");
	            $valor10 = odbc_result($rs,"Cobertura");
	            $valor11 = odbc_result($rs,"Subtotal");
	            $valor12 = odbc_result($rs,"iva");
	            $valor13 = odbc_result($rs,"Descuento");
	            $valor14 = odbc_result($rs,"Total");
	            // $valor16 = odbc_result($rs,"TipoUnidad");
	            $valor17 = odbc_result($rs,"FechaCaptura");
	            $valor18 = odbc_result($rs,"Unidad");
	            $valor19 = odbc_result($rs,"Motivo");


				$traspasosResultado['folioElectronico'] =  $valor1;
	            $traspasosResultado['folioAdministradora'] =  $valor2;
	            $traspasosResultado['folioSistema'] = $valor3;
	            $traspasosResultado['claveproovedor'] = $valor4;
	            $traspasosResultado['claveprestador'] =  $valor5;
	            $traspasosResultado['Siniestro'] =  $valor6;
	            $traspasosResultado['Reporte'] =  $valor7;
	            $traspasosResultado['Poliza'] = $valor8;
				$traspasosResultado['Lesionado'] = $valor9;
				$traspasosResultado['Afectado'] = $valor15;
				$traspasosResultado['Cobertura'] = $valor10;
				$traspasosResultado['Subtotal'] = $valor11;
				$traspasosResultado['iva'] = $valor12;
				$traspasosResultado['Descuento'] = $valor13;
				$traspasosResultado['Total'] = $valor14;
				// $traspasosResultado['TipoUnidad'] = $valor16;
				$traspasosResultado['FechaCaptura'] = $valor17;
				$traspasosResultado['Unidad'] = $valor18;
				$traspasosResultado['Motivo'] = $valor19;

				$valores[$i] = $traspasosResultado;
	            $i++;
	 

			}

			if (count($valores)>0) {
				echo json_encode($valores);
			}else{
				$arr = array('respuesta' => 'Datos No Encontrados');
				echo json_encode($arr);
			}

		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		

		
	}

});

//consulta facturas rechazadas por qualitas
$app->post('/facturasQualitasRechazos', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());//recibimos los folios

	$Dia = date('d');
	$Mes = date('m');
	$Anyo = date('Y');

    $conexion = conectarActual();

    //$conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{

		foreach ($datos as $dato) {
				
				$folio = $dato->folioSistema;
				$observaciones = $dato->Motivo;

				$sql ="UPDATE Pase SET PAS_procQ = 4, PAS_procQObs = '$observaciones' where PAS_folio = '$folio'";
				$rs = odbc_exec($conexion,$sql);

		}

		
	}

});

//verifica que existan los archivos de cada folio
$app->post('/facturasQualitasInserta', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());//recibimos los folios

	$Dia = date('d');
	$Mes = date('m');
	$Anyo = date('Y');



    $conexion = conectarActual();

    //$conexion = conectarActual();

   

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{

		$sql = "INSERT INTO EnviosQualitas (ENQ_fechaenvio,ENQ_procesado) VALUES ( GETDATE(),0)";
		$rs = odbc_exec($conexion,$sql);

		$sql2 = "SELECT MAX(ENQ_claveint) as Ultimo FROM EnviosQualitas";
		$rs2 = odbc_exec($conexion,$sql2);

		$ultimo = odbc_result($rs2,"Ultimo");
		//
		foreach ($datos->correctos as $dato) {
				
				$folio = $dato->folioSistema;

				$sql3 = "INSERT INTO DetalleEnvio (ENQ_claveint,PAS_folio,DEE_procesado) VALUES ( $ultimo,'$folio',0)";
				$rs3 = odbc_exec($conexion,$sql3);

				$sql4 ="UPDATE Pase SET PAS_procQ = 1 where PAS_folio = '$folio'";
				$rs4 = odbc_exec($conexion,$sql4);

		}

		foreach ($datos->incorrectos as $dato) {
				
				$folio = $dato->folioSistema;

				$sql5 ="UPDATE Pase SET PAS_procQ = 3 where PAS_folio = '$folio'";
				$rs5 = odbc_exec($conexion,$sql5);

		}

		
	}

});


//verifica que existan los archivos de cada folio
$app->post('/facturasQualitasInsertaFaltaArchivos', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());//recibimos los folios

	$Dia = date('d');
	$Mes = date('m');
	$Anyo = date('Y');



    $conexion = conectarActual();

    //$conexion = conectarActual();

   

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{

		foreach ($datos->incorrectos as $dato) {
				
				$folio = $dato->folioSistema;

				$sql5 ="UPDATE Pase SET PAS_procQ = 3 where PAS_folio = '$folio'";
				$rs5 = odbc_exec($conexion,$sql5);

		}

		
	}

});


//verifica que existan los archivos de cada folio
$app->post('/facturasQualitasActualiza/:id', function($id){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());//recibimos los folios

	$Dia = date('d');
	$Mes = date('m');
	$Anyo = date('Y');

	$i = 0;
	$valores = array();

    $conexion = conectarActual();

    //$conexion = conectarActual();

   

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{

		$sql = "UPDATE EnviosQualitas SET ENQ_fechaprocesado = GETDATE() ,ENQ_procesado = 1 where ENQ_claveint = $id";
		$rs = odbc_exec($conexion,$sql);

		foreach ($datos as $dato) {
				
				$folio = $dato->folioSistema;

				$sql3 ="UPDATE DetalleEnvio SET DEE_procesado = 1 where PAS_folio = '$folio' and ENQ_claveint = $id";
				$rs3 = odbc_exec($conexion,$sql3);

				$sql4 ="UPDATE Pase SET PAS_procQ = 2 where PAS_folio = '$folio'";
				$rs4 = odbc_exec($conexion,$sql4);

		}
		
		$sql = "UPDATE Pase SET PAS_procQ = 0 where PAS_folio in ( SELECT PAS_folio FROM DetalleEnvio where ENQ_claveint = $id and DEE_procesado = 0) ";
		$rs = odbc_exec($conexion,$sql);
		

		$sql2 = "SELECT * FROM DetalleEnvio where ENQ_claveint = $id and DEE_procesado = 0";
		$rs2 = odbc_exec($conexion,$sql2);

		if( odbc_num_rows($rs2) > 0 ) { 

			while (odbc_fetch_row($rs2)){ 

	            $valor1 = odbc_result($rs2,"PAS_folio"); 
	            $traspasosResultado['folioSistema'] = $valor1;

	            $valores[$i] = $traspasosResultado;
	            $i++;

			}
		}

		$respuesta = array('respuesta' => 'Datos procesados Correctamente','faltantes' => $valores);

		echo json_encode($respuesta);

	}

});

///listado general al usuario
$app->get('/folioactivoarea/:area', function($area){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_DCU_ListadoDocumentosXArea  @area=$area";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 
				
				$valor1 = utf8_encode(odbc_result($rs,"folio"));
	            $valor2 = utf8_encode(odbc_result($rs,"etapa"));
	            $valor3 = utf8_encode(odbc_result($rs,"fax"));
	            $valor4 = odbc_result($rs,"fechafax"); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = utf8_encode(odbc_result($rs,"original"));
	            $valor6 = odbc_result($rs,"fechaoriginal"); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor7 = utf8_encode(odbc_result($rs,"facExp"));
	            $valor8 = odbc_result($rs,"fechaFacExp"); //utf8_encode(odbc_result($rs,"fechaFacExp"));
	            $valor9 = utf8_encode(odbc_result($rs,"situacion"));
	            $valor10 = utf8_encode(odbc_result($rs,"unidad"));
	            $valor11 = odbc_result($rs,"fechapago"); //utf8_encode(odbc_result($rs,"fechapago"));
	            $valor12 = odbc_result($rs,"fechacaptura"); //utf8_encode(odbc_result($rs,"fechacaptura"));
	            $valor13 = utf8_encode(odbc_result($rs,"DOC_lesionado"));
	            $valor14 = utf8_encode(odbc_result($rs,"DOC_factura"));
	            $valor15 = utf8_encode(odbc_result($rs,"DOC_remesa"));
	            $valor16 = utf8_encode(odbc_result($rs,"PRO_nombre"));
	            $valor17 = utf8_encode(odbc_result($rs,"ESC_nombre"));
	            $valor18 = utf8_encode(odbc_result($rs,"cancelado"));
	            $valor19 = utf8_encode(odbc_result($rs,"etapaEntrega"));
	            $valor20 = utf8_encode(odbc_result($rs,"EMP_nombrecorto"));



	            //echo $valor1;
	            //echo $valor2;
				$traspasosResultado['Folio'] = $valor1;
	            $traspasosResultado['Etapa'] = $valor2;
	            $traspasosResultado['Fax'] = $valor3;
	            $traspasosResultado['FechaFax'] = $valor4;
	            $traspasosResultado['Original'] = $valor5;
	            $traspasosResultado['FechaOriginal'] = $valor6;
	            $traspasosResultado['F.E.'] = $valor7;
	            $traspasosResultado['FechaF.E.'] = $valor8;
	            $traspasosResultado['Situacion'] = $valor9;
	            $traspasosResultado['Unidad'] = $valor10;
	            $traspasosResultado['FechaPago'] = $valor11;
	            $traspasosResultado['FechaCaptura'] = $valor12;
	            $traspasosResultado['Lesionado'] = $valor13;
	            $traspasosResultado['Factura'] = $valor14;
	            $traspasosResultado['Remesa'] = $valor15;
	            $traspasosResultado['Producto'] = $valor16;
	            $traspasosResultado['Escolaridad'] = $valor17;
	            $traspasosResultado['Cancelado'] = $valor18;
	            $traspasosResultado['Numero'] = $valor19;
	            $traspasosResultado['Empresa'] = $valor20;
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		odbc_close($conexion);

	}

});

///folios activos por area x fecha de captura
$app->post('/folioactivoareafecha', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$area = $datos->area;
	$fechaini = $datos->fechaini;
	$fechafin = $datos->fechafin;

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sqlAux = "EXEC MV_DCU_ListadoDocumentosXAreaXfecha @area = $area,
		@fechaIni = N'$fechaini',
		@fechaFin = N'$fechafin'";

		$rs= odbc_exec($conexion,$sqlAux); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 
				
				$valor1 = utf8_encode(odbc_result($rs,"folio"));
	            $valor2 = utf8_encode(odbc_result($rs,"etapa"));
	            $valor3 = utf8_encode(odbc_result($rs,"fax"));
	            $valor4 = odbc_result($rs,"fechafax"); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = utf8_encode(odbc_result($rs,"original"));
	            $valor6 = odbc_result($rs,"fechaoriginal"); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor7 = utf8_encode(odbc_result($rs,"facExp"));
	            $valor8 = odbc_result($rs,"fechaFacExp"); //utf8_encode(odbc_result($rs,"fechaFacExp"));
	            $valor9 = utf8_encode(odbc_result($rs,"situacion"));
	            $valor10 = utf8_encode(odbc_result($rs,"unidad"));
	            $valor11 = odbc_result($rs,"fechapago"); //utf8_encode(odbc_result($rs,"fechapago"));
	            $valor12 = odbc_result($rs,"fechacaptura"); //utf8_encode(odbc_result($rs,"fechacaptura"));
	            $valor13 = utf8_encode(odbc_result($rs,"DOC_lesionado"));
	            $valor14 = utf8_encode(odbc_result($rs,"DOC_factura"));
	            $valor15 = utf8_encode(odbc_result($rs,"DOC_remesa"));
	            $valor16 = utf8_encode(odbc_result($rs,"PRO_nombre"));
	            $valor17 = utf8_encode(odbc_result($rs,"ESC_nombre"));
	            $valor18 = utf8_encode(odbc_result($rs,"cancelado"));
	            $valor19 = utf8_encode(odbc_result($rs,"etapaEntrega"));
	            $valor20 = utf8_encode(odbc_result($rs,"EMP_nombrecorto"));



	            //echo $valor1;
	            //echo $valor2;
				$traspasosResultado['Folio'] = $valor1;
	            $traspasosResultado['Etapa'] = $valor2;
	            $traspasosResultado['Fax'] = $valor3;
	            $traspasosResultado['FechaFax'] = $valor4;
	            $traspasosResultado['Original'] = $valor5;
	            $traspasosResultado['FechaOriginal'] = $valor6;
	            $traspasosResultado['F.E.'] = $valor7;
	            $traspasosResultado['FechaF.E.'] = $valor8;
	            $traspasosResultado['Situacion'] = $valor9;
	            $traspasosResultado['Unidad'] = $valor10;
	            $traspasosResultado['FechaPago'] = $valor11;
	            $traspasosResultado['FechaCaptura'] = $valor12;
	            $traspasosResultado['Lesionado'] = $valor13;
	            $traspasosResultado['Factura'] = $valor14;
	            $traspasosResultado['Remesa'] = $valor15;
	            $traspasosResultado['Producto'] = $valor16;
	            $traspasosResultado['Escolaridad'] = $valor17;
	            $traspasosResultado['Cancelado'] = $valor18;
	            $traspasosResultado['Numero'] = $valor19;
	            $traspasosResultado['Empresa'] = $valor20;
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// odbc_close($conexion);

	}

});

///buscamos folios web 
$app->get('/folioweb/:folio', function($folio){

    $db = conectarMySQL();

    if(!$db) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT EXP_nombre as Nombre,
				             EXP_paterno as Paterno,
				             EXP_materno as Materno,
				             IFNULL(PRO_clave,-1) as PROClave,
				             IFNULL(CIA_claveMV,-1) as CIAClaveMV,
				             IFNULL(UNI_claveMV,-1) as UNIClaveMV,
				             IFNULL(ESC_claveMV,-1) as ESCClaveMV,
				             Expediente.Cia_clave,
				             Expediente.Uni_clave
				FROM Expediente INNER JOIN Compania    ON Compania.CIA_clave=Expediente.CIA_clave
				                INNER JOIN Unidad        ON Unidad.UNI_clave=Expediente.UNI_clave
				                LEFT    JOIN Escolaridad ON Escolaridad.ESC_clave = Expediente.ESC_clave 
				WHERE EXP_folio = '$folio'";

		$result = $db->query($sql);
        $folios = $result->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($folios);

    }

});

//Entrega los documentos que estan pendientes por recibir el usuario
$app->get('/listarecepcion/:usuario', function($usuario){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_FLU_ListaRecepcionXUsu  @usuario=$usuario";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"PAS_folio"));
	            $valor2 = utf8_encode(odbc_result($rs,"FLD_etapa"));
	            $valor4 = utf8_encode(odbc_result($rs,"FLD_numeroEntrega")); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = utf8_encode(odbc_result($rs,"EMP_nombrecorto"));
	            $valor6 = utf8_encode(odbc_result($rs,"FLD_formaRecep")); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor7 = utf8_encode(odbc_result($rs,"FLD_fechaRecep"));
	            $valor9 = utf8_encode(odbc_result($rs,"USU_recibe"));
	            $valor10 = utf8_encode(odbc_result($rs,"UNI_nombrecorto"));
	            $valor11 = utf8_encode(odbc_result($rs,"EntregadoPor"));
	            // $valor12 = utf8_encode(odbc_result($rs,"ROC"));
	            $valor13 = utf8_encode(odbc_result($rs,"UNI_nombrecorto"));
	            $valor14 = utf8_encode(odbc_result($rs,"USU_rec"));
	            $valor15 = utf8_encode(odbc_result($rs,"DOC_claveint"));
	            $valor16 = utf8_encode(odbc_result($rs,"FLD_claveint"));
	            $valor17 = utf8_encode(odbc_result($rs,"FLD_AROrec"));
	            $valor18 = utf8_encode(odbc_result($rs,"ARO_porRecibir"));
	            $valor19 = utf8_encode(odbc_result($rs,"FLD_AROent"));
	            $valor20 = utf8_encode(odbc_result($rs,"USU_ent"));

				$traspasosResultado['Folio'] = $valor1;
	            $traspasosResultado['Etapa'] = $valor2;
	            $traspasosResultado['Cantidad'] = $valor4;
	            $traspasosResultado['Empresa'] = $valor5;
	            $traspasosResultado['FaxOrigianl'] = $valor6;
	            $traspasosResultado['FechaRecepcion'] = $valor7;
	            $traspasosResultado['USU_recibe'] = $valor9;
	            $traspasosResultado['Unidad'] = $valor10;
	            $traspasosResultado['EntregadoPor'] = $valor11;
	            $traspasosResultado['USU_rec'] = $valor14;
	            $traspasosResultado['Unidad'] = $valor13;
				// $traspasosResultado['PorEntregarA'] = $valor14;
				$traspasosResultado['DOC_claveint'] = $valor15;
				$traspasosResultado['FLD_claveint'] = $valor16;
				$traspasosResultado['FLD_AROrec'] = $valor17;
				$traspasosResultado['ARO_porRecibir'] = $valor18;
				$traspasosResultado['FLD_AROent'] = $valor19;
				$traspasosResultado['USU_ent'] = $valor20;
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// 
	}

});

//manda correo a responsable operativo para 
$app->post('/generapeticion',function(){
	
	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());
	



	// Varios destinatarios
	$para  = 'jolvera@medicavial.com.mx'; //. ', '; // atención a la coma
	//$para .= 'salcala@medicavial.com.mx';

	// título
	$título = 'Recordatorio de cumpleaños para Agosto';

	$bootstrap = file_get_contents('../css/bootstrap.min.css');

	// mensaje
	$mensaje = '
	<html>
	<head>
	  <title>Recordatorio de cumpleaños para Agosto</title>
	  <style>' . $bootstrap . 
	  '</style>
	</head>
	<body>
	  <p>¡Estos son los cumpleaños para Agosto!</p>
	  <table>
	    <tr>
	      <th>Quien</th><th>Día</th><th>Mes</th><th>Año</th>
	    </tr>
	    <tr>
	      <td>Joe</td><td>3</td><td>Agosto</td><td>1970</td>
	    </tr>
	    <tr>
	      <td>Sally</td><td>17</td><td>Agosto</td><td>1973</td>
	    </tr>
	  </table>
	</body>
	</html>
	';

	// Para enviar un correo HTML, debe establecerse la cabecera Content-type
	$cabeceras  = 'MIME-Version: 1.0' . "\r\n";
	$cabeceras .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

	// Cabeceras adicionales
	$cabeceras .= 'From: Sistema de Flujo <salcala@medicavial.com.mx>' . "\r\n";

	// Enviarlo
	mail($para, $título, $mensaje, $cabeceras);
	
});

//Entrega al usuario los documentos pendientes por recibir 
$app->get('/listaentrega/:usuario', function($usuario){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_FLU_ListaEntregaXUsu  @usuario=$usuario";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"PAS_folio"));
	            $valor2 = utf8_encode(odbc_result($rs,"FLD_etapa"));
	            $valor4 = utf8_encode(odbc_result($rs,"FLD_numeroEntrega")); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = utf8_encode(odbc_result($rs,"EMP_nombrecorto"));
	            $valor6 = utf8_encode(odbc_result($rs,"FLD_formaRecep")); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor7 = utf8_encode(odbc_result($rs,"FLD_fechaRecep"));
	            $valor9 = utf8_encode(odbc_result($rs,"ROC"));
	            $valor10 = utf8_encode(odbc_result($rs,"UNI_nombrecorto"));
	            $valor11 = utf8_encode(odbc_result($rs,"porEntregarA"));
	            $valor12 = utf8_encode(odbc_result($rs,"DOC_claveint"));
	            $valor13 = utf8_encode(odbc_result($rs,"FLD_claveint"));
	            $valor14 = utf8_encode(odbc_result($rs,"FLD_AROent"));
	            $valor15 = utf8_encode(odbc_result($rs,"ARO_porRecibir"));


				$traspasosResultado['Folio'] = $valor1;
	            $traspasosResultado['Etapa'] = $valor2;
	            $traspasosResultado['Cantidad'] = $valor4;
	            $traspasosResultado['Empresa'] = $valor5;
	            $traspasosResultado['FaxOrigianl'] = $valor6;
	            $traspasosResultado['FechaRecepcion'] = $valor7;
	            $traspasosResultado['ROC'] = $valor9;
	            $traspasosResultado['Unidad'] = $valor10;
				$traspasosResultado['PorEntregarA'] = $valor11;
				$traspasosResultado['DOC_claveint'] = $valor12;
				$traspasosResultado['FLD_claveint'] = $valor13;
				$traspasosResultado['FLD_AROent'] = $valor14;
				$traspasosResultado['ARO_porRecibir'] = $valor15;

				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		

	}

});

//muestra el folio donde esta en el flujo
$app->get('/listaflujo/:folio', function($folio){


    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_FLU_BuscaDocumento  @folio='$folio'";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"Usuario"));
	            $valor2 = utf8_encode(odbc_result($rs,"Tipo"));
	            $valor3 = utf8_encode(odbc_result($rs,"ARO_Nombre"));
	            $valor4 = odbc_result($rs,"FLD_etapa"); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = odbc_result($rs,"FLD_numeroEntrega");
	            $valor6 = utf8_encode(odbc_result($rs,"Status")); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	           

				$traspasosResultado['Usuario'] = $valor1;
	            $traspasosResultado['Tipo'] = $valor2;
	            $traspasosResultado['Area'] = $valor3;
	            $traspasosResultado['Etapa'] = $valor4;
	            $traspasosResultado['Entrega'] = $valor5;
	            $traspasosResultado['Status'] = $valor6;
	            
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}
		//Solo para testear las variables que quiero obtener de lo que estoy mandando
		//$arr = array('a' => $sql);
		//echo json_encode($arr);


		

	}

});

///listado general al usuario
$app->get('/listageneral/:usuario', function($usuario){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_FLU_ListaGralXUsu  @usuario=$usuario";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 
				
				$valor1 = utf8_encode(odbc_result($rs,"PAS_folio"));
	            $valor2 = utf8_encode(odbc_result($rs,"FLD_etapa"));
	            $valor4 = utf8_encode(odbc_result($rs,"FLD_numeroEntrega")); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = utf8_encode(odbc_result($rs,"EMP_nombrecorto"));
	            $valor6 = utf8_encode(odbc_result($rs,"FLD_formaRecep")); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor7 = utf8_encode(odbc_result($rs,"FLD_fechaRecep"));
	            $valor9 = odbc_result($rs,"FLD_AROent");
	            $valor10 = utf8_encode(odbc_result($rs,"UNI_nombrecorto"));
	            $valor11 = odbc_result($rs,"CapEt2");
	            $valor12 = odbc_result($rs,"USU_ent");
	            $valor13 = odbc_result($rs,"EnvFac");
	            $valor14 = odbc_result($rs,"FLD_claveint");
	            $valor15 = odbc_result($rs,"ARO_Activa");
	            $valor16 = odbc_result($rs,"DOC_claveint");
	            $valor17 = odbc_result($rs,"FLD_observaciones"); 
	            
	            

				$traspasosResultado['Folio'] = $valor1;
	            $traspasosResultado['Etapa'] = $valor2;
	            $traspasosResultado['Cantidad'] = $valor4;
	            $traspasosResultado['Empresa'] = $valor5;
	            $traspasosResultado['FaxOrigianl'] = $valor6;
	            $traspasosResultado['FechaRecepcion'] = $valor7;
	            $traspasosResultado['FLD_AROent'] = $valor9;
	            $traspasosResultado['Unidad'] = $valor10;
	            $traspasosResultado['CapEt2'] = $valor11;
	            $traspasosResultado['USU_ent'] = $valor12;
	            $traspasosResultado['EnvFac'] = $valor13;
	            $traspasosResultado['FLD_claveint'] = $valor14;
	            $traspasosResultado['area'] = $valor15;
	            $traspasosResultado['documento'] = $valor16;
	            $traspasosResultado['Observaciones'] = $valor17;
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// odbc_close($conexion);

	}

});

///listado general al usuario
$app->get('/listageneralnpc/:usuario', function($usuario){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_FLU_ListaGralXUsuNPC  @usuario=$usuario";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 
				
				$valor1 = utf8_encode(odbc_result($rs,"PAS_folio"));
	            $valor2 = utf8_encode(odbc_result($rs,"FLD_etapa"));
	            $valor4 = utf8_encode(odbc_result($rs,"FLD_numeroEntrega")); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = utf8_encode(odbc_result($rs,"EMP_nombrecorto"));
	            $valor6 = utf8_encode(odbc_result($rs,"FLD_formaRecep")); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor7 = utf8_encode(odbc_result($rs,"FLD_fechaRecep"));
	            $valor9 = odbc_result($rs,"FLD_AROent");
	            $valor10 = utf8_encode(odbc_result($rs,"UNI_nombrecorto"));
	            $valor11 = odbc_result($rs,"CapEt2");
	            $valor12 = odbc_result($rs,"USU_ent");
	            $valor13 = odbc_result($rs,"EnvFac");
	            $valor14 = odbc_result($rs,"FLD_claveint");
	            $valor15 = odbc_result($rs,"ARO_Activa");
	            $valor16 = odbc_result($rs,"DOC_claveint");
	            $valor17 = odbc_result($rs,"FLD_observaciones"); 
	            
	            

				$traspasosResultado['Folio'] = $valor1;
	            $traspasosResultado['Etapa'] = $valor2;
	            $traspasosResultado['Cantidad'] = $valor4;
	            $traspasosResultado['Empresa'] = $valor5;
	            $traspasosResultado['FaxOrigianl'] = $valor6;
	            $traspasosResultado['FechaRecepcion'] = $valor7;
	            $traspasosResultado['FLD_AROent'] = $valor9;
	            $traspasosResultado['Unidad'] = $valor10;
	            $traspasosResultado['CapEt2'] = $valor11;
	            $traspasosResultado['USU_ent'] = $valor12;
	            $traspasosResultado['EnvFac'] = $valor13;
	            $traspasosResultado['FLD_claveint'] = $valor14;
	            $traspasosResultado['area'] = $valor15;
	            $traspasosResultado['documento'] = $valor16;
	            $traspasosResultado['Observaciones'] = $valor17;
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// odbc_close($conexion);

	}

});

//Entrega al usuario del area de pagos sus folios activos
$app->get('/listapagos', function(){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_FLU_ListaPagos";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"USUNombre"));
	            $valor2 = utf8_encode(odbc_result($rs,"Cliente"));
	            $valor3 = utf8_encode(odbc_result($rs,"Unidad")); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor4 = utf8_encode(odbc_result($rs,"Folio"));
	            $valor5 = utf8_encode(odbc_result($rs,"Lesionado")); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor6 = utf8_encode(odbc_result($rs,"Etapa"));
	            $valor7 = utf8_encode(odbc_result($rs,"Entrega"));
	            $valor8 = utf8_encode(odbc_result($rs,"FormaRecep"));
	            $valor9 = utf8_encode(odbc_result($rs,"fechaRecepcion"));
	            $valor10 = utf8_encode(odbc_result($rs,"FechaRecepPag"));
	            $valor11 = utf8_encode(odbc_result($rs,"Relacion"));
	            $valor12 = utf8_encode(odbc_result($rs,"RelP"));
	            $valor13 = utf8_encode(odbc_result($rs,"PasC"));
	            $valor14 = utf8_encode(odbc_result($rs,"FPasCobrado"));
	            $valor15 = utf8_encode(odbc_result($rs,"Pago"));
	            $valor16 = utf8_encode(odbc_result($rs,"Reserva"));
	            $valor17 = utf8_encode(odbc_result($rs,"LNombre"));
	            $valor18 = utf8_encode(odbc_result($rs,"TNombre"));
	            $valor19 = utf8_encode(odbc_result($rs,"Pagado"));
	            $valor20 = utf8_encode(odbc_result($rs,"Cobrado"));
	            $valor21 = utf8_encode(odbc_result($rs,"FacRel"));
	            $valor22 = utf8_encode(odbc_result($rs,"FacDoc"));



				$traspasosResultado['USUNombre'] = $valor1;
	            $traspasosResultado['Cliente'] = $valor2;
	            $traspasosResultado['Unidad'] = $valor3;
	            $traspasosResultado['Folio'] = $valor4;
	            $traspasosResultado['Lesionado'] = $valor5;
	            $traspasosResultado['Etapa'] = $valor6;
	            $traspasosResultado['Entrega'] = $valor7;
	            $traspasosResultado['FormaRecep'] = $valor8;
				$traspasosResultado['fechaRecepcion'] = $valor9;
				$traspasosResultado['FechaRecepPag'] = $valor10;
				$traspasosResultado['Relacion'] = $valor11;
				$traspasosResultado['RelP'] = $valor12;
				$traspasosResultado['PasC'] = $valor13;
				$traspasosResultado['FPasCobrado'] = $valor14;
				$traspasosResultado['Pago'] = $valor15;
				$traspasosResultado['Reserva'] = $valor16;
				$traspasosResultado['LNombre'] = $valor17;
				$traspasosResultado['TNombre'] = $valor18;
				$traspasosResultado['Pagado'] = $valor19;
				$traspasosResultado['Cobrado'] = $valor20;
				$traspasosResultado['FacturaRelacion'] = $valor21;
				$traspasosResultado['FacturaControl'] = $valor22;


				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		

	}
	
});


//Entrega al usuario del area de pagos sus folios activos
$app->post('/listapagosfechas', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());


	$fechaini = $datos->fechaini;
	$fechafin = $datos->fechafin;

	$fechafin = $fechafin . ' 23:59:58.999';

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		

		$sql = "EXEC MV_FLU_ListaPagosXfechaRecepcionPagos @fechaini = '$fechaini', @fechafin = '$fechafin'";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1  = utf8_encode(odbc_result($rs,"USUNombre"));
	            $valor2  = utf8_encode(odbc_result($rs,"Cliente"));
	            $valor3  = utf8_encode(odbc_result($rs,"Unidad")); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor4  = utf8_encode(odbc_result($rs,"Folio"));
	            $valor5  = utf8_encode(odbc_result($rs,"Lesionado")); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor6  = utf8_encode(odbc_result($rs,"Etapa"));
	            $valor7  = utf8_encode(odbc_result($rs,"Entrega"));
	            $valor8  = utf8_encode(odbc_result($rs,"FormaRecep"));
	            $valor9  = utf8_encode(odbc_result($rs,"fechaRecepcion"));
	            $valor10 = utf8_encode(odbc_result($rs,"FechaRecepPag"));
	            $valor11 = utf8_encode(odbc_result($rs,"Relacion"));
	            $valor12 = utf8_encode(odbc_result($rs,"RelP"));
	            $valor13 = utf8_encode(odbc_result($rs,"PasC"));
	            $valor14 = utf8_encode(odbc_result($rs,"FPasCobrado"));
	            $valor15 = utf8_encode(odbc_result($rs,"Pago"));
	            $valor16 = utf8_encode(odbc_result($rs,"Reserva"));
	            $valor17 = utf8_encode(odbc_result($rs,"LNombre"));
	            $valor18 = utf8_encode(odbc_result($rs,"TNombre"));
	            $valor19 = utf8_encode(odbc_result($rs,"Pagado"));
	            $valor20 = utf8_encode(odbc_result($rs,"Cobrado"));
	            $valor21 = utf8_encode(odbc_result($rs,"FacRel"));
	            $valor22 = utf8_encode(odbc_result($rs,"FacDoc"));



				$traspasosResultado['USUNombre'] = $valor1;
	            $traspasosResultado['Cliente'] = $valor2;
	            $traspasosResultado['Unidad'] = $valor3;
	            $traspasosResultado['Folio'] = $valor4;
	            $traspasosResultado['Lesionado'] = $valor5;
	            $traspasosResultado['Etapa'] = $valor6;
	            $traspasosResultado['Entrega'] = $valor7;
	            $traspasosResultado['FormaRecep'] = $valor8;
				$traspasosResultado['fechaRecepcion'] = $valor9;
				$traspasosResultado['FechaRecepPag'] = $valor10;
				$traspasosResultado['Relacion'] = $valor11;
				$traspasosResultado['RelP'] = $valor12;
				$traspasosResultado['PasC'] = $valor13;
				$traspasosResultado['FPasCobrado'] = $valor14;
				$traspasosResultado['Pago'] = $valor15;
				$traspasosResultado['Reserva'] = $valor16;
				$traspasosResultado['LNombre'] = $valor17;
				$traspasosResultado['TNombre'] = $valor18;
				$traspasosResultado['Pagado'] = $valor19;
				$traspasosResultado['Cobrado'] = $valor20;
				$traspasosResultado['FacturaRelacion'] = $valor21;
				$traspasosResultado['FacturaControl'] = $valor22;


				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		

	}

});

//Entrega al usuario del area de pagos sus folios activos
$app->post('/listapagosfechasrecepcion', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$fechaini = $datos->fechaini;
	$fechafin = $datos->fechafin;

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{

		$sql = "EXEC MV_FLU_ListaPagosXfechaRecepcion @fechaini = '$fechaini', @fechafin = '$fechafin'";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"USUNombre"));
	            $valor2 = utf8_encode(odbc_result($rs,"Cliente"));
	            $valor3 = utf8_encode(odbc_result($rs,"Unidad")); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor4 = utf8_encode(odbc_result($rs,"Folio"));
	            $valor5 = utf8_encode(odbc_result($rs,"Lesionado")); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor6 = utf8_encode(odbc_result($rs,"Etapa"));
	            $valor7 = utf8_encode(odbc_result($rs,"Entrega"));
	            $valor8 = utf8_encode(odbc_result($rs,"FormaRecep"));
	            $valor9 = utf8_encode(odbc_result($rs,"fechaRecepcion"));
	            $valor10 = utf8_encode(odbc_result($rs,"FechaRecepPag"));
	            $valor11 = utf8_encode(odbc_result($rs,"Relacion"));
	            $valor12 = utf8_encode(odbc_result($rs,"RelP"));
	            $valor13 = utf8_encode(odbc_result($rs,"PasC"));
	            $valor14 = utf8_encode(odbc_result($rs,"FPasCobrado"));
	            $valor15 = utf8_encode(odbc_result($rs,"Pago"));
	            $valor16 = utf8_encode(odbc_result($rs,"Reserva"));
	            $valor17 = utf8_encode(odbc_result($rs,"LNombre"));
	            $valor18 = utf8_encode(odbc_result($rs,"TNombre"));
	            $valor19 = utf8_encode(odbc_result($rs,"Pagado"));
	            $valor20 = utf8_encode(odbc_result($rs,"Cobrado"));
	            $valor21 = utf8_encode(odbc_result($rs,"FacRel"));
	            $valor22 = utf8_encode(odbc_result($rs,"FacDoc"));



				$traspasosResultado['USUNombre'] = $valor1;
	            $traspasosResultado['Cliente'] = $valor2;
	            $traspasosResultado['Unidad'] = $valor3;
	            $traspasosResultado['Folio'] = $valor4;
	            $traspasosResultado['Lesionado'] = $valor5;
	            $traspasosResultado['Etapa'] = $valor6;
	            $traspasosResultado['Entrega'] = $valor7;
	            $traspasosResultado['FormaRecep'] = $valor8;
				$traspasosResultado['fechaRecepcion'] = $valor9;
				$traspasosResultado['FechaRecepPag'] = $valor10;
				$traspasosResultado['Relacion'] = $valor11;
				$traspasosResultado['RelP'] = $valor12;
				$traspasosResultado['PasC'] = $valor13;
				$traspasosResultado['FPasCobrado'] = $valor14;
				$traspasosResultado['Pago'] = $valor15;
				$traspasosResultado['Reserva'] = $valor16;
				$traspasosResultado['LNombre'] = $valor17;
				$traspasosResultado['TNombre'] = $valor18;
				$traspasosResultado['Pagado'] = $valor19;
				$traspasosResultado['Cobrado'] = $valor20;
				$traspasosResultado['FacturaRelacion'] = $valor21;
				$traspasosResultado['FacturaControl'] = $valor22;


				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		// 

	}

});


//muestra los rechazos que tiene el usuario
$app->get('/listarechazos/:usuario', function($usuario){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		

		//verificar filtro de rechazo
		$sql = "EXEC MV_FLU_ListaGralXUsuRechazo  @usuario=$usuario";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"PAS_folio"));
	            $valor2 = utf8_encode(odbc_result($rs,"FLD_etapa"));
	            $valor4 = utf8_encode(odbc_result($rs,"FLD_numeroEntrega")); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = utf8_encode(odbc_result($rs,"EMP_nombrecorto"));
	            $valor6 = utf8_encode(odbc_result($rs,"FLD_formaRecep")); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor7 = utf8_encode(odbc_result($rs,"FLD_fechaRecep"));
	            $valor9 = utf8_encode(odbc_result($rs,"EnvFac"));
	            $valor10 = utf8_encode(odbc_result($rs,"FLD_motivorechazo"));
	            $valor11 = utf8_encode(odbc_result($rs,"USUrechazo"));
	            $valor12 = utf8_encode(odbc_result($rs,"UNI_nombrecorto"));
	            $valor13 = utf8_encode(odbc_result($rs,"ARO_Activa"));
	            $valor14 = utf8_encode(odbc_result($rs,"DOC_claveint"));
	            $valor15 = utf8_encode(odbc_result($rs,"FLD_claveint"));
	            $valor16 = utf8_encode(odbc_result($rs,"FLD_AROent"));
	            $valor17 = utf8_encode(odbc_result($rs,"ARO_porRecibir"));
	            $valor18 = utf8_encode(odbc_result($rs,"FLD_observaciones"));

				$traspasosResultado['Folio'] = $valor1;
	            $traspasosResultado['Etapa'] = $valor2;
	            $traspasosResultado['Cantidad'] = $valor4;
	            $traspasosResultado['Empresa'] = $valor5;
	            $traspasosResultado['Tipo'] = $valor6;
	            $traspasosResultado['FechaRecepcion'] = $valor7;
	            $traspasosResultado['EnvFac'] = $valor9;
	            $traspasosResultado['MotivoRechazo'] = $valor10;
	            $traspasosResultado['UsuarioRechazo'] = $valor11;
	            $traspasosResultado['Unidad'] = $valor12;
	            $traspasosResultado['area'] = $valor13;
				$traspasosResultado['documento'] = $valor14;
				$traspasosResultado['FLD_claveint'] = $valor15;
				$traspasosResultado['FLD_AROent'] = $valor16;
				$traspasosResultado['USU_rec'] = $valor17;
				$traspasosResultado['Observaciones'] = $valor18;
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}


		// 

	}
		
});

//Lista de tickets que estan registrados por filtro de fechas
$app->post('/listatickets', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	$fecha1 = $datos->fechaini; 
	$fecha2 = $datos->fechafin; 

    $fechaIni =  date('Y-m-d', strtotime(str_replace('/', '-', $fecha1)));
    $fechaFin = date('Y-m-d', strtotime(str_replace('/', '-', $fecha2)));
    
    
    $conexion = conectarMySQL();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT TSeg_clave as Folio_Interno, TicketSeguimiento.Exp_folio as Folio_Web, TSeg_etapa as Etapa, TCat_nombre as Categoria, TSub_nombre as Subcategoria,
				TStatus_nombre as Status, TSeg_obs as Observaciones, Uni_nombre as Unidad, TSeg_Asignado as Asignado, TSeg_fechareg as Registro,
				Usu_nombre as Usuario_Registro, Tseg_fechaactualizacion as Ultima_Actualizacion,Concat(Exp_nombre,' ', Exp_paterno,' ', Exp_materno) As Lesionado,Cia_nombrecorto as Cliente,
				TicketSeguimiento.Cia_clave, Usuario.Usu_login, TicketSeguimiento.Uni_clave,TicketSeguimiento.TStatus_clave
				FROM TicketSeguimiento
				left join TicketCat on TicketCat.TCat_clave=TicketSeguimiento.TCat_clave
				left join TicketSubcat on TicketSubcat.TSub_clave=TicketSeguimiento.TSub_clave
				left join TicketStatus on TicketStatus.TStatus_clave=TicketSeguimiento.TStatus_clave
				left join Unidad on Unidad.Uni_clave=TicketSeguimiento.Uni_clave
				left join Usuario on Usuario.Usu_login=TicketSeguimiento.Usu_registro
				left join Expediente on Expediente.Exp_folio=TicketSeguimiento.Exp_folio
				left join Compania on Compania.Cia_clave=TicketSeguimiento.Cia_clave
				WHERE TSeg_fechareg between '$fechaIni 00:00:00'  and '$fechaFin 23:59:59'
				order by TSeg_clave";


		$result = $conexion->query($sql);
        $tickets = $result->fetchAll(PDO::FETCH_OBJ);
        $conexion = null;
        echo json_encode($tickets);

	}

});


//busca tickets con folio interno
$app->get('/listatickets/:interno', function($interno){

	// $request = \Slim\Slim::getInstance()->request();
	// $datos = json_decode($request->getBody());

	// $fecha1 = $datos->fechaini; 
	// $fecha2 = $datos->fechafin; 

 //    $fechaIni =  date('Y-m-d', strtotime(str_replace('/', '-', $fecha1)));
 //    $fechaFin = date('Y-m-d', strtotime(str_replace('/', '-', $fecha2)));
    
    
    $conexion = conectarMySQL();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT TSeg_clave as Folio_Interno, TicketSeguimiento.Exp_folio as Folio_Web, TSeg_etapa as Etapa, TCat_nombre as Categoria, TSub_nombre as Subcategoria,
				TStatus_nombre as Status, TSeg_obs as Observaciones, Uni_nombre as Unidad, TSeg_Asignado as Asignado, TSeg_fechareg as Registro,
				Usu_nombre as Usuario_Registro, Tseg_fechaactualizacion as Ultima_Actualizacion,Concat(Exp_nombre,' ', Exp_paterno,' ', Exp_materno) As Lesionado,Cia_nombrecorto as Cliente,
				TicketSeguimiento.Cia_clave, Usuario.Usu_login, TicketSeguimiento.Uni_clave,TicketSeguimiento.TStatus_clave
				FROM TicketSeguimiento
				left join TicketCat on TicketCat.TCat_clave=TicketSeguimiento.TCat_clave
				left join TicketSubcat on TicketSubcat.TSub_clave=TicketSeguimiento.TSub_clave
				left join TicketStatus on TicketStatus.TStatus_clave=TicketSeguimiento.TStatus_clave
				left join Unidad on Unidad.Uni_clave=TicketSeguimiento.Uni_clave
				left join Usuario on Usuario.Usu_login=TicketSeguimiento.Usu_registro
				left join Expediente on Expediente.Exp_folio=TicketSeguimiento.Exp_folio
				left join Compania on Compania.Cia_clave=TicketSeguimiento.Cia_clave
				WHERE TSeg_clave = $interno
				order by TSeg_clave";


		$result = $conexion->query($sql);
        $tickets = $result->fetchAll(PDO::FETCH_OBJ);
        $conexion = null;
        echo json_encode($tickets);

	}

});


//busca tickets con folio web 
$app->get('/listaticketsfolio/:web', function($web){

	// $request = \Slim\Slim::getInstance()->request();
	// $datos = json_decode($request->getBody());

	// $fecha1 = $datos->fechaini; 
	// $fecha2 = $datos->fechafin; 

 //    $fechaIni =  date('Y-m-d', strtotime(str_replace('/', '-', $fecha1)));
 //    $fechaFin = date('Y-m-d', strtotime(str_replace('/', '-', $fecha2)));
    
    
    $conexion = conectarMySQL();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT TSeg_clave as Folio_Interno, TicketSeguimiento.Exp_folio as Folio_Web, TSeg_etapa as Etapa, TCat_nombre as Categoria, TSub_nombre as Subcategoria,
				TStatus_nombre as Status, TSeg_obs as Observaciones, Uni_nombre as Unidad, TSeg_Asignado as Asignado, TSeg_fechareg as Registro,
				Usu_nombre as Usuario_Registro, Tseg_fechaactualizacion as Ultima_Actualizacion,Concat(Exp_nombre,' ', Exp_paterno,' ', Exp_materno) As Lesionado,Cia_nombrecorto as Cliente,
				TicketSeguimiento.Cia_clave, Usuario.Usu_login, TicketSeguimiento.Uni_clave,TicketSeguimiento.TStatus_clave
				FROM TicketSeguimiento
				left join TicketCat on TicketCat.TCat_clave=TicketSeguimiento.TCat_clave
				left join TicketSubcat on TicketSubcat.TSub_clave=TicketSeguimiento.TSub_clave
				left join TicketStatus on TicketStatus.TStatus_clave=TicketSeguimiento.TStatus_clave
				left join Unidad on Unidad.Uni_clave=TicketSeguimiento.Uni_clave
				left join Usuario on Usuario.Usu_login=TicketSeguimiento.Usu_registro
				left join Expediente on Expediente.Exp_folio=TicketSeguimiento.Exp_folio
				left join Compania on Compania.Cia_clave=TicketSeguimiento.Cia_clave
				WHERE TicketSeguimiento.Exp_folio = '$web'
				order by TSeg_clave";


		$result = $conexion->query($sql);
        $tickets = $result->fetchAll(PDO::FETCH_OBJ);
        $conexion = null;
        echo json_encode($tickets);

	}

});

//Obtenemos usuario
$app->post('/login', function(){


	$request = \Slim\Slim::getInstance()->request();
	$entrada = json_decode($request->getBody());

    $usuario =  $entrada->user;
    $contrasena =  md5($entrada->psw); 

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
	
		$rs= odbc_exec($conexion,"select * from Usuario left join UsuarioArea on Usuario.USU_claveint = UsuarioArea.USU_claveint where USU_login = '$usuario' and USU_password = '$contrasena' "); 


		$i = 0;

		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = odbc_result($rs,"USU_claveint");
	            $valor2 = utf8_encode(odbc_result($rs,"USU_Nombre"));
	            $valor3 = odbc_result($rs,"USU_factivo");
	            $valor4 = odbc_result($rs,"ARO_claveint");
	            $valor5 = odbc_result($rs,"USU_login");
	            $valor6 = odbc_result($rs,"USU_usuarioWeb");

	            if ($valor3 = 1){

	            	$traspasosResultado['clave'] = $valor1;
		            $traspasosResultado['nombre'] = $valor2;
					$traspasosResultado['area'] = $valor4;
					$traspasosResultado['usuario'] = $valor5;
					$traspasosResultado['usuarioweb'] = $valor6;

					$valores[$i] = $traspasosResultado;
		            $i++;

	            }else{
	            	$arr = array('respuesta' => 'El Usuario no esta Activo');
					echo json_encode($arr);
	            }
				

			}

			echo json_encode($valores);

		}else{

			$arr = array('respuesta' => 'El nombre de Usuario o Contraseña son Incorrectos');
			echo json_encode($arr);

		}

		

	}

});

$app->get('/muestrahistorico/:folio/:etapa/:entrega',function ($folio,$etapa,$entrega){
 	

    $conexion = conectarActual();

    if(!$conexion){

	    die('Something went wrong while connecting to MSSQL');

	}else{

		//$sql = "select * from HistorialFlujo where his_folio = '$folio' and his_etapa = $etapa";
		$sql = "SELECT his_folio,his_fecha,his_etapa,his_entrega, his_hora,his_titulo,his_descripcion,his_accion,EMP_NombreCorto,DOC_lesionado, UNI_nombrecorto  FROM HistorialFlujo
				inner join documento on his_folio = Documento.DOC_folio
				inner join Empresa on empresa.EMP_claveint = Documento.EMP_claveint
				inner join Unidad on Unidad.UNI_claveint = Documento.UNI_claveint
				where HistorialFlujo.his_folio = '$folio' and HistorialFlujo.his_etapa = $etapa and Documento.DOC_etapa = $etapa and HistorialFlujo.his_entrega = $entrega and Documento.DOC_numeroEntrega = $entrega";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			
			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"his_folio"));
				$valor7 = odbc_result($rs,"EMP_NombreCorto");
		        $valor8 = odbc_result($rs,"DOC_lesionado");
		        $valor9 = utf8_encode(odbc_result($rs,"UNI_nombrecorto"));

				$resultado['Folio'] = $valor1;
				$resultado['cliente'] = $valor7;
		        $resultado['lesionado'] = $valor8;
		        $resultado['unidad'] = $valor9;

	            $valor2 = odbc_result($rs,"his_fecha");
	            $valor3 = odbc_result($rs,"his_hora");
	            $valor4 = odbc_result($rs,"his_titulo");
	            $valor5 = odbc_result($rs,"his_descripcion");
	            $valor6 = trim(utf8_encode(odbc_result($rs,"his_accion")));

	            $valor2 = strtotime($valor2);
	            $valor2 = date('d/m/Y', $valor2);

	            $valor3 = strtotime($valor3);
	            $valor3 = date('G:ia', $valor3);

	            
	            if ($valor6 == "Fax") {
	            	$valor6 = 'icon-drawer';
	            }

	            if ($valor6 == "Original") {
	            	$valor6 = 'icon-stack';
	            }

	            /*
	            if ($valor6 = "Envio") {
	            	$valor6 = 'icon-mail';
	            }

	            if ($valor6 = "Rechazo") {
	            	$valor6 = 'icon-sad';
	            }
	       
	            //echo $valor1;
	            //echo $valor2;

				*/

	            $traspasosResultado['fecha'] = $valor2;
	            $traspasosResultado['hora'] = $valor3;
	            $traspasosResultado['titulo'] = utf8_encode($valor4);
	            $traspasosResultado['descripcion'] = utf8_encode($valor5);
	            $traspasosResultado['accion'] = $valor6;
	            
	    				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			$resultado['movimientos'] = $valores;
			echo json_encode($resultado);
		
		}

		else{

			$arr = array('respuesta' => 'No hay historico registrado');
			echo json_encode($arr);

		}

		

	}

});

$app->get('/producto/:empresa', function($empresa){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_DCU_ProductoXEmpresa @empresa = $empresa";

		$rs= odbc_exec($conexion, $sql); 


		$i = 0;

		//echo odbc_fetch_row($rs);

		while (odbc_fetch_row($rs)){ 

			$valor1 = utf8_encode(odbc_result($rs,"PRO_claveint"));
            $valor2 = utf8_encode(odbc_result($rs,"PRO_nombre"));

            //echo $valor1;
            //echo $valor2;
			$traspasosResultado['id'] = $valor1;
            $traspasosResultado['nombre'] = $valor2;
			
			$valores[$i] = $traspasosResultado;
            $i++;

		}

		echo json_encode($valores);

		// odbc_close($conexion);

	}

});

$app->get('/productos', function(){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT * FROM Producto";

		$rs= odbc_exec($conexion, $sql); 


		$i = 0;

		//echo odbc_fetch_row($rs);

		while (odbc_fetch_row($rs)){ 

			$valor1 = utf8_encode(odbc_result($rs,"PRO_claveint"));
            $valor2 = utf8_encode(odbc_result($rs,"PRO_nombre"));

            //echo $valor1;
            //echo $valor2;
			$traspasosResultado['id'] = $valor1;
            $traspasosResultado['nombre'] = $valor2;
			
			$valores[$i] = $traspasosResultado;
            $i++;

		}

		echo json_encode($valores);

		// odbc_close($conexion);

	}

});

//Se rechaza el folio 
$app->post('/rechazoentrega', function(){


		$request = \Slim\Slim::getInstance()->request();
		$datos = json_decode($request->getBody());

		//datos para guardar historico
		$folio =  $datos->Folio; 
	    $etapa =  $datos->Etapa;
		$numentrega = $datos->Cantidad;

		$documento =  $datos->DOC_claveint; 
	    $areaentrega  =  $datos->FLD_AROent; 
	    $usuarioentrega =  $datos->USU_ent;

	    $usuariorecibe =  $datos->USU_recibe; 
	    $arearecibe =  $datos->ARO_porRecibir;
	    $clave = $datos->FLD_claveint;

	    $rechazo = $datos->motivo;
	    
	    $fecha = date("d/m/Y");
	    $hoy = date("H:i:s");
	    $fecha = $fecha . " " . $hoy;


	    $hoy = date("H:i:s");
	    $fecha = $fecha . " " . $hoy;
	    $conexion = conectarActual();

	    if(!$conexion) {

		    die('Something went wrong while connecting to MSSQL');

		}else{
			
 
			$sql = "UPDATE FlujoDoc SET 
					USU_ent = NULL, FLD_fechaEnt = NULL, FLD_porRecibir = 0, USU_recibe = NULL, ARO_porRecibir = NULL, 
					FLD_rechazado = 1, USU_Rechazo = $usuariorecibe, FLD_fechaRechazo = CONVERT (datetime, GETDATE()), 
					FLD_MotivoRechazo = '$rechazo' WHERE FLD_claveint = $clave";

			$rs = odbc_exec($conexion,$sql); 

			if ($rs){

				if ($usuariorecibe == 4) {
					$detalle = $rechazo . " -- juego de facturación --";
				}else{
					$detalle = $rechazo;
				}
				
				// //$nombre = nombrecompleto($usuarioentrega);
				$historico = altahistorial($usuariorecibe, $folio, $etapa, $numentrega, $fecha, 6 ,$detalle,$usuarioentrega,$areaentrega,$arearecibe,$documento);

	            $arr = array('respuesta' => 'Documento(s) rechazados Correctamente');
	              
	        }else{

	            $arr = array('respuesta' => 'Error durante el proceso : '.odbc_error());

	        }   

			echo json_encode($arr); 

			odbc_close($conexion);

		}

});


$app->post('/recepcionfoliosfecha', function(){

	$request = \Slim\Slim::getInstance()->request();
	$entrada = json_decode($request->getBody());

    $fechaini =  $entrada->fechaini; //"01/01/2014";
    $fechafin =  $entrada->fechafin . " 23:59:58.999"; //$entrada->fechafin; // "26/02/2014";

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_DCU_ListadoDocumentosXFecha  @fechaIni='$fechaini', @fechaFin='$fechafin'";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"folio"));
	            $valor2 = utf8_encode(odbc_result($rs,"etapa"));
	            $valor3 = utf8_encode(odbc_result($rs,"fax"));
	            $valor4 = odbc_result($rs,"fechafax"); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = utf8_encode(odbc_result($rs,"original"));
	            $valor6 = odbc_result($rs,"fechaoriginal"); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor7 = utf8_encode(odbc_result($rs,"facExp"));
	            $valor8 = odbc_result($rs,"fechaFacExp"); //utf8_encode(odbc_result($rs,"fechaFacExp"));
	            $valor9 = utf8_encode(odbc_result($rs,"situacion"));
	            $valor10 = utf8_encode(odbc_result($rs,"unidad"));
	            $valor11 = odbc_result($rs,"fechapago"); //utf8_encode(odbc_result($rs,"fechapago"));
	            $valor12 = odbc_result($rs,"fechacaptura"); //utf8_encode(odbc_result($rs,"fechacaptura"));
	            $valor13 = utf8_encode(odbc_result($rs,"DOC_lesionado"));
	            $valor14 = utf8_encode(odbc_result($rs,"DOC_factura"));
	            $valor15 = utf8_encode(odbc_result($rs,"DOC_remesa"));
	            $valor16 = utf8_encode(odbc_result($rs,"PRO_nombre"));
	            $valor17 = utf8_encode(odbc_result($rs,"ESC_nombre"));
	            $valor18 = utf8_encode(odbc_result($rs,"cancelado"));
	            $valor19 = utf8_encode(odbc_result($rs,"etapaEntrega"));
	            $valor20 = utf8_encode(odbc_result($rs,"EMP_nombrecorto"));



	            //echo $valor1;
	            //echo $valor2;
				$traspasosResultado['Folio'] = $valor1;
	            $traspasosResultado['Etapa'] = $valor2;
	            $traspasosResultado['Fax'] = $valor3;
	            $traspasosResultado['FechaFax'] = $valor4;
	            $traspasosResultado['Original'] = $valor5;
	            $traspasosResultado['FechaOriginal'] = $valor6;
	            $traspasosResultado['F.E.'] = $valor7;
	            $traspasosResultado['FechaF.E.'] = $valor8;
	            $traspasosResultado['Situacion'] = $valor9;
	            $traspasosResultado['Unidad'] = $valor10;
	            $traspasosResultado['FechaPago'] = $valor11;
	            $traspasosResultado['FechaCaptura'] = $valor12;
	            $traspasosResultado['Lesionado'] = $valor13;
	            $traspasosResultado['Factura'] = $valor14;
	            $traspasosResultado['Remesa'] = $valor15;
	            $traspasosResultado['Producto'] = $valor16;
	            $traspasosResultado['Escolaridad'] = $valor17;
	            $traspasosResultado['Cancelado'] = $valor18;
	            $traspasosResultado['Numero'] = $valor19;
	            $traspasosResultado['Empresa'] = $valor20;
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}
		//Solo para testear las variables que quiero obtener de lo que estoy mandando
		//$arr = array('a' => $sql);
		//echo json_encode($arr);
		odbc_close($conexion);

	}

});


$app->get('/recepcionfolios/:folio', function($folio){


    $conexion = conectarActual();
    $conexionMysql = conectarMySQL();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_DCU_ListadoDocumentosXFolio  @folio='$folio'";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"folio"));
	            $valor2 = utf8_encode(odbc_result($rs,"etapa"));
	            $valor3 = utf8_encode(odbc_result($rs,"fax"));
	            $valor4 = odbc_result($rs,"fechafax"); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = utf8_encode(odbc_result($rs,"original"));
	            $valor6 = odbc_result($rs,"fechaoriginal"); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor7 = utf8_encode(odbc_result($rs,"facExp"));
	            $valor8 = odbc_result($rs,"fechaFacExp"); //utf8_encode(odbc_result($rs,"fechaFacExp"));
	            $valor9 = utf8_encode(odbc_result($rs,"situacion"));
	            $valor10 = utf8_encode(odbc_result($rs,"unidad"));
	            $valor11 = odbc_result($rs,"fechapago"); //utf8_encode(odbc_result($rs,"fechapago"));
	            $valor12 = odbc_result($rs,"fechacaptura"); //utf8_encode(odbc_result($rs,"fechacaptura"));
	            $valor13 = utf8_encode(odbc_result($rs,"DOC_lesionado"));
	            $valor14 = utf8_encode(odbc_result($rs,"DOC_factura"));
	            $valor15 = utf8_encode(odbc_result($rs,"DOC_remesa"));
	            $valor16 = utf8_encode(odbc_result($rs,"PRO_nombre"));
	            $valor17 = utf8_encode(odbc_result($rs,"ESC_nombre"));
	            $valor18 = utf8_encode(odbc_result($rs,"cancelado"));
	            $valor19 = utf8_encode(odbc_result($rs,"etapaEntrega"));
	            $valor20 = utf8_encode(odbc_result($rs,"EMP_nombrecorto"));

	            

			    if(!$conexionMysql) {

				    $tickets = array('respuesta' => 'Sin Ticket');

				}else{
					
					$sql = "SELECT TSeg_clave as Folio_Interno, TicketSeguimiento.Exp_folio as Folio_Web, TSeg_etapa as Etapa, TCat_nombre as Categoria, TSub_nombre as Subcategoria,
							TStatus_nombre as Status, TSeg_obs as Observaciones, Uni_nombre as Unidad, TSeg_Asignado as Asignado, TSeg_fechareg as Registro,
							Usu_nombre as Usuario_Registro, Tseg_fechaactualizacion as Ultima_Actualizacion,Concat(Exp_nombre,' ', Exp_paterno,' ', Exp_materno) As Lesionado,Cia_nombrecorto as Cliente,
							TicketSeguimiento.Cia_clave, Usuario.Usu_login, TicketSeguimiento.Uni_clave,TicketSeguimiento.TStatus_clave
							FROM TicketSeguimiento
							left join TicketCat on TicketCat.TCat_clave=TicketSeguimiento.TCat_clave
							left join TicketSubcat on TicketSubcat.TSub_clave=TicketSeguimiento.TSub_clave
							left join TicketStatus on TicketStatus.TStatus_clave=TicketSeguimiento.TStatus_clave
							left join Unidad on Unidad.Uni_clave=TicketSeguimiento.Uni_clave
							left join Usuario on Usuario.Usu_login=TicketSeguimiento.Usu_registro
							left join Expediente on Expediente.Exp_folio=TicketSeguimiento.Exp_folio
							left join Compania on Compania.Cia_clave=TicketSeguimiento.Cia_clave
							WHERE TicketSeguimiento.Exp_folio = '$folio' AND TSeg_etapa = $valor2
							order by TSeg_clave";


					$result = $conexionMysql->query($sql);
			        $tickets = $result->fetchAll(PDO::FETCH_OBJ);
			        

				}

	            

				$traspasosResultado['Folio'] = $valor1;
	            $traspasosResultado['Etapa'] = $valor2;
	            $traspasosResultado['Fax'] = $valor3;
	            $traspasosResultado['FechaFax'] = $valor4;
	            $traspasosResultado['Original'] = $valor5;
	            $traspasosResultado['FechaOriginal'] = $valor6;
	            $traspasosResultado['F.E.'] = $valor7;
	            $traspasosResultado['FechaF.E.'] = $valor8;
	            $traspasosResultado['Situacion'] = $valor9;
	            $traspasosResultado['Unidad'] = $valor10;
	            $traspasosResultado['FechaPago'] = $valor11;
	            $traspasosResultado['FechaCaptura'] = $valor12;
	            $traspasosResultado['Lesionado'] = $valor13;
	            $traspasosResultado['Factura'] = $valor14;
	            $traspasosResultado['Remesa'] = $valor15;
	            $traspasosResultado['Producto'] = $valor16;
	            $traspasosResultado['Escolaridad'] = $valor17;
	            $traspasosResultado['Cancelado'] = $valor18;
	            $traspasosResultado['Numero'] = $valor19;
	            $traspasosResultado['Empresa'] = $valor20;
	            $traspasosResultado['ticket'] = $tickets;

				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}

		$conexionMysql = null;
		// odbc_close($conexion);
		//Solo para testear las variables que quiero obtener de lo que estoy mandando
		//$arr = array('a' => $sql);
		//echo json_encode($arr);

	}

});


$app->get('/recepcionfoliosxlesionado/:lesionado', function($lesionado){


    $conexion = conectarActual();
    $conexionMysql = conectarMySQL();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_DCU_ListadoDocumentosXLesionado  @lesionado='% $lesionado %'";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"folio"));
	            $valor2 = utf8_encode(odbc_result($rs,"etapa"));
	            $valor3 = utf8_encode(odbc_result($rs,"fax"));
	            $valor4 = odbc_result($rs,"fechafax"); //utf8_encode(odbc_result($rs,"fechafax"));
	            $valor5 = utf8_encode(odbc_result($rs,"original"));
	            $valor6 = odbc_result($rs,"fechaoriginal"); //utf8_encode(odbc_result($rs,"fechaoriginal"));
	            $valor7 = utf8_encode(odbc_result($rs,"facExp"));
	            $valor8 = odbc_result($rs,"fechaFacExp"); //utf8_encode(odbc_result($rs,"fechaFacExp"));
	            $valor9 = utf8_encode(odbc_result($rs,"situacion"));
	            $valor10 = utf8_encode(odbc_result($rs,"unidad"));
	            $valor11 = odbc_result($rs,"fechapago"); //utf8_encode(odbc_result($rs,"fechapago"));
	            $valor12 = odbc_result($rs,"fechacaptura"); //utf8_encode(odbc_result($rs,"fechacaptura"));
	            $valor13 = utf8_encode(odbc_result($rs,"DOC_lesionado"));
	            $valor14 = utf8_encode(odbc_result($rs,"DOC_factura"));
	            $valor15 = utf8_encode(odbc_result($rs,"DOC_remesa"));
	            $valor16 = utf8_encode(odbc_result($rs,"PRO_nombre"));
	            $valor17 = utf8_encode(odbc_result($rs,"ESC_nombre"));
	            $valor18 = utf8_encode(odbc_result($rs,"cancelado"));
	            $valor19 = utf8_encode(odbc_result($rs,"etapaEntrega"));
	            $valor20 = utf8_encode(odbc_result($rs,"EMP_nombrecorto"));

	            if(!$conexionMysql) {

				    $tickets = array('respuesta' => 'Sin Ticket');

				}else{
					
					$sql = "SELECT TSeg_clave as Folio_Interno, TicketSeguimiento.Exp_folio as Folio_Web, TSeg_etapa as Etapa, TCat_nombre as Categoria, TSub_nombre as Subcategoria,
							TStatus_nombre as Status, TSeg_obs as Observaciones, Uni_nombre as Unidad, TSeg_Asignado as Asignado, TSeg_fechareg as Registro,
							Usu_nombre as Usuario_Registro, Tseg_fechaactualizacion as Ultima_Actualizacion,Concat(Exp_nombre,' ', Exp_paterno,' ', Exp_materno) As Lesionado,Cia_nombrecorto as Cliente,
							TicketSeguimiento.Cia_clave, Usuario.Usu_login, TicketSeguimiento.Uni_clave,TicketSeguimiento.TStatus_clave
							FROM TicketSeguimiento
							left join TicketCat on TicketCat.TCat_clave=TicketSeguimiento.TCat_clave
							left join TicketSubcat on TicketSubcat.TSub_clave=TicketSeguimiento.TSub_clave
							left join TicketStatus on TicketStatus.TStatus_clave=TicketSeguimiento.TStatus_clave
							left join Unidad on Unidad.Uni_clave=TicketSeguimiento.Uni_clave
							left join Usuario on Usuario.Usu_login=TicketSeguimiento.Usu_registro
							left join Expediente on Expediente.Exp_folio=TicketSeguimiento.Exp_folio
							left join Compania on Compania.Cia_clave=TicketSeguimiento.Cia_clave
							WHERE TicketSeguimiento.Exp_folio = '$valor1' AND TSeg_etapa = $valor2
							order by TSeg_clave";


					$result = $conexionMysql->query($sql);
			        $tickets = $result->fetchAll(PDO::FETCH_OBJ);
			        

				}

	            //echo $valor1;
	            //echo $valor2;
				$traspasosResultado['Folio'] = $valor1;
	            $traspasosResultado['Etapa'] = $valor2;
	            $traspasosResultado['Fax'] = $valor3;
	            $traspasosResultado['FechaFax'] = $valor4;
	            $traspasosResultado['Original'] = $valor5;
	            $traspasosResultado['FechaOriginal'] = $valor6;
	            $traspasosResultado['F.E.'] = $valor7;
	            $traspasosResultado['FechaF.E.'] = $valor8;
	            $traspasosResultado['Situacion'] = $valor9;
	            $traspasosResultado['Unidad'] = $valor10;
	            $traspasosResultado['FechaPago'] = $valor11;
	            $traspasosResultado['FechaCaptura'] = $valor12;
	            $traspasosResultado['Lesionado'] = $valor13;
	            $traspasosResultado['Factura'] = $valor14;
	            $traspasosResultado['Remesa'] = $valor15;
	            $traspasosResultado['Producto'] = $valor16;
	            $traspasosResultado['Escolaridad'] = $valor17;
	            $traspasosResultado['Cancelado'] = $valor18;
	            $traspasosResultado['Numero'] = $valor19;
	            $traspasosResultado['Empresa'] = $valor20;
	            $traspasosResultado['ticket'] = $tickets;

				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'No se encontraron Datos');
			echo json_encode($arr);

		}
		//Solo para testear las variables que quiero obtener de lo que estoy mandando
		//$arr = array('a' => $sql);
		//echo json_encode($arr);
		$conexionMysql = null;
		// odbc_close($conexion);

	}

});


$app->get('/referenciaunidad/:unidad', function($unidad){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
	
		$rs= odbc_exec($conexion,"EXEC MV_DCU_referenciaXunidad @unidad = $unidad "); 


		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 


			$valor1 = utf8_encode(odbc_result($rs,"uni_ref"));

			$valores = array('referencia' => $valor1);

		}else{

			$valores = array('referencia' => 'Sin referencia');
		}

		echo json_encode($valores);

		odbc_close($conexion);

	}

});


$app->get('/statusweb', function(){

    $db = conectarMySQL();

    if(!$db) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT TStatus_clave as Clave, TStatus_nombre as Nombre FROM TicketStatus ";

		$result = $db->query($sql);
        $status = $result->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($status);

    }

});

//busca categorias para tickets en web 
$app->get('/subcategorias/:categoria', function($subcategoria){

    $conexion = conectarMySQL();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT TSub_clave as Clave, TSub_nombre as Nombre FROM TicketSubcat where TCat_clave= $subcategoria";


		$result = $conexion->query($sql);
        $subcategorias = $result->fetchAll(PDO::FETCH_OBJ);
        $conexion = null;
        echo json_encode($subcategorias);


	}

});

//busca tickets con folio web 
$app->get('/ticket', function(){
    
    
    $conexion = conectarMySQL();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT MAX(TSeg_clave) as ultimo FROM TicketSeguimiento";


		$result = $conexion->query($sql);
        $ticket = $result->fetchAll(PDO::FETCH_OBJ);
        $conexion = null;
        echo json_encode($ticket);

	}

});

//busca tickets con folio web 
$app->get('/ticketinfo/:id/:folio', function($id,$folio){
    
    
    $conexion = conectarMySQL();
    $datos = array();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		//info del ticket
		$query = "SELECT * FROM TicketSeguimiento where TSeg_clave=$id";
		
		$result = $conexion->query($query);
        $ticket = $result->fetchAll(PDO::FETCH_OBJ);
        
		//Obtener comunicacion
		$querycomunicacion="SELECT TC_descripcion as Descripcion, TC_fechareg as Fecha, Usuario.Usu_nombre as Usuario
		FROM TicketComunicacion
		inner join Usuario on Usuario.Usu_login=TicketComunicacion.Usu_registro
		where TSeg_clave=$id And Exp_folio='$folio'";

		$result = $conexion->query($querycomunicacion);
        $comunicacion = $result->fetchAll(PDO::FETCH_OBJ);

		//Obtener notas
		$querynotas="SELECT TN_descripcion as Descripcion, TN_fechareg as Fecha, Usuario.Usu_nombre as Usuario
		FROM TicketNotas 
		inner join Usuario on Usuario.Usu_login=TicketNotas.Usu_registro
		where TSeg_clave=$id And Exp_folio='$folio'";

		$result = $conexion->query($querynotas);
        $notas = $result->fetchAll(PDO::FETCH_OBJ);

		//Obtener expediente
		$qryexp="SELECT concat(Exp_nombre ,' ', Exp_paterno,' ', Exp_materno)as Nombre, Cia_nombrecorto, Exp_siniestro, Exp_reporte, Exp_poliza, Exp_telefono, Exp_mail, Exp_fechaNac, Exp_edad, Exp_meses, Exp_sexo, ObsNot_diagnosticoRX as Diagnostico
		FROM Expediente
		Inner Join Compania On Expediente.Cia_clave=Compania.Cia_clave
		Left Join ObsNotaMed On ObsNotaMed.Exp_folio=Expediente.Exp_folio
		where Exp_cancelado=0 and Expediente.exp_folio='$folio'";

		$result = $conexion->query($qryexp);
        $expediente = $result->fetchAll(PDO::FETCH_OBJ);
		
        $datos['expediente'] = $expediente;
        $datos['ticket'] = $ticket;
        $datos['notas'] = $notas;
        $datos['comunicacion'] = $comunicacion;
        
        echo json_encode($datos);

	}

	$conexion = null;

});

//alta de entregas de un area a otra se actualiza en el flujo
$app->post('/traspaso', function(){

	$request = \Slim\Slim::getInstance()->request();
	$datos = json_decode($request->getBody());

	//datos para guardar historico
	$folio =  $datos->folio; 
    $etapa =  $datos->etapa;
	$numentrega = $datos->cantidad;
	$areaentrega =  $datos->areaentrega; //es la misma area asi que se deja solo una 

	$documento =  $datos->documento; 
    $usuarioentrega =  $datos->usuarioentrega; 
    $usuariorecibe =  $datos->usuariorecibe; 

    $usuarioactivo =  $datos->uasuarioemitio;

    $clave = $datos->clave;
    
    $fecha = date("d/m/Y");
    $hoy = date("H:i:s");
    $fecha = $fecha . " " . $hoy;
    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "UPDATE FlujoDoc SET USU_activo = $usuariorecibe WHERE FLD_claveint = $clave";

		$rs = odbc_exec($conexion,$sql); 

		if ($rs){

			  //en este caso se genero un paso de documentos por lo que al mandar la area2 al historico 
			  //se necesita que se mande el usuario que realizo todo el cambio ya que usuentrega y usurecibe pueden variar 
			  $historico = altahistorial($usuarioentrega, $folio, $etapa, $numentrega, $fecha, 7 ,'', $usuariorecibe,$areaentrega,$usuarioactivo,$documento); 
              $arr = array('respuesta' => 'Documento(s) enviado Correctamente', 'Historial' => $historico);
              
        }else {

              $arr = array('respuesta' => 'Error durante el Guardado : '.odbc_error());
        }   

		echo json_encode($arr); 

	}

});

//modulo donde verificamos la entrega 
$app->get('/verificaetapaentrega/:folio/:etapa', function($folio, $etapa){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_DCU_VerificaEtapaEntrega @folio ='$folio', @etapa = $etapa";
		$rs = odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			$valor1 = odbc_result($rs,"total");

			//Esto es para ver el numero de documentos en el historial
			$detalle = array();

			for ($i=0; $i < $valor1; $i++) { 
				$detalle[$i]['valor'] = $i +1;
			}

			$arr = array('total' => $valor1, 'detalle' => $detalle);
			echo json_encode($arr);
		
		}
		else{

			$arr = array('total' => 0);
			echo json_encode($arr);

		}

		// odbc_close($conexion);

	}

});

$app->get('/verificafolio/:folio/:etapa', function($folio,$etapa){


    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_DCU_VerificaFolio  @folio=$folio, @etapa=$etapa";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 


			$valor1 = utf8_encode(odbc_result($rs,"DOC_original"));
			$valor2 = utf8_encode(odbc_result($rs,"DOC_claveint"));
			$valor3 = utf8_encode(odbc_result($rs,"DOC_fax"));
			$valor4 = utf8_encode(odbc_result($rs,"DOC_faxfecha"));
			$valor5 = utf8_encode(odbc_result($rs,"DOC_FE"));
			$valor6 = utf8_encode(odbc_result($rs,"DOC_FEFecha"));
			$valor7 = utf8_encode(odbc_result($rs,"DOC_lesionado"));
			$valor8 = utf8_encode(odbc_result($rs,"UNI_claveint"));
			$valor9 = utf8_encode(odbc_result($rs,"EMP_claveint"));
			$valor10 = utf8_encode(odbc_result($rs,"PRO_claveint"));
			$valor11 = utf8_encode(odbc_result($rs,"ESC_claveint"));


			$arr = array('respuesta' => 'El folio ya se encuentra registrado en Control de Documentos','original' => $valor1,'clave' => $valor2,'fax' => $valor3,'fechafax' => $valor4,'fe' => $valor5,
				'fefecha' => $valor6,'lesionado' => $valor7,'unidad' => $valor8,'empresa' => $valor9,'producto' => $valor10,'escuela' => $valor11);
			echo json_encode($arr);
		
		}
		else{

			$arr = array('siguiente' => 'true');
			echo json_encode($arr);

		}

		// odbc_close($conexion);
	}

});


$app->get('/verificafoliopase/:folio', function($folio){


    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_DCU_VerificaFolioEnPase  @folio=$folio";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			$valor1 = odbc_result($rs,"total");
			if ($valor1 > 0) {

				$arr = array('respuesta' => 'El folio ya se encuentra registrado en Modulo de Capturas');
				
			}else{
				$arr = array('siguiente' => 'true');
			}
			
			echo json_encode($arr);
		
		}
		else{

			$arr = array('siguiente' => 'true');
			echo json_encode($arr);

		}

		odbc_close($conexion);
	}

});

$app->get('/verificaprefijo/:prefijo/:empresa', function($prefijo, $empresa){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_DCU_ValidaPrefijoFolio  @prefijo='$prefijo', @empresa='$empresa'";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		$valor1 = utf8_encode(odbc_result($rs,"valido"));
		$valores = array('valido' => $valor1);

		echo json_encode($valores);
	}

	odbc_close($conexion);
	
});

$app->get('/unidades', function(){

    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
	
		$rs= odbc_exec($conexion,"EXEC MV_DCU_Unidades"); 


		$i = 0;

		//echo odbc_fetch_row($rs);

		while (odbc_fetch_row($rs)){ 

			$valor1 = utf8_encode(odbc_result($rs,"uni_claveint"));
            $valor2 = utf8_encode(odbc_result($rs,"uni_nombrecorto"));

            //echo $valor1;
            //echo $valor2;
			$traspasosResultado['id'] = $valor1;
            $traspasosResultado['nombre'] = $valor2;
			
			$valores[$i] = $traspasosResultado;
            $i++;

		}

		echo json_encode($valores);

		// odbc_close($conexion);

	}
	
});

$app->get('/unidadesweb', function(){

    $db = conectarMySQL();

    if(!$db) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT Uni_clave as UnidadClave, Uni_nombre as Nombre FROM Unidad Where Uni_activa='S' ORDER BY Uni_nombre";

		$result = $db->query($sql);
        $unidades = $result->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($unidades);

    }
    
});

$app->get('/usuariosarea/:area', function($area){


    $conexion = conectarActual();

    if(!$conexion) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "EXEC MV_FLU_UsuarioXArea  @areaclave=$area";

		$rs= odbc_exec($conexion,$sql); 
		$i = 0;

		//echo odbc_fetch_row($rs);
		if( odbc_num_rows($rs) > 0 ) { 

			while (odbc_fetch_row($rs)){ 

				$valor1 = utf8_encode(odbc_result($rs,"USU_claveint"));
	            $valor2 = utf8_encode(odbc_result($rs,"USU_login"));

				$traspasosResultado['id'] = $valor1;
	            $traspasosResultado['nombre'] = $valor2;
				
				$valores[$i] = $traspasosResultado;
	            $i++;

			}

			echo json_encode($valores);
		
		}
		else{

			$arr = array('respuesta' => 'Datos No Encontrados');
			echo json_encode($arr);

		}
		//Solo para testear las variables que quiero obtener de lo que estoy mandando
		//$arr = array('a' => $sql);
		//echo json_encode($arr);

		// odbc_close($conexion);

	}
	
});

//verifica los usuarios en el protal web
$app->get('/usuariosweb', function(){

    $db = conectarMySQL();

    if(!$db) {

	    die('Something went wrong while connecting to MSSQL');

	}else{
		
		$sql = "SELECT Usuario.Usu_login as Clave, Usu_nombre as Nombre 
				FROM Usuario 
				Inner Join Permiso on Permiso.Usu_login=Usuario.Usu_login
				Where Usu_activo='S' and Per_seguimiento='S' and Usuario.Usu_login <> 'lendex' ";

		$result = $db->query($sql);
        $usuarios = $result->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($usuarios);

    }
    
});

$app->get('/historico',function (){
 	
 	$usuario = 1;
 	$fecha = '18/03/2014';
 	$folio = 'UMEG001235';
 	$etapa = 0;
 	$entrega = 0;
 	$accion = 'Fax';
 	$detalle = '';
   	$icono = $accion;
    $hora = date("H:i:s");

    $conexion = conectarActual();

    if(!$conexion){

	    die('Something went wrong while connecting to MSSQL');

	}else{

		$sql = "select * from Usuario where USU_claveint = $usuario";
		$usu = odbc_exec($conexion,$sql); 
		$nombre = utf8_encode(odbc_result($usu,"USU_nombre"));

		if($accion = 'Fax'){

	    	$titulo = "Se emitio Fax";
	    	$descripcion = "Se emitio Fax del folio por el usuario " . $nombre;
 
	    }elseif ($accion = 'Original') {

	    	$titulo = "Se emitio Original por el usuario: ". $nombre;

	    	if($etapa = 1){
	    		$descripcion = "Se capturò la documentaciòn de la primera atencion del folio";
	    	}elseif($etapa = 2){
	    		$descripcion = "Se emitio Subsecuencia del folio";
	    	}else{
	    		$descripcion = "Se emitio Rehabilitación del folio";
	    	}
	    	
	    }elseif ($accion == 'Envio') {

	    	$titulo = "Se envio por: ". $nombre ." al usuario ";
	    	
	    }elseif ($accion == 'Rechazo') {
	    	
	    	$titulo = "Se rechazo por: ". $nombre;

	    }
		

		$sql = "EXEC MV_HIS_GuardaHistorial @folio='$folio', @fecha='$fecha', @hora = '$hora', @titulo = '$titulo', @descripcion = '$descripcion' , @etapa = $etapa, @entrega = $entrega, @usuario = $usuario, @accion = '$accion' ";

		$rs = odbc_exec($conexion,$sql); 

		if ($rs){

              return true;

        }else {

              return false;
        }

        odbc_close($conexion);

	}
	
});

//funcion para buscar nombre completo del usuario
function nombrecompleto($usuario){

	$conexion = conectarActual();

    if($conexion){

		$sql = "SELECT USU_nombre FROM Usuario where USU_claveint = $usuario";
		$usu = odbc_exec($conexion,$sql); 
		$nombre = odbc_result($usu,"USU_nombre");

		return $nombre;

	}

	odbc_close($conexion);

}


///Funcion para obtener el nombre del area completo
function nombrearea($area){

	$conexion = conectarActual();

    if($conexion){

		$sql = "SELECT ARO_Nombre FROM AreaOperativa where ARO_activa = 1 and ARO_claveint = $area";
		$are = odbc_exec($conexion,$sql); 
		$nombre = odbc_result($are,"ARO_Nombre");

		return $nombre;

	}

	// odbc_close($conexion);

}


//'102', 'ORTO003292', '1', '1', '09/07/2014', 5, '', '', '3', '', ''
//'83', 'PEMV023870', 1, 1, '10/07/2014 14:0...', 1, '', '', '', '', '', '512283'
///////funcion para agregar el historial de cada folio
function altahistorial($usuario, $folio, $etapa, $entrega, $fecha, $accion, $detalle, $usuario2, $area , $area2, $documento){
 	
 	if ($documento == '') {
 		$documento = 0;
 	}

 	//existen cuatro tipos de acciones 
 	// 1.- evio de fax 2.- envio de original 3.- se envio el documento 4 .- se rechazo el documento
	$fechaI = date("d/m/Y");
    $hora =  date("d/m/Y H:i:s");

    $conexion = conectarActual();

    if(!$conexion){

	    die('Something went wrong while connecting to MSSQL');

	}else{

		 
		$nombre = nombrecompleto($usuario);
		//se genera este debido a que no se pudo generar un orden al mandar los suarios =(
		$areaaccion = 0;

		if($accion == 1){

	    	$titulo = "Se emitio Fax";
	    	$descripcion =  mb_convert_encoding("Se emitio Fax del folio por el usuario ", "ISO-8859-1", "UTF-8") . $nombre;
	    	$icono = 'Fax';
	    	$areaaccion = 1;
 
	    }

	    if ($accion == 2) {

	    	$titulo = "Se emitio Original ";

	    	if($etapa == 1){
	    		$descripcion =  mb_convert_encoding("Se capturó la primera atención del folio por el usuario ", "ISO-8859-1", "UTF-8"). $nombre;
	    	}elseif($etapa == 2){
	    		$descripcion = "Se emitio Subsecuencia del folio por el usuario ". $nombre;
	    	}else{
	    		$descripcion =  mb_convert_encoding("Se emitio Rehabilitación del folio por el usuario ", "ISO-8859-1", "UTF-8"). $nombre;
	    	}

	    	$icono = 'Original';

	    	$areaaccion = 1;
	    	
	    }

	    if ($accion == 3) {

	    	$nombrearea = nombrearea($area);
	    	$nombre2 = nombrecompleto($usuario2);
	    	$nombrearea2 = nombrearea($area2);
	    	$titulocont = " generó una entrega";
	    	$contenido = "Se entregó el documento del area de ";

	    	$titulo = "El Usuario " . $nombre . mb_convert_encoding($titulocont, "ISO-8859-1", "UTF-8");
	    	$descripcion = mb_convert_encoding($contenido, "ISO-8859-1", "UTF-8") . $nombrearea . " al area de " . $nombrearea2 . " al usuario: " . $nombre2 . " " . mb_convert_encoding($detalle, "ISO-8859-1", "UTF-8");
	    	$icono = 'Entrega';

	    	$areaaccion = $area;
	    	
	    }

	    if ($accion == 4) {
	    	
	    	$nombrearea = nombrearea($area);
	    	
	    	$nombre2 = nombrecompleto($usuario2);
	    	$nombrearea2 = nombrearea($area2);
	    	
	    	$titulocont = " Aceptó entrega";
	    	$contenido = "Se aceptó el documento mandado por el area de ";
	    	
	    	$titulo = "El Usuario " . $nombre . mb_convert_encoding($titulocont, "ISO-8859-1", "UTF-8");
	    	$descripcion = mb_convert_encoding($contenido , "ISO-8859-1", "UTF-8") . $nombrearea2 . " por el usuario: " . $nombre2 . " " . $detalle;
	    	$icono = 'Recepcion';
	    	
	    	$areaaccion = $area2;

	    }

	    if ($accion == 5) {
	    	
	    	$nombrearea = nombrearea($area);
	    	$titulo = "Se quito como entrega de docuemnto";
	    	$descripcion = mb_convert_encoding("El Usuario " . $nombre . " removio el documento impidiendo que llegara al area: " , "ISO-8859-1", "UTF-8"). $nombrearea;
	    	$icono = 'Removido';
	    	
	    	$areaaccion = $area;
	    	
	    }

	    if ($accion == 6) {
	    	
	    	$nombrearea = nombrearea($area);
	    	$nombre2 = nombrecompleto($usuario2);
	    	$nombrearea2 = nombrearea($area2);
	    	$titulocont = " Rechazó la entrega";
	    	$contenido = "Se rechazó el documento por el area de ";

	    	$titulo = "El Usuario " . $nombre . mb_convert_encoding( $titulocont, "ISO-8859-1", "UTF-8");
	    	$descripcion = mb_convert_encoding($contenido , "ISO-8859-1", "UTF-8") . $nombrearea2 . " por el usuario: " . $nombre . " mandado por " . $nombre2 . " del area de " . $nombrearea . " por motivo: "  . $detalle; //
	    	$icono = 'Rechazo';

	    	$areaaccion = $area;


	    }

	    if ($accion == 7) {

	    	$nombreemitio = nombrecompleto($area2);

	    	$nombreenvia = nombrecompleto($usuario);
	    	$nombrerecibe = nombrecompleto($usuario2);

	    	$nombrearea = nombrearea($area);
	    	
	    	$titulocont = " generó un traspaso";
	    	$contenido = "El usuario ";

	    	$titulo = "El Usuario " . $nombreemitio . mb_convert_encoding($titulocont, "ISO-8859-1", "UTF-8");
	    	$descripcion = mb_convert_encoding($contenido, "ISO-8859-1", "UTF-8") . $nombreenvia . " asigno el documento al usario " . $nombrerecibe . "  del area de " . $nombrearea;
	    	$icono = 'Traspaso';

	    	$areaaccion = $area;
	    	
	    }

	    if($accion == 8){

	    	$titulo = "Se emitio Un Ticket";
	    	$descripcion = "Se emitio Ticket del folio por el usuario " . $nombre . " con el folio interno: " . $detalle;
	    	$icono = 'Ticket';
 
	    }

	    if($accion == 9){

	    	$titulo = "Se Actualizo Ticket";
	    	$descripcion = "El Ticket con folio interno: " . $detalle ." del folio fue actualizado por el usuario " . $nombre;
	    	$icono = 'Ticket';
 
	    }

	    if($accion == 10){

	    	$titulo = "Se Envio a No pagar hasta cobrar";
	    	$descripcion = "El Folio se movio a no pagar hasta cobrar por el usuario: " . $nombre;
	    	$icono = 'NPC';
 
	    }

	    if($accion == 11){
	    	
	    	$nombrearea = nombrearea($area);

	    	$titulo = "Se Quito de No pagar hasta cobrar";
	    	$descripcion = "El Folio se movio de No pagar hasta cobrar por el usuario: " . $nombre . " regresando al area de " . $nombrearea;
	    	$icono = 'NPC';
 
	    }
		

		//$sql = "EXEC MV_HIS_GuardaHistorial @folio='$folio', @fecha='$fecha', @hora = '$hora', @titulo = '$titulo', @descripcion = '$descripcion' , @etapa = $etapa, @entrega = $entrega, @usuario = $usuario, @accion = '$icono'";
		$sql = "EXEC [dbo].[MV_HIS_GuardaHistorial] 
				@folio = N'$folio',
				@etapa = $etapa,
				@entrega = $entrega,
				@usuario = $usuario,
				@fecha = '$fechaI',
				@hora = '$hora',
				@titulo = N'$titulo',
				@descripcion = N'$descripcion',
				@accion = N'$icono',
				@area = $areaaccion,
				@documento = $documento";

		$rs = odbc_exec($conexion,$sql); 

		if ($rs){

              return true;

        }else {

              return false;
        }

        // odbc_close($conexion);

	}

};

///Se creo este modulo solo para agregar en facturacion razon desconocida por la cual no podia guardarse
//en el modulo de arriba marcaba error de SQL ejecutado directamente WTF???
function altahistorialfactura($usuario, $folio, $etapa, $entrega, $fecha, $accion, $detalle, $usuario2, $area , $area2,$documento){
 	

 	//existen cuatro tipos de acciones 
 	// 1.- evio de fax 2.- envio de original 3.- se envio el documento 4 .- se rechazo el documento

    $hora = date("H:i:s");

    $conexion = conectarActual();

    if(!$conexion){

	    die('Something went wrong while connecting to MSSQL');

	}else{
 
		$nombre = nombrecompleto($usuario);

    	$nombrearea = nombrearea($area);
    	$nombre2 = nombrecompleto($usuario2);
    	$nombrearea2 = nombrearea($area2);
    	$titulocont = " generó una entrega";
    	$contenido = "Se entregó el documento del area de ";

    	$titulo = "El Usuario " . $nombre . mb_convert_encoding($titulocont, "ISO-8859-1", "UTF-8");
    	$descripcion = mb_convert_encoding($contenido, "ISO-8859-1", "UTF-8") . $nombrearea . " al area de " . $nombrearea2 . " al usuario: " . $nombre2 . " " . mb_convert_encoding($detalle, "ISO-8859-1", "UTF-8");
    	$icono = 'Envio';

		//$sql = "EXEC MV_HIS_GuardaHistorial @folio='$folio', @fecha='$fecha', @hora = '$hora', @titulo = '$titulo', @descripcion = '$descripcion' , @etapa = $etapa, @entrega = $entrega, @usuario = $usuario, @accion = '$icono'";
		$sqlAux = "INSERT INTO HistorialFlujo (his_folio,his_fecha,his_hora,his_etapa,his_entrega,his_usuario,his_titulo,his_descripcion,his_accion,his_area,DOC_claveint) VALUES ( '$folio',GETDATE(), GETDATE(),$etapa, $entrega,$usuario,'$titulo','$descripcion' , '$icono',$area,$documento);";
		$rs = odbc_exec($conexion,$sqlAux);



		if ($rs){

              return true;

        }else {

              return false;
        }

	}

};



$app->run();



