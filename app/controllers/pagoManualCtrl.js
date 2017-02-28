function pagoManualCtrl($scope, $rootScope, loading,$filter,$location,$http,checkFolios,api, find, $upload, leexml, PagoManual){

    loading.despedida();

    $scope.inicio = function(){

        $rootScope.area = 6;
        $scope.tituloPM = "Pagos Manuales";
        $scope.tipoTramite(); 
        $scope.archivos = [];
        $scope.Pagos = [];
        $scope.Proveedores();


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
	        usuarioentrega: ''

        }


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
                        $scope.PagoM.elimina = false;

                    }
                });
                PagoManual.validaUnidad(courses.Comprobante.Emisor._rfc).success(function (data){ 
                        if (data.length > 0){

                            $scope.PagoM.rfcemisor = data[0].rfc;
                            $scope.PagoM.unidad = data[0].unidad;

                        if ($scope.PagoM.rfcemisor == courses.Comprobante.Emisor._rfc){

			                $scope.PagoM.serie = courses.Comprobante._serie;
			                $scope.PagoM.foliointerno = courses.Comprobante._folio;
			                $scope.PagoM.subtotal = courses.Comprobante._subTotal;
			                $scope.PagoM.total = courses.Comprobante._total;
			                $scope.PagoM.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
			                $scope.PagoM.fechaemision = courses.Comprobante._fecha;
			                $scope.PagoM.descuento = courses.Comprobante._descuento;
			                $scope.PagoM.emisor = courses.Comprobante.Emisor._nombre;
			                $scope.PagoM.rfcemisor = courses.Comprobante.Emisor._rfc;
			                $scope.PagoM.impuesto = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
			                $scope.PagoM.tasa = courses.Comprobante.Impuestos.Traslados.Traslado._tasa;
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

                        }
                    }else{

                      swal("Upss", "El proveedor no se encuentra en el sistema, Solicitalo al area de Sistemas", "error");

                    }

                });



            });

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

        seleccionados : $scope.PagoM,
        archivos : $scope.archivos,
        usucarpeta: $rootScope.user,
        factura: $scope.Pagos,
        subtotaltotal: $scope.subtotalPago,
        iva: $scope.ivaPago,
        total: $scope.totalPago
    }

    console.log($scope.OPago);

    if ($scope.OPago.total != $scope.OPago.seleccionados.total){

       swal("Upss","El Monto de los Pagos no Coincide con el Total de la Factura","error");

    }else{

    	var areaRecibe = 6;
        var areaEntrega = 6;
        var usuarioRecibe = 78;

        var ruta = api+'PagoManual/ordenPago'; 

        // for (var i = 0; i < $scope.PagoM.length; i++){

    	    $http.post(ruta,$scope.OPago).success(function (data){

    	    	// $scope.borratemporales();
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
		                 'rfcemisor':$scope.PagoM.rfcemisor, 'impuesto': $scope.PagoM.impuesto, 'tasa': $scope.PagoM.tasa, 'SubtotalF':$scope.PagoM.SubtotalF, 'IVAF':  $scope.PagoM.IVAF, 'TotalF': $scope.PagoM.TotalF});

    $scope.PagoM.folio = '';
    $scope.PagoM.tipotramite = '';
    $scope.PagoM.concepto = '';
    $scope.PagoM.etapa = '';
    $scope.PagoM.entrega = '';
    $scope.PagoM.SubtotalF = '';
    $scope.PagoM.IVAF = '';
    $scope.PagoM.TotalF = '';
    $scope.PagoM.observacion = '';


    var sumaTotal = 0;
    var sumaSubtotal = 0;
    var sumaIVA = 0;

    for (var i = 0; i < $scope.Pagos.length; i++){

        var valor = $scope.Pagos[i].SubtotalF;
        var numero = valor.replace(",",'');
        sumaSubtotal += parseFloat(numero);
        var sumas = sumaSubtotal.toFixed(2);
        $scope.subtotalPago = sumas;

        var valor1 = $scope.Pagos[i].IVAF;
        var numero1 = valor1.replace(",",'');
        sumaIVA += parseFloat(numero1);
        var sumas1 = sumaIVA.toFixed(2);
        $scope.ivaPago = sumas1;

        var valor2 = $scope.Pagos[i].TotalF;
        var numero2 = valor2.replace(",",'');
        sumaTotal += parseFloat(numero2);
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

    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

    });

}

$scope.Proveedores = function(){

    PagoManual.proveedores().success( function (data){

        $scope.proveedores = data;
        
     });
}

}

pagoManualCtrl.$inject = ['$scope', '$rootScope',  'loading','$filter','$location','$http','checkFolios','api','find', '$upload', 'leexml', 'PagoManual'];
app.controller('pagoManualCtrl',pagoManualCtrl);
