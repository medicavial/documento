/// Facturas qualitas
function controlFacturasZimaCtrl($scope, $rootScope,$http, find, loading,api , FacturaZima, $location){

	$scope.inicio = function(){

		$scope.tituloFQ = "Facturas Zima";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.listado = [];
        $scope.Altaunidades();
		// $scope.buscafacturas();

	}

    $scope.Altaunidades = function(){

        FacturaZima.unidades().success( function (data) {
            $scope.unidades = data;
            
         });
    }
};

controlFacturasZimaCtrl.$inject = ['$scope', '$rootScope','$http', 'find', 'loading', 'api', 'FacturaZima', '$location'];


app.controller('controlFacturasZimaCtrl',controlFacturasZimaCtrl);
