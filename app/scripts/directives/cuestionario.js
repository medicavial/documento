app.directive('capturaCuestionario', capturaCuestionario);

function capturaCuestionario() {

    var directive = {
        restrict: 'EA',
        templateUrl: 'vistas/capturaCuestionario.html',
        controller: capturaCueCtrl
        // bindToController: true // because the scope is isolated
    };

    return directive;

}

capturaCueCtrl.$inject = ['$scope', '$rootScope', '$filter', '$location', '$http', 'find', 'loading', 'checkFolios','carga','api'];

function capturaCueCtrl($scope, $rootScope, $filter, $location, $http, find, loading, checkFolios, carga, api) {

    $scope.cuestionario={  
        tipoCuestionario:'',  
        pregunta38:'',
        pregunta39:'',
        pregunta40:'',
        pregunta41:'',
        pregunta42:'',
        pregunta43:'',
        pregunta44:'',
        pregunta45:'',
        pregunta46:'',
        pregunta47:'',
        pregunta48:''
    }

}