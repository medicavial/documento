function complementoCtrl($scope, $rootScope, find ,loading,$filter,$location,$http,checkFolios,api,complementos, $upload, leexml){

    $scope.inicio = function(){

        $scope.titulo = "Factura de Recepción de Pago";

        $scope.file=[];
        $scope.listadoArchivos= [];
        $scope.archivo = [];
        $scope.borratemporales();
        $("#cargador").hide();
        $("#btnvalidar").hide();
        $("#btndescarga").hide();
        $scope.eliminatxt();
        $scope.numNoprocesado = 0;
        $scope.numArchivos = 0;
        $scope.complemento = [];
        $scope.doctorelacionado = [];


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
                nombreEmisor: ''
            }

    }

$scope.subeXML = function($files){

        $("#cargador").hide();
        $("#btnvalidar").hide();
        $("#btndescarga").hide(); 

        $scope.eliminatxt();
        $scope.numNoprocesado = 0;
        $scope.numArchivos = 0;


    setInterval($("#cargador").show(),90000);

    var aux = $files[0].name.split('.');

    if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

        for (var i = 0; i < $files.length; i++){

                var file = $files[i];
                var amt = 0;

                $scope.upload = $upload.upload({
                url: api+'Complementos/uploadComplementoP/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                method: 'POST',
                // data: $scope.PagoG,
                file: file // or list of files ($files) for html5 only
                }).success(function (data){

                    $scope.archivo = data.archivo;
                    $("#cargador").hide();
                    $("#btnvalidar").show();

                    $scope.mensaje = "Tus"+ " "+ data.numArch+ " " +"archivos solo fueron almacenados temporalmente, Aun no son Procesados.";
                    $scope.tipoalerta = 'alert-success';

                });

        }
       
    }else{

        $scope.mensaje = "Verifica que tu carpeta contenga solo archivos XML.";
        $scope.tipoalerta = 'alert-danger';
        $scope.borratemporales();
        $("#cargador").hide();
    }
}

$scope.valida = function(archivo){

       setInterval($("#cargador").show(),90000);
       var archivo = $scope.archivo;
       var a = 0;
       var e = 0;

       for (var i = 0; i < archivo.length; i++) {


       leexml.getxmltemporal($rootScope.user,archivo[i]).success(function(data){

            var xml = JSON.stringify(x2js.xml_str2json(data));
            var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
            var courses =  x2js.json2xml_str($.parseJSON(prueba));
            courses  = x2js.xml_str2json(courses);
                    
            var ruta = api+'Complementos/insertaComplemento';

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

                if (courses.comprobante.complemento.pagos == undefined) {

                  $scope.complementoP.monto =  courses.comprobante._total;

                }else{

                  $scope.complementoP.monto =  courses.comprobante.complemento.pagos.pago._monto;

                }

                if (courses.comprobante._fecha == undefined) {

                  $scope.complementoP.fechaEmision =  '';

                }else{

                  $scope.complementoP.fechaEmision =  courses.comprobante._fecha;

                }

                $scope.complementoP.rfcEmisor =  courses.comprobante.emisor._rfc;
                $scope.complementoP.nombreEmisor =  courses.comprobante.emisor._nombre;

                $scope.doctorelacionado = courses.comprobante.complemento.pagos.pago.doctorelacionado;


            }else if(courses.comprobante._tipodecomprobante == 'I' || courses.comprobante._tipodecomprobante == 'ingreso'){


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

                if (courses.comprobante.complemento.pagos == undefined) {

                  $scope.complementoP.monto =  courses.comprobante._total;

                }else{

                  $scope.complementoP.monto =  courses.comprobante.complemento.pagos.pago._monto;

                }

                if (courses.comprobante._fecha == undefined) {

                  $scope.complementoP.fechaEmision =  '';

                }else{

                  $scope.complementoP.fechaEmision =  courses.comprobante._fecha;

                }

                $scope.complementoP.rfcEmisor =  courses.comprobante.emisor._rfc;


            }

            $scope.complemento = {

                facturasRel: $scope.doctorelacionado,
                complementoP : $scope.complementoP

            }

            // console.log($scope.complementoP);

                $http.post(ruta,$scope.complemento).success(function (data){

                    a= a +1;
                    
                    $("#btndescarga").show();
                    $("#cargador").hide();
                    $scope.numArchivos = a;
                    $scope.borratemporales();


                }).error( function (data){

                    a= a +1;
                    $scope.numNoprocesado = a;
                    $scope.mensaje1 = "Hubo un error de conexión, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-danger';

                });
            // $scope.complemento.push($scope.complementoP);

            // console.log($scope.complemento);
    
        

        // $scope.listadoArchivos = $files;
        
        }).error( function (xhr,status,data){

                alert('Ocurrio un error');
                a= a +1;
                $scope.numNoprocesado = a;

        });

    }
}

$scope.borratemporales = function(){

  find.borratemporales($rootScope.user).success(function (data){

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

};


complementoCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading','$filter','$location','$http','checkFolios','api','complementos','$upload', 'leexml'];
// flujoPagosCtrl.$inject = ['$scope','$rootScope', 'find','loading', '$http', 'api','datos','$filter'];

app.controller('complementoCtrl',complementoCtrl);
// app.controller('flujoPagosCtrl',flujoPagosCtrl);
