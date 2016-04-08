//servicio de chekeo de folios para las entregas verifica cada condicion 
app.factory("checkFolios", function($q,$http,find, api){
    return{
        enviaFolios:function(folios,areaRecibe,usuarioRecibe,usuarioEntrega,areaEntrega){

            // creamos las variables 
            // la primera es preparar una promesa 
            var promesa = $q.defer(),
                foliosIn = [],
                foliosVal = [];

            //verificamos los folios enviados para ver si hay algun error 
            angular.forEach(folios,function (folio){

                var documento = folio;

                // console.log(documento.DOC_situacionoriginal);
                //Si es Etapa 2 o 3 y Etapa 1 no esta capturada
                if(documento.FLD_etapa > 1 && documento.CapEt2 == 0){
                    foliosIn.push({msg:'El documento ' + documento.PAS_folio + ' etapa '+ documento.FLD_etapa + ' # ' + documento.FLD_numeroEntrega + ' no se puede entregar debido a que la etapa 1 no esta capturada'});
                }
                //Si se envia a Facturación y no es original ó ya fue enviado anteriormente manda mensaje de error
                //se agrego indexof(busca el contenido que se ponga aqui) por que javascript no soporta muchos && y || en un mismo if 
                else if( (   (documento.FLD_formaRecep.indexOf('O')  == -1 && documento.FLD_formaRecep.indexOf('NP') == -1)   && areaRecibe == 5)  || (areaRecibe == 5 && documento.FLD_AROent == 5 && documento.USU_ent != 'null')||(areaRecibe == 5 && documento.EnvFac == 'SI' && documento.FLD_etapa == 1) ){
                    foliosIn.push({msg:'El documento ' + documento.PAS_folio + ' etapa '+ documento.FLD_etapa + ' # ' + documento.FLD_numeroEntrega + ' no se puede enviar a Facturación debido a que no es etapa 1 o ya fue mandado'});
                }

                //Si se envia a Facturación y no es etapa 1
                else if(areaRecibe == 5 && documento.FLD_etapa > 1) {
                    foliosIn.push({msg:'El documento ' + documento.PAS_folio + ' etapa '+ documento.FLD_etapa + ' # ' + documento.FLD_numeroEntrega + ' no se puede enviar a Facturación debido a que no es etapa 1'});
                }

                //Si se envia a Facturación o pagos y no es mesa de control
                else if(  (areaRecibe == 5 || areaRecibe == 6)  && areaEntrega != 4) {
                    foliosIn.push({msg:'El documento ' + documento.PAS_folio + ' etapa '+ documento.FLD_etapa + ' # ' + documento.FLD_numeroEntrega + ' no se puede generar envio tu usuario no tiene permisos'});
                }

                // si se envia a facturacion y ya fue enviado
                else if(areaRecibe == 5 && documento.EnvFac.indexOf('SI') == 0){

                    foliosIn.push({msg:'El documento ' + documento.PAS_folio + ' etapa '+ documento.FLD_etapa + ' # ' + documento.FLD_numeroEntrega + ' no se puedo enviar a Facturación por que ya fue enviado'});
                
                }

                // si se envia a pagos o facturacion pero no esta capturado
                else if( (areaRecibe == 5 || areaRecibe == 6 || areaRecibe == 4) && documento.DOC_situacionoriginal == 0){

                    foliosIn.push({msg:'El documento ' + documento.PAS_folio + ' etapa '+ documento.FLD_etapa + ' # ' + documento.FLD_numeroEntrega + ' no se puedo generar envio por que no esta capturado'});
                
                }

                //Si se envia a pagos y no es original 
                else if(areaRecibe == 6 && documento.EnvFac.indexOf('SI') == -1 && documento.FLD_etapa == 1) {

                    if(confirm('El documento ' + documento.PAS_folio + ' etapa '+ documento.FLD_etapa + ' # ' + documento.FLD_numeroEntrega + ' no se a enviado a Facturación. ¿Desea proseguir?')){                         
                        //si es facturacion agrega un juego mas al flujo
                        foliosVal.push(documento);
                    }else{
                        foliosIn.push({msg:'El documento ' + documento.PAS_folio + ' etapa '+ documento.FLD_etapa + ' # ' + documento.FLD_numeroEntrega + ' no se puedo enviar a Pagos por que no se ha enviado a facturación'});
                    }

                
                }else{

                    foliosVal.push(documento);

                }

            });
            
            //verifica que ya haya terminado para mandarlos el $q detecta cuando no se hayan efectuado cambios en los arreglos 
            $q.all([foliosVal,foliosIn]).then(function (respuesta){


                // al generar una respuesta generamos un objecto para mandar respuesta 
                var resultado = {
                    respuesta:'',
                    rechazos:respuesta[1]
                }

                // generamos el objeto con los datos a enviar para guardar en el server
                if (respuesta[0].length > 0) {

                    //Si se envia a Facturación y es mesa de control
                    if(areaRecibe == 5 && areaEntrega == 4) {
                        var ruta = api+'flujo/alta';
                    }else{
                        var ruta = api+'flujo/actualiza';                    
                    }

                    //armamos la estructura de nuestros datos a enviar
                    var datos = {
                        folios:respuesta[0],//este el el conjunto de folios validos de nuestra primer promesa devuelta
                        usuarioentrega:Number(usuarioEntrega),
                        areaentrega:Number(areaEntrega),
                        usuariorecibe:Number(usuarioRecibe),
                        arearecibe:Number(areaRecibe)
                    };

                    // generamos la peticion al servidor
                    $http.post(ruta,datos,{timeout: 10000})
                    .success( function (data){

                        resultado.respuesta = data.respuesta;
                        // resolvemos la promesa para que lo pueda mandar y retornar
                        promesa.resolve(resultado);          

                    }).error( function (data){
                        // hubo un error y rechaza todo
                        promesa.reject('Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas')

                    });
                    
                }else{

                    resultado.respuesta = 'No se generó ninguna entrega';
                    promesa.resolve(resultado);

                }

            });
            
            // 
            return promesa.promise;
        },
        preparaGuardado:function(datos, esoriginal, esfax, esfe){

            //preparamos promesa
            var promesa = $q.defer();
            //en caso de error preparamos el mensaje a mandar
            var error = {
                mensaje:'',
                tipoalerta:''
            }
            // console.log(datos);
            
            //verificamos si el folio tiene documento registrado
            if(datos.documento == 0){

                //Si es primera atencion
                if(datos.tipoDoc == 1){

                    //Verificamos que el folio no este dado de alta en documentos

                    //como es primera atencion se define como 1 el numero de entrega para la primera etapa (aunque solo debe ser 1 para la primera)
                    datos.numentrega = 1;

                    //verifica que el folio esta registrado en control de documentos
                    find.verificafolio(datos.folio, 1).success( function (data){

                        if(data.length > 0){

                            error.mensaje = 'El folio ya se encuentra registrado en Control de Documentos';
                            error.tipoalerta = 'alert-danger';
                            promesa.reject(error);

                        }else{
                            
                            //Segunda validacion para verificar que no esta en la tabla pase o capturas
                            find.verificafoliopase(datos.folio).success( function (data){

                                if(data > 0){

                                    error.mensaje = data.respuesta;
                                    error.tipoalerta = 'alert-danger';
                                    promesa.reject(error);

                                }else{

                                    promesa.resolve({info:datos,agregaOriginal:1});
                                    
                                }
                                
                            });
                        }
                        
                    })
                    


                }else{

                    //en caso de que sea segunda atencion o tercera y se haya registrado por primera vez en sql server 
                    error.mensaje = 'No se permite capturar una segunda atencion de un registro nuevo';
                    error.tipoalerta = 'alert-danger';
                    promesa.reject(error);

                }
                

            }else{
            ///Se actualiza pero se tiene que ver si es original o es una segunda atencion 

                //Tiene fax/fe y no esta capturado como original y se actualiza a original
                if(esoriginal == 0){

                    //tenemos primera atencion
                    if(datos.tipoDoc == 1){

                        //Es fax
                        if(esfax == 1){

                            if(Date.parse(datos.fecha) < Date.parse(datos.fechafax)){
                                error.mensaje = 'La fecha de captura del original no puede ser anterior a la fecha de captura del fax.';
                                error.tipoalerta = 'alert-danger';
                                promesa.reject(error);
                            }else{
                                //actualizamos
                                promesa.resolve({info:datos,actualizaOriginal:1});
                                //alert('entro actualiza');
                            }

                        //es factura express    
                        }else if(esfe == 1){

                            if(Date.parse(datos.fecha) < Date.parse(datos.fechafe)){
                                error.mensaje = 'La fecha de captura del original no puede ser anterior a la fecha de captura de la factura express.';
                                error.tipoalerta = 'alert-danger';
                                promesa.reject(error);
                            }else{
                                //actualizamos
                                promesa.resolve({info:datos,actualizaOriginal:1});

                            }
                        }

                    }else{//segunda/tercera atencion agregamos nuevo documento

                       promesa.resolve({info:datos,agregaOriginal:1});
                    }


                }else{
                //es segunda o tercera atencion

                    //verificamos que no se haya apretado la primera atencion
                    if(datos.tipoDoc == 1){
                        error.mensaje = 'No se puede guardar como primera atencion';
                        error.tipoalerta = 'alert-danger';
                        promesa.reject(error);

                    }else{

                        //verifica que numero de segunda o tercera atencion es
                        find.verificaetapaentrega(datos.folio,datos.tipoDoc).success(function (data){

                            datos.numentrega = Number(data) + 1;
                            //Agregamos un nuevo documento de segunda etapa o tercera
                            promesa.resolve({info:datos,agregaOriginal:1});

                        });

                    }

                }

            }//se cierra donde verificamos si un nuevo registro
            return promesa.promise;

        },
        enviaRechazos:function(folios, area, usuario){

            // creamos las variables 
            // la primera es preparar una promesa 
            var promesa = $q.defer(),
                foliosIn = [],
                foliosVal = [];

            //verificamos los folios enviados para ver si hay algun error 
            angular.forEach(folios,function (folio){
                
                if(area == 4 && folio.FaxOrigianl == 'JF'){
                    foliosVal.push(folio);
                }else{
                    if (folio.FaxOrigianl == 'JF') {
                        foliosin.push(folio);
                    }else{
                        foliosVal.push(folio);
                    }
                }

            });
            
            //verifica que ya haya terminado para mandarlos el $q detecta cuando no se hayan efectuado cambios en los arreglos 
            $q.all([foliosVal,foliosIn]).then(function (respuesta){

                var folios_validos = respuesta[0];
                // al generar una respuesta generamos un objecto para mandar respuesta 
                var resultado = {
                    respuesta:'',
                    rechazos:respuesta[1]
                }

                $http.post(api+'flujo/elimina',folios_validos,{timeout: 10000}).success(function (data){
                    resultado.respuesta = data.respuesta;
                    promesa.resolve(resultado);
                }).error(function (data){
                    promesa.reject('Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas');
                });

            });
            
            // 
            return promesa.promise;
        },
        verificaInfo:function(cliente, producto, escolaridad, fecha, folio){

            var promesa = $q.defer();
            var error = {
                mensaje:'',
                tipoalerta:''
            }


            if(cliente == 20 && producto == 2 && (escolaridad == null || escolaridad == -1 || escolaridad == 0) ){

                error.mensaje = 'La escolaridad es requerida para AXA AP.';
                error.tipoalerta = 'alert-danger';
                promesa.reject(error);

            }else{

                if (moment(fecha, 'DD/MM/YYYY') > moment(FechaAct, 'DD/MM/YYYY')) {

                    error.mensaje = 'La fecha de captura no debe ser mayor al dia de hoy';
                    error.tipoalerta = 'alert-danger';
                    promesa.reject(error);

                }else{

                    if(producto == -1 || producto == null){

                        error.mensaje = 'El campo producto es requerido';
                        error.tipoalerta = 'alert-danger';
                        promesa.reject(error);

                    }else{

                        find.verificaprefijo(folio.substr(0,4),cliente).success(function (data){

                            if(data[0].valido == 1){
                                promesa.resolve({revisado:1});
                            }else{

                                error.mensaje = 'El prefijo del folio no es valido. Favor de verificar';
                                error.tipoalerta = 'alert-danger';
                                promesa.reject(error);

                            }

                        });

                    }

                }
                
            }

            return promesa.promise;
        },
        validaFolio:function(folio,etapa){

            var datos = {
                folio:'',
                documento:0,
                tipoDoc:'',
                cliente:'',
                lesionado:'',
                unidad:'',
                producto:'',
                escolaridad:0,
                fechafax: '',
                fechafe: '' ,
                internet:1 ,
                original:0,
                numentrega:1,
                incompleto:'',
                factura:'',
                totalfactura:0,
                mensaje: '',
                remesa: '',
                label1: '',
                label2: '',
                label3: '',
                unidadref: '',//referencia para la unidad
                esfax: 0,
                esfe: 0,
                esoriginal: 0,
                revisado: 0,
                bloqueo: false,
                bloqueoUni: false
            };

            var promesa        = $q.defer(),
                verifcacion    = find.verificafolio(folio,etapa),
                folioweb       = find.folioweb(folio);

            $q.all([verifcacion,folioweb]).then(function(data) { 
                
                var interno = data[0].data[0],
                    web     = data[1].data[0];

                if(interno){
                    //verificamos si es una segunda atencion o tercera pero la tercera es manual
                    if (interno.original == 1) {
                        
                        //segunda atencion
                        datos.bloqueo = true;
                        datos.bloqueoUni = false;
                        datos.esoriginal = 1;
                        datos.tipoDoc = 2;
                        
                    }else{

                        datos.documento = interno.clave;
                        //primera atencion
                        datos.tipoDoc = 2;

                        //verificamos que sea fax 
                        if(interno.fax == 1){
                            datos.label2 = 'FAX RECIBIDO: ' + interno.fechafax;
                            datos.fechafax = interno.fechafax;
                            datos.esfax = 1;
                            datos.tipoDoc = 1;
                        }
                        //verificamos que sea factura express
                        if(interno.fe == 1){
                            datos.label2 = 'FAC. EXPRESS: ' + interno.fefecha;
                            datos.fechafe = interno.fechafe;
                            datos.esfe = 1;
                        }

                        //asignamos bloqueos de campos
                        datos.bloqueo = true;
                        datos.bloqueoUni = false;
                        datos.esoriginal = 0;

                    }

                    datos.cliente = interno.empresa;
                    datos.lesionado = interno.lesionado;
                    datos.unidadref = interno.unidad;
                    datos.unidad = interno.unidad;
                    datos.documento = interno.clave;

                    datos.escolaridad = interno.escuela;
                    datos.producto = interno.producto;

                }else{

                    //Como no ninguna atencion registrada en sql server buscamos en web 
                    if (web) {

                        // console.log(web)
                        if (web.Exp_cancelado) {
                            promesa.reject('El folio se encuentra cancelado en registro web favor de verificarlo');
                        }else{

                            datos.cliente = web.Cia_claveMV ? String(web.Cia_claveMV) : web.Cia_claveMV;
                            datos.lesionado = web.Exp_completo;
                            datos.unidadref = web.Uni_claveMV ? String(web.Uni_claveMV) : web.Uni_claveMV;
                            datos.unidad = web.Uni_claveMV ? String(web.Uni_claveMV) : web.Uni_claveMV;
                            datos.producto = web.Pro_claveMV ? String(web.Pro_claveMV) : web.Pro_claveMV;
                            datos.escolaridad = web.Esc_claveMV ? String(web.Esc_claveMV) : web.Esc_claveMV;
                            
                            datos.label2 = 'NO SE RECIBIO FAX';
                            datos.label3 = 'NO ES FAC. EXPRESS';

                            datos.tipoDoc = 1;
                            datos.esoriginal = 0;
                        }
                        
                    }else{
                        promesa.reject('El folio no se encuentra debido a que no tiene datos correctos de registro');
                    }

                }

                promesa.resolve(datos);

            });

            return promesa.promise;
        },
        aceptaEntrega:function(folios){
            return $http.post(api+'entregas/acepta',folios,{timeout: 10000});
        },
        rechazaEntrega:function(folios, usuario){
            var promesa = $q.defer(),
                foliosIn = [];

            //verificamos los folios enviados para ver si hay algun error 
            angular.forEach(folios,function (folio){ 
                folio.USU_rec = usuario;
                folio.FLD_motivo = prompt("Escribe motivo de rechazo para el folio " + folio.PAS_folio,"Falto ");
                foliosIn.push(folio);
            });
            
            //verifica que ya haya terminado para mandarlos el $q detecta cuando no se hayan efectuado cambios en los arreglos 
            $q.all(foliosIn).then(function (foliosgenerados){

                $http.post(api+'entregas/rechaza',foliosgenerados,{timeout: 10000})
                .success(function (data){
                    promesa.resolve(data);
                })
                .error(function (data){
                    promesa.reject('Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas');
                });

            });
            
            return promesa.promise;
        }
    }
});


