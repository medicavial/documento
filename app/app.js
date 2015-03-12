//creamos la aplicacion
app = angular.module('app', ['ngRoute','angularFileUpload','ngCookies','ngAnimate','ngGrid','ngIdle','mgcrea.ngStrap','ngProgress']);

//configuramos las rutas y asignamos html y controlador segun la ruta
app.config(function($routeProvider, $idleProvider, $keepaliveProvider){

    //Configuramos la ruta que queremos el html que le toca y que controlador usara
	$routeProvider.when('/',{
			templateUrl: 'vistas/home.html',
			controller : 'homeCtrl'
	});

    $routeProvider.when('/altarechazo',{
            templateUrl   : 'vistas/altarechazo.html',
            controller    : 'altaRechazosCtrl'
    });

    $routeProvider.when('/archivo',{
            templateUrl   : 'vistas/archivo.html',
            controller    : 'archivoCtrl'
    });

    $routeProvider.when('/bloqueo',{
            templateUrl: 'vistas/bloqueo.html',
            controller : 'bloqueoCtrl'
    });

    $routeProvider.when('/captura',{
            templateUrl    :'vistas/captura.html',
            controller     :'capturaCtrl'
    });

    $routeProvider.when('/consulta',{
            templateUrl   : 'vistas/consulta.html',
            controller    : 'consultaCtrl'   
    });

    $routeProvider.when('/control',{
            templateUrl   : 'vistas/controldocumentos.html',
            controller    : 'controlDocumentosCtrl'   
    });

    $routeProvider.when('/consultaflujo',{
            templateUrl   : 'vistas/consultaflujo.html',
            controller    : 'consultaFlujoCtrl'   
    });

    $routeProvider.when('/cordinacion',{
            templateUrl    :'vistas/cordinacion.html',
            controller     :'cordinacionCtrl'
    });

    $routeProvider.when('/editaticket/:foliointerno/:folioweb',{
            templateUrl   : 'vistas/ticket.html',
            controller    : 'editaTicketCtrl'
    });

    $routeProvider.when('/entregas/:area',{
            templateUrl   : 'vistas/entregas.html',
            controller    : 'entregasCtrl'   
    });

    $routeProvider.when('/facturacion',{
            templateUrl    :'vistas/facturacion.html',
            controller     :'facturacionCtrl'
    });

    $routeProvider.when('/flujo',{
            templateUrl    :'vistas/flujo.html',
            controller     :'flujoCtrl'
    });

    $routeProvider.when('/flujopagos',{
            templateUrl   : 'vistas/flujopagos.html',
            controller    : 'flujoPagosCtrl'   
    });

    $routeProvider.when('/formatoqualitas',{
            templateUrl   : 'vistas/formatoqualitas.html',
            controller    : 'formatoQualitasCtrl'   
    });

    $routeProvider.when('/formatoqualitasconsulta',{
            templateUrl   : 'vistas/formatoqualitasconsulta.html',
            controller    : 'formatoQualitasConsultaCtrl'   
    });

    $routeProvider.when('/formatoqualitasarchivos',{
            templateUrl   : 'vistas/formatoqualitasarchivos.html',
            controller    : 'formatoQualitasArchivosCtrl'   
    });

    $routeProvider.when('/formatoqualitasenviado',{
            templateUrl   : 'vistas/formatoqualitasenviado.html',
            controller    : 'formatoQualitasEnviadoCtrl'   
    });

    $routeProvider.when('/formatoqualitasrechazados',{
            templateUrl   : 'vistas/formatoqualitasrechazados.html',
            controller    : 'formatoQualitasRechazadosCtrl'   
    });

    $routeProvider.when('/formatoqualitasincompletos',{
            templateUrl   : 'vistas/formatoqualitasincompletos.html',
            controller    : 'formatoQualitasIncompletosCtrl'   
    });


    $routeProvider.when('/generaticket',{
            templateUrl   : 'vistas/ticket.html',
            controller    : 'ticketCtrl'
    });

    $routeProvider.when('/historial/:folio/:etapa/:entrega',{
            templateUrl   : 'vistas/timeline.html',
            controller    : 'historialCtrl'        
    });

    $routeProvider.when('/infopase',{
            templateUrl   : 'vistas/infopase.html',
            controller    : 'infoPaseCtrl'
    });

    $routeProvider.when('/infopase/:folio',{
            templateUrl   : 'vistas/infopase.html',
            controller    : 'infoPaseCtrl'
    });

    $routeProvider.when('/listadoEntregas/:area',{
            templateUrl   : 'vistas/listadoentrega.html',
            controller    : 'listadoEntregasCtrl'        
    });

    $routeProvider.when('/listadoRecepcion/:area',{
            templateUrl   : 'vistas/listadoRecepcion.html',
            controller    : 'listadoRecepcionCtrl'      
    });

   $routeProvider.when('/login',{
            templateUrl   : 'vistas/login.html',
            controller    : 'loginCtrl'       
    });


   $routeProvider.when('/logout',{
            templateUrl   : 'vistas/adios.html',
            controller    : 'logoutCtrl'       
    });

   $routeProvider.when('/mapa',{
            templateUrl   : 'vistas/mapa.html',
            controller    : 'mapaCtrl'       
    });

   $routeProvider.when('/mesacontrol',{
            templateUrl   : 'vistas/menuRechazo.html',
            controller    : 'rechazosFolioCtrl'       
    });

   $routeProvider.when('/nopagar',{
            templateUrl   : 'vistas/listadoentreganpc.html',
            controller    : 'nopagarCtrl'        
    });

   $routeProvider.when('/pagos',{
            templateUrl   : 'vistas/pagos.html',
            controller    : 'pagosCtrl'       
    });

   $routeProvider.when('/Rechazos/:area',{
            templateUrl   : 'vistas/rechazos.html',
            controller    : 'rechazosCtrl'       
    });

   $routeProvider.when('/Recepcion',{
            templateUrl   : 'vistas/recepcion.html',
            controller    : 'recepcionCtrl'
    });

   $routeProvider.when('/seguimiento',{
            templateUrl   : 'vistas/seguimiento.html',
            controller    : 'seguimientoCtrl'
    });

   $routeProvider.when('/ticket',{
            templateUrl   : 'vistas/menuticket.html',
            controller    : 'menuticketCtrl'
    });

   $routeProvider.when('/traspasos/:area',{
            templateUrl   : 'vistas/traspasos.html',
            controller    : 'traspasosCtrl'
    });

    // ngClipProvider.setPath("lib/ZeroClipboard.swf");

	$routeProvider.otherwise({redirectTo:'/login'});

    //$locationProvider.html5Mode(true);

    $idleProvider.idleDuration(900); // tiempo en activarse el modo en reposo 
    $idleProvider.warningDuration(10); // tiempo que dura la alerta de sesion cerrada
    $keepaliveProvider.interval(10); // 

});


