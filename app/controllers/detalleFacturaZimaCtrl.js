/// Facturas qualitas
function detalleFacturaZimaCtrl($scope, $rootScope,$http, find, loading,api , DetalleFacturasZima,$routeParams,$location){

    $scope.inicio = function(){

        $scope.titulo = "Detalle de la Atención Zima";
        $scope.titulo2 = "Archivos de la Factura";
        $scope.titulo3 = "Complementos";
        $scope.archivos = [];
        $scope.xml = 0;
        $scope.pdf = 0;


        $scope.detalle = {

            xml: '',
            pdf:''
        }
                
    }

    DetalleFacturasZima.imprimeDatos($routeParams.folio).success( function (data){ 

        console.log(data.respuesta);

        $scope.detalle.folio = data.respuesta[0].Folio;
        $scope.detalle.solicitud = data.respuesta[0].Solicitud;
        $scope.detalle.aseguradora = data.respuesta[0].Aseguradora;
        $scope.detalle.unidad = data.respuesta[0].Unidad;
        $scope.detalle.lesionado = data.respuesta[0].Lesionado;

        if (data.rutaxml != undefined){

            $scope.detalle.xml = data.rutaxml;
            $scope.xml = 1;

        }

        if (data.rutapdf != undefined){

            $scope.detalle.pdf = data.rutapdf;
            $scope.pdf = 1;

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

        $scope.datos = {folio:$routeParams.folio, nsolicitud: $scope.detalle.solicitud, usuario: $rootScope.userWeb, motivo:$scope.motivo }

        DetalleFacturasZima.rechazaFactura($scope.datos).success( function (data){ 

            loading.cargando('Rechazando Atención');
            swal("Factura rechazada");
            $location.path('/controlFacturas');

        })
    }

    $scope.revision = function(){

        $('#boton').button('loading');
        $scope.cargando = true;

        $scope.files = {

            xml:  $scope.detalle.xml,
            pdf: $scope.detalle.pdf,
            folio: $routeParams.folio,
            unidad: $scope.detalle.unidad

        }

        $http.post(api+'DetalleFacturasZima/revisa', $scope.files).success(function (data){
            $('#boton').button('reset');
            $scope.cargando = false;
            swal('Ok',data.respuesta,'success');

        }).error( function (data){

            swal('Ok','Ocurrio un problema','success');
            $scope.cargando = false;

        });

    }

};


detalleFacturaZimaCtrl.$inject = ['$scope', '$rootScope','$http', 'find', 'loading', 'api', 'DetalleFacturasZima','$routeParams','$location'];


app.controller('detalleFacturaZimaCtrl',detalleFacturaZimaCtrl);
