app.directive('capturaTramite', capturaTramite);

function capturaTramite() {

    var directive = {
        restrict: 'EA',
        templateUrl: 'vistas/capturaTramite.html',
        scope:{},
        controller: tramiteCtrl
        // bindToController: true // because the scope is isolated
    };

    return directive;

}

tramiteCtrl.$inject = ['$scope', '$rootScope', 'operacion'];

function tramiteCtrl($scope, $rootScope, operacion) {

    $scope.inicio = function(){
        $scope.datos = {
            lesionado:'',
            hospital:'',
            telHospital:'',
            contenido:'',
            usuario:$rootScope.id,
            folioZima:'',
            prefacturaZima:'',
            fechaRecep:''
        }
    }

    $scope.guardaTramite = function(){
        operacion.guardaTramite($scope.datos).then(function (resp){
            console.log(resp.data);
        });
    }

}