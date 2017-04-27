function pagoManualCtrl($scope, $rootScope, loading,$filter,$location,$http,checkFolios,api, find, $upload, leexml, PagoManual){

    loading.despedida();

    $scope.inicio = function(){

        $rootScope.area = 6;
        $scope.tituloPM = "Pagos Manuales";
        $scope.tipoTramite(); 
        $scope.archivos = [];
        $scope.Pagos = [];
        // $scope.PagosM = [];
        $scope.Proveedores();
        $scope.eliminaxml();


        $scope.PagoM = {

        	unidad: '',
        	folio: '',
        	tipotramite: '',
        	concepto: '',
        	etapa: '',
        	foliofiscal: '',
	        subtotal: '', 
	        descuento: 0.00, 
	        total: '',
	        fechaemision: '',
	        observacion: '',
	        rfcemisor: '',
	        serie:'',
	        foliointerno: '',
	        emisor: '',
	        impuesto: '',
	        tasa: '',
	        usuarioentrega: '',
            proveedor: '',
            retencion: 0.00,
            SubtotalF: 0.00,
            IVAF: 0.00,
            TotalF: 0.00



        }

        $scope.PagoI = {

            unidad: '',
            folio: '',
            tipotramite: '',
            concepto: '',
            etapa: '',
            foliofiscal: '',
            subtotal: '', 
            descuento: 0.00, 
            total: '',
            fechaemision: '',
            observacion: '',
            rfcemisor: '',
            serie:'',
            foliointerno: '',
            emisor: '',
            importeiva: '',
            iva: '',
            importeisr: '',
            isr: '',
            usuarioentrega: '',
            proveedor: '',
            retencion: 0.00,
            SubtotalF: 0.00,
            IVAF: 0.00,
            TotalF: 0.00,
            ndc: 0


        }


    }

    $scope.limpiaTabla = function(){

        $scope.Pagos = [];
        $scope.subtotalPago = 0;
        $scope.ivaPago = 0;
        $scope.totalPago = 0;


    }

    $scope.calculaTotal = function(){

        var m = parseFloat($scope.PagoM.SubtotalF) - parseFloat($scope.PagoM.descuento) + parseFloat($scope.PagoM.IVAF) - parseFloat($scope.PagoM.retencion);
        var mm = m.toFixed(2);
        $scope.PagoM.TotalF = mm;

    }

    $scope.calculaTotalInd = function(){

        var t = parseFloat($scope.PagoI.SubtotalF) - parseFloat($scope.PagoI.descuento) + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.retencion);
        var tt = t.toFixed(2);
        $scope.PagoI.TotalF = tt;

    }

    $scope.Altaunidades = function(){

        find.unidades().success( function (data){

            $scope.unidades = data;
            
         });
    }

    $scope.subtipotramite = function(tipotramite){

        find.conceptotramite(tipotramite).success( function (data){

            $scope.conceptost = data;

        });
    }

    $scope.tipoTramite = function(){
        find.tipotramite().success( function (data) {

            $scope.tipostramites = data;

        });
    }

    $scope.subeXML = function($files){

        var aux = $files[0].name.split('.');

        if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

         for (var i = 0; i < $files.length; i++){
         var file = $files[i];
         var amt = 0;
          $scope.upload = $upload.upload({
                url: api+'PagoManual/upload/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                method: 'POST',
                data: $scope.PagoM,
                file: file // or list of files ($files) for html5 only
        }).success(function (data){

            if ($scope.PagoM.proveedor == '' || $scope.PagoM.proveedor == undefined){

                leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
                courses  = x2js.xml_str2json(data);

                PagoManual.consultaFolioFiscal(courses.Comprobante.Complemento.TimbreFiscalDigital._UUID).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.PagoM.importe = '';
                        $scope.PagoM.total = '';
                        $scope.PagoM.foliofiscal = '';
                        $scope.PagoM.fechaemision = '';
                        $scope.PagoM.descuento = '';
                        $scope.PagoM.emisor = '';
                        $scope.PagoM.descuento = '';
                        $scope.PagoM.serie = '';
                        $scope.PagoM.elimina = false;

                    }
                });
                PagoManual.validaUnidad($scope.PagoM.unidad).success(function (data){ 
                        if (data.length > 0){

                            $scope.PagoM.rfcemisor = data[0].rfc;
                            $scope.PagoM.unidad = data[0].unidad;

                        if ($scope.PagoM.rfcemisor == courses.Comprobante.Emisor._rfc){

                            $scope.PagoM.serie = courses.Comprobante._serie;
                            $scope.PagoM.foliointerno = courses.Comprobante._folio;

                            /////  particionar 2 decimales de xml 
                            // $scope.PagoM.subtotal = courses.Comprobante._subTotal;

                            var subglobal = courses.Comprobante._subTotal;
                            var subglobal1 = parseFloat(subglobal);
                            var subglobal2 = subglobal1.toFixed(2);
                            $scope.PagoM.subtotal = subglobal2;

                            var totalglobal = courses.Comprobante._total;
                            var totalglobal1 = parseFloat(totalglobal);
                            var totalglobal2 = totalglobal1.toFixed(2);
                            $scope.PagoM.total = totalglobal2;


                            // $scope.PagoM.total = courses.Comprobante._total;
                            $scope.PagoM.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                            $scope.PagoM.fechaemision = courses.Comprobante._fecha;
                            $scope.PagoM.descuento = courses.Comprobante._descuento;
                            $scope.PagoM.emisor = courses.Comprobante.Emisor._nombre;
                            $scope.PagoM.rfcemisor = courses.Comprobante.Emisor._rfc;

                            if(courses.Comprobante.Impuestos.Traslados == undefined){

                                $scope.PagoM.iva = '';
                                $scope.PagoM.importeiva = '';

                            }else{

                                $scope.PagoM.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                                $scope.PagoM.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                            }

                            if (courses.Comprobante.Impuestos.Retenciones == undefined) {

                                $scope.PagoM.isr = '';
                                $scope.PagoM.importeisr = '';


                            }else{


                                $scope.PagoM.isr = courses.Comprobante.Impuestos.Retenciones.Retencion._impuesto;
                                $scope.PagoM.importeisr = courses.Comprobante.Impuestos.Retenciones.Retencion._importe;

                            }
                            $scope.PagoM.usuarioentrega = Number($rootScope.id);
                            // $scope.PagoM.areaentrega =Number(areaEntrega);
                            // $scope.PagoM.usuariorecibe =Number(usuarioRecibe);
                            // $scope.PagoM.arearecibe =Number(areaRecibe);
                            // $scope.PagoM.folio = data.Folios;
                            $scope.PagoM.tipoorden = 4;
                            $scope.btndelete = true;
                          
                        }else{

                            swal('Upss','Tu Factura no coincide con el Emisor','error');

                            // var archivo = $scope.datos.leexml;
                            // $scope.elimina_ahora(archivo);
                            $scope.eliminaxml();

                        }
                    }else{

                      swal("Upss", "El proveedor no se encuentra en el sistema, Solicitalo al area de Sistemas", "error");
                      $scope.eliminaxml();
                    }

                });

            });


            }else{

                leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
                courses  = x2js.xml_str2json(data);

                PagoManual.consultaFolioFiscal(courses.Comprobante.Complemento.TimbreFiscalDigital._UUID).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.eliminaxml();
                        $scope.PagoM.importe = '';
                        $scope.PagoM.total = '';
                        $scope.PagoM.foliofiscal = '';
                        $scope.PagoM.fechaemision = '';
                        $scope.PagoM.descuento = '';
                        $scope.PagoM.emisor = '';
                        $scope.PagoM.descuento = '';
                        $scope.PagoM.serie = '';
                        $scope.PagoM.rfcemisor = '';
                        $scope.PagoM.elimina = false;

                    }
                });
                PagoManual.validaProveedor($scope.PagoM.proveedor).success(function (data){ 
                        if (data.length > 0){

                            $scope.PagoM.rfcemisor = data[0].rfc;
                            $scope.PagoM.unidad = data[0].unidad;

                        if ($scope.PagoM.rfcemisor == courses.Comprobante.Emisor._rfc){

                            $scope.PagoM.serie = courses.Comprobante._serie;
                            $scope.PagoM.foliointerno = courses.Comprobante._folio;

                            var subglobal = courses.Comprobante._subTotal;
                            var subglobal1 = parseFloat(subglobal);
                            var subglobal2 = subglobal1.toFixed(2);
                            $scope.PagoM.subtotal = subglobal2;

                            var totalglobal = courses.Comprobante._total;
                            var totalglobal1 = parseFloat(totalglobal);
                            var totalglobal2 = totalglobal1.toFixed(2);
                            $scope.PagoM.total = totalglobal2;

                            $scope.PagoM.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                            $scope.PagoM.fechaemision = courses.Comprobante._fecha;
                            $scope.PagoM.descuento = courses.Comprobante._descuento;
                            $scope.PagoM.emisor = courses.Comprobante.Emisor._nombre;
                            $scope.PagoM.rfcemisor = courses.Comprobante.Emisor._rfc;
                            if(courses.Comprobante.Impuestos.Traslados == undefined){

                                $scope.PagoM.iva = '';
                                $scope.PagoM.importeiva = '';

                            }else{

                                $scope.PagoM.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                                $scope.PagoM.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                            }

                            if (courses.Comprobante.Impuestos.Retenciones == undefined) {

                                $scope.PagoM.isr = '';
                                $scope.PagoM.importeisr = '';


                            }else{


                                $scope.PagoM.isr = courses.Comprobante.Impuestos.Retenciones.Retencion._impuesto;
                                $scope.PagoM.importeisr = courses.Comprobante.Impuestos.Retenciones.Retencion._importe;

                            }
                            $scope.PagoM.usuarioentrega = Number($rootScope.id);
                            // $scope.PagoM.areaentrega =Number(areaEntrega);
                            // $scope.PagoM.usuariorecibe =Number(usuarioRecibe);
                            // $scope.PagoM.arearecibe =Number(areaRecibe);
                            // $scope.PagoM.folio = data.Folios;
                            $scope.PagoM.tipoorden = 4;
                            $scope.btndelete = true;
                          
                        }else{

                            swal('Upss','Tu Factura no coincide con el Emisor','error');

                            // var archivo = $scope.datos.leexml;
                           $scope.eliminaxml();

                        }
                    }else{

                      swal("Upss", "El proveedor no se encuentra en el sistema, Solicitalo al area de Sistemas", "error");
                      $scope.eliminaxml();

                    }

                });

            });


            }

                $scope.archivos = data.ruta;

                console.log(data.ruta);

        }).error( function (xhr,status,data){

                  alert('Ocurrio un error');

                });
            }

        }else{

               alert('La extensión debe ser xml');
        }

}

