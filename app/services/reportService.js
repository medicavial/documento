app.factory("reportes", function($http,api){
    return{
      descargar:function(datos){

        $http.post(api+'reportes/controldocumentos',datos).success(function (data){

            var archivo = api + 'reportes/descargar' + data.file;
            console.log(archivo);
            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");    
            link.href = archivo;
            
            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = archivo;
            
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            $('#boton').button('reset');

        });
        
          
      }
    }
});


app.directive('descarga', function(){
    return {
        restrict: 'E',
        scope: true,
        scope: { info: '=' },
        template: '<button ng-click="click(info)" class="btn btn-primary btn-sm glyphicon glyphicon-download-alt"> Descargar</button>',
        controller: function($scope, $element){

            $scope.click = function(info){
              
              console.log(info);
              
              //this trick will generate a temp <a /> tag
              var link = document.createElement("a");    
              link.href = info;
              
              //set the visibility hidden so it will not effect on your web-layout
              link.style = "visibility:hidden";
              link.download = info;
              
              //this part will append the anchor tag and remove it after automatic click
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

            }
        }
    }
});