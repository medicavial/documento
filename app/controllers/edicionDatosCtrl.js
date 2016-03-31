app.controller('edicionDatosCtrl', function($scope) {

	$scope.tituloEdic = "Búsqueda de Folios";

	$scope.Actualiza=function(){
		$scope.formVisible=false;
		console.log($scope.formVisible)
	}

	$scope.formVisible=false;

	$scope.ShowForm=function() {
		$scope.formVisible=true;
		console.log($scope.formVisible)
	}
});