$scope.enviaOrdenPago = function(){

    $scope.OPago = {

        seleccionados : $scope.Pagos,
        archivos : $scope.archivos,
        usucarpeta: $rootScope.user,
        factura: $scope.PagoM,
        subtotaltotal: $scope.subtotalPago,
        importeiva: $scope.PagoM.importeiva,
        importeisr: $scope.PagoM.importeisr,
        total: $scope.totalPago,
        usuario: $rootScope.id,
        unidad: $scope.PagoM.unidad

    }

    console.log($scope.OPago.subtotaltotal);
    console.log( $scope.OPago.factura.subtotal);

    if ($scope.OPago.subtotaltotal !=  $scope.OPago.factura.subtotal){

       swal("Upss","El Monto de los Pagos no Coincide con el Subtotal de la Factura","error");

    }else

    if ($scope.OPago.total != $scope.OPago.factura.total){

       swal("Upss","El Monto de los Pagos no Coincide con el Total de la Factura","error");

    }else{

    	var areaRecibe = 6;
        var areaEntrega = 6;
        var usuarioRecibe = $rootScope.id;

        var ruta = api+'PagoManual/ordenPago'; 

        // for (var i = 0; i < $scope.PagoM.length; i++){

    	    $http.post(ruta,$scope.OPago).success(function (data){

    	    	// $scope.borratemporales();
                $scope.PagoM = {

                    unidad: '',
                    folio: '',
                    tipotramite: '',
                    concepto: '',
                    etapa: '',
                    foliofiscal: '',
                    subtotal: '', 
                    descuento: '', 
                    total: '',
                    fechaemision: '',
                    observacion: '',
                    rfcemisor: '',
                    serie:'',
                    foliointerno: '',
                    emisor: '',
                    impuesto: '',
                    tasa: '',
                    usuarioentrega: '',
                    proveedor: '',
                    retencion: ''

                }
                $scope.eliminaxml();
                $scope.Pagos = [];
    	    	swal("ok","Se Genero una Orden de Pago","success");


            }).error( function (data){

                alert('Error, Intentalo de Nuevo');

            });

        // } 
    }

}

