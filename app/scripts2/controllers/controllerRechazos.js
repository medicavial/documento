function rechazosFolioCtrl($scope, $rootScope,$http, find, loading){

	$scope.inicio = function(){
		$scope.tituloRZ = "Rechazos";
		$scope.cargaInfo();	
		$scope.limpia();
	}

	$scope.limpia = function(){
		$scope.info = {
			fechaini:'',
			fechafin:'',
			folio:''
		}
		$scope.mostrando=false;
	}

	$scope.cargaInfo = function(){
		find.rechazos().success(function (data){
			$scope.datos = data;
		});
	}

	$scope.buscar = function(){
		$scope.mostrando=true;
		$http.post('/documento/api/rechazos/busqueda',$scope.info).success(function (data){
			$scope.datos = data;
			$scope.limpia();
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

		$scope.guardado=false;
	}

	$scope.verFolio = function(folio){
		// console.log(folio);
	}

	$scope.guardar = function(){

		if (Number($scope.datos.monto) > 0) {
			$('#boton').button('loading');
			$http.post('/documento/api/rechazos',$scope.datos).success(function (data){
				// console.log(data);
				$scope.mensaje = data.respuesta;
				$('#boton').button('reset');
				$scope.guardado=true;
			});
		}else{
			alert('El Monto debe ser mayor a cero')
		}

	}

}