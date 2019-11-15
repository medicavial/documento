function pagoManualPrefacturaCtrl($scope, $rootScope, loading,$filter,$location,$http,checkFolios,api, find, $upload, leexml, PagoManual, FacturaNormal){

 
    loading.despedida();

    $scope.inicio = function(){

        // $scope.buscaProveedores ={};
        $rootScope.area = 6;
        $scope.tituloPM = "Orden Pago Manual c/n Prefactura";
        // $scope.listadoPre();
        $scope.tipoTramite();
        $scope.buscaProveedores();
        $scope.archivos = [];
        $scope.Pagos = [];
        $scope.PagosM = [];
        $scope.eliminaxml();
        $scope.eliminaxmlNC();
        $scope.envia = true;
        $scope.agrega = true;
        $scope.btndelete = true;
        $scope.validaCaja = "";
        $scope.Pagos.novalidaNC = false;
        $scope.Pagos.validaNC = false;
        $scope.NC2 = 0;
        $scope.NC = null;

        $scope.PagoM = {

            unidad: '',
            folio: '',
            tipotramite: '',
            concepto: '',
            etapa: '',
            foliofiscal: '',
            subtotal: '', 
            descuentoF: 0.00, 
            total: 0,
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
            descuento: 0.00,
            acumuladoT: 0.00,
            metodoPago: ''

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
            totalprefactura: '',
            TotalFV: 0.00,
            clavemaestra: '',
            TotalFCN : 0,
            metodoPago: ''

    
        }

        $scope.NCI = {

          serie: '',
          foliofiscal:'',
          emisor:'',
          rfcemisor :'',
          subtotal: null,
          iVA: null,
          total: 0.00,
          fechaemision: '',
          metodopago: ''

        }

        $scope.NCG = {

          serie: '',
          foliofiscal:'',
          emisor:'',
          rfcemisor :'',
          subtotal: null,
          iVA: null,
          total: 0,
          fechaemision: '',
          metodopago: ''

        }


    }

    $scope.buscaProveedores = function(){

        find.busquedaProveedor().success(function (data){
                
            $scope.proveedores = data; 
                // $scope.datos = [];

        });
    }


    $scope.listadoPre = function(){
                    console.log($scope.PagoI.folio);
                    console.log($scope.PagoM.folio);

     if($scope.PagoI.folio != null || $scope.PagoI.folio != ""){

        find.busquedaPrefacturas($scope.PagoI.folio).success(function (data){

            if (data.length == 0){

                // $scope.PagoI.folio = '';
                $scope.listado = [];

                $scope.mensaje = "No hay prefacturas, para este Folio, realiza la orden en el modulo correcto";
                $scope.tipoalerta = "alert-danger";

            }else{
                $scope.listado = data;

            }

            $scope.verificaLesionado($scope.PagoI.folio);
                // $scope.datos = [];
        });
    }


    if($scope.PagoM.folio != null || $scope.PagoM.folio != ""){


        find.busquedaPrefacturas($scope.PagoM.folio).success(function (data){

            if (data.length == 0){

                // $scope.PagoM.folio = '';
                $scope.listado = [];

                $scope.mensaje = "No hay prefacturas, para este Folio, realiza la orden en el modulo correcto";
                $scope.tipoalerta = "alert-danger";

            }else{
                $scope.listado = data;

            }

            $scope.verificaLesionado($scope.PagoM.folio);
                // $scope.datos = [];
        });
     }



    }

    $scope.verificaLesionado = function(folio){

        find.verificaLesionado(folio).success( function (data) {

            if (data.length == 0) {

                $scope.nombreLesionado = "NO ESTA CAPTURADO";
                $scope.tipoalerta1 = "alert.danger";

            }else{

                $scope.nombreLesionado = data[0].lesionado;

            }

        
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

        // if ($scope.PagoI.tipoDeducible == 1) {

            var t = parseFloat($scope.PagoI.SubtotalF) - parseFloat($scope.PagoI.deducibleF) -  parseFloat($scope.PagoI.descuentoF)  + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.retencionF);
            var tt = t.toFixed(2);
            $scope.PagoI.TotalF = tt;

        // }

        // if ($scope.PagoI.tipoDeducible == 2) {

        //     var dF = parseFloat($scope.PagoI.SubtotalF) + parseFloat($scope.PagoI.deducibleF);
        //     var dF = dF.toFixed(2);
        //     $scope.PagoI.SubtotalF = dF;


        //     var t = parseFloat($scope.PagoI.SubtotalF) - parseFloat($scope.PagoI.deducibleF)  +  parseFloat($scope.PagoI.descuentoF)  + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.retencionF);
        //     var tt = t.toFixed(2);
        //     $scope.PagoI.TotalF = tt;

        // }

        // if ($scope.PagoI.tipoDeducible == 3) {

        //     //// obtengo lo que se agregara del deducible en el subtotal 

        //     var d = parseFloat($scope.PagoI.deducibleF) / parseFloat(1.16); 

        //     //// obtenemos el porcentaje del deducible para agregar al iva
            
        //     var dd = parseFloat(d) * parseFloat(0.16); 

        //     // agregamos lo odtenido al subtotal

        //     var ddd = parseFloat($scope.PagoI.SubtotalF) + parseFloat(d);
        //     var ddd = ddd.toFixed(2);
        //     $scope.PagoI.SubtotalF = ddd;

        //     // agregamos lo odtenido al iva
        //     // 
        //     var dddd = parseFloat($scope.PagoI.IVAF) + parseFloat(dd);
        //     var dddd = dddd.toFixed(2);
        //     $scope.PagoI.IVAF = dddd;

        //     /// sumamos lo que se obtuvo de lo agregado para restarlo al subtotal

        //     var pretotal = parseFloat(d) + parseFloat(dd);
            

        //     var t = parseFloat($scope.PagoI.SubtotalF)  -  parseFloat($scope.PagoI.descuentoF)  + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.retencionF);
        //     var tt = t.toFixed(2);

        //     // console.log(ivadd1);
        //     $scope.PagoI.TotalF = parseFloat(tt) - parseFloat(pretotal);

        // }

        // if ($scope.PagoI.tipoDeducible == 4) {
            
        //     //// obtengo lo que se agregara del deducible en el subtotal 

        //     var d = parseFloat($scope.PagoI.deducibleF); 

        //     //// obtenemos el porcentaje del deducible para agregar al iva
            
        //     var dd = parseFloat(d) * parseFloat(0.16); 

        //     // agregamos lo odtenido al subtotal
        //     var ddd = parseFloat($scope.PagoI.SubtotalF) + parseFloat(d) + parseFloat(dd);
        //     var ddd = ddd.toFixed(2);

        //     $scope.PagoI.SubtotalF = ddd;
            

        //     var t = parseFloat($scope.PagoI.SubtotalF) + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.deducibleF)  -  parseFloat($scope.PagoI.descuentoF)  - parseFloat($scope.PagoI.retencionF);
        //     var tt = t.toFixed(2);



        //     $scope.PagoI.TotalF = parseFloat(ddd);

        // }

   

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

            if ($scope.PagoM.proveedor == '' && $scope.PagoM.unidad == '') {

                swal('Error','Selecciona Unidad o Proveedor','error');

            }
            if ($scope.PagoM.proveedor == '' || $scope.PagoM.proveedor == undefined){

                leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
                var xml = JSON.stringify(x2js.xml_str2json(data));
                var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                
                var courses =  x2js.json2xml_str($.parseJSON(prueba));
                courses  = x2js.xml_str2json(courses);


                PagoManual.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.PagoM.importe = '';
                        $scope.PagoM.total = 0;
                        $scope.PagoM.foliofiscal = '';
                        $scope.PagoM.fechaemision = '';
                        $scope.PagoM.descuento = '';
                        $scope.PagoM.emisor = '';
                        $scope.PagoM.descuento = '';
                        $scope.PagoM.serie = '';
                        $scope.PagoM.elimina = false;

                    }
                });

                /////////////////
////////////////    VERIFICA SI EL PROVEEDOR NO ESTA EN LA LISTA DE CONDONADOS
////////////////

                FacturaNormal.rfcCondonado(courses.comprobante.emisor._rfc).success(function (data){

                  if (data[0].count != 0){

                    swal({
                      title: "Emisor Condonado, Antes de procesar esta factura, notifica al Lic. Jose Sanchez o Ing. Alfredo", 
                      text: "Clave Maestra", 
                      type: "input",
                      inputType: "password",
                      showCancelButton: true,
                      closeOnConfirm: false
                    }, function(typedPassword){

                        if (typedPassword === ""){
                            swal.showInputError("Debes escribir alguna clave!");
                            return false;
                        }

                        var rutaClave = api+'PagoManual/claveMaestra';

                        $.ajax({
                            url: rutaClave,
                            data: { password: typedPassword },
                            type: "POST"
                        })
                        .done(function(data){

                            if (data.claveMaestraAlfred == typedPassword || data.claveMaestraMartha == typedPassword) {
                               
                                swal("OK", "Clave correcta", "success");



                            }else{

                                swal("Upss", "Clave incorrecta", "error");

                                $scope.PagoM.importe = '';
                                $scope.PagoM.total = 0;
                                $scope.PagoM.foliofiscal = '';
                                $scope.PagoM.fechaemision = '';
                                $scope.PagoM.descuento = '';
                                $scope.PagoM.emisor = '';
                                $scope.PagoM.descuento = '';
                                $scope.PagoM.serie = '';
                                $scope.PagoM.elimina = false;


                            }

                })

                    .error(function(data) {
                        swal.showInputError("Error, Verificalo con el Area de sistemas");
                    });
                  
                });
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
                                $scope.PagoM.metodoPago = courses.comprobante._metodopago;

                                if(courses.comprobante.impuestos == undefined){

                                    $scope.PagoM.iva = '';
                                    $scope.PagoM.importeiva = '';

                                }else{

                                    if (courses.comprobante.impuestos.traslados == undefined) {


                                    $scope.PagoM.iva = '';
                                    $scope.PagoM.importeiva = '';

                                    }else{


                                    $scope.PagoM.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.PagoM.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;

                                    }


                                }

                                if (courses.comprobante.impuestos == undefined) {

                                    $scope.PagoM.isr = '';
                                    $scope.PagoM.importeisr = '';


                                }else{

                                    if (courses.comprobante.impuestos.retenciones == undefined) {


                                    $scope.PagoM.isr = '';
                                    $scope.PagoM.importeisr = '';
                                    
                                    }else{


                                    $scope.PagoM.isr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    $scope.PagoM.importeisr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    }


                                }
                                $scope.PagoM.usuarioentrega = Number($rootScope.id);
                                // $scope.PagoM.areaentrega =Number(areaEntrega);
                                // $scope.PagoM.usuariorecibe =Number(usuarioRecibe);
                                // $scope.PagoM.arearecibe =Number(areaRecibe);
                                // $scope.PagoM.folio = data.Folios;
                                $scope.PagoM.tipoorden = 4;
                                $scope.btndelete = true;

                                if ($scope.PagoM.foliofiscal != '') {

                                    $scope.enviaPG = false;

                                };


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
                        $scope.PagoM.total = 0;
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

                                /////////////////
////////////////    VERIFICA SI EL PROVEEDOR NO ESTA EN LA LISTA DE CONDONADOS
////////////////

                FacturaNormal.rfcCondonado(courses.comprobante.emisor._rfc).success(function (data){

                  if (data[0].count != 0){

                    swal({
                      title: "Emisor Condonado, Antes de procesar esta factura, notifica al Lic. Jose Sanchez o Ing. Alfredo", 
                      text: "Clave Maestra", 
                      type: "input",
                      inputType: "password",
                      showCancelButton: true,
                      closeOnConfirm: false
                    }, function(typedPassword){

                        if (typedPassword === ""){
                            swal.showInputError("Debes escribir alguna clave!");
                            return false;
                        }

                        var rutaClave = api+'PagoManual/claveMaestra';

                        $.ajax({
                            url: rutaClave,
                            data: { password: typedPassword },
                            type: "POST"
                        })
                        .done(function(data){

                            if (data.claveMaestraAlfred == typedPassword || data.claveMaestraMartha == typedPassword) {
                               
                                swal("OK", "Clave correcta", "success");



                            }else{

                                swal("Upss", "Clave incorrecta", "error");

                                $scope.PagoM.importe = '';
                                $scope.PagoM.total = 0;
                                $scope.PagoM.foliofiscal = '';
                                $scope.PagoM.fechaemision = '';
                                $scope.PagoM.descuento = '';
                                $scope.PagoM.emisor = '';
                                $scope.PagoM.descuento = '';
                                $scope.PagoM.serie = '';
                                $scope.PagoM.elimina = false;


                            }

                })

                    .error(function(data) {
                        swal.showInputError("Error, Verificalo con el Area de sistemas");
                    });
                  
                });
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
                                $scope.PagoM.metodoPago = courses.comprobante._metodopago;


                                if(courses.comprobante.impuestos == undefined){

                                    $scope.PagoM.iva = '';
                                    $scope.PagoM.importeiva = '';

                                }else{

                                    if (courses.comprobante.impuestos.traslados == undefined) {


                                    $scope.PagoM.iva = '';
                                    $scope.PagoM.importeiva = '';

                                    }else{


                                    $scope.PagoM.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.PagoM.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;

                                    }


                                }

                                if (courses.comprobante.impuestos == undefined) {

                                    $scope.PagoM.isr = '';
                                    $scope.PagoM.importeisr = '';


                                }else{

                                    if (courses.comprobante.impuestos.retenciones == undefined) {


                                    $scope.PagoM.isr = '';
                                    $scope.PagoM.importeisr = '';
                                    
                                    }else{


                                    $scope.PagoM.isr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    $scope.PagoM.importeisr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    }


                                }
                                $scope.PagoM.usuarioentrega = Number($rootScope.id);
                                // $scope.PagoM.areaentrega =Number(areaEntrega);
                                // $scope.PagoM.usuariorecibe =Number(usuarioRecibe);
                                // $scope.PagoM.arearecibe =Number(areaRecibe);
                                // $scope.PagoM.folio = data.Folios;
                                $scope.PagoM.tipoorden = 4;
                                $scope.btndelete = true;
                                if ($scope.PagoM.foliofiscal != '') {

                                    $scope.enviaPG = false;

                                };



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

        }).error( function (xhr,status,data){

                  alert('Ocurrio un error');

                });
            }

        }else{

               alert('La extensión debe ser xml');
        }

}

$scope.enviaOrdenPago = function(){

    if($scope.NCG.total == ''){ $scope.NCG.total = 0;}


    console.log($scope.NCG.total);
    console.log($scope.PagoM.total);

    var resta =  parseFloat($scope.PagoM.total) - parseFloat($scope.NCG.total);
    var restResta = resta.toFixed(2);

    console.log(restResta);

    console.log($scope.PagoM.acumuladoT);


    if(restResta != $scope.PagoM.acumuladoT){

    swal({
          title: "Monto diferente a tu Factura", 
          text: "Clave Maestra", 
          type: "input",
          inputType: "password",
          showCancelButton: true,
          closeOnConfirm: false
        }, function(typedPassword) {

            if (typedPassword === "") {
                swal.showInputError("Debes escribir alguna clave!");
                return false;
            }

            var rutaClave = api+'PagoManual/claveMaestra';

            $.ajax({
                url: rutaClave,
                data: { password: typedPassword },
                type: "POST"
            })
            .done(function(data){

                if (data.claveMaestraAlfred == typedPassword || data.claveMaestraMartha == typedPassword) {
                   
                    var areaRecibe = 6;
                    var areaEntrega = 6;
                    var usuarioRecibe = $rootScope.id;

                    // if ($scope.NCG.foliofiscal != ""){ $scope.PagoM.tipoorden = 5;};

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
                            clavemaestra: typedPassword,
                            NC: $scope.NCG,
                            prefactura: $scope.selectos,
                            tipoconcepto: $scope.PagoM.NC
                        }

                        console.log($scope.OPago);

                        

            // var ruta = api+'PagoManual/ordenPago'; 

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

                $scope.nombreLesionado = '';

                $scope.NCG = {

                  serie: '',
                  foliofiscal:'',
                  emisor:'',
                  rfcemisor :'',
                  subtotal: '',
                  iVA: '',
                  total: '',
                  fechaemision: ''

                }

                $scope.eliminaxml();
                $scope.Pagos = [];
                $scope.listado = [];
                $scope.listadoPre();

                swal("ok","Se Genero una Orden de Pago","success");

            }).error( function (data){

                alert('Error, Intentalo de Nuevo');

            });

        }else{

            swal("Upss", "Clave incorrecta", "error");


        }

    })

        .error(function(data) {
            swal.showInputError("Tu clave es incorrecta!");
        });
      
    });

 }else{

        // if ($scope.NCG.foliofiscal != ""){ $scope.PagoM.tipoorden = 5;};

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
                NC: $scope.NCG,
                prefactura: $scope.selectos,
                tipoconcepto: $scope.PagoM.NC
            }

        var ruta = api+'PagoManual/ordenPago'; 

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

                $scope.NCG = {

                  serie: '',
                  foliofiscal:'',
                  emisor:'',
                  rfcemisor :'',
                  subtotal: '',
                  iVA: '',
                  total: '',
                  fechaemision: ''

                }

                $scope.eliminaxml();
                $scope.Pagos = [];
                $scope.listadoPre();

                swal("ok","Se Genero una Orden de Pago","success");


            }).error( function (data){

                alert('Error, Intentalo de Nuevo');

            });

 }


}

