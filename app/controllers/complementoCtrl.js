function complementoCtrl($scope, $rootScope, find ,loading,$filter,$location,$http,checkFolios,api,complementos, $upload, leexml, relaciones){

    $scope.inicio = function(){



        $scope.titulo = "Factura de Recepción de Pago";

        $scope.file=[];
        $scope.listadoArchivos= [];
        $scope.archivo = [];
        $scope.borratemporales();
        $scope.borratemporales3();
        $("#cargador").hide();
        $("#btnvalidar").hide();
        $("#btndescarga").hide();
        $("#btndescargaXLS").hide();
        $scope.eliminatxt();
        $scope.numNoprocesado = 0;
        $scope.numArchivos = 0;
        $scope.complemento = [];
        $scope.doctorelacionado = [];
        $scope.ruta = [];
        $scope.conteoPago = 0;
        $scope.conteoIngreso = 0;
        $scope.conteoEgreso = 0;

            $scope.complementoP = {

                tipoComprobante: '',
                folioFiscal: '',
                monto: '',
                usuario: $rootScope.user,
                error: '',
                factura :'',
                fechaEmision: '',
                rfcEmisor: '',
                facturasRel: '',
                nombreEmisor: '',
                serie: '',
                folio: '',
                metodoPago: ''
            }

    }


$scope.subeXML = function($files){

        $scope.borratemporales();
        $scope.borratemporales3();
        $scope.archivo = 0;

        $("#cargador").hide();
        $("#btnvalidar").hide();
        $("#btndescarga").hide();
        $("#btndescargaXLS").hide(); 

        $scope.eliminatxt();
        $scope.numNoprocesado = 0;
        $scope.numArchivos = 0;
        var a = 0;

    setInterval($("#cargador").show(),90000);

    var aux = $files[0].name.split('.');

    var otrosArchivos = 0;


        for (var i = 0; i < $files.length; i++){

            if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){


                var file = $files[i];
                var amt = 0;

                $scope.upload = $upload.upload({
                url: api+'Complementos/uploadComplementoP/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                method: 'POST',
                // data: $scope.PagoG,
                file: file // or list of files ($files) for html5 only
                }).success(function (data){

                if (i == $files.length){

                        $scope.archivo = data.archivo;
                        $scope.ruta    =data.ruta;
                        $("#cargador").hide();
                        $("#btnvalidar").show();

                        // $scope.mensaje = "Tus"+ " "+ data.numArch+ " " +"archivos solo fueron almacenados temporalmente, Aun no son Procesados.";
                        // $scope.tipoalerta = 'alert-success';

                    if (data.numArch == $files) {

                        $("#cargador").hide();
                        $("#btnvalidar").show();
                    };

                }

                });

            }else{

                $scope.mensaje = "Verifica que tu carpeta contenga solo archivos XML.";
                $scope.tipoalerta = 'alert-danger';
                $scope.borratemporales();
                $("#cargador").hide();

                a= a +1;
                $scope.numNoprocesado = a;
            }

        }
}


//////////////////////// SE EMPIEZA A VALIDAR EL XML DE EGRESO ///////////////////////////////