// app.config(['ngClipProvider', function(ngClipProvider) {
//     ngClipProvider.setPath("lib/ZeroClipboard.swf");
// }]);


// var notificaciones = new Firebase("https://medicavial.firebaseio.com/notificaciones");


//notificaciones que se ejecutan cuando la aplicacion inicia
app.run(function ($rootScope , auth ,$cookies, $cookieStore, $idle, $location){

    $rootScope.$on('$routeChangeStart', function(){
        //llamamos a checkStatus, el cual lo hemos definido en la factoria auth
        //la cuál hemos inyectado en la acción run de la aplicación
        $rootScope.username = $cookies.username;
        $rootScope.id = $cookies.id;
        $rootScope.areaUsuario = $cookies.areaUsuario;
        $rootScope.user = $cookies.user;
        $rootScope.userWeb = $cookies.userWeb;

        auth.checkStatus();
    });


    $rootScope.hoverIn = function(){
        $rootScope.hoverEdit = true;
    };

    $rootScope.hoverOut = function(){
        $rootScope.hoverEdit = false;
    };


    ///Esto es para ver notificaciones existentes aun es manual 


    // notificaciones.on('child_added',function(dataSnapshot){

    //     var valor = dataSnapshot.val();
    //     console.log(valor);

    // });


        // $rootScope.notifica = true;
        // $rootScope.noexiste = false;

        $rootScope.existen = true;
        $rootScope.mensaje = 'No hay ninguna notificación';
        $rootScope.notificaciones = []; //[{link:'#/Rechazos/Recepcion',titulo:'Folio(s) en Espera de Aceptaciòn',detalle:'Tienes 50 Folios(s) en espera de aceptación'},{link:'#/mensajes',titulo:'Vacaciones Semana Santa',detalle:'Se Informa que los dias 17 y 18 de abril no tendremos labores.'},{link:'#/Correos',titulo:'Nuevo Correo de Alguien',detalle:'Contenido del correo'}];
        $rootScope.push = $rootScope.notificaciones.length;


    ///mostramos los tooltip para mostrar los titulos abajo de cada elemento
    $('#tooltip1').tooltip({placement : 'bottom'});
    $('#tooltip2').tooltip({placement : 'bottom'});
    $('#tooltip3').tooltip({placement : 'bottom'});
    $('#tooltip4').tooltip({placement : 'bottom'});
    $('#tooltip5').tooltip({placement : 'bottom'});

    $('#busqueda').tooltip({placement : 'bottom'});
    $('#notificacion').tooltip({placement : 'bottom'});

    //mostramos las notificaciones en caso de tenerlas en el popover
    $('#notificacion').popover({
        trigger:'focus',
        placement : 'bottom',
        'html':true,
        title : 'Notificaciones',
        content :function() {
                    return $("#contenidonot").html();
                }
    });


    $('#notificacion').on('click',function(){
        $('#notificacion').popover('show')
    });


    // $rootScope.cargando=false;
    // $rootScope.loading=false;
    // $rootScope.label='Buscando Folios';

    //generamos al rootscope las variables que tenemos en las cookies para no perder la sesion 
    $rootScope.username = $cookies.username;
    $rootScope.id = $cookies.id;
    $rootScope.areaUsuario = $cookies.areaUsuario;
    $rootScope.user = $cookies.user;
    $rootScope.userWeb = $cookies.userWeb;

    //verificamos el estatus del usuario en la aplicacion
    $idle.watch();

    $rootScope.$on('$idleStart', function() {
        // the user appears to have gone idle  
        if($location.path() != "/login"){
            console.log('iniciando estado temporal'); 
        }                
    });

    $rootScope.$on('$idleWarn', function(e, countdown) {
        // follows after the $idleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling $idle.watch()
        if($location.path() != "/login"){
            //console.log('Cuidado se va a bloquear');
        }
         
    });

    $rootScope.$on('$idleTimeout', function() {
       //Entra en el estado de reposo cerramos session guardamos la ultima ruta en la que se encontraba
       //ademas de verificar si no estaban en la pagina del login ni en la de bloqueo 
        if($location.path() != "/login"){

            if ($location.path() != "/bloqueo") {

                $('#myModal2').modal('hide');
                $('#myModal').modal('hide');
                $rootScope.ruta = $location.path(); //Guardamos 
                $location.path('/bloqueo');
            };
        
        }
        
    })

    $rootScope.$on('$idleEnd', function() {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog 
         
        if($location.path() != "/login"){
            //console.log('llegaste bienvenido');
        }
    });

    $rootScope.$on('$keepalive', function() {
        // do something to keep the user's session alive
        if($location.path() != "/login"){
            //console.log('Activo en el sitio'); 
        }
        
    });

});