//servicio de chekeo de folios para las cargar busquedas por bloque y carga informacion del flujo
//por usuario
app.factory("carga", function($q,$http,find,api){
    return{
        activos:function(usuario){

            var promesa        = $q.defer(),
                activos        = $http.get(api+'flujo/activos/'+usuario);

            $q.when(activos).then(function(data) {
                promesa.resolve(data.data);

            }); 

            return promesa.promise;
        },
        informacion:function(){

            var promesa        = $q.defer(),
                cliente        = find.empresas(),
                unidades       = find.unidades(),
                productos      = find.productos(),
                escolaridad    = find.escolaridad(),
                areaOperativa  = find.areaoperativa();

            $q.all([cliente,unidades,productos,escolaridad,areaOperativa]).then(function(data) { 
                
                var datos = {
                    clientes:data[0].data,
                    unidades:data[1].data,
                    productos:data[2].data,
                    escolaridad:data[3].data,
                    areaOperativa:data[4].data
                }

                promesa.resolve(datos);
            });


            return promesa.promise;

        },
        flujo:function(usuario){

            var promesa        = $q.defer(),
                activos        = $http.get(api+'flujo/activos/'+usuario, {timeout: 10000}),
                info           = $http.get(api+'flujo/consulta/'+usuario, {timeout: 10000});
                // recepcion      = $http.get(api+'flujo/recepcion/'+usuario),
                // rechazos       = $http.get(api+'flujo/rechazos/'+usuario);

            $q.all([info]).then(function(data) {
                console.log(data);
                var datos = {
                    activos:activos,
                    rechazos:data[0].data.rechazos,
                    recepcion:data[0].data.xrecibir
                }
                promesa.resolve(datos);

            }); 

            return promesa.promise;
        },
        flujoArea:function(area){

            var promesa        = $q.defer(),
                activos        = $http.get(api+'flujo/activosarea/'+area),
                recepcion      = $http.get(api+'flujo/recepcionarea/'+area),
                rechazos       = $http.get(api+'flujo/rechazosarea/'+area);

            $q.all([activos,rechazos,recepcion]).then(function(data) {
                var datos = {
                    activos:data[0].data,
                    rechazos:data[1].data,
                    recepcion:data[2].data
                }
                promesa.resolve(datos);

            }); 

            return promesa.promise;
        }
    }
});



