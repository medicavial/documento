//servicio de chekeo de folios para las entregas verifica cada condicion 
app.factory("checkFolios", function($q,$http){
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
                    $http({
                        url:ruta,
                        method:'POST', 
                        contentType: 'application/json', 
                        dataType: "json", 
                        data:datos
                    }).success( function (data){

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

        }
    }
});


//servicio de chekeo de folios para las entregas verifica cada condicion 
app.factory("carga", function($q,$http,find){
    return{
        informacion:function(area){

            var promesa        = $q.defer(),
                cliente        = find.empresas(),
                unidades       = find.unidades(),
                productos      = find.productos(),
                areaOperativa  = find.areaoperativa(),
                escolaridad    = find.escolaridad();

            $q.all([cliente,unidades,productos,areaOperativa,escolaridad]).then(function(data) { 
                
                var datos = {
                    clientes:data[0].data,
                    unidades:data[1].data,
                    productos:data[2].data,
                    areaOperativa:data[3].data,
                    escolaridad:data[4].data
                }

                promesa.resolve(datos);
            });


            return promesa.promise;

        }
    }
});


//funcion para convertir mayusculas
app.directive('folio', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            var functionToCall = scope.$eval(attrs.folio);

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
                    modelCtrl.$setViewValue(nuevo);
                    modelCtrl.$render();
                    scope.$apply();
                };

            });

            element.on('keydown', function(e){

                var cantidad = modelCtrl.$modelValue.length;

                //los primero cuatro caracteres NO deben ser numeros
                if(cantidad <= 3){

                    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) {
                        e.preventDefault();
                    }else{
                        modelCtrl.$parsers.push(function (inputValue) {

                           if (inputValue == undefined) return '' 
                           var transformedInput = inputValue.toUpperCase();
                           if (transformedInput!=inputValue) {
                              modelCtrl.$setViewValue(transformedInput);
                              modelCtrl.$render();
                           }         

                           return transformedInput; 

                        });
                    }

                }

                //los ultimos 6 NO deben ser letras
                if(cantidad >= 4 && cantidad <= 9){

                    if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 106) {
                        e.preventDefault();
                    }

                }

                //Si son mas de 10 digitos no escribas mas
                if(cantidad >= 10){
                    
                    if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 106) {
                        e.preventDefault();
                    }else{
                      //console.log('Presionaste ' + e.keyCode);
                    } 

                }

                if (e.keyCode == 13 || e.keyCode == 9) {

                    if (cantidad > 4) {

                        var nuevo = rellenaFolio(modelCtrl.$modelValue);
                        modelCtrl.$setViewValue(nuevo);
                        modelCtrl.$render();
                        scope.$apply();
                        functionToCall(nuevo);
                              
                    };
                               
                }


            });

        }

    };
    
});
