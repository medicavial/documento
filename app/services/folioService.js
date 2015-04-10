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

                //Si es Etapa 2 o 3 y Etapa 1 no esta capturada
                if(documento.Etapa > 1 && documento.CapEt2 == 0){
                    foliosIn.push({msg:'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede entregar debido a que la etapa 1 no esta capturada'});
                }
                //Si se envia a Facturación y no es original ó ya fue enviado anteriormente manda mensaje de error
                //se agrego indexof(busca el contenido que se ponga aqui) por que javascript no soporta muchos && y || en un mismo if 
                else if( (documento.FaxOrigianl.indexOf('O') == -1  && areaRecibe == 5) || (areaRecibe == 5 && documento.FLD_AROent == 5 && documento.USU_ent != 'null')||(areaRecibe == 5 && documento.EnvFac == 'SI' && documento.Etapa == 1) ){
                    foliosIn.push({msg:'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede enviar a Facturación debido a que no es etapa 1 o ya fue mandado'});
                }

                //Si se envia a Facturación y no es etapa 1
                else if(areaRecibe == 5 && documento.Etapa > 1) {
                    foliosIn.push({msg:'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede enviar a Facturación debido a que no es etapa 1'});
                }

                //Si se envia a Facturación y no es mesa de control
                else if(areaRecibe == 5 && areaEntrega != 4) {
                    foliosIn.push({msg:'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede enviar a Facturación tu usuario no tiene permisos'});
                }

                //Si se envia a pagos y no es original 
                else if(areaRecibe == 6 && documento.EnvFac != 'SI' && documento.Etapa == 1) {

                    if(!confirm('El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se a enviado a Facturación. ¿Desea proseguir?')){                         
                        //si es facturacion agrega un juego mas al flujo
                        foliosIn.push({msg:'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puedo enviar a Facturación por que no es original'});
                    }else{
                        foliosVal.push(documento);
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
                        var ruta = '/documento/api/altaentrega';
                    }else{
                        var ruta = '/documento/api/actualizaentrega';                    
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
                    $http.post(ruta,datos)
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
            
            //verificamos si el folio tiene documento registrado
            if(datos.documento == 0){

                //Si es primera atencion
                if(datos.tipoDoc == 1){

                    //Verificamos que el folio no este dado de alta en documentos

                    //como es primera atencion se define como 1 el numero de entrega para la primera etapa (aunque solo debe ser 1 para la primera)
                    datos.numentrega = 1;

                    //verifica que el folio esta registrado en control de documentos
                    find.verificafolio(datos.folio, 1).success( function (data){

                        if(data){

                            error.mensaje = 'El folio ya se encuentra registrado en Control de Documentos';
                            error.tipoalerta = 'alert-danger';
                            promesa.reject(error);

                        }else{
                            
                            //Segunda validacion para verificar que no esta en la tabla pase o capturas
                            find.verificafoliopase(datos.folio).success( function (data){

                                if(data.respuesta){

                                    error.mensaje = data.respuesta;
                                    error.tipoalerta = 'alert-danger';
                                    promesa.reject(error);

                                }else{

                                    promesa.resolve({info:datos,agregaOriginal:1});
                                    
                                }
                                
                            });
                        }
                        
                    }).error( function (xhr,status,data){

                        alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

                    });
                    


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

                            if(datos.fecha < datos.fechafax){
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

                            if(datos.fecha < datos.fechafe){
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

                            datos.numentrega = Number(data.total) + 1;

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

                $http.post('/documento/api/eliminaentrega/'+ usuario,folios_validos).success(function (data){
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

                if (fecha > FechaAct) {

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
                escolaridad:'',
                fechafax: '',
                fechafe: '' ,
                internet:1 ,
                original:0,
                numentrega:1,
                incompleto:'',
                factura:'',
                totalfactura:'',
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

                console.log(data);

                if(interno){
                    //verificamos si es una segunda atencion o tercera pero la tercera es manual
                    if (interno.original == 1) {
                        
                        //segunda atencion
                        datos.tipoDoc = 2;
                        datos.bloqueo = true;
                        datos.bloqueoUni = false;
                        datos.esoriginal = 1;
                        
                    }else{

                        datos.documento = interno.clave;
                        //primera atencion
                        datos.tipoDoc = 1;

                        //verificamos que sea fax 
                        if(interno.fax == 1){
                            datos.label2 = 'FAX RECIBIDO: ' + interno.fechafax;
                            datos.fechafax = interno.fechafax;
                            datos.esfax = 1;
                        }
                        //verificamos que sea factura express
                        if(interno.fe == 1){
                            datos.label2 = 'FAC. EXPRESS: ' + interno.fefecha;
                            datos.fechafe = interno.fechafe;
                            datos.esfe = 1;
                        }

                        //asignamos bloqueos de campos
                        datos.bloqueo = true;
                        datos.bloqueoUni = true;
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

                    datos.cliente = String(web.Cia_claveMV);
                    datos.lesionado = web.Exp_completo;
                    datos.unidadref = String(web.UNI_claveMV);
                    datos.unidad = String(web.UNI_claveMV);
                    datos.producto = String(web.Pro_claveMV);
                    datos.escolaridad = String(web.Esc_claveMV);

                    datos.label2 = 'NO SE RECIBIO FAX';
                    datos.label3 = 'NO ES FAC. EXPRESS';

                    datos.tipoDoc = 1;
                    datos.esoriginal = 0;

                }

                promesa.resolve(datos);

            });

            return promesa.promise;
        }
    }
});


//servicio de chekeo de folios para las cargar busquedas por bloque y carga informacion del flujo
//por usuario
app.factory("carga", function($q,$http,find,api){
    return{
        informacion:function(){

            var promesa        = $q.defer(),
                cliente        = $http.get(api+'consulta/empresas'),
                unidades       = $http.get(api+'consulta/unidades'),
                productos      = $http.get(api+'consulta/productos'),
                escolaridad    = $http.get(api+'consulta/escolaridad'),
                areaOperativa  = $http.get(api+'consulta/areas');

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
                activos        = $http.get(api+'flujo/activos/'+usuario),
                rechazos       = $http.get(api+'flujo/rechazos/'+usuario);

            $q.all([activos,rechazos]).then(function(data) {
                var datos = {
                    activos:data[0].data,
                    rechazos:data[1].data
                }
                promesa.resolve(datos);

            }); 

            return promesa.promise;
        }
    }
});


//funcion para convertir a folios validos
app.directive('folio', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            //var functionToCall = scope.$eval(attrs.folio);

            //funcion que rellena folios 
            var rellenaFolio = function(folio){

                if (folio != '') {

                    var totalletras = folio.length;

                    var letras = folio.substr(0,4);
                    var numeros = folio.substr(4,totalletras);

                    if(letras.length < 4 ){

                        var faltantes = 4 - letras.length;

                        for (var i = 0; i < faltantes; i++) {

                          var letra = letras.charAt(i);
                          letras = letras + "0";
                        }
                    }

                    if(numeros.length < 6 ){

                        var faltantes = 6 - numeros.length;

                        for (var i = 0; i < faltantes; i++) {
                          
                          numeros = "0" + numeros;
                        }
                    }

                    folio = letras + numeros;

                    return folio;

                }else{

                    return folio

                }
            }

            element.on('blur',function(){

                if (modelCtrl.$modelValue.length > 3) {
                    var nuevo = rellenaFolio(modelCtrl.$modelValue);
                    modelCtrl.$setViewValue(nuevo.toUpperCase());
                    modelCtrl.$render();
                    scope.$apply();
                };

            });

            element.on('keydown', function(e){

                if (modelCtrl.$modelValue) {

                    var cantidad = modelCtrl.$modelValue.length;

                    //los primero cuatro caracteres NO deben ser numeros
                    if(cantidad < 4){

                        if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) {
                            e.preventDefault();
                        }else{

                            element.css("text-transform","uppercase");

                        }
                    //los ultimos 6 NO deben ser letras

                    }else if(cantidad > 3 && cantidad < 10){

                        if (e.keyCode >= 65 && e.keyCode <= 90) {
                            e.preventDefault();
                        }else if (e.keyCode == 13) {
                            // var nextinput = element.next('input');
                            // nextinput.focus();
                            var nuevo = rellenaFolio(modelCtrl.$modelValue);
                            modelCtrl.$setViewValue(nuevo.toUpperCase());
                            modelCtrl.$render();
                            scope.$apply();

                        }    
                              
                    }else{

                        if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 ) {
                            e.preventDefault();
                        }

                    }
                    
                };
            });



      }

    };
    
});

