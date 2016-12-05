/// Home de la app
function homeCtrl($scope, $rootScope, auth, find,webStorage,$location){

	$scope.tituloH = "Sistema MV";
	$scope.area = $rootScope.areaUsuario;
    $scope.inicio = function(){
        $scope.buscaarea();
        $scope.areaManual = '';
        $scope.usuarioManual = '';
    }

    $scope.altausuariosarea = function(area){

            find.usuariosareatodos(area).success( function (data){

                $scope.usuarios = data;

             });
       
    }

    $scope.buscaarea = function(){
        find.areaoperativa().success(function (data){
            $scope.areas = data;
        });
    }

    $scope.consulta = function(){

        $('#modalT').modal('hide');
        webStorage.session.add('areaManual', $scope.areaManual);
        webStorage.session.add('usuarioManual', $scope.usuarioManual);
        $rootScope.areaM = $scope.areaManual;
        $rootScope.userM = $scope.usuarioManual;
        $location.path('/flujoManual');

    }
    
};


homeCtrl.$inject = ['$scope', '$rootScope', 'auth', 'find','webStorage','$location'];
app.controller('homeCtrl',homeCtrl);