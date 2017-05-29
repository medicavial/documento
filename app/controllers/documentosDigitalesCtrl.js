function documentosDigitalesCtrl($scope, $rootScope,  loading, $filter, $timeout, find, upload){

    $scope.inicio = function()
    {
        $scope.tituloPT = "Documentos Digitales";
        $scope.unidades ='';
        $scope.digitales ={
            folio:'',
            nombre:''
        }
        $scope.mensaje='';
        $scope.uniElegida='';
        $scope.docsDigitales=[];
        $scope.rotar = false;
        $scope.msjDocs=false;
        $scope.msjBus=false;
    }

    $scope.buscar = function()
    {
        loading.cargando('Cargando Información');
        find.busquedaDoctos($scope.digitales).success(function (data){
          console.log(data);
          if(data.length>0){
            $scope.listaFolPar = data;
            $scope.msjBus=false;
          }else{
            $scope.msjBus=true;
          }
          loading.despedida();
        });
    }

    $scope.verDocumentos = function(folio, uni)
    {
        $scope.uniElegida=uni;
        console.log($scope.uniElegida);
        loading.cargando('Cargando Información');
        find.busquedaDigitalesFolio(folio).success(function (data){
          console.log(data);
          if(data.length==0){
            $scope.msjDocs=true;
          }else{
            $scope.msjDocs=false;
            $scope.docsDigitales=data;
          }
          $("#myModal").modal();
          loading.despedida();
        });
    }
    //obtiene la ruta de las imagenes que se solicitaron
    $scope.obtenerFrame = function(src) {
        console.log(src);
        return 'http://medicavial.net/registro/' + src;
    };

    //verifica si es imagen
    $scope.imagen = function(archivo){
        //se obtiene la extension del archivo
        var extn = archivo.split(".").pop();

        if (extn == 'jpg' || extn == 'jpeg' || extn == 'png' || extn == 'PNG' ) {
            return true;
        }else{
            return false;
        }
    }

    //verifica si es pdf
    $scope.file = function(archivo){
        //se obtiene la extension del archivo
        var extn = archivo.split(".").pop();
        if (extn == 'pdf' || extn == 'PDF') {
            return true;
        }else{
            return false;
        }
    }
}
subirDocumentosCtrl.$inject =['$scope', '$rootScope', 'loading','$filter','$timeout','find','upload'];
app.controller('documentosDigitalesCtrl',documentosDigitalesCtrl);