//servicio de chekeo de folios para las cargar busquedas por bloque y carga informacion del flujo
//por usuario
app.factory("qualitas", function($q,$http,find,api,publicfiles){
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
        invalidos:function(datos){
            return $http.post(api+'qualitas/invalidos', datos);
        },
        sinArchivo:function(datos){
            return $http.post(api+'qualitas/sinarchivo', datos);
        },
        sinProcesar:function(datos){
            return $http.post(api+'qualitas/sinprocesar', datos);
        },
        general:function(datos){
            return $http.post(api+'qualitas/general', datos);
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


app.factory("tickets", function($q,$http,find,api){
    return{
        guardar:function(datos){
            return $http.post(api + 'tickets', datos,{timeout: 10000});
        },
        actualiza:function(datos){
            return $http.put(api + 'tickets', datos,{timeout: 10000});
        }
    }
});


app.factory("facturacionExpress", function($q,$http,find,api){
    return{
        actualizaFolio:function(datos){
            return $http.put(api + 'facturacionExpress/actualizaFolio', datos,{timeout: 10000});
        },
        autorizados:function(datos){
            return $http.post(api + 'facturacionExpress/autorizados', datos,{timeout: 10000});
        },
        captura:function(datos){
            return $http.post(api + 'facturacionExpress/captura', datos,{timeout: 100000});
        },
        capturaAjustador:function(datos){
            return $http.post(api + 'facturacionExpress/capturaAjustador', datos,{timeout: 10000});
        },
        capturaCuestionario:function(datos){
            return $http.post(api + 'facturacionExpress/capturaCuestionario', datos,{timeout: 10000});
        },
        rechazados:function(datos){
            return $http.post(api + 'facturacionExpress/rechazados', datos,{timeout: 10000});
        },
        solicitarAutorizacion:function(datos){
            return $http.post(api + 'facturacionExpress/solicitarAutorizacion', datos,{timeout: 10000});
        },
        solicitarAutorizacionRechazos:function(datos){
            return $http.post(api + 'facturacionExpress/solicitarAutorizacionRechazos', datos,{timeout: 10000});
        },
        solicitados:function(datos){
            return $http.post(api + 'facturacionExpress/solicitados', datos,{timeout: 10000});
        }
    }
});


app.factory("ticketpagos", function($q,$http,find,api){
    return{
        guardar:function(datos){
            return $http.post(api + 'tickets/pagos', datos);
        },
        actualiza:function(datos){
            return $http.put(api + 'tickets/pagos', datos);
        }
    }
});

