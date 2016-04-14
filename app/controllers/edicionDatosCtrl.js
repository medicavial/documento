app.controller('edicionDatosCtrl', function ($scope, loading, find) {

	$scope.consultaDatos = function(){
		$('#boton').button('loading');
		find.editaDatos($scope.folio).success(function (data){
			console.log(data)
			$('#boton').button('reset');

			$scope.datos = data;

		});

		$scope.formVisible=true;
    }

    $scope.Actualiza=function(){
    	$scope.folio = ''
    	$scope.formVisible=false;
		console.log($scope.datos);
	}

	$scope.ShowForm=function(){
		console.log($scope.formVisible)
	}
});