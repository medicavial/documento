function buscaFacturaCtrl($scope, $rootScope, find ,loading,$filter,$location,$http,checkFolios,api){

    $scope.inicio = function(){

        $scope.tituloR = "Busqueda de Facturas";
        $scope.busqueda = {

            foliofiscal:'',
            foliomv: '',
            prefactura: ''

        }
    }




    $scope.buscar = function(){

    	$http.post(api+'consulta/buscaFolioFiscal',$scope.busqueda)
        .success( function (data){

            if (data.length == 0) {

                $scope.mensaje = 'No hubo coincidencia en Sistema';
                $scope.tipoalerta = 'alert-warning';

            }else{

                $scope.accion = true;
                $scope.resultados = data;
            }

		});
    }

    $scope.limpiar = function(){

        $scope.busqueda = {

            foliofiscal:'',
            foliomv: ''


        }

    }

};


buscaFacturaCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading','$filter','$location','$http','checkFolios','api'];
// flujoPagosCtrl.$inject = ['$scope','$rootScope', 'find','loading', '$http', 'api','datos','$filter'];

app.controller('buscaFacturaCtrl',buscaFacturaCtrl);
// app.controller('flujoPagosCtrl',flujoPagosCtrl);
