function notaCreditoCtrl($scope, $rootScope, loading,$filter,$location,$http,checkFolios,api, find, $upload, leexml, PagoManual){

    loading.despedida();

    $scope.inicio = function(){

        $rootScope.area = 6;
        $scope.tituloPM = "Notas de Credito";
        $scope.tipoTramite(); 
        $scope.archivos = [];
        $scope.Pagos = [];
        // $scope.PagosM = [];
        $scope.Proveedores();
        $scope.eliminaxml();

        $scope.NotaG = {

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
            retencion: 0.00,
            SubtotalF: 0.00,
            IVAF: 0.00,
            TotalF: 0.00
        }

        $scope.NotaI = {

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
            importeiva: '',
            iva: '',
            importeisr: '',
            isr: '',
            usuarioentrega: '',
            proveedor: '',
            retencion: 0.00,
            SubtotalF: 0.00,
            IVAF: 0.00,
            TotalF: 0.00


        }


    }

    $scope.limpiaTabla = function(){

        $scope.Pagos = [];
        $scope.subtotalPago = 0;
        $scope.ivaPago = 0;
        $scope.totalPago = 0;


    }

    $scope.calculaTotal = function(){

        var m = parseInt($scope.NotaG.SubtotalF) + parseInt($scope.NotaG.IVAF) - parseInt($scope.NotaG.retencion);
        var mm = m.toFixed(2);
        $scope.NotaG.TotalF = mm;

    }

    $scope.calculaTotalInd = function(){

        var t = parseInt($scope.NotaI.SubtotalF) + parseInt($scope.NotaI.IVAF) - parseInt($scope.NotaI.retencion);
        var tt = t.toFixed(2);
        $scope.NotaI.TotalF = tt;

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
                data: $scope.NotaG,
                file: file // or list of files ($files) for html5 only
        }).success(function (data){

            if ($scope.NotaG.proveedor == '' || $scope.NotaG.proveedor == undefined){

                leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
                courses  = x2js.xml_str2json(data);

                PagoManual.consultaFolioFiscal(courses.Comprobante.Complemento.TimbreFiscalDigital._UUID).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.NotaG.importe = '';
                        $scope.NotaG.total = '';
                        $scope.NotaG.foliofiscal = '';
                        $scope.NotaG.fechaemision = '';
                        $scope.NotaG.descuento = '';
                        $scope.NotaG.emisor = '';
                        $scope.NotaG.descuento = '';
                        $scope.NotaG.serie = '';
                        $scope.NotaG.elimina = false;

                    }
                });
                PagoManual.validaUnidad($scope.NotaG.unidad).success(function (data){ 
                        if (data.length > 0){

                            $scope.NotaG.rfcemisor = data[0].rfc;
                            $scope.NotaG.unidad = data[0].unidad;

                        if ($scope.NotaG.rfcemisor == courses.Comprobante.Emisor._rfc){

                            $scope.NotaG.serie = courses.Comprobante._serie;
                            $scope.NotaG.foliointerno = courses.Comprobante._folio;

                            /////  particionar 2 decimales de xml 
                            // $scope.PagoM.subtotal = courses.Comprobante._subTotal;

                            var subglobal = courses.Comprobante._subTotal;
                            var subglobal1 = parseFloat(subglobal);
                            var subglobal2 = subglobal1.toFixed(2);
                            $scope.NotaG.subtotal = subglobal2;

                            var totalglobal = courses.Comprobante._total;
                            var totalglobal1 = parseFloat(totalglobal);
                            var totalglobal2 = totalglobal1.toFixed(2);
                            $scope.NotaG.total = totalglobal2;


                            // $scope.PagoM.total = courses.Comprobante._total;
                            $scope.NotaG.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                            $scope.NotaG.fechaemision = courses.Comprobante._fecha;
                            $scope.NotaG.descuento = courses.Comprobante._descuento;
                            $scope.NotaG.emisor = courses.Comprobante.Emisor._nombre;
                            $scope.NotaG.rfcemisor = courses.Comprobante.Emisor._rfc;

                            if(courses.Comprobante.Impuestos.Traslados == undefined){

                                $scope.NotaG.iva = '';
                                $scope.NotaG.importeiva = '';

                            }else{

                                $scope.NotaG.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                                $scope.NotaG.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                            }

                            if (courses.Comprobante.Impuestos.Retenciones == undefined) {

                                $scope.NotaG.isr = '';
                                $scope.NotaG.importeisr = '';


                            }else{


                                $scope.NotaG.isr = courses.Comprobante.Impuestos.Retenciones.Retencion._impuesto;
                                $scope.NotaG.importeisr = courses.Comprobante.Impuestos.Retenciones.Retencion._importe;

                            }
                            $scope.NotaG.usuarioentrega = Number($rootScope.id);
                            // $scope.NotaG.areaentrega =Number(areaEntrega);
                            // $scope.NotaG.usuariorecibe =Number(usuarioRecibe);
                            // $scope.NotaG.arearecibe =Number(areaRecibe);
                            // $scope.NotaG.folio = data.Folios;
                            $scope.NotaG.tipoorden = 4;
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
                        $scope.NotaG.importe = '';
                        $scope.NotaG.total = '';
                        $scope.NotaG.foliofiscal = '';
                        $scope.NotaG.fechaemision = '';
                        $scope.NotaG.descuento = '';
                        $scope.NotaG.emisor = '';
                        $scope.NotaG.descuento = '';
                        $scope.NotaG.serie = '';
                        $scope.NotaG.rfcemisor = '';
                        $scope.NotaG.elimina = false;

                    }
                });
                PagoManual.validaProveedor($scope.NotaG.proveedor).success(function (data){ 
                        if (data.length > 0){

                            $scope.NotaG.rfcemisor = data[0].rfc;
                            $scope.NotaG.unidad = data[0].unidad;

                        if ($scope.NotaG.rfcemisor == courses.Comprobante.Emisor._rfc){

                            $scope.NotaG.serie = courses.Comprobante._serie;
                            $scope.NotaG.foliointerno = courses.Comprobante._folio;

                            var subglobal = courses.Comprobante._subTotal;
                            var subglobal1 = parseFloat(subglobal);
                            var subglobal2 = subglobal1.toFixed(2);
                            $scope.NotaG.subtotal = subglobal2;

                            var totalglobal = courses.Comprobante._total;
                            var totalglobal1 = parseFloat(totalglobal);
                            var totalglobal2 = totalglobal1.toFixed(2);
                            $scope.NotaG.total = totalglobal2;

                            $scope.NotaG.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                            $scope.NotaG.fechaemision = courses.Comprobante._fecha;
                            $scope.NotaG.descuento = courses.Comprobante._descuento;
                            $scope.NotaG.emisor = courses.Comprobante.Emisor._nombre;
                            $scope.NotaG.rfcemisor = courses.Comprobante.Emisor._rfc;
                            if(courses.Comprobante.Impuestos.Traslados == undefined){

                                $scope.NotaG.iva = '';
                                $scope.NotaG.importeiva = '';

                            }else{

                                $scope.NotaG.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                                $scope.NotaG.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                            }

                            if (courses.Comprobante.Impuestos.Retenciones == undefined) {

                                $scope.NotaG.isr = '';
                                $scope.NotaG.importeisr = '';


                            }else{


                                $scope.NotaG.isr = courses.Comprobante.Impuestos.Retenciones.Retencion._impuesto;
                                $scope.NotaG.importeisr = courses.Comprobante.Impuestos.Retenciones.Retencion._importe;

                            }
                            $scope.NotaG.usuarioentrega = Number($rootScope.id);
                            // $scope.NotaG.areaentrega =Number(areaEntrega);
                            // $scope.NotaG.usuariorecibe =Number(usuarioRecibe);
                            // $scope.NotaG.arearecibe =Number(areaRecibe);
                            // $scope.NotaG.folio = data.Folios;
                            $scope.NotaG.tipoorden = 4;
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
        factura: $scope.NotaG,
        subtotaltotal: $scope.subtotalPago,
        importeiva: $scope.NotaG.importeiva,
        importeisr: $scope.NotaG.importeisr,
        total: $scope.totalPago,
        usuario: $rootScope.id,
        unidad: $scope.NotaG.unidad

    }

    	var areaRecibe = 6;
        var areaEntrega = 6;
        var usuarioRecibe = $rootScope.id;

        var ruta = api+'PagoManual/NotaCreditoG'; 

    	    $http.post(ruta,$scope.OPago).success(function (data){

                $scope.NotaG = {

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
}

$scope.addRow = function(){

	$scope.Pagos.push({ 'unidad':$scope.NotaG.unidad, 'folio': $scope.NotaG.folio, 'tramite': $scope.NotaG.tipotramite, 
		                 'concepto': $scope.NotaG.concepto, 'etapa': $scope.NotaG.etapa, 'entrega': $scope.NotaG.entrega,
		                 'observacion': $scope.NotaG.observacion, 'serie': $scope.NotaG.serie, 'foliointerno': $scope.NotaG.foliointerno,
		                 'subtotal': $scope.NotaG.subtotal, 'total': $scope.NotaG.total, 'foliofiscal':$scope.NotaG.foliofiscal, 
		                 'fechaemision':$scope.NotaG.fechaemision, 'descuento':$scope.NotaG.descuento, 'emisor':$scope.NotaG.emisor,
		                 'rfcemisor':$scope.NotaG.rfcemisor, 'impuesto': $scope.NotaG.impuesto, 'tasa': $scope.NotaG.tasa, 'SubtotalF':$scope.NotaG.SubtotalF, 'IVAF':  $scope.NotaG.IVAF, 'TotalF': $scope.NotaG.TotalF,
                         'proveedor': $scope.NotaG.proveedor, 'retencion': $scope.NotaG.retencion});

    $scope.NotaG.folio = '';
    $scope.NotaG.tipotramite = '';
    $scope.NotaG.concepto = '';
    $scope.NotaG.etapa = '';
    $scope.NotaG.entrega = '';
    $scope.NotaG.SubtotalF = 0.00;
    $scope.NotaG.IVAF = 0.00;
    $scope.NotaG.TotalF = 0.00;
    $scope.NotaG.observacion = '';
    $scope.NotaG.serie = '';
    $scope.NotaG.retencion = 0.00;



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

      $scope.NotaG.foliointerno = '';
      $scope.NotaG.serie = '';
      $scope.NotaG.foliofiscal = '';
      $scope.NotaG.emisor = '';
      $scope.NotaG.rfc_emisor = '';
      $scope.NotaG.subtotal = '';
      $scope.NotaG.tasa = '';
      $scope.NotaG.total = '';
      $scope.NotaG.fechaemision = '';

      $scope.NotaI.foliointerno = '';
      $scope.NotaI.serie = '';
      $scope.NotaI.foliofiscal = '';
      $scope.NotaI.emisor = '';
      $scope.NotaI.rfcemisor = '';
      $scope.NotaI.subtotal = '';
      $scope.NotaI.tasa = '';
      $scope.NotaI.total = '';
      $scope.NotaI.fechaemision = '';



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

        var aux = $files[0].name.split('.');

        if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

         for (var i = 0; i < $files.length; i++){
         var file = $files[i];
         var amt = 0;
          $scope.upload = $upload.upload({
                url: api+'PagoManual/upload/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                method: 'POST',
                data: $scope.NotaI,
                file: file // or list of files ($files) for html5 only
        }).success(function (data){

            if ($scope.NotaI.proveedor == '') {

                leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
                courses  = x2js.xml_str2json(data);

                PagoManual.consultaFolioFiscal(courses.Comprobante.Complemento.TimbreFiscalDigital._UUID).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope. NotaI.importe = '';
                        $scope. NotaI.total = '';
                        $scope. NotaI.foliofiscal = '';
                        $scope. NotaI.fechaemision = '';
                        $scope. NotaI.descuento = '';
                        $scope. NotaI.emisor = '';
                        $scope. NotaI.descuento = "";
                        $scope. NotaI.serie = '';
                        $scope. NotaI.elimina = false;
                        $scope. NotaI.retencion = '';

                    }
                });
                PagoManual.validaUnidad($scope.NotaI.unidad).success(function (data){ 
                        if (data.length > 0){

                            $scope.NotaI.rfcemisor = data[0].rfc;
                            $scope.NotaI.unidad = data[0].unidad;

                        if ($scope.NotaI.rfcemisor == courses.Comprobante.Emisor._rfc){


                            $scope.NotaI.serie = courses.Comprobante._serie;
                            $scope.NotaI.foliointerno = courses.Comprobante._folio;

                            //////////  limitar el subtotal del xml 
                            // $scope.NotaI.subtotal = courses.Comprobante._subTotal;
                            // $scope.NotaI.total = courses.Comprobante._total;

                            var subglobal = courses.Comprobante._subTotal;
                            var subglobal1 = parseFloat(subglobal);
                            var subglobal2 = subglobal1.toFixed(2);
                            $scope.NotaI.subtotal = subglobal2;

                            var totalglobal = courses.Comprobante._total;
                            var totalglobal1 = parseFloat(totalglobal);
                            var totalglobal2 = totalglobal1.toFixed(2);
                            $scope.NotaI.total = totalglobal2;


                            $scope.NotaI.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                            $scope.NotaI.fechaemision = courses.Comprobante._fecha;
                            $scope.NotaI.descuento = courses.Comprobante._descuento;
                            $scope.NotaI.emisor = courses.Comprobante.Emisor._nombre;
                            $scope.NotaI.rfcemisor = courses.Comprobante.Emisor._rfc;

                            if(courses.Comprobante.Impuestos.Traslados == undefined){

                                $scope.NotaI.iva = '';
                                $scope.NotaI.importeiva = 0;

                            }else{

                                if(courses.Comprobante.Impuestos.Traslados.Traslado.length > 1){
                                    
                                    $scope.NotaI.iva = courses.Comprobante.Impuestos.Traslados.Traslado[0]._impuesto;
                                    $scope.NotaI.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado[0]._importe;

                                }else{

                                    $scope.NotaI.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                                    $scope.NotaI.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                                }
                            }

                            if (courses.Comprobante.Impuestos.Retenciones == undefined) {

                                $scope.NotaI.isr = '';
                                $scope.NotaI.importeisr = 0;

                            }else{

                                if(courses.Comprobante.Impuestos.Traslados.Traslado.length > 1){
                                    
                                    $scope.NotaI.isr = courses.Comprobante.Impuestos.Retenciones.Retencion[0]._impuesto;
                                    $scope.NotaI.importeisr = courses.Comprobante.Impuestos.Retenciones.Retencion[0]._importe;

                                }else{

                                    $scope.NotaI.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                                    $scope.NotaI.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                                }


                            }

                            $scope.NotaI.usuarioentrega = Number($rootScope.id);
                            $scope.NotaI.tipoorden = 5;
                            $scope.btndelete = true;

                            ///// SE CALCULA EL MONTO DE LA NOTA DE CREDITO /////
                            
                            $scope.NotaI.importeNC = parseFloat($scope.NotaI.subtotal) - parseFloat($scope.NotaI.SubtotalF);
                            $scope.NotaI.importeisrNC = parseFloat($scope.NotaI.importeisr) - parseFloat($scope.NotaI.retencion);
                            $scope.NotaI.importeivaNC = parseFloat($scope.NotaI.importeiva) - parseFloat($scope.NotaI.IVAF);
                            $scope.NotaI.TotalNC = parseFloat($scope.NotaI.total) - parseFloat($scope.NotaI.TotalF);
            
                          
                        }else{

                            swal('Upss','Tu Factura no coincide con el Emisor','error');

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
                        $scope.NotaI.importe = '';
                        $scope.NotaI.total = '';
                        $scope.NotaI.foliofiscal = '';
                        $scope.NotaI.fechaemision = '';
                        $scope.NotaI.descuento = '';
                        $scope.NotaI.emisor = '';
                        $scope.NotaI.descuento = "";
                        $scope.NotaI.serie = '';
                        $scope.NotaI.elimina = false;
                        $scope.NotaI.retencion = '';

                    }
                });
                PagoManual.validaProveedor($scope.NotaI.proveedor).success(function (data){ 
                        if (data.length > 0){

                            $scope.NotaI.rfcemisor = data[0].rfc;
                            $scope.NotaI.unidad = data[0].unidad;

                        if ($scope.NotaI.rfcemisor == courses.Comprobante.Emisor._rfc){

                            $scope.NotaI.serie = courses.Comprobante._serie;
                            $scope.NotaI.foliointerno = courses.Comprobante._folio;

                            var subglobal = courses.Comprobante._subTotal;
                            var subglobal1 = parseFloat(subglobal);
                            var subglobal2 = subglobal1.toFixed(2);
                            $scope.NotaI.subtotal = subglobal2;

                            var totalglobal = courses.Comprobante._total;
                            var totalglobal1 = parseFloat(totalglobal);
                            var totalglobal2 = totalglobal1.toFixed(2);
                            $scope.NotaI.total = totalglobal2;

                            $scope.NotaI.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                            $scope.NotaI.fechaemision = courses.Comprobante._fecha;
                            $scope.NotaI.descuento = courses.Comprobante._descuento;
                            $scope.NotaI.emisor = courses.Comprobante.Emisor._nombre;
                            $scope.NotaI.rfcemisor = courses.Comprobante.Emisor._rfc;

                            if(courses.Comprobante.Impuestos.Traslados == undefined){

                                $scope.NotaI.iva = '';
                                $scope.NotaI.importeiva = '';

                            }else{

                                if(courses.Comprobante.Impuestos.Traslados.Traslado.length > 1){
                                    
                                    $scope.NotaI.iva = courses.Comprobante.Impuestos.Traslados.Traslado[0]._impuesto;
                                    $scope.NotaI.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado[0]._importe;

                                }else{

                                    $scope.NotaI.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                                    $scope.NotaI.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                                }

                            }

                            if (courses.Comprobante.Impuestos.Retenciones == undefined) {

                                $scope.NotaI.isr = '';
                                $scope.NotaI.importeisr = '';


                            }else{


                                if(courses.Comprobante.Impuestos.Traslados.Traslado.length > 1){
                                    
                                    $scope.NotaI.isr = courses.Comprobante.Impuestos.Retenciones.Retencion[0]._impuesto;
                                    $scope.NotaI.importeisr = courses.Comprobante.Impuestos.Retenciones.Retencion[0]._importe;

                                }else{

                                    $scope.NotaI.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                                    $scope.NotaI.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                                }

                            }

                            $scope.NotaI.usuarioentrega = Number($rootScope.id);
                            $scope.NotaI.tipoorden = 5;
                            $scope.btndelete = true;

                        }else{

                            swal('Upss','Tu Factura no coincide con el Emisor','error');

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

$scope.enviaOrdenNotaInd = function(){

    $scope.OPago = {

        seleccionados : $scope.Pagos,
        archivos : $scope.archivos,
        usucarpeta: $rootScope.user,
        factura: $scope.NotaI,
        subtotaltotal: $scope.NotaI.SubtotalF,
        importeiva: $scope.NotaI.importeiva,
        importeisr: $scope.NotaI.importeisr,
        total: $scope.NotaI.TotalF,
        usuario: $rootScope.id,
        unidad: $scope.NotaI.unidad,
        proveedor: $scope.NotaI.proveedor,
        importeNC: $scope.NotaI.importeNC,
        importeivaNC: $scope.NotaI.importeivaNC,
        importeisrNC: $scope.NotaI.importeisrNC,
        totalNC: $scope.NotaI.TotalNC 

    }

    // console.log($scope.OPago);

        var areaRecibe = 6;
        var areaEntrega = 6;
        var usuarioRecibe = $rootScope.id;

        var ruta = api+'PagoManual/notaCreditoI'; 

        // for (var i = 0; i < $scope.PagoM.length; i++){

            $http.post(ruta,$scope.OPago).success(function (data){

                // $scope.borratemporales();
            $scope.NotaI = {

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

notaCreditoCtrl.$inject = ['$scope', '$rootScope',  'loading','$filter','$location','$http','checkFolios','api','find', '$upload', 'leexml', 'PagoManual'];
app.controller('notaCreditoCtrl',notaCreditoCtrl);
