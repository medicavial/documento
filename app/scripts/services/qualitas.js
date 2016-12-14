//servicio de chekeo de folios para las cargar busquedas por bloque y carga informacion del flujo
//por usuario
app.factory("qualitas", function($q,$http,find,api,publicfiles,operacion){
    return{
        actualiza:function(envio,datos){
            // console.log(datos);
            return $http.post(api+'qualitas/actualiza/'+ envio, datos);
        },
        envios:function(datos){
            return $http.post(api+'qualitas/envios', datos);
        },
        enviaPrincipal:function(datos){
            return $http.post(api+'qualitas/principal', datos);
        },
        enviaRechazos:function(datos){
            return $http.post(api+'qualitas/rechazos', datos);
        },
        descargaArchivos:function(folios){
            
            angular.forEach(folios,function(dato){
            	console.log(dato.folioSistema);

                operacion.guardaImagenes(dato.folioSistema);

            });
            
        },
        detalleEnvio:function(dato){
            var promesa = $q.defer(),
                folios  = [];

            $http.get(api + 'qualitas/envios/' + dato.ENQ_claveint).success(function (data){

                //console.log(dato.ENQ_procesado);

                // promesa.resolve(data);
                if(dato.ENQ_procesado == 1){

                    angular.forEach(data,function (folio){
                        if (folio.procesado == 1) {
                            folios.push(folio);
                        };
                    });

                    $q.when(folios).then(function (data){
                        promesa.resolve(data);
                    });

                }else{

                    promesa.resolve(data);
                }


            });

            return promesa.promise;

        },
        incompletos:function(datos){
            return $http.post(api+'qualitas/incompletos', datos);
        },
        incompletosFE:function(datos){
            return $http.post(api+'qualitasFE/incompletos', datos);
        },
        invalidos:function(datos){
            return $http.post(api+'qualitas/invalidos', datos);
        },
        invalidosFE:function(datos){
            return $http.post(api+'qualitasFE/invalidos', datos);
        },
        sinArchivo:function(datos){
            return $http.post(api+'qualitas/sinarchivo', datos);
        },
        sinArchivoFE:function(datos){
            return $http.post(api+'qualitasFE/sinarchivo', datos);
        },
        sinProcesar:function(datos){
            return $http.post(api+'qualitas/sinprocesar', datos);
        },
        sinProcesarFE:function(datos){
            return $http.post(api+'qualitasFE/sinprocesar', datos);
        },
        general:function(datos){
            return $http.post(api+'qualitas/general', datos);
        },
        generalFE:function(datos){
            return $http.post(api+'qualitasFE/general', datos);
        },
        generaEnvio:function(datos){
            return $http.post(api + 'qualitas/genera', datos);
        },
        procesaEnvio:function(datos){
            return $http.post(api + 'qualitas/procesa', datos);
        },
        descargaEnvio:function(archivo){

            // console.log(archivo);
            var ruta = publicfiles + archivo;
            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");    
            link.href = ruta;
            
            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = ruta;
            
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            $('#boton').button('reset');
        },
        renombrar:function(datos){
            return $http.post(api + 'qualitas/renombrar', datos);
        }
    }
});