//creamos la aplicacion
var app = angular.module('app', [
    'ngRoute',
    'angularFileUpload',
    'ngAnimate',
    'ngGrid',
    'ngIdle',
    'ngProgress',
    'webStorageModule',
    'datatables'
]);

app.constant('api','http://localhost/apimv/public/api/')

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

    $routeProvider.when('/generaticketpago',{
            templateUrl   : 'vistas/ticketPagos.html',
            controller    : 'ticketPagoCtrl'
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
            templateUrl   : 'vistas/mesacontrol.html',
            controller    : 'mesaControlCtrl'       
    });

   $routeProvider.when('/pagosrechazos',{
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

