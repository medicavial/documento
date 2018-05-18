function digitalesQualitasCtrl($scope, $rootScope,  loading, $filter, $timeout, find, upload){

    $scope.inicio = function()
    {
        $scope.tituloPT = "Documentos Digitales para Qualitas";
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
        $scope.mensaje = '';
    }

    $scope.buscar = function()
    {
        loading.cargando('Cargando Información');
        find.busquedaDoctosQualitas($scope.digitales).success(function (data){
          console.log(data);
          if(data.respuesta =='error'){
            $scope.mensaje = 'No se encontraron imagenes';
          }else{
            $scope.mensaje = '';
            $scope.listadoImagenes = data.imagenes; 
            $scope.ruta = data.ruta;           
          }          
          loading.despedida();
        });
    }

    $scope.borrarImagenes = function()
    {
        var URLactual = window.location;
        kalert(URLactual);
        console.log('entro');
        $scope.url= 'CEMS011367/04161235630_21737_CEMS011367_GN19.jpg'; 
        var fileName = "04161235630_21737_CEMS011367_GN19.jpg";
        var uri = $scope.url;                        
        var link = document.createElement("a");    
        link.href = uri;        
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".jpg";        
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        $scope.cargador=false;
        document.body.removeChild(link);
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
app.controller('digitalesQualitasCtrl',digitalesQualitasCtrl);