//factoria que controla la autentificación, devuelve un objeto
//$cookies para crear cookies
//$cookieStore para actualizar o eliminar
//$location para cargar otras rutas

app.factory("auth", function($cookies,$cookieStore,$location, $rootScope, $http)
{
    return{
        login : function(username, password)
        {   
            $('#boton').button('loading');
            $http({
                url:'/documento/api/login',
                method:'POST', 
                contentType: 'application/json', 
                dataType: "json", 
                data:{user:username,psw:password}
            }).success( function (data){
                
                $('#boton').button('reset');
                if(data.respuesta){
                    $rootScope.mensaje = data.respuesta;
                }else{
                    
                    //creamos la cookie con el nombre que nos han pasado
                    $cookies.username = data[0].nombre;
                    $cookies.id = data[0].clave;
                    $cookies.areaUsuario = data[0].area;
                    $cookies.user = data[0].usuario;
                    $cookies.userWeb = data[0].usuarioweb;

                    $rootScope.username = data[0].nombre;
                    $rootScope.id = data[0].clave;
                    $rootScope.areaUsuario = data[0].area;
                    $rootScope.user = data[0].usuario;
                    $rootScope.userWeb = data[0].usuarioweb;

                    //mandamos a la home o a la ventana que estaba antes de entrar a bloqueo
                    $('html').removeClass('lockscreen');
                    if ($rootScope.ruta != undefined){
                        
                        $location.path($rootScope.ruta);
                        $rootScope.ruta = '';
                        
                    }else{

                        $location.path("/");

                        if($rootScope.push > 0){
                            $('#myModal5').modal('show');
                        }

                    }
                    

                    if (navigator.geolocation) {

                        navigator.geolocation.getCurrentPosition(function (posicion){

                            $rootScope.localidad = posicion;
                            console.log($rootScope.localidad);

                        });
                        
                    };

                }
                
                //console.log(data);
            }).error( function (xhr,status,data){

                $('#boton').button('reset');
                alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

            });

            
        },
        logout : function()
        {
            //al hacer logout eliminamos la cookie con $cookieStore.remove y los rootscope
            $cookieStore.remove("username"),
            $cookieStore.remove("areaUsuario");
            $cookieStore.remove("id");
            $cookieStore.remove("user");
            $cookieStore.remove("userWeb");
            $rootScope.id = '';
            $rootScope.areaUsuario = '';
            $rootScope.user = '';
            $rootScope.username = '';
            //mandamos al login
            $location.path("/login");
        },
        checkStatus : function()
        {
            //creamos un array con las rutas que queremos controlar
            var rutasPrivadas = ["/","/login","/Recepcion", "/entregas/:area", "/listadoEntregas/:area", "/listadoRecepcion/:area" ,"/historial", "/Rechazos/:area"];
            if($location.path() != "/login" && typeof($cookies.username) == "undefined")
            {   
                $('html').removeClass('lockscreen');
                $location.path("/login");
            }
            //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
            if($location.path() == "/login" && typeof($cookies.username) != "undefined")
            {
                $location.path("/");
            }
        },
        in_array : function(needle, haystack)
        {
            var key = '';
            for(key in haystack)
            {
                if(haystack[key] == needle)
                {
                    return true;
                }
            }
            return false;
        }
    }
});