$scope.addRow = function(){

	$scope.Pagos.push({ 'unidad':$scope.PagoM.unidad, 'folio': $scope.PagoM.folio, 'tramite': $scope.PagoM.tipotramite, 
		                 'concepto': $scope.PagoM.concepto, 'etapa': $scope.PagoM.etapa, 'entrega': $scope.PagoM.entrega,
		                 'observacion': $scope.PagoM.observacion, 'serie': $scope.PagoM.serie, 'foliointerno': $scope.PagoM.foliointerno,
		                 'subtotal': $scope.PagoM.subtotal, 'total': $scope.PagoM.total, 'foliofiscal':$scope.PagoM.foliofiscal, 
		                 'fechaemision':$scope.PagoM.fechaemision, 'descuento':$scope.PagoM.descuento, 'emisor':$scope.PagoM.emisor,
		                 'rfcemisor':$scope.PagoM.rfcemisor, 'impuesto': $scope.PagoM.impuesto, 'tasa': $scope.PagoM.tasa, 'SubtotalF':$scope.PagoM.SubtotalF, 'IVAF':  $scope.PagoM.IVAF, 'TotalF': $scope.PagoM.TotalF,
                         'proveedor': $scope.PagoM.proveedor, 'retencion': $scope.PagoM.retencion});

    $scope.PagoM.folio = '';
    $scope.PagoM.tipotramite = '';
    $scope.PagoM.concepto = '';
    $scope.PagoM.etapa = '';
    $scope.PagoM.entrega = '';
    $scope.PagoM.SubtotalF = 0.00;
    $scope.PagoM.IVAF = 0.00;
    $scope.PagoM.TotalF = 0.00;
    $scope.PagoM.observacion = '';
    $scope.PagoM.serie = '';
    $scope.PagoM.retencion = 0.00;



    var sumaTotal = 0;
    var sumaSubtotal = 0;
    var sumaIVA = 0;

    for (var i = 0; i < $scope.Pagos.length; i++){

        var valor = $scope.Pagos[i].SubtotalF;
        // var numero = valor.replace(",",'');
        sumaSubtotal += parseFloat(valor);
        var sumas = sumaSubtotal.toFixed(2);
        $scope.subtotalPago = sumas;

        var valor1 = $scope.Pagos[i].IVAF;
        // var numero1 = valor1.replace(",",'');
        sumaIVA += parseFloat(valor1);
        var sumas1 = sumaIVA.toFixed(2);
        $scope.ivaPago = sumas1;

        var valor2 = $scope.Pagos[i].TotalF;
        // var numero2 = valor2.replace(",",'');
        sumaTotal += parseFloat(valor2);
        var sumas2 = sumaTotal.toFixed(2);
        $scope.totalPago = sumas2;


    }


}


