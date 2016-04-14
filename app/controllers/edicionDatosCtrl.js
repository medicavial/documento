app.controller('edicionDatosCtrl', function ($scope, loading, find) {

	$scope.consultaDatos = function(){
		$('#boton').button('loading');
		find.editaDatos($scope.folio).success(function (data){
			console.log(data)
			$('#boton').button('reset');


			$scope.datos = data;
			// $scope.AFE_nombre = data.lesionado;
			// $scope.AFE_fechaNac = data.fechaNacimiento;
			// $scope.DAS_poliza = data.poliza;
			// $scope.EMP_claveint = data.cliente;
			// $scope.DAS_reporte = data.reporte;
			// $scope.PRO_claveint = data.producto;
			// $scope.RIE_clave = data.riesgo;

		});

		$scope.formVisible=true;
    }

    $scope.Actualiza=function(){
    	$scope.formVisible=false;
		console.log($scope.datos);
	}

	$scope.ShowForm=function(){
		console.log($scope.formVisible)
	}
});