//Todas las consultas generadas al api por un servicio llamada find
app.factory("find", function($http){
    return{
        areaoperativa:function(){
            return $http.get('/documento/api/areas');
        },
        categorias:function(){
            return $http.get('/documento/api/categorias');
        },
        consultaFacturaQualitas:function(folio){
            return $http.get('/documento/api/facturasQualitasConsulta/' + folio);
        },
        detalleticket:function(folioint,folioweb){
            return $http.get('/documento/api/ticketinfo/' + folioint + '/' + folioweb);
        },
        empresas:function(){
            return $http.get('/documento/api/empresas');
        },
        empresasweb:function(){
            return $http.get('/documento/api/empresasweb');
        },
        escolaridad:function(){
            return $http.get('/documento/api/escolaridad');
        },
        folioweb:function(folio){
            return $http.get('/documento/api/folioweb/'+folio);
        },
        foliosxArea:function(area){
            return $http.get('/documento/api/folioactivoarea/'+area);
        },
        foliosxAreaxFecha:function(area,fechaini,fechafin){
            return $http.get('/documento/api/folioactivoareafecha/'+area+"/"+fechaini+"/"+fechafin);
        },
        listadoentrega:function(usuario){
            return $http.get('/documento/api/listaentrega/'+usuario);
        },
        listadofolio:function(folio){
            return $http.get('/documento/api/listaflujo/'+folio);
        },
        listadogeneral:function(usuario){
            return $http.get('/documento/api/listageneral/'+usuario);
        },
        listadogeneralnpc:function(usuario){
            return $http.get('/documento/api/listageneralnpc/'+usuario);
        },
        listadopagos:function(){
            return $http.get('/documento/api/listapagos');
        },
        listadorecepcion:function(usuario){
            return $http.get('/documento/api/listarecepcion/'+usuario);
        },
        listadorechazos:function(usuario){
            return $http.get('/documento/api/listarechazos/'+usuario);
        },
        listatickets:function(interno){
            return $http.get('/documento/api/listatickets/'+interno);
        },
        listaticketsfolio:function(folio){
            return $http.get('/documento/api/listaticketsfolio/'+folio);
        },
        muestrahistorico:function(folio,etapa,entrega){
            return $http.get('/documento/api/muestrahistorico/'+folio +"/"+etapa+"/"+entrega);
        },
        producto:function(empresa){
            return $http.get('/documento/api/producto/'+empresa);
        },
        productos:function(){
            return $http.get('/documento/api/productos');
        },
        rechazos:function(){
            return $http.get('/documento/api/rechazos');
        },
        recepcionxfolio:function(folio){
            return $http.get('/documento/api/recepcionfolios/'+folio);
        },
        recepcionxlesionado:function(lesionado){
            return $http.get('/documento/api/recepcionfoliosxlesionado/'+lesionado);
        },
        referenciaxunidad:function(unidad){
            return $http.get('/documento/api/referenciaunidad/'+unidad);
        },
        statusweb:function(){
            return $http.get('/documento/api/statusweb');
        },
        subcategorias:function(categoria){
            return $http.get('/documento/api/subcategorias/'+categoria);
        },
        ultimoticket:function(){
            return $http.get('/documento/api/ticket');
        },
        unidades:function(){
            return $http.get('/documento/api/unidades');
        },
        unidadesweb:function(){
            return $http.get('/documento/api/unidadesweb');
        },
        usuariosarea:function(area){
            return $http.get('/documento/api/usuariosarea/'+area);
        },
        usuariosweb:function(area){
            return $http.get('/documento/api/usuariosweb');
        },
        verificaetapaentrega:function(folio,etapa){
            return $http.get('/documento/api/verificaetapaentrega/'+folio +"/"+etapa);
        },
        verificafolio:function(folio,etapa){
            return $http.get('/documento/api/verificafolio/'+folio +"/"+etapa);
        },
        verificafoliopase:function(folio){
            return $http.get('/documento/api/verificafoliopase/'+folio);
        },
        verificaprefijo:function(prefijo,empresa){
            return $http.get('/documento/api/verificaprefijo/'+prefijo +"/"+empresa);
        }
    }
})