$scope.eliminaxml = function(){

    $http.post(api+'PagoManual/eliminaxml/'+$rootScope.user).success(function (data){

      $scope.PagoM.foliointerno = '';
      $scope.PagoM.serie = '';
      $scope.PagoM.foliofiscal = '';
      $scope.PagoM.emisor = '';
      $scope.PagoM.rfc_emisor = '';
      $scope.PagoM.subtotal = '';
      $scope.PagoM.tasa = '';
      $scope.PagoM.total = '';
      $scope.PagoM.fechaemision = '';

      $scope.PagoI.foliointerno = '';
      $scope.PagoI.serie = '';
      $scope.PagoI.foliofiscal = '';
      $scope.PagoI.emisor = '';
      $scope.PagoI.rfcemisor = '';
      $scope.PagoI.subtotal = '';
      $scope.PagoI.tasa = '';
      $scope.PagoI.total = '';
      $scope.PagoI.fechaemision = '';



    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

    });

}

$scope.Proveedores = function(){

    PagoManual.proveedores().success( function (data){

        $scope.proveedores = data;
        
     });
}


$scope.subeXMLInd = function($files){

    console.log($scope.PagoI);

        var aux = $files[0].name.split('.');

        if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

         for (var i = 0; i < $files.length; i++){
         var file = $files[i];
         var amt = 0;
          $scope.upload = $upload.upload({
                url: api+'PagoManual/upload/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                method: 'POST',
                data: $scope.PagoM,
                file: file // or list of files ($files) for html5 only
        }).success(function (data){

            if ($scope.PagoI.proveedor == '') {

                leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
                courses  = x2js.xml_str2json(data);

                PagoManual.consultaFolioFiscal(courses.Comprobante.Complemento.TimbreFiscalDigital._UUID).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.PagoI.importe = '';
                        $scope.PagoI.total = '';
                        $scope.PagoI.foliofiscal = '';
                        $scope.PagoI.fechaemision = '';
                        $scope.PagoI.descuento = '';
                        $scope.PagoI.emisor = '';
                        $scope.PagoI.descuento = "";
                        $scope.PagoI.serie = '';
                        $scope.PagoI.elimina = false;
                        $scope.PagoI.retencion = '';

                    }
                });
                PagoManual.validaUnidad($scope.PagoI.unidad).success(function (data){ 
                        if (data.length > 0){

                            $scope.PagoI.rfcemisor = data[0].rfc;
                            $scope.PagoI.unidad = data[0].unidad;

                        if ($scope.PagoI.rfcemisor == courses.Comprobante.Emisor._rfc){


                            $scope.PagoI.serie = courses.Comprobante._serie;
                            $scope.PagoI.foliointerno = courses.Comprobante._folio;

                            //////////  limitar el subtotal del xml 
                            // $scope.PagoI.subtotal = courses.Comprobante._subTotal;
                            // $scope.PagoI.total = courses.Comprobante._total;

                            var subglobal = courses.Comprobante._subTotal;
                            var subglobal1 = parseFloat(subglobal);
                            var subglobal2 = subglobal1.toFixed(2);
                            $scope.PagoI.subtotal = subglobal2;

                            var totalglobal = courses.Comprobante._total;
                            var totalglobal1 = parseFloat(totalglobal);
                            var totalglobal2 = totalglobal1.toFixed(2);
                            $scope.PagoI.total = totalglobal2;


                            $scope.PagoI.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                            $scope.PagoI.fechaemision = courses.Comprobante._fecha;
                            $scope.PagoI.descuento = courses.Comprobante._descuento;
                            $scope.PagoI.emisor = courses.Comprobante.Emisor._nombre;
                            $scope.PagoI.rfcemisor = courses.Comprobante.Emisor._rfc;

                            if(courses.Comprobante.Impuestos.Traslados == undefined){

                                $scope.PagoI.iva = '';
                                $scope.PagoI.importeiva = '';

                            }else{

                                $scope.PagoI.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                                $scope.PagoI.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                            }

                            if (courses.Comprobante.Impuestos.Retenciones == undefined) {

                                $scope.PagoI.isr = '';
                                $scope.PagoI.importeisr = '';


                            }else{


                                $scope.PagoI.isr = courses.Comprobante.Impuestos.Retenciones.Retencion._impuesto;
                                $scope.PagoI.importeisr = courses.Comprobante.Impuestos.Retenciones.Retencion._importe;

                            }

                            $scope.PagoI.usuarioentrega = Number($rootScope.id);
                            $scope.PagoI.tipoorden = 4;
                            $scope.btndelete = true;

                          
                        }else{

                            swal('Upss','Tu Factura no coincide con el Emisor','error');

                            // var archivo = $scope.datos.leexml;
                            // $scope.elimina_ahora(archivo);
                            $scope.eliminaxml();

                        }
                    }else{

                      swal("Upss", "El proveedor no se encuentra en el sistema, Solicitalo al area de Sistemas", "error");
                      $scope.eliminaxml();

                    }

                });



            });


            }else{

            leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
            courses  = x2js.xml_str2json(data);

                PagoManual.consultaFolioFiscal(courses.Comprobante.Complemento.TimbreFiscalDigital._UUID).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.eliminaxml();
                        $scope.PagoI.importe = '';
                        $scope.PagoI.total = '';
                        $scope.PagoI.foliofiscal = '';
                        $scope.PagoI.fechaemision = '';
                        $scope.PagoI.descuento = '';
                        $scope.PagoI.emisor = '';
                        $scope.PagoI.descuento = "";
                        $scope.PagoI.serie = '';
                        $scope.PagoI.elimina = false;
                        $scope.PagoI.retencion = '';

                    }
                });
                PagoManual.validaProveedor($scope.PagoI.proveedor).success(function (data){ 
                        if (data.length > 0){

                            $scope.PagoI.rfcemisor = data[0].rfc;
                            $scope.PagoI.unidad = data[0].unidad;

                        if ($scope.PagoI.rfcemisor == courses.Comprobante.Emisor._rfc){

                            $scope.PagoI.serie = courses.Comprobante._serie;
                            $scope.PagoI.foliointerno = courses.Comprobante._folio;

                            // $scope.PagoI.subtotal = courses.Comprobante._subTotal;
                            // $scope.PagoI.total = courses.Comprobante._total;

                            var subglobal = courses.Comprobante._subTotal;
                            var subglobal1 = parseFloat(subglobal);
                            var subglobal2 = subglobal1.toFixed(2);
                            $scope.PagoI.subtotal = subglobal2;

                            var totalglobal = courses.Comprobante._total;
                            var totalglobal1 = parseFloat(totalglobal);
                            var totalglobal2 = totalglobal1.toFixed(2);
                            $scope.PagoI.total = totalglobal2;

                            $scope.PagoI.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                            $scope.PagoI.fechaemision = courses.Comprobante._fecha;
                            $scope.PagoI.descuento = courses.Comprobante._descuento;
                            $scope.PagoI.emisor = courses.Comprobante.Emisor._nombre;
                            $scope.PagoI.rfcemisor = courses.Comprobante.Emisor._rfc;

                            if(courses.Comprobante.Impuestos.Traslados == undefined){

                                $scope.PagoI.iva = '';
                                $scope.PagoI.importeiva = '';

                            }else{

                                $scope.PagoI.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                                $scope.PagoI.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                            }

                            if (courses.Comprobante.Impuestos.Retenciones == undefined) {

                                $scope.PagoI.isr = '';
                                $scope.PagoI.importeisr = '';


                            }else{


                                $scope.PagoI.isr = courses.Comprobante.Impuestos.Retenciones.Retencion._impuesto;
                                $scope.PagoI.importeisr = courses.Comprobante.Impuestos.Retenciones.Retencion._importe;

                            }

                            $scope.PagoI.usuarioentrega = Number($rootScope.id);
                            $scope.PagoI.tipoorden = 4;
                            $scope.btndelete = true;

                        }else{

                            swal('Upss','Tu Factura no coincide con el Emisor','error');

                            // var archivo = $scope.datos.leexml;
                            // $scope.elimina_ahora(archivo);
                            $scope.eliminaxml();

                        }
                    }else{

                      swal("Upss", "El proveedor no se encuentra en el sistema, Solicitalo al area de Sistemas", "error");
                      $scope.eliminaxml();

                    }

                });



            });
}

                $scope.archivos = data.ruta;

                console.log(data.ruta);



        }).error( function (xhr,status,data){

                  alert('Ocurrio un error');

                });
            }

        }else{

               alert('La extensión debe ser xml');
        }

}