$scope.delete = function(index){

    var valor = $scope.Pagos[index].TotalF;
    $scope.PagoM.acumuladoT  = parseFloat($scope.PagoM.acumuladoT) - parseFloat(valor);

    // var valor1 = $scope.Pagos[index].calculoNC;
    // $scope.PagoM.acumuladoTNC  = parseFloat($scope.PagoM.acumuladoTNC) - parseFloat(valor1);

    $scope.Pagos.splice(index,1);

};


$scope.addRow = function(){


    //// se van agregando las ordenes para una factura global

    if ($scope.PagoM.folio == '') {

        swal("Upss", "No tienes O.P para agregar", "error");

    }

    // else{

    //     if ($scope.NCG.foliofiscal == '' || $scope.NCG.foliofiscal == undefined) {
    //         $scope.NCG.foliofiscal = "";
    //         $scope.NCG.valorNC     = 0.00;
    //         $scope.NCG.importeiva  = 0.00;
    //         $scope.NCG.importeisr  = 0.00;
    //     };

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
    $scope.PagoM.metodoPago = '';

    ///// limpia cuadro de nota de credito //////
    $scope.eliminaxmlNC();
    // $scope.NCG.foliofiscal = '';
    // $scope.NCG.serie = '';
    // $scope.NCG.emisor ='';                        
    // $scope.NCG.rfcemisor  ='';                        
    // $scope.NCG.subtotal = '';
    // $scope.NCG.iVA = '';
    // $scope.NCG.total = '';
    // $scope.NCG.fechaemision = '';
    // $scope.NC2 = 0;


    var sumaTotal = 0;
    var sumaTotal1 = 0;

    for (var i = 0; i < $scope.Pagos.length; i++){

/// suma de las ordenes
        var valor = $scope.Pagos[i].TotalF;
        sumaTotal += parseFloat(valor);
        var sumas = sumaTotal.toFixed(2);
        $scope.PagoM.acumuladoT  = sumas;

        // var valor1 = $scope.Pagos[i].calculoNC;
        // sumaTotal1 += parseFloat(valor1);
        // var sumas1 = sumaTotal1.toFixed(2);
        // $scope.PagoM.acumuladoTNC  = sumas1;

    }
// }


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
      $scope.PagoM.descuento = '';

      $scope.totalPago =  $scope.totalPago -  $scope.totalPago;
      $scope.subtotalPago =  $scope.subtotalPago -  $scope.subtotalPago;

      $scope.PagoI.foliointerno = '';
      $scope.PagoI.serie = '';
      $scope.PagoI.foliofiscal = '';
      $scope.PagoI.emisor = '';
      $scope.PagoI.rfcemisor = '';
      $scope.PagoI.subtotal = '';
      $scope.PagoI.tasa = '';
      $scope.PagoI.total = '';
      $scope.PagoI.fechaemision = '';
      $scope.PagoI.descuento = '';

      $scope.envia = true;



    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

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

                                /////////////////
////////////////    VERIFICA SI EL PROVEEDOR NO ESTA EN LA LISTA DE CONDONADOS
////////////////

                FacturaNormal.rfcCondonado(courses.comprobante.emisor._rfc).success(function (data){

                  if (data[0].count != 0){

                    swal({
                      title: "Emisor Condonado, Antes de procesar esta factura, notifica al Lic. Jose Sanchez o Ing. Alfredo", 
                      text: "Clave Maestra", 
                      type: "input",
                      inputType: "password",
                      showCancelButton: true,
                      closeOnConfirm: false
                    }, function(typedPassword){

                        if (typedPassword === ""){
                            swal.showInputError("Debes escribir alguna clave!");
                            return false;
                        }

                        var rutaClave = api+'PagoManual/claveMaestra';

                        $.ajax({
                            url: rutaClave,
                            data: { password: typedPassword },
                            type: "POST"
                        })
                        .done(function(data){

                            if (data.claveMaestraAlfred == typedPassword || data.claveMaestraMartha == typedPassword) {
                               
                                swal("OK", "Clave correcta", "success");



                            }else{

                                swal("Upss", "Clave incorrecta", "error");

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

                })

                    .error(function(data) {
                        swal.showInputError("Error, Verificalo con el Area de sistemas");
                    });
                  
                });
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
                                $scope.PagoI.metodoPago = courses.comprobante._metodopago;
                                
                                if(courses.comprobante.impuestos == undefined){

                                    $scope.PagoI.iva = '';
                                    $scope.PagoI.importeiva = '';

                                }else{

                                    if (courses.comprobante.impuestos.traslados == undefined) {


                                    $scope.PagoI.iva = '';
                                    $scope.PagoI.importeiva = '';

                                    }else{


                                    $scope.PagoI.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.PagoI.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;

                                    }


                                }

                                if (courses.comprobante.impuestos == undefined) {

                                    $scope.PagoI.isr = '';
                                    $scope.PagoI.importeisr = '';


                                }else{

                                    if (courses.comprobante.impuestos.retenciones == undefined) {


                                    $scope.PagoI.isr = '';
                                    $scope.PagoI.importeisr = '';
                                    
                                    }else{


                                    $scope.PagoI.isr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    $scope.PagoI.importeisr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    }


                                }

                                $scope.PagoI.usuarioentrega = Number($rootScope.id);
                                $scope.PagoI.tipoorden = 4;
                                $scope.btndelete = true;

                                console.log($scope.PagoI.TotalF);
                                console.log($scope.PagoI.total);

                                $scope.PagoI.TotalFSN = parseFloat($scope.PagoI.TotalF) - parseFloat($scope.PagoI.total);
                                $scope.PagoI.TotalFCN = 0;

                                console.log($scope.PagoI.TotalFSN);

                                if ($scope.PagoI.foliofiscal != '') {

                                    $scope.envia = false;

                                };
                                

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

                                                /////////////////
////////////////    VERIFICA SI EL PROVEEDOR NO ESTA EN LA LISTA DE CONDONADOS
////////////////

                FacturaNormal.rfcCondonado(courses.comprobante.emisor._rfc).success(function (data){

                  if (data[0].count != 0){

                    swal({
                      title: "Emisor Condonado, Antes de procesar esta factura, notifica al Lic. Jose Sanchez o Ing. Alfredo", 
                      text: "Clave Maestra", 
                      type: "input",
                      inputType: "password",
                      showCancelButton: true,
                      closeOnConfirm: false
                    }, function(typedPassword){

                        if (typedPassword === ""){
                            swal.showInputError("Debes escribir alguna clave!");
                            return false;
                        }

                        var rutaClave = api+'PagoManual/claveMaestra';

                        $.ajax({
                            url: rutaClave,
                            data: { password: typedPassword },
                            type: "POST"
                        })
                        .done(function(data){

                            if (data.claveMaestraAlfred == typedPassword || data.claveMaestraMartha == typedPassword) {
                               
                                swal("OK", "Clave correcta", "success");



                            }else{

                                swal("Upss", "Clave incorrecta", "error");

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

                })

                    .error(function(data) {
                        swal.showInputError("Error, Verificalo con el Area de sistemas");
                    });
                  
                });
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
                                $scope.PagoI.metodoPago = courses.comprobante._metodopago;

                                // if(courses.comprobante.Impuestos_totalimpuestostrasladados == undefined){

                                //     $scope.PagoI.iva = '';
                                //     $scope.PagoI.importeiva = '';

                                // }else{

                                //     $scope.PagoI.iva = 'IVA';
                                //     $scope.PagoI.importeiva = courses.comprobante.impuestos.totalimpuestostrasladados;

                                // }

                                if(courses.comprobante.impuestos == undefined){

                                    $scope.PagoI.iva = '';
                                    $scope.PagoI.importeiva = '';

                                }else{

                                    if (courses.comprobante.impuestos.traslados == undefined) {


                                    $scope.PagoI.iva = '';
                                    $scope.PagoI.importeiva = '';

                                    }else{


                                    $scope.PagoI.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.PagoI.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;

                                    }


                                }

                                if (courses.comprobante.impuestos == undefined) {

                                    $scope.PagoI.isr = '';
                                    $scope.PagoI.importeisr = '';


                                }else{

                                    if (courses.comprobante.impuestos.retenciones == undefined) {

                                    $scope.PagoI.isr = '';
                                    $scope.PagoI.importeisr = '';
                                    
                                    }else{

                                    $scope.PagoI.isr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    $scope.PagoI.importeisr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    }

                                }

                                $scope.PagoI.usuarioentrega = Number($rootScope.id);
                                $scope.PagoI.tipoorden = 4;
                                $scope.btndelete = true;

                                $scope.PagoI.TotalFSN = parseFloat($scope.PagoI.TotalF) - parseFloat($scope.PagoI.total);
                                $scope.PagoI.TotalFCN = 0;

                                console.log($scope.PagoI.TotalFN);

                                if ($scope.PagoI.foliofiscal != '') {

                                    $scope.envia = false;

                                };

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



        }).error( function (xhr,status,data){

                  alert('Ocurrio un error');

                });
            }

        }else{

               alert('La extensión debe ser xml');
        }

}

$scope.enviaOrdenPagoInd = function(){

    $scope.PagoI.TotalFSN = parseFloat($scope.PagoI.TotalF) - parseFloat($scope.PagoI.total);
    $scope.PagoI.TotalFCN = 0;

    if ($scope.PagoI.TotalFSN == undefined) {$scope.PagoI.TotalFSN = 0;};

    console.log($scope.PagoI.TotalFSN);
    console.log($scope.PagoI.TotalFCN);


    if(($scope.PagoI.TotalFSN != 0 &&  $scope.PagoI.TotalFSN >= 2 ) || $scope.PagoI.TotalFCN != 0){

    swal({
      title: "Monto diferente a tu Factura", 
      text: "Clave Maestra", 
      type: "input",
      inputType: "password",
      showCancelButton: true,
      closeOnConfirm: false
    }, function(typedPassword) {

        if (typedPassword === "") {
            swal.showInputError("Debes escribir alguna clave!");
            return false;
        }

        var rutaClave = api+'PagoManual/claveMaestra';

        $.ajax({
            url: rutaClave,
            data: { password: typedPassword },
            type: "POST"
        })
        .done(function(data){

            if (data.claveMaestraAlfred == typedPassword || data.claveMaestraMartha == typedPassword) {
                        
                    var areaRecibe = 6;
                    var areaEntrega = 6;
                    var usuarioRecibe = $rootScope.id;

                   // if ($scope.NCI.foliofiscal != ""){ $scope.PagoI.tipoorden = 5;};

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
                        clavemaestra: typedPassword,
                        NC: $scope.NCI,
                        prefactura: $scope.selectos,
                        tipoconcepto: $scope.PagoI.NC
                    }

                    console.log($scope.OPago);

                    var ruta = api+'PagoManual/ordenPagoIndividual'; 

                            $http.post(ruta,$scope.OPago).success(function (data){

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

                           $scope.nombreLesionado = "";

                           $scope.NCI = {

                              serie: '',
                              foliofiscal:'',
                              emisor:'',
                              rfcemisor :'',
                              subtotal: '',
                              iVA: '',
                              total: '',
                              fechaemision: ''

                            }

                            $scope.eliminaxml();
                            $scope.listadoPre();

                            swal("ok","Se Genero una Orden de Pago","success");


                            }).error( function (data){

                                alert('Error, Intentalo de Nuevo');

                            });



            }else{

                swal("Upss", "Clave incorrecta", "error");


            }

            
        })
        .error(function(data) {
            swal.showInputError("Tu clave es incorrecta!");
        });
      
    });

   }else{
                        
                    var areaRecibe = 6;
                    var areaEntrega = 6;
                    var usuarioRecibe = $rootScope.id;

                   // if ($scope.NCI.foliofiscal != ""){ $scope.PagoI.tipoorden = 5;};

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
                        NC: $scope.NCI,
                        prefactura: $scope.selectos,
                        tipoconcepto: $scope.PagoI.NC
                    }

                    console.log($scope.OPago);

                    var ruta = api+'PagoManual/ordenPagoIndividual'; 

                            $http.post(ruta,$scope.OPago).success(function (data){

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

                           $scope.NCI = {

                              serie: '',
                              foliofiscal:'',
                              emisor:'',
                              rfcemisor :'',
                              subtotal: '',
                              iVA: '',
                              total: '',
                              fechaemision: ''

                            }

                            $scope.eliminaxml();
                            $scope.listadoPre();

                            swal("ok","Se Genero una Orden de Pago","success");


                            }).error( function (data){

                                alert('Error, Intentalo de Nuevo');

                            });


   }


}

    $scope.selectos = [];

    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: true
    };

    var csvOpts = { columnOverrides: { obj: function (o) {
        return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
        } },
        iEUrl: 'downloads/download_as_csv'
    };

    ////opciones del grid                 
    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:true,
        multiSelect:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: true,
        enableCellSelection: true,
        selectedItems: $scope.selectos, 
        enableCellEdit: true,
        columnDefs: [
                    { field:'folioprefactura', width: 120,displayName:'Folio Prefactura' },
                    { field:'foliozima', width: 230 },
                    { field:'foliomv', width: 230 },
                    { field:'importe', width: 120 },
                    { field:'fecharegistro', width: 250 }


        ],
        showFooter: true,
        showFilter:true,

    };

    $scope.$on('ngGridEventRows', function (newFilterText){

        var filas = newFilterText.targetScope.renderedRows;
        $scope.exportables = [];
        allChecked = true;

        angular.forEach(filas , function(item){
            $scope.exportables.push(item.entity);
        });



    });