$scope.valida = function(archivo){

       setInterval($("#cargador").show(),90000);
       var archivo = $scope.archivo;
       var rutaArchivo    = $scope.ruta;
       var a = 0;
       var e = 0;
       var excel = [];
       // var numArchivos;
       for (var i = 0; i < archivo.length; i++) {

           var conteo = 0;
           var conteoPago = 1;
           var conteoIngreso = 1;
           var conteoNotaCred = 0;
           var conteoEgreso = 0;
           var otros = 0;


       leexml.getxmltemporal($rootScope.user,archivo[i]).success(function(data){
            conteo = conteo +1;

            var xml = JSON.stringify(x2js.xml_str2json(data));
            var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
            var courses =  x2js.json2xml_str($.parseJSON(prueba));
            courses  = x2js.xml_str2json(courses);

            numArchivos = archivo[conteo-1];
                    
            var ruta = api+'Complementos/insertaComplemento';

            ////// REVISO QUE NO SE DUPLIQUE FOLIO FISCAL DE COMPLEMENTOS ////////////////////////////////

                find.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');

                    }
                });

            if(courses.comprobante == undefined){
                e= e +1;
                $scope.numNoprocesado = e;

            }else if(courses.comprobante.complemento == undefined){

                e= e +1;
                $scope.numNoprocesado = e;
                $scope.complementoP = {

                    tipoComprobante: 'error',
                    folioFiscal: 'error',
                    monto: '0.00',
                    descripcion: '',   
                    usuario: $rootScope.user,
                    error: 'No se puede leer el folio fiscal',
                    factura: courses.comprobante._folio

                }
                    $http.post(ruta, $scope.complementoP).success(function (data){

                    }).error( function (data){

                        $scope.mensaje1 = "Hubo un error de conexión, Verificalo con el Area de Sistemas";
                        $scope.tipoalerta = 'alert-danger';

                    });
            }

            if (courses.comprobante._tipodecomprobante == 'P'){

                $scope.conteoPago = conteoPago ++;
                if(courses.comprobante._tipodecomprobante == undefined){
                  $scope.complementoP.tipoComprobante =  '';
                }else{
                  $scope.complementoP.tipoComprobante =  courses.comprobante._tipodecomprobante;
                }


                if (courses.comprobante.complemento.timbrefiscaldigital._uuid == undefined) {
                  $scope.complementoP.folioFiscal =  '';
                }else{
                  $scope.complementoP.folioFiscal =  courses.comprobante.complemento.timbrefiscaldigital._uuid;
                }

                if (courses.comprobante._fecha == undefined) {
                  $scope.complementoP.fechaEmision =  '';
                }else{
                  $scope.complementoP.fechaEmision =  courses.comprobante._fecha;
                }

                $scope.complementoP.folio      =  courses.comprobante._folio;
                $scope.complementoP.serie      =  courses.comprobante._serie;
                $scope.complementoP.metodoPago =  courses.comprobante._metodopago;
                $scope.complementoP.subtotal   =  courses.comprobante._subtotal;
                $scope.complementoP.monto      =  courses.comprobante._total;


                $scope.complementoP.rfcEmisor =  courses.comprobante.emisor._rfc;
                $scope.complementoP.nombreEmisor =  courses.comprobante.emisor._nombre;
                $scope.doctorelacionado = courses.comprobante.complemento.pagos.pago.doctorelacionado;
                find.moverArchPago($rootScope.user, 'P' ,{file:numArchivos}).success(function (data){

                });


            }else if(courses.comprobante._tipodecomprobante == 'I' || courses.comprobante._tipodecomprobante == 'ingreso'){
               
               $scope.conteoIngreso = conteoIngreso ++;
                if(courses.comprobante._tipodecomprobante == undefined){
                  $scope.complementoP.tipoComprobante =  '';
                }else{
                  $scope.complementoP.tipoComprobante =  courses.comprobante._tipodecomprobante;
                }


                if (courses.comprobante.complemento.timbrefiscaldigital._uuid == undefined) {
                  $scope.complementoP.folioFiscal =  '';
                }else{
                  $scope.complementoP.folioFiscal =  courses.comprobante.complemento.timbrefiscaldigital._uuid;
                }
                  $scope.complementoP.subtotal =  courses.comprobante._subtotal;
                  $scope.complementoP.monto =  courses.comprobante._total;


                if (courses.comprobante._fecha == undefined) {
                  $scope.complementoP.fechaEmision =  '';
                }else{
                  $scope.complementoP.fechaEmision =  courses.comprobante._fecha;
                }
                $scope.complementoP.folio      =  courses.comprobante._folio;
                $scope.complementoP.serie      =  courses.comprobante._serie;
                $scope.complementoP.metodoPago =  courses.comprobante._metodopago;
                $scope.complementoP.descuento =  courses.comprobante._descuento;


                $scope.complementoP.rfcEmisor =  courses.comprobante.emisor._rfc;
                find.moverArchPago($rootScope.user, 'I' ,{file:numArchivos}).success(function (data){

                });

            }

            // }else if(courses.comprobante._tipodecomprobante == 'E' || courses.comprobante._tipodecomprobante == 'Egreso'){
               
            //    $scope.conteoEgreso = conteoEgreso ++;

            //     if(courses.comprobante._tipodecomprobante == undefined){
            //       $scope.complementoP.tipoComprobante =  '';
            //     }else{
            //       $scope.complementoP.tipoComprobante =  courses.comprobante._tipodecomprobante;
            //     }


            //     if (courses.comprobante.complemento.timbrefiscaldigital._uuid == undefined) {
            //       $scope.complementoP.folioFiscal =  '';
            //     }else{
            //       $scope.complementoP.folioFiscal =  courses.comprobante.complemento.timbrefiscaldigital._uuid;
            //     }

            //     $scope.complementoP.subtotal   =  courses.comprobante._subtotal;
            //     $scope.complementoP.monto      =  courses.comprobante._total;
            //     $scope.complementoP.metodoPago =  courses.comprobante._metodopago;
            //     $scope.complementoP.folio      =  courses.comprobante._folio;
            //     $scope.complementoP.serie      =  courses.comprobante._serie;
                

            //     if (courses.comprobante._fecha == undefined) {
            //       $scope.complementoP.fechaEmision =  '';
            //     }else{
            //       $scope.complementoP.fechaEmision =  courses.comprobante._fecha;
            //     }

            //     $scope.complementoP.rfcEmisor =  courses.comprobante.emisor._rfc;
            //     $scope.doctorelacionado = courses.comprobante.cfdirelacionados.cfdirelacionado;

            //     find.moverArchPago($rootScope.user, 'E' ,{file:numArchivos}).success(function (data){

            //     });

            // }

            // excel.push({tipocomprobante: $scope.complementoP.tipoComprobante,
            //      foliofiscal: $scope.complementoP.folioFiscal,
            //      monto: $scope.complementoP.monto,
            //      fechaemision: $scope.complementoP.fechaEmision,
            //      nombreemision: $scope.complementoP.nombreEmisor,
            //      doctorelacionado: $scope.doctorelacionado


            //  });

            $scope.complemento = {

                facturasRel: $scope.doctorelacionado,
                complementoP : $scope.complementoP

            }

            // console.log($scope.complementoP);

                $http.post(ruta,$scope.complemento).success(function (data){

                    a= a +1;
                    
                    $("#btndescarga").show();
                    $("#cargador").hide();
                    $("#btndescargaXLS").show();
                    $scope.numArchivos = a;
                    // $scope.borratemporales();


                }).error( function (data){

                    // a= a +1;
                    // $scope.numNoprocesado = a;
                    $scope.mensaje1 = "Hubo un error de conexión, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-danger';

                });
            // $scope.complemento.push($scope.complementoP);

            // console.log($scope.complemento);
    
        

        // $scope.listadoArchivos = $files;
        
        }).error( function (xhr,status,data){

                alert('Ocurrio un error');

        });

}

}

