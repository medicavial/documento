app.directive('buscador', buscador);

function buscador() {

    var directive = {
        restrict: 'EA',
        templateUrl: 'vistas/buscador.html',
        controller: controladorBuscador,
        bindToController: true // because the scope is isolated
    };

    return directive;

}

controladorBuscador.$inject = ['$scope', '$rootScope', '$filter', '$location', '$http', 'find', 'loading', 'checkFolios','carga','api', 'tickets'];;

function controladorBuscador($scope, $rootScope, $filter, $location, $http, find, loading, checkFolios, carga, api, tickets) {

    $rootScope.folioGlobal = '';
    $scope.tipo = 'lesionado';
    $scope.folio = '';
    $scope.genieVisible = false;

    $scope.$watch('genieVisible', function(newValue, oldValue) {
        if (newValue == true) {

            if ($location.path() == "/login" || $location.path() == "/bloqueo") {
                $scope.genieVisible = false;
            }else{
                $scope.resultados = [];
                $scope.consulta = '';
                $scope.accion = false;
            }
        };
    });


    $scope.verifica = function(event,dato,tipo){

        if (event.charCode == 13) {

            $scope.resultados = [];
            $scope.folio = '';
            $scope.accion = false;

            find.buscador(dato,tipo).success( function (data){
                $scope.resultados = data;  
                $scope.consulta = '';              
            });

        };
    }

    $scope.preparaFolio = function(folio){
        console.log(folio);
        $scope.folio = folio;
        $scope.accion = true;
    }

    $scope.generaAccion = function(accion){

        $rootScope.folioGlobal = $scope.folio;

        if (accion == 'registra') {
            $('#myModal10').modal();
        }else if(accion == 'ticket'){

        }else if(accion == 'seguimiento'){
            $('#myModal20').modal();
        }

        console.log($rootScope.folioGlobal);
        $scope.genieVisible = false;
    }

}