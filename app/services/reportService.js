app.factory("reportes", function($http,api,publicfiles){
    return{
        descargar:function(datos){

            $http.post(api+'reportes/controldocumentos',datos).success(function (data){
                // console.log(data);
                var archivo = publicfiles + data.file;
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
