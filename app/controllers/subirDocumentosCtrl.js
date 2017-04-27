function subirDocumentosCtrl($scope, $rootScope,  loading, $filter, $timeout, find, upload){

  $scope.unidades ='';
  $scope.digitales ={
      unidad:'',
      fecha:'',
      tipo:"1"
  }

  $scope.file='';

    $scope.inicio = function()
    {
        $scope.tituloPT = "Subir Documentos";
        find.unidades().success(function (data){
          console.log(data);
          $scope.unidades =data;
        });
    }

    //función para subir archivos
    $scope.uploadFile = function()
  	{
      console.log($scope.digitales.unidad);
      var unidad = $scope.digitales.unidad;
      var fecha = $scope.digitales.fecha;
  		var file = $scope.file;
      var fechaMod = fecha.replace(/\//g,"-");
      console.log(fechaMod);
      console.log(unidad+'----'+file+'----'+fechaMod);
  		upload.uploadFile(file, unidad, fechaMod).then(function(res)
  		{
  			console.log(res);
  		})
  	}
}
subirDocumentosCtrl.$inject =['$scope', '$rootScope', 'loading','$filter','$timeout','find','upload'];
app.controller('subirDocumentosCtrl',subirDocumentosCtrl);
