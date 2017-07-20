function buscaFacturaCtrl($scope, $rootScope, find ,loading,$filter,$location,$http,checkFolios,api){

    $scope.inicio = function(){

        $scope.tituloR = "Busqueda de Facturas";


        $scope.busqueda = {

            foliofiscal:'',
            foliomv: ''


        }

    }

    $scope.buscar = function(){

        console.log($scope.busqueda);

    	$http.post(api+'consulta/buscaFolioFiscal',$scope.busqueda)
        .success( function (data){

            $scope.accion = true;
            $scope.resultados = data;

        	
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
