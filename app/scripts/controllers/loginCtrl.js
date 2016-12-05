//inicio de sesion
function loginCtrl($rootScope , $scope , auth){
	
	$scope.inicio = function(){

		$rootScope.username = '';
		$rootScope.mensaje = '';
		$scope.titulo = 'Bienvenido';

	}
	

	$scope.login = function(){
		$rootScope.mensaje = '';
        auth.login($scope.username, $scope.password);
    }

};

loginCtrl.$inject = ['$rootScope' , '$scope' , 'auth'];

app.controller('loginCtrl',loginCtrl);