///////////////////////////////////// SUBIR NOTAS DE CREDITO Y VALIDACION /////////////
///



$scope.subeNCI = function($files){

        var aux = $files[0].name.split('.');

        if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

         for (var i = 0; i < $files.length; i++){
         var file = $files[i];
         var amt = 0;
          $scope.upload = $upload.upload({
                url: api+'PagoManual/uploadNC/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                method: 'POST',
                data: $scope.PagoM,
                file: file // or list of files ($files) for html5 only
        }).success(function (data){

            if ($scope.PagoI.proveedor == '' && $scope.PagoI.unidad == '') {

                swal('Error','Selecciona Unidad o Proveedor','error');
            }

            if ($scope.PagoI.proveedor == '') {

                leexml.getxmlNC($rootScope.user,data.archivo).success(function(data){
                
                var xml = JSON.stringify(x2js.xml_str2json(data));
                var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                
                var courses =  x2js.json2xml_str($.parseJSON(prueba));
                courses  = x2js.xml_str2json(courses);

                PagoManual.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.eliminaxmlNC();
                        $scope.NCI.serie = '';
                        $scope.NCI.foliofiscal ='';                        
                        $scope.NCI.emisor ='';                        
                        $scope.NCI.rfcemisor  ='';                        
                        $scope.NCI.subtotal = '';
                        $scope.NCI.iVA = '';
                        $scope.NCI.total = '';
                        $scope.NCI.fechaemision = '';
                    }
                });

                /////////////////
////////////////         VERIFICAMOS QUE NO ESTE EN LA LISTA DE CONDONADOS
////////////////

               FacturaNormal.rfcCondonado(courses.comprobante.emisor._rfc).success(function (data){

                  if (data[0].count != 0){

                    swal({
                      title: "Emisor Condonado, Antes de procesar esta factura, notifica al Lic. Jose Sanchez o Ing. Alfredo", 
                      text: "Clave Maestra", 
                      type: "input",
                      inputType: "password",
                      showCancelButton: true,
                      closeOnConfirm: false
                    }, function(typedPassword){

                        if (typedPassword === ""){
                            swal.showInputError("Debes escribir alguna clave!");
                            return false;
                        }

                        var rutaClave = api+'PagoManual/claveMaestra';

                        $.ajax({
                            url: rutaClave,
                            data: { password: typedPassword },
                            type: "POST"
                        })
                        .done(function(data){

                            if (data.claveMaestraAlfred == typedPassword || data.claveMaestraMartha == typedPassword) {
                               
                                swal("OK", "Clave correcta", "success");



                            }else{

                                swal("Upss", "Clave incorrecta", "error");

                                $scope.NCI.importe = '';
                                $scope.NCI.total = '';
                                $scope.NCI.foliofiscal = '';
                                $scope.NCI.fechaemision = '';
                                $scope.NCI.descuento = '';
                                $scope.NCI.rfcemisor = '';
                                $scope.NCI.descuento = "";
                                $scope.NCI.serie = '';
                                $scope.NCI.elimina = false;
                                $scope.NCI.retencion = '';
                                $scope.NCI.subtotal = '';
                                $scope.NCI.emisor = '';
                                $scope.NCI.foliointerno = '';


                            }

                })

                    .error(function(data) {
                        swal.showInputError("Error, Verificalo con el Area de sistemas");
                    });
                  
                });
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

                                $scope.NCI.serie = courses.comprobante._serie;
                                $scope.NCI.foliointerno = courses.comprobante._folio;

                                var subglobal = courses.comprobante._subtotal;
                                var subglobal1 = parseFloat(subglobal);
                                var subglobal2 = subglobal1.toFixed(2);
                                $scope.NCI.subtotal = subglobal2;

                                var totalglobal = courses.comprobante._total;
                                var totalglobal1 = parseFloat(totalglobal);
                                var totalglobal2 = totalglobal1.toFixed(2);
                                $scope.NCI.total = totalglobal2;


                                $scope.NCI.foliofiscal = courses.comprobante.complemento.timbrefiscaldigital._uuid;
                                $scope.NCI.fechaemision = courses.comprobante._fecha;
                                $scope.NCI.descuento = courses.comprobante._descuento;
                                $scope.NCI.emisor = courses.comprobante.emisor._nombre;
                                $scope.NCI.rfcemisor = courses.comprobante.emisor._rfc;

                                if(courses.comprobante.impuestos.traslados == undefined){

                                    $scope.NCI.iva = '';
                                    $scope.NCI.importeiva = '';

                                }else{

                                    $scope.NCI.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.NCI.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;

                                }

                                if (courses.comprobante.impuestos.retenciones == undefined) {

                                    $scope.NCI.isr = '';
                                    $scope.NCI.importeisr = '';


                                }else{


                                    $scope.NCI.isr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    $scope.NCI.importeisr = courses.comprobante._totaimpuestosretenidos;

                                }

                                $scope.NCI.usuarioentrega = Number($rootScope.id);
                                $scope.btndelete = true;

                                $scope.PagoI.TotalFV = $scope.NCI.total;
                                $scope.PagoI.deducibleF = $scope.NCI.subtotal;
                                
                                var totalfv =  parseFloat($scope.PagoI.total) - parseFloat($scope.NCI.total);
                                var tt      = totalfv.toFixed(2);

                                $scope.PagoI.TotalFCN = parseFloat($scope.PagoI.TotalF) - parseFloat(tt);
                                $scope.PagoI.TotalFSN = 0;


                                if ($scope.NCI.foliofiscal != '') {

                                    $scope.envia = false;

                                };
                                

                            }

                        }else{

                            swal('Upss','Tu Factura no coincide con el Emisor','error');

                            // var archivo = $scope.datos.leexml;
                            // $scope.elimina_ahora(archivo);
                            $scope.eliminaxmlNC();

                        }
                    }else{

                      swal("Upss", "El proveedor no se encuentra en el sistema, Solicitalo al area de Sistemas", "error");
                      $scope.eliminaxml();

                    }

                });



            });


            }else{

            leexml.getxmlNC($rootScope.user,data.archivo).success(function(data){

                var xml = JSON.stringify(x2js.xml_str2json(data));
                var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                
                var courses =  x2js.json2xml_str($.parseJSON(prueba));
                courses  = x2js.xml_str2json(courses);

                PagoManual.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.eliminaxmlNC();
                        $scope.NCI.serie = '';
                        $scope.NCI.foliofiscal ='';                        
                        $scope.NCI.emisor ='';                        
                        $scope.NCI.rfcemisor  ='';                        
                        $scope.NCI.subtotal = '';
                        $scope.NCI.iVA = '';
                        $scope.NCI.total = '';
                        $scope.NCI.fechaemision = '';
                    }
                });

                /////////////////
