function pagoManualCtrl($scope, $rootScope, find ,loading,datos,$filter,$location,$http,checkFolios,api,$upload,leexml){

    // console.log(datos);
    loading.despedida();

    $scope.recibidos = datos.recepcion;

    $scope.inicio = function(){

        $rootScope.area = 6;
        $scope.tituloR = "Pagos Manuales";

    }

};

pagoManualCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading','datos','$filter','$location','$http','checkFolios','api','$upload','leexml'];
// flujoPagosCtrl.$inject = ['$scope','$rootScope', 'find','loading', '$http', 'api','datos','$filter'];
app.controller('pagoManualCtrl',pagoManualCtrl);
// app.controller('flujoPagosCtrl',flujoPagosCtrl);