//funcion para convertir a folios validos con acciones que se ejecutan dando enter
app.directive('folioex', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            var functionToCall = scope.$eval(attrs.folioex);

            //funcion que rellena folios 
            var rellenaFolio = function(folio){

                if (folio != '') {

                    var totalletras = folio.length;

                    var letras = folio.substr(0,4);
                    var numeros = folio.substr(4,totalletras);

                    if(letras.length < 4 ){

                        var faltantes = 4 - letras.length;

                        for (var i = 0; i < faltantes; i++) {

                          var letra = letras.charAt(i);
                          letras = letras + "0";
                        }
                    }

                    if(numeros.length < 6 ){

                        var faltantes = 6 - numeros.length;

                        for (var i = 0; i < faltantes; i++) {
                          
                          numeros = "0" + numeros;
                        }
                    }

                    folio = letras + numeros;

                    return folio;

                }else{

                    return folio

                }
            }

            element.on('keydown', function(e){

                if (modelCtrl.$modelValue) {

                    var cantidad = modelCtrl.$modelValue.length;

                    //los primero cuatro caracteres NO deben ser numeros
                    if(cantidad < 4){

                        if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) {
                            e.preventDefault();
                        }else{

                            modelCtrl.$parsers.push(function (inputValue) {

                                if (inputValue){
                                    var transformedInput = inputValue.toUpperCase();
                                    if (transformedInput!=inputValue) {
                                        modelCtrl.$setViewValue(transformedInput);
                                        modelCtrl.$render();
                                    }         

                                    return transformedInput; 
                                }
                            });
                        }
                    //los ultimos 6 NO deben ser letras

                    }else if(cantidad > 3 && cantidad < 10){

                        if (e.keyCode == 9 || e.keyCode == 13) {

                            if (modelCtrl.$modelValue.length > 3) {
                                var nuevo = rellenaFolio(modelCtrl.$modelValue);
                                modelCtrl.$setViewValue(nuevo);
                                modelCtrl.$render();
                                scope.$apply();
                                functionToCall(modelCtrl.$modelValue);
                            };

                        }else if (e.keyCode >= 65 && e.keyCode <= 90) {

                            e.preventDefault();

                        }    
                              
                    }else{

                        if (e.keyCode == 13) {

                            if (modelCtrl.$modelValue.length > 3) {
                                var nuevo = rellenaFolio(modelCtrl.$modelValue);
                                modelCtrl.$setViewValue(nuevo);
                                modelCtrl.$render();
                                scope.$apply();
                                functionToCall(modelCtrl.$modelValue);
                            };

                        }else if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 ) {
                             e.preventDefault();
                        }

                    }
                    
                };
            });



      }

    };
    
});