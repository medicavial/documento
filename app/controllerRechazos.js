function rechazosFolioCtrl($scope, $rootScope,$http, find, loading){

	$scope.inicio = function(){
		$scope.tituloRZ = "Rechazos";
		$scope.cargaInfo();	
	}

	$scope.cargaInfo = function(){
		find.rechazos().success(function (data){
			$scope.datos = data;
		});
	}

	$scope.buscar = function(){
		$http.post('/documento/api/rechazos/busqueda',$scope.datos).success(function (data){
			$scope.datos = data;
		});
	}

}


function altaRechazosCtrl($scope, $rootScope,$http, find, loading){

	$scope.inicio = function(){
		$scope.tituloNR = "Nuevo Rechazo";
		$scope.mensaje = '';
		$scope.datos = {
			folio:'',
			motivo:'',
			monto:0,
			usuario:$rootScope.id
		}
	}

	$scope.verFolio = function(folio){
		console.log(folio);
	}

	$scope.guardar = function(){
		$('#boton').button('loading');
		$http.post('/documento/api/rechazos',$scope.datos).success(function (data){
			console.log(data);
			$scope.mensaje = data.respuesta;
			$('#boton').button('reset');
		});
	}

}