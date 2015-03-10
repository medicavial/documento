function rechazosCtrl($scope, $rootScope,$http, find, loading){

	$scope.inicio = function(){
		$scope.tituloRZ = "Rechazos";
		$scope.Altaunidades();
		$scope.empresas();	
	}


	$scope.Altaunidades = function(){

		find.unidades().success( function (data) {

			$scope.unidades = data;

		 });
	}

	$scope.empresas = function(){

		find.empresas().success( function (data) {

			$scope.clientes = data;

		 });
	}

}