function pagoManualPrefacturaCtrl($scope, $rootScope, loading,$filter,$location,$http,checkFolios,api, find, $upload, leexml, PagoManual){

    loading.despedida();

    $scope.inicio = function(){

        // $scope.buscaProveedores ={};
        $rootScope.area = 6;
        $scope.tituloPM = "Pagos Manuales";
        $scope.listadoPre();
        $scope.tipoTramite();
        $scope.buscaProveedores();
        $scope.archivos = [];
        $scope.Pagos = [];
        $scope.PagosM = [];
        $scope.eliminaxml();
        $scope.enviaI = true;
        $scope.enviaPG = true;



        $scope.PagoM = {

        	unidad: '',
        	folio: '',
        	tipotramite: '',
        	concepto: '',
        	etapa: '',
        	foliofiscal: '',
	        subtotal: '', 
	        descuentoF: 0.00, 
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
            retencionF: 0.00,
            SubtotalF: 0.00,
            IVAF: 0.00,
            TotalF: 0.00,
            deducibleF: 0.00,
            descuento: 0.00



        }

        $scope.PagoI = {

            unidad: '',
            folio: '',
            tipotramite: '',
            concepto: '',
            etapa: 0,
            foliofiscal: '',
            subtotal: '', 
            descuentoF: 0.00, 
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
            retencionF: 0.00,
            SubtotalF: 0.00,
            IVAF: 0.00,
            TotalF: 0.00,
            ndc: 0,
            deducibleF: 0.00,
            tipoDeducible: 1,
            prefactura: '',
            totalprefactura: ''

        

        }


    }

    $scope.buscaProveedores = function(){

        find.busquedaProveedor().success(function (data){
                
            $scope.proveedores = data; 
                // $scope.datos = [];

        });
    }


    $scope.listadoPre = function(){

        find.busquedaPrefacturas().success(function (data){
                
            $scope.listado = data; 
                // $scope.datos = [];

        });
    }

    $scope.limpiaTabla = function(){

        $scope.Pagos = [];
        $scope.subtotalPago = 0;
        $scope.ivaPago = 0;
        $scope.totalPago = 0;


    }

    $scope.calculaTotal = function(){

        var m = parseFloat($scope.PagoM.SubtotalF) -  parseFloat($scope.PagoM.deducibleF) - parseFloat($scope.PagoM.descuentoF) + parseFloat($scope.PagoM.IVAF) - parseFloat($scope.PagoM.retencionF);
        var mm = m.toFixed(2);
        $scope.PagoM.TotalF = mm;

    }

    $scope.calculaTotalInd = function(){

        if ($scope.PagoI.tipoDeducible == 1) {

            var t = parseFloat($scope.PagoI.SubtotalF) - parseFloat($scope.PagoI.deducibleF) -  parseFloat($scope.PagoI.descuentoF)  + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.retencionF);
            var tt = t.toFixed(2);
            $scope.PagoI.TotalF = tt;

        }

        if ($scope.PagoI.tipoDeducible == 2) {

            var dF = parseFloat($scope.PagoI.SubtotalF) + parseFloat($scope.PagoI.deducibleF);
            var dF = dF.toFixed(2);
            $scope.PagoI.SubtotalF = dF;


            var t = parseFloat($scope.PagoI.SubtotalF) - parseFloat($scope.PagoI.deducibleF)  +  parseFloat($scope.PagoI.descuentoF)  + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.retencionF);
            var tt = t.toFixed(2);
            $scope.PagoI.TotalF = tt;

        }

        if ($scope.PagoI.tipoDeducible == 3) {

            // var ivadd  = parseFloat($scope.PagoI.deducibleF3) * 0.16;
            // var ivadd1  =  ivadd.toFixed(2);
            // var addiva = parseFloat($scope.PagoI.IVAF) + ivadd;
            // $scope.PagoI.IVAF = addiva;
            
            //// obtengo lo que se agregara del deducible en el subtotal 

            var d = parseFloat($scope.PagoI.deducibleF) / parseFloat(1.16); 

            //// obtenemos el porcentaje del deducible para agregar al iva
            
            var dd = parseFloat(d) * parseFloat(0.16); 

            // agregamos lo odtenido al subtotal

            var ddd = parseFloat($scope.PagoI.SubtotalF) + parseFloat(d);
            var ddd = ddd.toFixed(2);
            $scope.PagoI.SubtotalF = ddd;

            // agregamos lo odtenido al iva
            // 
            var dddd = parseFloat($scope.PagoI.IVAF) + parseFloat(dd);
            var dddd = dddd.toFixed(2);
            $scope.PagoI.IVAF = dddd;

            /// sumamos lo que se obtuvo de lo agregado para restarlo al subtotal

            var pretotal = parseFloat(d) + parseFloat(dd);
            

            var t = parseFloat($scope.PagoI.SubtotalF)  -  parseFloat($scope.PagoI.descuentoF)  + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.retencionF);
            var tt = t.toFixed(2);

            // console.log(ivadd1);
            $scope.PagoI.TotalF = parseFloat(tt) - parseFloat(pretotal);

        }

        if ($scope.PagoI.tipoDeducible == 4) {

            // var ivadd  = parseFloat($scope.PagoI.deducibleF3) * 0.16;
            // var ivadd1  =  ivadd.toFixed(2);
            // var addiva = parseFloat($scope.PagoI.IVAF) + ivadd;
            // $scope.PagoI.IVAF = addiva;
            
            //// obtengo lo que se agregara del deducible en el subtotal 

            var d = parseFloat($scope.PagoI.deducibleF); 

            //// obtenemos el porcentaje del deducible para agregar al iva
            
            var dd = parseFloat(d) * parseFloat(0.16); 

            // agregamos lo odtenido al subtotal
            var ddd = parseFloat($scope.PagoI.SubtotalF) + parseFloat(d) + parseFloat(dd);
            var ddd = ddd.toFixed(2);

            $scope.PagoI.SubtotalF = ddd;

            // agregamos lo odtenido al iva
             
            // var dddd = parseFloat($scope.PagoI.IVAF) + parseFloat(dd);
            // var dddd = dddd.toFixed(2);
            // $scope.PagoI.IVAF = dddd;

            /// sumamos lo que se obtuvo de lo agregado para restarlo al subtotal

            // var pretotal = parseFloat(d) + parseFloat(dd);
            

            var t = parseFloat($scope.PagoI.SubtotalF) + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.deducibleF)  -  parseFloat($scope.PagoI.descuentoF)  - parseFloat($scope.PagoI.retencionF);
            var tt = t.toFixed(2);



            // console.log(ivadd1);
            $scope.PagoI.TotalF = parseFloat(ddd);

        }

        // console.log($scope.PagoI.tipoDeducible);
        // console.log($scope.PagoI.deducibleF3);

        // var t = parseFloat($scope.PagoI.SubtotalF) + parseFloat($scope.PagoI.deducibleF2) - parseFloat($scope.PagoI.deducibleF) +  parseFloat($scope.PagoI.descuentoF)  + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.retencionF);
        // var tt = t.toFixed(2);
        // $scope.PagoI.TotalF = tt;

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

    $scope.verificaLesionado = function(){

        find.verificaLesionado($scope.PagoI.folio).success( function (data) {

            $scope.nombreLesionado = data[0].lesionado;

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
                var xml = JSON.stringify(x2js.xml_str2json(data));
                var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                
                var courses =  x2js.json2xml_str($.parseJSON(prueba));
                courses  = x2js.xml_str2json(courses);
                // console.log(prueba);
                console.log(courses);

                PagoManual.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
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

                        if ($scope.PagoM.rfcemisor == courses.comprobante.emisor._rfc){


                            if((courses.comprobante._fecha >= '2018-01-01') && (courses.comprobante._version != '3.3')){


                                swal('Upss','Revisa la versión de tu xml, solo se acepta 3.3 a partir del 2018','error');


                            }else{



                                $scope.PagoM.serie = courses.comprobante._serie;
                                $scope.PagoM.foliointerno = courses.comprobante._folio;

                                /////  particionar 2 decimales de xml 
                                // $scope.PagoM.subtotal = courses.comprobante._subTotal;

                                var subglobal = courses.comprobante._subtotal;
                                var subglobal1 = parseFloat(subglobal);
                                var subglobal2 = subglobal1.toFixed(2);
                                $scope.PagoM.subtotal = subglobal2;

                                var totalglobal = courses.comprobante._total;
                                var totalglobal1 = parseFloat(totalglobal);
                                var totalglobal2 = totalglobal1.toFixed(2);
                                $scope.PagoM.total = totalglobal2;


                                // $scope.PagoM.total = courses.comprobante._total;
                                $scope.PagoM.foliofiscal = courses.comprobante.complemento.timbrefiscaldigital._uuid;
                                $scope.PagoM.fechaemision = courses.comprobante._fecha;
                                $scope.PagoM.descuento = courses.comprobante._descuento;
                                $scope.PagoM.emisor = courses.comprobante.emisor._nombre;
                                $scope.PagoM.rfcemisor = courses.comprobante.emisor._rfc;

                                if(courses.comprobante.impuestos.traslados == undefined){

                                    $scope.PagoM.iva = '';
                                    $scope.PagoM.importeiva = '';

                                }else{


                                    $scope.PagoM.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.PagoM.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;

                                }
                                // else{

                                //     $scope.PagoM.iva = courses.comprobante.Impuestos.Traslados.Traslado._impuesto;
                                //     $scope.PagoM.importeiva = courses.comprobante.Impuestos_totalImpuestosTrasladados;


                                // }



                                if (courses.comprobante.impuestos.retenciones == undefined) {

                                    $scope.PagoM.isr = '';
                                    $scope.PagoM.importeisr = '';


                                }else{


                                    $scope.PagoM.isr = courses.comprobante.impuestos.retenciones.retencion._impuesto;
                                    $scope.PagoM.importeisr = courses.comprobante.impuestos.retenciones.retencion._importe;

                                }
                                $scope.PagoM.usuarioentrega = Number($rootScope.id);
                                // $scope.PagoM.areaentrega =Number(areaEntrega);
                                // $scope.PagoM.usuariorecibe =Number(usuarioRecibe);
                                // $scope.PagoM.arearecibe =Number(areaRecibe);
                                // $scope.PagoM.folio = data.Folios;
                                $scope.PagoM.tipoorden = 4;
                                $scope.btndelete = true;
                                $scope.enviaPG = false;


                            }

                          
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
                var xml = JSON.stringify(x2js.xml_str2json(data));
                var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                
                var courses =  x2js.json2xml_str($.parseJSON(prueba));
                courses  = x2js.xml_str2json(courses);

                PagoManual.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
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

                        if ($scope.PagoM.rfcemisor == courses.comprobante.emisor._rfc){

                            if((courses.comprobante._fecha >= '2018-01-01') && (courses.comprobante._version != '3.3')){


                                swal('Upss','Revisa la versión de tu xml, solo se acepta 3.3 a partir del 2018','error');

                        }else{



                                $scope.PagoM.serie = courses.comprobante._serie;
                                $scope.PagoM.foliointerno = courses.comprobante._folio;

                                var subglobal = courses.comprobante._subtotal;
                                var subglobal1 = parseFloat(subglobal);
                                var subglobal2 = subglobal1.toFixed(2);
                                $scope.PagoM.subtotal = subglobal2;

                                var totalglobal = courses.comprobante._total;
                                var totalglobal1 = parseFloat(totalglobal);
                                var totalglobal2 = totalglobal1.toFixed(2);
                                $scope.PagoM.total = totalglobal2;

                                $scope.PagoM.foliofiscal = courses.comprobante.complemento.timbrefiscaldigital._uuid;
                                $scope.PagoM.fechaemision = courses.comprobante._fecha;
                                $scope.PagoM.descuento = courses.comprobante._descuento;
                                $scope.PagoM.emisor = courses.comprobante.emisor._nombre;
                                $scope.PagoM.rfcemisor = courses.comprobante.emisor._rfc;
                                if(courses.comprobante.Impuestos.Traslados == undefined){

                                    $scope.PagoM.iva = '';
                                    $scope.PagoM.importeiva = '';

                                }else{

                                    $scope.PagoM.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.PagoM.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;

                                }

                                if (courses.comprobante.Impuestos.Retenciones == undefined) {

                                    $scope.PagoM.isr = '';
                                    $scope.PagoM.importeisr = '';


                                }else{


                                    $scope.PagoM.isr = courses.comprobante.impuestos.retenciones.retencion._impuesto;
                                    $scope.PagoM.importeisr = courses.comprobante.impuestos.retenciones.retencion._importe;

                                }
                                $scope.PagoM.usuarioentrega = Number($rootScope.id);
                                // $scope.PagoM.areaentrega =Number(areaEntrega);
                                // $scope.PagoM.usuariorecibe =Number(usuarioRecibe);
                                // $scope.PagoM.arearecibe =Number(areaRecibe);
                                // $scope.PagoM.folio = data.Folios;
                                $scope.PagoM.tipoorden = 4;
                                $scope.btndelete = true;
                                $scope.enviaPG =  false;




                        }
                          
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

    if ($scope.selectos.length == 0){ 

        var prefacturaSelect = ''

    }else{

        var prefacturaSelect= $scope.selectos
    }

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
        unidad: $scope.PagoM.unidad,
        prefacturaSelect: prefacturaSelect

    }

    console.log($scope.OPago);
    // console.log( $scope.OPago.factura.subtotal);

    // if ($scope.OPago.subtotaltotal >  $scope.OPago.factura.subtotal){

    //    swal("Upss","El Monto del Subtotal es mas alto que la Factura","error");

    // }else

    // if ($scope.OPago.total > $scope.OPago.factura.total){

    //    swal("Upss","El Monto del Total es mas alto que la Factura","error");

    // }else{

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
                $scope.listadoPre();
    	    	swal("ok","Se Genero una Orden de Pago","success");


            }).error( function (data){

                alert('Error, Intentalo de Nuevo');

            });

        // } 
    // }

}

$scope.delete = function(index){

    $scope.Pagos.splice(index,1);

};

$scope.addRow = function(){


    if ($scope.PagoM.folio == '') {

        swal("Upss", "No tienes O.P para agregar", "error");

    }else{


	$scope.Pagos.push({ 'unidad':$scope.PagoM.unidad, 'folio': $scope.PagoM.folio, 'tramite': $scope.PagoM.tipotramite, 
		                 'concepto': $scope.PagoM.concepto, 'etapa': $scope.PagoM.etapa, 'entrega': $scope.PagoM.entrega,
		                 'observacion': $scope.PagoM.observacion, 'serie': $scope.PagoM.serie, 'foliointerno': $scope.PagoM.foliointerno,
		                 'subtotal': $scope.PagoM.subtotal, 'total': $scope.PagoM.total, 'foliofiscal':$scope.PagoM.foliofiscal, 
		                 'fechaemision':$scope.PagoM.fechaemision, 'descuento':$scope.PagoM.descuento, 'emisor':$scope.PagoM.emisor,
		                 'rfcemisor':$scope.PagoM.rfcemisor, 'impuesto': $scope.PagoM.impuesto, 'tasa': $scope.PagoM.tasa, 'SubtotalF':$scope.PagoM.SubtotalF, 'IVAF':  $scope.PagoM.IVAF, 'TotalF': $scope.PagoM.TotalF,
                         'proveedor': $scope.PagoM.proveedor, 'retencionF': $scope.PagoM.retencionF, 'deducibleF': $scope.PagoM.deducibleF, 'descuentoF': $scope.PagoM.descuentoF});

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
    $scope.PagoM.retencionF = 0.00;
    $scope.PagoM.deducibleF = 0.00;



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


}


$scope.eliminaxml = function(){

    $http.post(api+'PagoManual/eliminaxml/'+$rootScope.user).success(function (data){

      $scope.PagoM.foliointerno = '';
      $scope.PagoM.serie = '';
      $scope.PagoM.foliofiscal = '';
      $scope.PagoM.emisor = '';
      $scope.PagoM.rfcemisor = '';
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
      $scope.enviaI = true;
      $scope.enviaPG = true;



    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

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

                if ($scope.PagoI.proveedor == '' && $scope.PagoI.unidad == '') {

                    swal('Error','Selecciona Unidad o Proveedor','error');

                }


            if ($scope.PagoI.proveedor == '') {

                leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
                

                var xml = JSON.stringify(x2js.xml_str2json(data));
                var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                
                var courses =  x2js.json2xml_str($.parseJSON(prueba));
                courses  = x2js.xml_str2json(courses);
                // console.log(prueba);

                PagoManual.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
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
                        $scope.PagoI.subtotal = '';
                        $scope.PagoI.emisor = '';
                        $scope.PagoI.foliointerno = '';

                    }
                });
                PagoManual.validaUnidad($scope.PagoI.unidad).success(function (data){ 
                        if (data.length > 0){

                            $scope.PagoI.rfcemisor = data[0].rfc;
                            $scope.PagoI.unidad = data[0].unidad;

                        if ($scope.PagoI.rfcemisor == courses.comprobante.emisor._rfc){

                            if((courses.comprobante._fecha >= '2018-01-01') && (courses.comprobante._version != '3.3')){


                                swal('Upss','Revisa la versión de tu xml, solo se acepta 3.3 a partir del 2018','error');


                            }else{


                                $scope.PagoI.serie = courses.comprobante._serie;
                                $scope.PagoI.foliointerno = courses.comprobante._folio;

                                //////////  limitar el subtotal del xml 
                                // $scope.PagoI.subtotal = courses.comprobante._subTotal;
                                // $scope.PagoI.total = courses.comprobante._total;

                                var subglobal = courses.comprobante._subtotal;
                                var subglobal1 = parseFloat(subglobal);
                                var subglobal2 = subglobal1.toFixed(2);
                                $scope.PagoI.subtotal = subglobal2;

                                var totalglobal = courses.comprobante._total;
                                var totalglobal1 = parseFloat(totalglobal);
                                var totalglobal2 = totalglobal1.toFixed(2);
                                $scope.PagoI.total = totalglobal2;


                                $scope.PagoI.foliofiscal = courses.comprobante.complemento.timbrefiscaldigital._uuid;
                                $scope.PagoI.fechaemision = courses.comprobante._fecha;
                                $scope.PagoI.descuento = courses.comprobante._descuento;
                                $scope.PagoI.emisor = courses.comprobante.emisor._nombre;
                                $scope.PagoI.rfcemisor = courses.comprobante.emisor._rfc;

                                if(courses.comprobante.impuestos.traslados == undefined){

                                    $scope.PagoI.iva = '';
                                    $scope.PagoI.importeiva = '';

                                }else{

                                    $scope.PagoI.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.PagoI.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;

                                }

                                if (courses.comprobante.impuestos.retenciones == undefined) {

                                    $scope.PagoI.isr = '';
                                    $scope.PagoI.importeisr = '';


                                }else{


                                    $scope.PagoI.isr = courses.comprobante.impuestos.retenciones.retencion._impuesto;
                                    $scope.PagoI.importeisr = courses.comprobante.impuestos.retenciones.retencion._importe;

                                }

                                $scope.PagoI.usuarioentrega = Number($rootScope.id);
                                $scope.PagoI.tipoorden = 4;
                                $scope.btndelete = true;
                                $scope.enviaI = false;

                            }

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
                var xml = JSON.stringify(x2js.xml_str2json(data));
                var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                
                var courses =  x2js.json2xml_str($.parseJSON(prueba));
                courses  = x2js.xml_str2json(courses);
                // console.log(prueba);
                console.log(courses);

                PagoManual.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
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

                        if ($scope.PagoI.rfcemisor == courses.comprobante.emisor._rfc){


                            if((courses.comprobante._fecha >= '2018-01-01') && (courses.comprobante._version != '3.3')){

                                swal('Upss','Revisa la versión de tu xml, solo se acepta 3.3 a partir del 2018','error');


                           }else{

                                

                                $scope.PagoI.serie = courses.comprobante._serie;
                                $scope.PagoI.foliointerno = courses.comprobante._folio;

                                // $scope.PagoI.subtotal = courses.comprobante._subTotal;
                                // $scope.PagoI.total = courses.comprobante._total;

                                var subglobal = courses.comprobante._subtotal;
                                var subglobal1 = parseFloat(subglobal);
                                var subglobal2 = subglobal1.toFixed(2);
                                $scope.PagoI.subtotal = subglobal2;

                                var totalglobal = courses.comprobante._total;
                                var totalglobal1 = parseFloat(totalglobal);
                                var totalglobal2 = totalglobal1.toFixed(2);
                                $scope.PagoI.total = totalglobal2;

                                $scope.PagoI.foliofiscal = courses.comprobante.complemento.timbrefiscaldigital._uuid;
                                $scope.PagoI.fechaemision = courses.comprobante._fecha;
                                $scope.PagoI.descuento = courses.comprobante._descuento;
                                $scope.PagoI.emisor = courses.comprobante.emisor._nombre;
                                $scope.PagoI.rfcemisor = courses.comprobante.emisor._rfc;

                                if(courses.comprobante.Impuestos_totalimpuestostrasladados == undefined){

                                    $scope.PagoI.iva = '';
                                    $scope.PagoI.importeiva = '';

                                }else{

                                    $scope.PagoI.iva = 'IVA';
                                    $scope.PagoI.importeiva = courses.comprobante.impuestos.totalimpuestostrasladados;

                                }

                                if(courses.comprobante.impuestos.traslados == undefined){

                                    $scope.PagoI.iva = '';
                                    $scope.PagoI.importeiva = '';

                                }else{


                                    $scope.PagoI.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.PagoI.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;


                                }

                                if (courses.comprobante.impuestos.retenciones == undefined) {

                                    $scope.PagoI.isr = '';
                                    $scope.PagoI.importeisr = '';


                                }else{


                                    $scope.PagoI.isr = courses.comprobante.impuestos.retenciones.retencion._impuesto;
                                    $scope.PagoI.importeisr = courses.comprobante.impuestos.retenciones.retencion._importe;

                                }

                                $scope.PagoI.usuarioentrega = Number($rootScope.id);
                                $scope.PagoI.tipoorden = 4;
                                $scope.btndelete = true;
                                $scope.enviaI = false;



                           }

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

    console.log($scope.selectos);

    if($scope.selectos.length >= 2){

        alert('Solo debes seleccionar una prefactura');

    }else{


        if ($scope.selectos.length == 0){ 

            var prefactura = '';

        }else{

            var prefactura = $scope.selectos[0].folioprefactura;

        };

        if ($scope.selectos.length == 0){

            var totalprefactura = '';
        }else{

            var totalprefactura = $scope.selectos[0].importe;
        };


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
        proveedor: $scope.PagoI.proveedor,
        prefactura: prefactura,
        totalprefactura: totalprefactura
    }

    console.log($scope.OPago);

    // if ($scope.PagoI.SubtotalF > $scope.OPago.factura.subtotal){

    //    swal("Upss","El Monto del Subtotal a Pagar es mas alto a la Factura","error");

    // }else

    // if ($scope.PagoI.TotalF > $scope.OPago.factura.total){

    //    swal("Upss","El Monto del Total a Pagar es mas alto a la Factura","error");

    // }else{

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
                $scope.listadoPre();

                swal("ok","Se Genero una Orden de Pago","success");


            }).error( function (data){

                alert('Error, Intentalo de Nuevo');

            });

        // } 
    // }
    }

}

    $scope.selectos = [];

    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: false
    };

    var csvOpts = { columnOverrides: { obj: function (o) {
        return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
        } },
        iEUrl: 'downloads/download_as_csv'
    };

    ////opciones del grid                 
    $scope.gridOptions = { 
        data: 'listado', 
        // enableColumnResize:true,
        enablePinning: false, 
        enableRowSelection:true,
        multiSelect:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectos, 
        enableCellEdit: true,
        columnDefs: [
                    { field:'folioprefactura', width: 120,displayName:'Folio Prefactura' },
                    { field:'foliozima', width: 120 },
                    { field:'foliomv', width: 120 },
                    { field:'importe', width: 120 },
                    { field:'fecharegistro', width: 160 }


        ],
        showFooter: true,
        showFilter:false,

    };

    $scope.$on('ngGridEventRows', function (newFilterText){

        var filas = newFilterText.targetScope.renderedRows;
        $scope.exportables = [];
        allChecked = true;

        angular.forEach(filas , function(item){
            $scope.exportables.push(item.entity);
        });

        // if (!$scope.gridOptions.$gridScope.checker)
        // $scope.gridOptions.$gridScope.checker = {};

        // $scope.gridOptions.$gridScope.checker.checked = allChecked;

    });


}

pagoManualPrefacturaCtrl.$inject = ['$scope', '$rootScope',  'loading','$filter','$location','$http','checkFolios','api','find', '$upload', 'leexml', 'PagoManual'];
app.controller('pagoManualPrefacturaCtrl',pagoManualPrefacturaCtrl);