app.factory("loading", function($rootScope){
    return{
        cargando:function(mensaje){
            $rootScope.cargando=true;
            $rootScope.loading=true;
            $rootScope.label= mensaje;
        },
        mensaje:function(mensaje){
            $rootScope.loading=false;
            $rootScope.label= mensaje;
        },
        despedida:function(){
            $rootScope.cargando=false;
        },
        error:function(mensaje){
            $rootScope.error=true;
            $rootScope.label= mensaje;
        }
    }
})

app.factory("barra", function(ngProgress){
    return{
        inicia:function(){
            ngProgress.color('#4376F2');
            ngProgress.start();
        },
        termina:function(){
            ngProgress.complete();
        }
    }
})

app.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0;i<files.length;i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }                                       
            });
        }
    };
});

app.directive('ngKeydown', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
             // this next line will convert the string
             // function name into an actual function
             var functionToCall = scope.$eval(attrs.ngKeydown);
             elem.on('keydown', function(e){
                  // on the keydown event, call my function
                  // and pass it the keycode of the key
                  // that was pressed
                  // ex: if ENTER was pressed, e.which == 13
                  functionToCall(e);
             });
        }
    };
});

//funcion para convertir mayusculas
app.directive('capitalize', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                
                if (inputValue) {
                    
                    var capitalized = inputValue.toUpperCase();
                    if(capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }         
                    return capitalized;
                };

            }

            modelCtrl.$parsers.push(capitalize);

            if (modelCtrl.$modelValue.length > 0) {
                
                capitalize(scope[attrs.ngModel]);  
            }
        }
   };
});


