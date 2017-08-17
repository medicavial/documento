function subirDocumentosCtrl($scope, $rootScope,  loading, $filter, $timeout, find, upload){

  $scope.unidades ='';
  $scope.digitales ={
      unidad:'',
      fecha:fecha(),
      tipo:"1"
  }
  $scope.mensaje='';

  $scope.file='';

    $scope.inicio = function()
    {
        $scope.tituloPT = "Subir Documentos";
        find.unidadesweb().success(function (data){
          console.log(data);
          $scope.unidades =data;
        });
    }

    $scope.getFileDetails = function (e) {

        $scope.files = [];
        $scope.$apply(function () {

            // STORE THE FILE OBJECT IN AN ARRAY.
            for (var i = 0; i < e.files.length; i++) {
                $scope.files.push(e.files[i])
            }

        });
        console.log($scope.files);
    };

    //función para subir archivos
    $scope.uploadFile = function()
  	{
      loading.cargando('Subiendo Documento');
      var unidad = $scope.digitales.unidad;
      var fecha = $scope.digitales.fecha;
  		var file = $scope.files;
      var fechaMod = fecha.replace(/\//g,"-");  
      console.log(file);    
  		upload.uploadFile(file, unidad, fechaMod).then(function(res)
  		{
        console.log(res);
        if(res.data=='ok'){
          $scope.digitales ={
              unidad:'',
              fecha:'',
              tipo:"1"
          }
          $scope.file='';
          $scope.mensaje='El documento se subió correctamente';
        }else{
          $scope.mensaje='Ocurrió un problema';
        }
        loading.despedida();
  		})
  	}
}
function fecha(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    var today = dd+'/'+mm+'/'+yyyy;
    return today;
}
subirDocumentosCtrl.$inject =['$scope', '$rootScope', 'loading','$filter','$timeout','find','upload'];
app.controller('subirDocumentosCtrl',subirDocumentosCtrl);
