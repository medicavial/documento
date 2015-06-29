//creamos la aplicacion
var app = angular.module('app', [
    'ngRoute',
    'angularFileUpload',
    'ngAnimate',
    'ngGrid',
    'ngIdle',
    'ngProgress',
    'webStorageModule'
]);

app.constant('api','http://localhost/apimv/public/api/')
// app.constant('api','http://172.17.10.15/apimv/public/api/')

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
            controller     :'facturacionCtrl',
            resolve:{
                datos:function(loading,carga,$rootScope){
                    loading.cargando('Cargando Informacón');
                    return carga.flujo($rootScope.id);
                }
            }
    });

    $routeProvider.when('/flujo',{
            templateUrl    :'vistas/flujo.html',
            controller     :'flujoCtrl',
            resolve:{
                datos:function(loading,carga,$rootScope){
                    loading.cargando('Cargando Informacón');
                    return carga.flujo($rootScope.id);
                }
            }
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

    $routeProvider.when('/generaticketpago',{
            templateUrl   : 'vistas/ticketPagos.html',
            controller    : 'ticketPagoCtrl'
    });

    $routeProvider.when('/historial/:folio/:etapa/:entrega',{
            templateUrl   : 'vistas/timeline.html',
            controller    : 'historialCtrl',
            resolve       :{
                datos:function($route,find,loading){
                    loading.cargando('Cargando Información');
                    var folio = $route.current.params.folio,
                        etapa = $route.current.params.etapa,
                        entrega = $route.current.params.entrega;
                   
                    return find.muestrahistorico(folio,etapa,entrega);
                }
            }        
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
            controller    : 'listadoEntregasCtrl',
            resolve       :{
                datos:function($rootScope,loading,find){
                    loading.cargando('Cargando Entregas');
                    return find.listadoentrega($rootScope.id);
                }
            }     
    });

    $routeProvider.when('/listadoRecepcion/:area',{
            templateUrl   : 'vistas/listadoRecepcion.html',
            controller    : 'listadoRecepcionCtrl',
            resolve       :{
                datos:function($rootScope,loading,find){
                    loading.cargando('Cargando Entregas');
                    return find.listadorecepcion($rootScope.id);
                }
            }     
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
            templateUrl   : 'vistas/mesacontrol.html',
            controller    : 'mesaControlCtrl',
            resolve       :{
                datos:function(loading,carga,$rootScope){
                    loading.cargando('Cargando Informacón');
                    return carga.flujo($rootScope.id);
                }
            }  
    });

    $routeProvider.when('/pagosrechazos',{
            templateUrl   : 'vistas/menuRechazo.html',
            controller    : 'rechazosFolioCtrl'       
    });

    $routeProvider.when('/nopagar',{
            templateUrl   : 'vistas/listadoentreganpc.html',
            controller    : 'nopagarCtrl',
            resolve       :{
                datos:function(loading,find,$rootScope){
                    loading.cargando('Cargando Informacón');
                    return find.listadogeneralnpc($rootScope.id);
                }
            }          
    });

    $routeProvider.when('/pagos',{
            templateUrl   : 'vistas/pagos.html',
            controller    : 'pagosCtrl',
            resolve       :{
                datos:function(loading,find,carga,$rootScope,$q){

                    loading.cargando('Cargando información');
                    var info = {
                        fechainiPag:primerdiames,
                        fechafinPag:FechaAct
                    },
                    promesa = $q.defer(),
                    pagos = find.listaPagos(info),
                    flujo = carga.flujo($rootScope.id);

                    $q.all([pagos,flujo]).then(function (data){
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }        
    });

    $routeProvider.when('/Rechazos/:area',{
            templateUrl   : 'vistas/rechazos.html',
            controller    : 'rechazosCtrl',
            resolve       :{
                datos:function(loading,find,$rootScope){
                    loading.cargando('Cargando rechazos');
                    return find.listadorechazos($rootScope.id);
                }
            }    
    });

    $routeProvider.when('/Recepcion',{
            templateUrl   : 'vistas/recepcion.html',
            controller    : 'recepcionCtrl',
            resolve:{
                datos:function(loading,carga,$rootScope){
                    loading.cargando('Cargando Informacón');
                    return carga.flujo($rootScope.id);
                }
            }
    });


    $routeProvider.when('/reportes',{
            templateUrl   : 'vistas/reportes.html'
    });

    $routeProvider.when('/reportes/tickets',{
            templateUrl   : 'vistas/reportestickets.html',
            controller    : 'reportesTicketsCtrl',
            resolve       :{
                datos:function(loading,find,$q){
                    loading.cargando('Cargando reporte');
                    var promesa = $q.defer(),
                        historico = find.reporteTickets(),
                        actual = find.reporteTicketsDia();

                    $q.all([actual,historico]).then(function (data){
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/seguimiento',{
            templateUrl   : 'vistas/seguimiento.html',
            controller    : 'seguimientoCtrl',
            resolve:{
                datos:function(loading,carga,$rootScope){
                    loading.cargando('Cargando Informacón');
                    return carga.flujo($rootScope.id);
                }
            }
    });

    $routeProvider.when('/ticket',{
            templateUrl   : 'vistas/menuticket.html',
            controller    : 'menuticketCtrl',
            resolve       :{
                datos:function($q,find,loading){

                    loading.cargando('Cargando Tickets');

                    var datos = {
                        fechaini:FechaAct,
                        fechafin:FechaAct
                    }
                    var promesa = $q.defer(),
                        clientes = find.empresasweb(),
                        status = find.statusweb(),
                        unidades = find.unidadesweb(),
                        usuarios = find.usuariosweb(),
                        tickets = find.ticketsxfecha(datos);

                    $q.all([clientes,status,unidades,usuarios,tickets]).then(function (data){
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/ticketpagos',{
            templateUrl   : 'vistas/menuticketPagos.html',
            controller    : 'menuticketPagosCtrl'
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



// var notificaciones = new Firebase("https://medicavial.firebaseio.com/notificaciones");


//notificaciones que se ejecutan cuando la aplicacion inicia
app.run(function ($rootScope , auth , $idle, $location, barra, webStorage){

    //generamos al rootscope las variables que tenemos en las cookies para no perder la sesion
    $rootScope.username = webStorage.session.get('username');
    $rootScope.id = webStorage.session.get('id');
    $rootScope.areaUsuario = webStorage.session.get('areaUsuario');
    $rootScope.user = webStorage.session.get('user');
    $rootScope.userWeb = webStorage.session.get('userWeb');


    $rootScope.$on('$routeChangeStart', function(){
        //llamamos a checkStatus, el cual lo hemos definido en la factoria auth
        //la cuál hemos inyectado en la acción run de la aplicación
        barra.inicia();
        auth.checkStatus();
			
    });

    $rootScope.$on('$routeChangeSuccess', function(){
        barra.termina();  
    });


    $rootScope.hoverIn = function(){
        $rootScope.hoverEdit = true;
    };

    $rootScope.hoverOut = function(){
        $rootScope.hoverEdit = false;
    };


    ///Esto es para ver notificaciones existentes aun es manual

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

                $('#myModal').modal('hide');
                $('#myModal2').modal('hide');
                $('#myModal3').modal('hide');
                $('#myModal4').modal('hide');
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

    $rootScope.logout = function(){
        auth.logout();
    }

});


//factoria que controla la autentificación, devuelve un objeto
//$cookies para crear cookies
//$cookieStore para actualizar o eliminar
//$location para cargar otras rutas