////////////////         VERIFICAMOS QUE NO ESTE EN LA LISTA DE CONDONADOS
////////////////

               FacturaNormal.rfcCondonado(courses.comprobante.emisor._rfc).success(function (data){

                  if (data[0].count != 0){

                    swal({
                      title: "Emisor Condonado, Antes de procesar esta factura, notifica al Lic. Jose Sanchez o Ing. Alfredo", 
                      text: "Clave Maestra", 
                      type: "input",
                      inputType: "password",
                      showCancelButton: true,
                      closeOnConfirm: false
                    }, function(typedPassword){

                        if (typedPassword === ""){
                            swal.showInputError("Debes escribir alguna clave!");
                            return false;
                        }

                        var rutaClave = api+'PagoManual/claveMaestra';

                        $.ajax({
                            url: rutaClave,
                            data: { password: typedPassword },
                            type: "POST"
                        })
                        .done(function(data){

                            if (data.claveMaestraAlfred == typedPassword || data.claveMaestraMartha == typedPassword) {
                               
                                swal("OK", "Clave correcta", "success");



                            }else{

                                swal("Upss", "Clave incorrecta", "error");

                                $scope.NCI.importe = '';
                                $scope.NCI.total = '';
                                $scope.NCI.foliofiscal = '';
                                $scope.NCI.fechaemision = '';
                                $scope.NCI.descuento = '';
                                $scope.NCI.rfcemisor = '';
                                $scope.NCI.descuento = "";
                                $scope.NCI.serie = '';
                                $scope.NCI.elimina = false;
                                $scope.NCI.retencion = '';
                                $scope.NCI.subtotal = '';
                                $scope.NCI.emisor = '';
                                $scope.NCI.foliointerno = '';


                            }

                })

                    .error(function(data) {
                        swal.showInputError("Error, Verificalo con el Area de sistemas");
                    });
                  
                });
              }

                });

                PagoManual.validaProveedor($scope.PagoI.proveedor).success(function (data){ 

                        if (data.length > 0){

                            $scope.PagoI.rfcemisor = data[0].rfc;
                            $scope.PagoI.unidad = data[0].unidad;

                        if ($scope.PagoI.rfcemisor == courses.comprobante.emisor._rfc){

                            if (courses.comprobante._tipodecomprobante == 'E'){


                            if((courses.comprobante._fecha >= '2018-01-01') && (courses.comprobante._version != '3.3')){

                                swal('Upss','Revisa la versión de tu xml, solo se acepta 3.3 a partir del 2018','error');

                           }else{

                                $scope.NCI.serie = courses.comprobante._serie;
                                $scope.NCI.foliointerno = courses.comprobante._folio;

                                var subglobal = courses.comprobante._subtotal;
                                var subglobal1 = parseFloat(subglobal);
                                var subglobal2 = subglobal1.toFixed(2);
                                $scope.NCI.subtotal = subglobal2;

                                var totalglobal = courses.comprobante._total;
                                var totalglobal1 = parseFloat(totalglobal);
                                var totalglobal2 = totalglobal1.toFixed(2);
                                $scope.NCI.total = totalglobal2;

                                $scope.NCI.foliofiscal = courses.comprobante.complemento.timbrefiscaldigital._uuid;
                                $scope.NCI.fechaemision = courses.comprobante._fecha;
                                $scope.NCI.descuento = courses.comprobante._descuento;
                                $scope.NCI.emisor = courses.comprobante.emisor._nombre;
                                $scope.NCI.rfcemisor = courses.comprobante.emisor._rfc;
                                $scope.NCI.metodopago = courses.comprobante._metodopago;

                                if(courses.comprobante.Impuestos_totalimpuestostrasladados == undefined){

                                    $scope.NCI.iva = '';
                                    $scope.NCI.importeiva = '';

                                }else{

                                    $scope.NCI.iva = 'IVA';
                                    $scope.NCI.importeiva = courses.comprobante.impuestos.totalimpuestostrasladados;

                                }

                                if(courses.comprobante.impuestos.traslados == undefined){

                                    $scope.NCI.iva = '';
                                    $scope.NCI.importeiva = '';

                                }else{


                                    $scope.NCI.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.NCI.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;


                                }

                                if (courses.comprobante.impuestos.retenciones == undefined) {

                                    $scope.NCI.isr = '';
                                    $scope.NCI.importeisr = '';


                                }else{


                                    $scope.NCI.isr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    $scope.NCI.importeisr = courses.comprobante._totaimpuestosretenidos;

                                }

                                $scope.NCI.usuarioentrega = Number($rootScope.id);
                                $scope.NCI.tipoorden = 4;
                                $scope.btndelete = true;

                                $scope.PagoI.TotalFV = $scope.NCI.total;
                                
                                var totalfv =  parseFloat($scope.PagoI.total) - parseFloat($scope.NCI.total);
                                var tt      = totalfv.toFixed(2);

                                $scope.PagoI.TotalFCN = parseFloat($scope.PagoI.TotalF) - parseFloat(tt);
                                $scope.PagoI.TotalFSN = 0;

                                if ($scope.NCI.foliofiscal != '') {

                                    $scope.envia = false;

                                };

                           }

                       }else{

                            swal('Upss','Tu Factura no es una Nota de Crédito','error');

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



        }).error( function (xhr,status,data){

                  alert('Ocurrio un error');

                });
            }

        }else{

               alert('La extensión debe ser xml');
        }

}

