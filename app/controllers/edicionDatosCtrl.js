app.controller('edicionDatosCtrl', function ($scope, loading, find, operacion) {

	$scope.consultaDatos = function(){
		$('#boton').button('loading');
		find.editaDatos($scope.folio).success(function (data){
			console.log(data)
			$('#boton').button('reset');

			$scope.datos = data;
			$scope.datos.producto = String(data.producto);
			$scope.datos.cliente = String(data.cliente);
			$scope.datos.riesgo = String(data.riesgo);
			
			$scope.formVisible=true;
		});

    }

    $scope.consulta = function(){
    	find.riesgos().success(function (data){
    		$scope.riesgos = data;
    	});
    	find.empresas().success(function (data){
    		$scope.empresas = data;
    	 });
    	find.productos().success(function (data){
    		$scope.productos = data;
    	});
    }

    $scope.inicio = function (){
    	$scope.consulta();
    }

    $scope.limpiaDatos = function(){
    	$scope.datos = [];
    	$scope.folio = '';
        $scope.mensaje = '';
    	$scope.formVisible=false;
		console.log($scope.datos);
    }

	$scope.ShowForm = function (){
		console.log($scope.formVisible)
	}

    $scope.guardaDatos = function (){

        $('#load').button('loading');
        operacion.actualizaDatos($scope.datos).success(function (data){
            console.log(data)

            $scope.mensaje = "Se guardo correctamente";
            $scope.tipoalerta = 'alert-success';
            $('#load').button('reset');

        })
        .error (function (data){
            $scope.mensaje = "Ocurrio un error al guardar";
            $scope.tipoalerta = 'alert-warning';
            $('#load').button('reset');
        });
    }
});