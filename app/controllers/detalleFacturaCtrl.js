/// Facturas qualitas
function detalleFacturaCtrl($scope, $rootScope,$http, find, loading,api , DetalleFacturas,$routeParams,$location){

    $scope.inicio = function(){

        $scope.titulo = "Detalle de la Atención";
        $scope.titulo2 = "Archivos de la Factura";
        $scope.titulo3 = "Complementos";
        $scope.archivos = [];
        
        
    }

    DetalleFacturas.imprimeDatos($routeParams.folio).success( function (data){ 

        $scope.cia_clave=data.respuesta[0].clave;        
        $scope.pro_clave=data.respuesta[0].Pro_clave;        
        $scope.cia=data.respuesta[0].cliente;    
        $scope.uniMed = data.respuesta[0].unidad;
        $scope.poliza = data.respuesta[0].Exp_poliza;
        $scope.sinicestro = data.respuesta[0].Exp_siniestro;
        $scope.reporte =data.respuesta[0].Exp_reporte;
        $scope.riesgo =data.respuesta[0].RIE_nombre;
        $scope.lesionado = data.respuesta[0].nombre;
        $scope.usuario=data.respuesta[0].Usu_registro;
        $scope.registro=data.respuesta[0].Exp_fecreg; 
        $scope.directorio = data.respuesta[0].ruta;
        $scope.claveunidad = data.respuesta[0].claveunidad;
        $scope.folio = $routeParams.folio;

        cveCia=$scope.cia_clave;
        imgCia=$scope.imgCompania(cveCia); 
        // console.log(img);       
        $scope.ruta=imgCia;
        // $scope.archivos = data.archivo;

        for (var i = 0; i < data.archivo.length; i++){

             var jpg = [];

             var aux = data.archivo[i].split('.');

        if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

            $scope.xml = 1;
            $scope.filexml = data.archivo[i];

        }
        if(aux[aux .length-1] == 'pdf' || aux[aux .length-1] == 'PDF'){

            $scope.pdf = 1;
            $scope.filepdf = data.archivo[i];

        }
        if(aux[aux .length-1] == 'jpg' || aux[aux .length-1] == 'JPG'){

            var imagenes = [];
            $scope.archivos.push(data.archivo[i]);
        }

        }
   
      
    });

    $scope.imgCompania = function(claveCompania){
        var img=0;   
        switch(claveCompania){          
        case 1:
            img="aba.jpg";
            break;        
        case 33:
            img="ace.jpg";
            break;
         case 2:
            img="afirme.jpg";
            break;
         case 3:
            img="aguila.jpg";
            break;
         case 4:
            img="aig.jpg";
            break;
         case 5:
            img="ana.jpg";
            break;
         case 6:
            img="atlas.jpg";
            break;
         case 7:
            img="axa.jpg";
            break;
         case 8:
            img="banorte.jpg";
            break;
         case 43:
            img="ci.jpg";
            break;
         case 44:
            img="cortesia.jpg";
            break;
         case 39:
            img="futv.JPG";
            break;
         case 40:
            img="futv2.JPG";
            break;
         case 9:
            img="general.jpg";
            break;
         case 10:
            img="gnp.jpg";
            break;
         case 11:
            img="goa.jpg";
            break;
         case 12:
            img="hdi.jpg";
            break;
         case 31:
            img="hir.jpg";
            break;
         case 45:
            img="inbursa.jpg";
            break;
         case 14:
            img="latino.jpg";
            break;
         case 41:
            img="lidnorte.JPG";
            break;
         case 15:
            img="mapfre.jpg";
            break;
         case 16:
            img="metro.jpg";
            break;
         case 37:
            img="multiafirme.jpg";
            break;
         case 35:
            img="multibancomer.jpg";
            break;
         case 36:
            img="multizurich.jpg";
            break;
         case 17:
            img="multiva.jpg";
            break;
         case 51:
            img="Ortho.jpg";
            break;
         case 18:
            img="potosi.jpg";
            break;
         case 22:
            img="primero.jpg";
            break;
         case 19:
            img="qualitas.jpg";
            break;
         case 20:
            img="rsa.jpg";
            break;
         case 32:
            img="spt.JPG";
            break;
         case 47:
            img="thona.jpg";
            break;
         case 34:
            img="travol.jpg";
            break;
        }        
        return img;

        console.log(img);
    }

    $scope.rechazaFactura = function(){

        $scope.datos = {folio:$routeParams.folio, usuario: $rootScope.userWeb, motivo:$scope.motivo }

        DetalleFacturas.rechazaFactura($scope.datos).success( function (data){ 

            loading.cargando('Rechazando Atención');
            swal("Factura rechazada");
            $location.path('/controlFacturas');

        })
    }

    $scope.revision = function(){

        $('#boton').button('loading');
        $scope.cargando = true;

        $scope.files = {

            xml:  $scope.filexml,
            pdf: $scope.filepdf,
            ruta: $scope.directorio,
            folio: $routeParams.folio,
            unidad: $scope.claveunidad
        }
        $http.post(api+'DetalleFacturas/revisa', $scope.files).success(function (data){
            $('#boton').button('reset');
            $scope.cargando = false;
            swal('Ok',data.respuesta,'success');

        }).error( function (data){

            swal('Ok','Ocurrio un problema','success');
            $scope.cargando = false;

        });

    }

};



detalleFacturaCtrl.$inject = ['$scope', '$rootScope','$http', 'find', 'loading', 'api', 'DetalleFacturas','$routeParams','$location'];


app.controller('detalleFacturaCtrl',detalleFacturaCtrl);
