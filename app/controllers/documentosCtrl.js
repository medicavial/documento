function documentosCtrl($scope, $rootScope, loading,$filter,$location,$http,api, find){

    $scope.inicio = function(){

        $scope.lee_carpetas();

    }

    $scope.lee_carpetas = function(){

        find.docs().success( function (data){

            $scope.listados = data.directorio;


        }).error(function (data){

            $scope.tipoalerta = 'alert-warning';
            $scope.mensaje = 'Algo salio mal intentalo nuevamente';
            $('#boton').button('reset');

        })

    }


    $scope.lee_subcarpetas = function(carpeta){

        var carpeta = carpeta;

         $('#subcarpeta').modal('show');

        find.subcarpetas(carpeta).success( function (data){

            $scope.listadoSubcarpetas = data.archivo;
            $scope.mes = data.mes;



        }).error(function (data){

            $scope.tipoalerta = 'alert-warning';
            $scope.mensaje = 'Algo salio mal intentalo nuevamente';
            $('#boton').button('reset');

        })

    }

$scope.descarga = function(mes, archivo){

    alert('hola');
       
        var fileName = "Reporte";
        var uri = 'Doc_Contribuyentes/'+mes+'/'+ archivo;
        var link = document.createElement("a"); 
        link.href = uri;
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";

        link.download = archivo;
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

}




}

documentosCtrl.$inject = ['$scope', '$rootScope',  'loading','$filter','$location','$http','api', 'find'];
app.controller('documentosCtrl',documentosCtrl);