$scope.eliminaxmlNC = function(){

    $http.post(api+'PagoManual/eliminaxmlNC/'+$rootScope.user).success(function (data){

      $scope.NCI.foliointerno = '';
      $scope.NCI.serie = '';
      $scope.NCI.foliofiscal = '';
      $scope.NCI.emisor = '';
      $scope.NCI.rfcemisor = '';
      $scope.NCI.subtotal = '';
      $scope.NCI.tasa = '';
      $scope.NCI.total = '';
      $scope.NCI.fechaemision = '';

        var t = parseFloat($scope.PagoI.SubtotalF) - parseFloat($scope.PagoI.deducibleF) -  parseFloat($scope.PagoI.descuentoF)  + parseFloat($scope.PagoI.IVAF) - parseFloat($scope.PagoI.retencionF);
        var tt = t.toFixed(2);
        $scope.PagoI.TotalFV = tt;


      $scope.NCG.foliointerno = '';
      $scope.NCG.serie = '';
      $scope.NCG.foliofiscal = '';
      $scope.NCG.emisor = '';
      $scope.NCG.rfcemisor = '';
      $scope.NCG.subtotal = '';
      $scope.NCG.tasa = '';
      $scope.NCG.total = '';
      $scope.NCG.fechaemision = '';



    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

    });

}