app.directive('excel', function(){
    return {
        restrict: 'E',
        scope: true,
        scope: { info: '=' },
        template: '<button ng-click="click(info)" class="btn btn-success btn-lg glyphicon glyphicon-download-alt"> Exportar</button>',
        controller: function($scope, $element){

            $scope.click = function(info){

                var arrData = typeof info != 'object' ? JSON.parse(info) : info;
                var CSV = ''; 
                var ReportTitle ='';   
                //Set Report title in first row or line

                //CSV += ReportTitle + '\r\n\n';

                //This condition will generate the Label/Header
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    
                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";
                    
                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);
                    
                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {        
                    alert("Invalid data");
                    return;
                }   

                //Generate a file name
                var fileName = "Reporte_";
                //this will remove the blank-spaces from the title and replace it with an underscore
                fileName += ReportTitle.replace(/ /g,"_");   

                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension    

                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");    
                link.href = uri;

                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".CSV";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            }
        }
    }

});

app.directive('money', function () {

  var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

  function link(scope, el, attrs, ngModelCtrl) {
    var min = parseFloat(attrs.min || 0);
    var precision = parseFloat(attrs.precision || 2);
    var lastValidValue;

    function round(num) {
      var d = Math.pow(10, precision);
      return Math.round(num * d) / d;
    }

    function formatPrecision(value) {
      return parseFloat(value).toFixed(precision);
    }

    function formatViewValue(value) {
      return ngModelCtrl.$isEmpty(value) ? '' : '' + value;
    }


    ngModelCtrl.$parsers.push(function (value) {
      // Handle leading decimal point, like ".5"
      if (value.indexOf('.') === 0) {
        value = '0' + value;
      }

      // Allow "-" inputs only when min < 0
      if (value.indexOf('-') === 0) {
        if (min >= 0) {
          value = null;
          ngModelCtrl.$setViewValue('');
          ngModelCtrl.$render();
        } else if (value === '-') {
          value = '';
        }
      }

      var empty = ngModelCtrl.$isEmpty(value);
      if (empty || NUMBER_REGEXP.test(value)) {
        lastValidValue = (value === '')
          ? null
          : (empty ? value : parseFloat(value));
      } else {
        // Render the last valid input in the field
        ngModelCtrl.$setViewValue(formatViewValue(lastValidValue));
        ngModelCtrl.$render();
      }

      ngModelCtrl.$setValidity('number', true);
      return lastValidValue;
    });
    ngModelCtrl.$formatters.push(formatViewValue);

    var minValidator = function(value) {
      if (!ngModelCtrl.$isEmpty(value) && value < min) {
        ngModelCtrl.$setValidity('min', false);
        return undefined;
      } else {
        ngModelCtrl.$setValidity('min', true);
        return value;
      }
    };
    ngModelCtrl.$parsers.push(minValidator);
    ngModelCtrl.$formatters.push(minValidator);

    if (attrs.max) {
      var max = parseFloat(attrs.max);
      var maxValidator = function(value) {
        if (!ngModelCtrl.$isEmpty(value) && value > max) {
          ngModelCtrl.$setValidity('max', false);
          return undefined;
        } else {
          ngModelCtrl.$setValidity('max', true);
          return value;
        }
      };

      ngModelCtrl.$parsers.push(maxValidator);
      ngModelCtrl.$formatters.push(maxValidator);
    }

    // Round off
    if (precision > -1) {
      ngModelCtrl.$parsers.push(function (value) {
        return value ? round(value) : value;
      });
      ngModelCtrl.$formatters.push(function (value) {
        return value ? formatPrecision(value) : value;
      });
    }

    el.bind('blur', function () {
      var value = ngModelCtrl.$modelValue;
      if (value) {
        ngModelCtrl.$viewValue = formatPrecision(value);
        ngModelCtrl.$render();
      }
    });
  }

  return {
    restrict: 'A',
    require: 'ngModel',
    link: link
  };

});
 

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
                    modelCtrl.$setViewValue(nuevo);
                    modelCtrl.$render();
                    scope.$apply();
                    //functionToCall(modelCtrl.$modelValue);
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

                        if (e.keyCode >= 65 && e.keyCode <= 90) {

                            e.preventDefault();

                        }
                        // else if (e.keyCode == 13 || e.keyCode == 9) {

                        //     var nuevo = rellenaFolio(modelCtrl.$modelValue);
                        //     //console.log(nuevo);
                        //     modelCtrl.$setViewValue(nuevo);
                        //     modelCtrl.$render();
                        //     scope.$apply();
                        //     functionToCall(modelCtrl.$modelValue);
                                
                        // };     
                              
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