$scope.enviaOrdenPagoInd = function(){

    $scope.OPago = {

        seleccionados : $scope.Pagos,
        archivos : $scope.archivos,
        usucarpeta: $rootScope.user,
        factura: $scope.PagoI,
        subtotaltotal: $scope.PagoI.SubtotalF,
        importeiva: $scope.PagoI.importeiva,
        importeisr: $scope.PagoI.importeisr,
        total: $scope.PagoI.TotalF,
        usuario: $rootScope.id,
        unidad: $scope.PagoI.unidad,
        proveedor: $scope.PagoI.proveedor
    }

    if ($scope.PagoI.SubtotalF != $scope.OPago.factura.subtotal){

       swal("Upss","El Monto de los Pagos no Coincide con el Subtotal de la Factura","error");

    }else

    if ($scope.PagoI.TotalF != $scope.OPago.factura.total){

       swal("Upss","El Monto de los Pagos no Coincide con el Total de la Factura","error");

    }else{

        var areaRecibe = 6;
        var areaEntrega = 6;
        var usuarioRecibe = $rootScope.id;

        var ruta = api+'PagoManual/ordenPagoIndividual'; 

        // for (var i = 0; i < $scope.PagoM.length; i++){

            $http.post(ruta,$scope.OPago).success(function (data){

                // $scope.borratemporales();
            $scope.PagoI = {

                unidad: '',
                folio: '',
                tipotramite: '',
                concepto: '',
                etapa: '',
                foliofiscal: '',
                subtotal: '', 
                descuento: '', 
                total: '',
                fechaemision: '',
                observacion: '',
                rfcemisor: '',
                serie:'',
                foliointerno: '',
                emisor: '',
                impuesto: '',
                tasa: '',
                usuarioentrega: '',
                proveedor: ''

           }
                $scope.eliminaxml();
                swal("ok","Se Genero una Orden de Pago","success");


            }).error( function (data){

                alert('Error, Intentalo de Nuevo');

            });

        // } 
    }

}

}

pagoManualCtrl.$inject = ['$scope', '$rootScope',  'loading','$filter','$location','$http','checkFolios','api','find', '$upload', 'leexml', 'PagoManual'];
app.controller('pagoManualCtrl',pagoManualCtrl);