///////////////////// nota de credito global //////////////
///


$scope.subeNCG = function($files, index){

        var aux = $files[0].name.split('.');

        if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

         for (var i = 0; i < $files.length; i++){
         var file = $files[i];
         var amt = 0;
          $scope.upload = $upload.upload({
                url: api+'PagoManual/uploadNC/'+$rootScope.user,//upload.php script, node.js route, or servlet url
                method: 'POST',
                data: $scope.PagoM,
                file: file // or list of files ($files) for html5 only
        }).success(function (data){

            if ($scope.PagoM.proveedor == '' && $scope.PagoM.unidad == '') {

                swal('Error','Selecciona Unidad o Proveedor','error');
            }

            if ($scope.PagoM.proveedor == '') {

                leexml.getxmlNC($rootScope.user,data.archivo).success(function(data){
                
                var xml = JSON.stringify(x2js.xml_str2json(data));
                var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                
                var courses =  x2js.json2xml_str($.parseJSON(prueba));
                courses  = x2js.xml_str2json(courses);

                PagoManual.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.eliminaxmlNC();
                        $scope.NCG.serie = '';
                        $scope.NCG.foliofiscal ='';                        
                        $scope.NCG.emisor ='';                        
                        $scope.NCG.rfcemisor  ='';                        
                        $scope.NCG.subtotal = 0;
                        $scope.NCG.iVA = 0;
                        $scope.NCG.total = 0;
                        $scope.NCG.fechaemision = '';
                    }
                });


                /////////////////
////////////////         VERIFICAMOS QUE NO ESTE EN LA LISTA DE CONDONADOS
////////////////

               FacturaNormal.rfcCondonado(courses.comprobante.emisor._rfc).success(function (data){

                  if (data[0].count != 0){

                    swal({
                      title: "Emisor Condonado, Antes de procesar esta factura, notifica al Lic. Jose Sanchez o Ing. Alfredo", 
                      text: "Clave Maestra", 
                      type: "input",
                      inputType: "password",
                      showCancelButton: true,
                      closeOnConfirm: false
                    }, function(typedPassword){

                        if (typedPassword === ""){
                            swal.showInputError("Debes escribir alguna clave!");
                            return false;
                        }

                        var rutaClave = api+'PagoManual/claveMaestra';

                        $.ajax({
                            url: rutaClave,
                            data: { password: typedPassword },
                            type: "POST"
                        })
                        .done(function(data){

                            if (data.claveMaestraAlfred == typedPassword || data.claveMaestraMartha == typedPassword) {
                               
                                swal("OK", "Clave correcta", "success");



                            }else{

                                swal("Upss", "Clave incorrecta", "error");

                                $scope.NCG.importe = '';
                                $scope.NCG.total = '';
                                $scope.NCG.foliofiscal = '';
                                $scope.NCG.fechaemision = '';
                                $scope.NCG.descuento = '';
                                $scope.NCG.rfcemisor = '';
                                $scope.NCG.descuento = "";
                                $scope.NCG.serie = '';
                                $scope.NCG.elimina = false;
                                $scope.NCG.retencion = '';
                                $scope.NCG.subtotal = '';
                                $scope.NCG.emisor = '';
                                $scope.NCG.foliointerno = '';


                            }

                })

                    .error(function(data) {
                        swal.showInputError("Error, Verificalo con el Area de sistemas");
                    });
                  
                });
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

                                $scope.NCG.serie = courses.comprobante._serie;
                                $scope.NCG.foliointerno = courses.comprobante._folio;

                                var subglobal = courses.comprobante._subtotal;
                                var subglobal1 = parseFloat(subglobal);
                                var subglobal2 = subglobal1.toFixed(2);
                                $scope.NCG.subtotal = subglobal2;

                                var totalglobal = courses.comprobante._total;
                                var totalglobal1 = parseFloat(totalglobal);
                                var totalglobal2 = totalglobal1.toFixed(2);
                                $scope.NCG.total = totalglobal2;

                                $scope.NCG.valorNC = totalglobal2;



                                /////// AGREGO DATOS DE LA NOTA DE CREDITO A LOS RENGLONES DE LOS PAGOS DE FACTURA GLOBAL ///

                                $scope.NCG.foliofiscal = courses.comprobante.complemento.timbrefiscaldigital._uuid;
                                $scope.NCG.fechaemision = courses.comprobante._fecha;
                                $scope.NCG.descuento = courses.comprobante._descuento;
                                $scope.NCG.emisor = courses.comprobante.emisor._nombre;
                                $scope.NCG.rfcemisor = courses.comprobante.emisor._rfc;
                                $scope.NCG.metodopago = courses.comprobante._metodopago;

                                if(courses.comprobante.impuestos.traslados == undefined){

                                    $scope.NCG.iva = '';
                                    $scope.NCG.importeiva = '';

                                }else{

                                    $scope.NCG.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.NCG.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;

                                }

                                if (courses.comprobante.impuestos.retenciones == undefined) {

                                    $scope.NCG.isr = '';
                                    $scope.NCG.importeisr = '';


                                }else{


                                    $scope.NCG.isr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    $scope.NCG.importeisr = courses.comprobante._totaimpuestosretenidos;

                                }

                                $scope.NCG.usuarioentrega = Number($rootScope.id);
                                $scope.btndelete = true;

                                if ($scope.NCG.foliofiscal != '') {

                                    $scope.envia = false;

                                };
                                

                            }

                        }else{

                            swal('Upss','Tu Factura no coincide con el Emisor','error');

                            // var archivo = $scope.datos.leexml;
                            // $scope.elimina_ahora(archivo);
                            $scope.eliminaxmlNC();

                        }
                    }else{

                      swal("Upss", "El proveedor no se encuentra en el sistema, Solicitalo al area de Sistemas", "error");
                      $scope.eliminaxml();

                    }

                });



            });


            }else{

            leexml.getxmlNC($rootScope.user,data.archivo).success(function(data){

                var xml = JSON.stringify(x2js.xml_str2json(data));
                var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                
                var courses =  x2js.json2xml_str($.parseJSON(prueba));
                courses  = x2js.xml_str2json(courses);

                PagoManual.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.eliminaxmlNC();
                        $scope.NCG.serie = '';
                        $scope.NCG.foliofiscal ='';                        
                        $scope.NCG.emisor ='';                        
                        $scope.NCG.rfcemisor  ='';                        
                        $scope.NCG.subtotal = 0;
                        $scope.NCG.iVA = 0;
                        $scope.NCG.total = 0;
                        $scope.NCG.fechaemision = '';
                    }

                });


                /////////////////
