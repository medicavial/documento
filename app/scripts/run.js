//notificaciones que se ejecutan cuando la aplicacion inicia
app.run(function ($rootScope , Idle, $location, webStorage, auth, barra, webStorage){

    //generamos al rootscope las variables que tenemos en las cookies para no perder la sesion
    $rootScope.username = webStorage.session.get('username');
    $rootScope.id = webStorage.session.get('id');
    $rootScope.areaUsuario = webStorage.session.get('areaUsuario');
    $rootScope.area = webStorage.session.get('areaUsuario');
    $rootScope.user = webStorage.session.get('user');
    $rootScope.userWeb = webStorage.session.get('userWeb');

    //asignacion para administradores que verifican flujo de cada persona
    $rootScope.areaM = webStorage.session.get('areaManual');
    $rootScope.userM = webStorage.session.get('usuarioManual');

    //permisos del usuario
    $rootScope.FacturacionExpress = webStorage.session.get('FacturacionExpress');
    $rootScope.FlujoDocumentos = webStorage.session.get('FlujoDocumentos');
    $rootScope.FlujoManual = webStorage.session.get('FlujoManual');
    $rootScope.FlujoPagos = webStorage.session.get('FlujoPagos');
    $rootScope.FormatoQualitas = webStorage.session.get('FormatoQualitas');
    $rootScope.Reportes = webStorage.session.get('Reportes');
    $rootScope.Tickets = webStorage.session.get('Tickets');
    $rootScope.TicketsPagos = webStorage.session.get('TicketsPagos');
    $rootScope.ControlDocumentos = webStorage.session.get('ControlDocumentos');
    $rootScope.ConsultaIndividual = webStorage.session.get('ConsultaIndividual');
    $rootScope.Captura = webStorage.session.get('Captura');
    $rootScope.Usuarios = webStorage.session.get('Usuarios');


    $rootScope.$on('$routeChangeStart', function(){
        //llamamos a checkStatus, el cual lo hemos definido en la factoria auth
        //la cuál hemos inyectado en la acción run de la aplicación
        barra.inicia();
        auth.checkStatus();
        $rootScope.pagina = true;
            
    });

    $rootScope.$on('$routeChangeSuccess', function(){
        barra.termina();  
        $rootScope.pagina = false;
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


    //verificamos el estatus del usuario en la aplicacion
    Idle.watch();

    $rootScope.$on('IdleStart', function() {
        // the user appears to have gone idle

        if($location.path() != "/login"){
            // console.log('iniciando estado temporal');
        }
    });

    $rootScope.$on('IdleWarn', function(e, countdown) {
        // follows after the $idleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling $idle.watch()
        if($location.path() != "/login"){
            //console.log('Cuidado se va a bloquear');
        }

    });

    $rootScope.$on('IdleTimeout', function() {
       //Entra en el estado de reposo cerramos session guardamos la ultima ruta en la que se encontraba
       //ademas de verificar si no estaban en la pagina del login ni en la de bloqueo
        if($location.path() != "/login"){

            if ($location.path() != "/bloqueo") {

                $('#myModal').modal('hide');
                $('#myModal2').modal('hide');
                $('#myModal3').modal('hide');
                $('#myModal4').modal('hide');
                $('#myModal10').modal('hide');
                $rootScope.ruta = $location.path(); //Guardamos
                $location.path('/bloqueo');
            };

        }

    })

    $rootScope.$on('IdleEnd', function() {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog

        if($location.path() != "/login"){
            //console.log('llegaste bienvenido');
        }
    });

    $rootScope.$on('Keepalive', function() {
        // do something to keep the user's session alive
        if($location.path() != "/login"){
            //console.log('Activo en el sitio');
        }

    });


});