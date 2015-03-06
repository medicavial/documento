<?php
//============================================================+
// File name   : example_009.php
// Begin       : 2008-03-04
// Last Update : 2013-05-14
//
// Description : Example 009 for TCPDF class
//               Test Image
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: Test Image
 * @author Nicola Asuni
 * @since 2008-03-04
 */

    
$archivo1 = "C:\\Users\\salcala.MEDICAVIAL\\Desktop\\MV\\QUALITAS\\2014\\5\\CEMS002449\\04140387958_21737_14M101525149_QS07.jpg";
$archivo2 = "C:\\Users\\salcala.MEDICAVIAL\\Desktop\\MV\\QUALITAS\\2014\\5\\CEMS002449\\04140387958_21737_14M101525149_GN19.jpg";
$archivo3 = "C:\\Users\\salcala.MEDICAVIAL\\Desktop\\MV\\QUALITAS\\2014\\5\\CEMS002449\\04140387958_21737_14M101525149_ME021.jpg";

// Include the main TCPDF library (search for installation path).
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

// add a page
$pdf->AddPage();

// set JPEG quality
$pdf->setJPEGQuality(75);


$pdf->SetXY(0, 15);
$pdf->Image($archivo3, '', '', 340, 400, '', '', 'T', false, 400, '', false, false, 1, false, false, false);

// -------------------------------------------------------------------

//Close and output PDF document
$pdf->Output('C:\\Users\\salcala.MEDICAVIAL\\Desktop\\MV\\QUALITAS\\2014\\5\\CEMS002449\\prueba.pdf', 'F');

//============================================================+
// END OF FILE
//============================================================+