////////////////         VERIFICAMOS QUE NO ESTE EN LA LISTA DE CONDONADOS
////////////////

               FacturaNormal.rfcCondonado(courses.comprobante.emisor._rfc).success(function (data){

                  if (data[0].count != 0){

                    swal({
                      title: "Emisor Condonado, Antes de procesar esta factura, notifica al Lic. Jose Sanchez o Ing. Alfredo", 
                      text: "Clave Maestra", 
                      type: "input",
                      inputType: "password",
                      showCancelButton: true,
                      closeOnConfirm: false
                    }, function(typedPassword){

                        if (typedPassword === ""){
                            swal.showInputError("Debes escribir alguna clave!");
                            return false;
                        }

                        var rutaClave = api+'PagoManual/claveMaestra';

                        $.ajax({
                            url: rutaClave,
                            data: { password: typedPassword },
                            type: "POST"
                        })
                        .done(function(data){

                            if (data.claveMaestraAlfred == typedPassword || data.claveMaestraMartha == typedPassword) {
                               
                                swal("OK", "Clave correcta", "success");



                            }else{

                                swal("Upss", "Clave incorrecta", "error");

                                $scope.NCG.importe = '';
                                $scope.NCG.total = '';
                                $scope.NCG.foliofiscal = '';
                                $scope.NCG.fechaemision = '';
                                $scope.NCG.descuento = '';
                                $scope.NCG.rfcemisor = '';
                                $scope.NCG.descuento = "";
                                $scope.NCG.serie = '';
                                $scope.NCG.elimina = false;
                                $scope.NCG.retencion = '';
                                $scope.NCG.subtotal = '';
                                $scope.NCG.emisor = '';
                                $scope.NCG.foliointerno = '';


                            }

                })

                    .error(function(data) {
                        swal.showInputError("Error, Verificalo con el Area de sistemas");
                    });
                  
                });
              }

                });

                PagoManual.validaProveedor($scope.PagoM.proveedor).success(function (data){ 

                        if (data.length > 0){

                            $scope.PagoM.rfcemisor = data[0].rfc;
                            $scope.PagoM.unidad = data[0].unidad;

                        if ($scope.PagoM.rfcemisor == courses.comprobante.emisor._rfc){

                            if (courses.comprobante._tipodecomprobante != 'E'){

                                swal('Upss','Tu Factura no es una Nota de Crédito','error');

                            }

                            if((courses.comprobante._fecha >= '2018-01-01') && (courses.comprobante._version != '3.3')){

                                swal('Upss','Revisa la versión de tu xml, solo se acepta 3.3 a partir del 2018','error');
                            }
                                $scope.NCG.serie = courses.comprobante._serie;
                                $scope.NCG.foliointerno = courses.comprobante._folio;

                                var subglobal = courses.comprobante._subtotal;
                                var subglobal1 = parseFloat(subglobal);
                                var subglobal2 = subglobal1.toFixed(2);
                                $scope.NCG.subtotal = subglobal2;

                                var totalglobal = courses.comprobante._total;
                                var totalglobal1 = parseFloat(totalglobal);
                                var totalglobal2 = totalglobal1.toFixed(2);
                                $scope.NCG.total = totalglobal2;

                                $scope.NCG.valorNC = totalglobal2;

                                /////// AGREGO DATOS DE LA NOTA DE CREDITO A LOS RENGLONES DE LOS PAGOS DE FACTURA GLOBAL ///

                                $scope.NCG.foliofiscal = courses.comprobante.complemento.timbrefiscaldigital._uuid;
                                $scope.NCG.fechaemision = courses.comprobante._fecha;
                                $scope.NCG.descuento = courses.comprobante._descuento;
                                $scope.NCG.emisor = courses.comprobante.emisor._nombre;
                                $scope.NCG.rfcemisor = courses.comprobante.emisor._rfc;

                                if(courses.comprobante.impuestos.traslados == undefined){

                                    $scope.NCG.iva = '';
                                    $scope.NCG.importeiva = '';

                                }else{

                                    $scope.NCG.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.NCG.importeiva = courses.comprobante.impuestos._totalimpuestostrasladados;

                                }

                                if (courses.comprobante.impuestos.retenciones == undefined) {

                                    $scope.NCG.isr = '';
                                    $scope.NCG.importeisr = '';


                                }else{


                                    $scope.NCG.isr = courses.comprobante.impuestos._totaimpuestosretenidos;
                                    $scope.NCG.importeisr = courses.comprobante.impuestos._totaimpuestosretenidos;

                                }

                                $scope.NCG.usuarioentrega = Number($rootScope.id);
                                $scope.btndelete = true;

                                if ($scope.NCG.foliofiscal != '') {

                                    $scope.envia = false;

                                };
                            

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

        }).error( function (xhr,status,data){

                  alert('Ocurrio un error');

                });
            }

        }else{

               alert('La extensión debe ser xml');
        }

}



}

pagoManualPrefacturaCtrl.$inject = ['$scope', '$rootScope',  'loading','$filter','$location','$http','checkFolios','api','find', '$upload', 'leexml', 'PagoManual', 'FacturaNormal'];
app.controller('pagoManualPrefacturaCtrl',pagoManualPrefacturaCtrl);
