function subeFacturaCtrl($scope, $rootScope,  loading,$filter,$timeout){

    $scope.inicio = function(){

        $scope.tituloPT = "Sube Factura";
        console.log($scope.selectos);


    }


    

}
subeFacturaCtrl.$inject =['$scope', '$rootScope', 'loading','$filter','$timeout'];
app.controller('subeFacturaCtrl',subeFacturaCtrl);
