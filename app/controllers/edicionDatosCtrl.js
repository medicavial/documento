app.controller('edicionDatosCtrl', function ($scope, loading) {
	
	$scope.Actualiza=function(){
		$scope.formVisible=false;
		console.log($scope.formVisible)
		// loading.despedida();
	}
	
	// $scope.formVisible=false;

	$scope.ShowForm=function() {
		// loading.cargando('Cargando...');
		$scope.formVisible=true;
		console.log($scope.formVisible)
	}

	$('.btn').on('click', function() {
		var $this = $(this);
		$this.button('loading');
		setTimeout(function() {
			$this.button('reset');
			}, 3000);
	})
});