$scope.borratemporales = function(){

  find.borratemporales($rootScope.user).success(function (data){

  });

}

$scope.borratemporales3 = function(){

  find.borratemporales3($rootScope.user).success(function (data){

  });

}

$scope.descarga = function(){
       
        var fileName = "Reporte";
        var uri = complementos+'/FacturasPagos/Complementos/mreyes/archivo.txt';
        var link = document.createElement("a"); 
        link.href = uri;
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";

        link.download = "archivo.txt";
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

}

$scope.eliminatxt = function(){

  find.eliminatxt($rootScope.user).success(function (data){

  });

}

$scope.listadoComplemento = function(){

    loading.cargando('Buscando Folio');

    relaciones.listadoCom().success(function (data){
        if(data){

            $scope.listado = data;
            $scope.cantidad = data.length -1;

        }else{

            loading.despedida();
            $scope.listado = [];
        }
        loading.despedida();
    });
}

};


complementoCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading','$filter','$location','$http','checkFolios','api','complementos','$upload', 'leexml', 'relaciones'];
// flujoPagosCtrl.$inject = ['$scope','$rootScope', 'find','loading', '$http', 'api','datos','$filter'];

app.controller('complementoCtrl',complementoCtrl);
// app.controller('flujoPagosCtrl',flujoPagosCtrl);
