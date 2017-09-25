//configuramos las rutas y asignamos html y controlador segun la ruta
app.config(function($routeProvider, $idleProvider, $keepaliveProvider, $sceDelegateProvider){

    //configuramos ruta valida o de confinaza
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://medicavial.net/registro/**'
    ]);

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

    $routeProvider.when('/autorizados',{
            templateUrl    :'vistas/autorizados.html'
    });


    $routeProvider.when('/bloqueo',{
            templateUrl: 'vistas/bloqueo.html',
            controller : 'bloqueoCtrl'
    });

     $routeProvider.when('/busquedaFacFTP',{
            templateUrl   : 'vistas/busquedaFacFTP.html',
            controller    : 'facturaFtpCTRL',
    });

    $routeProvider.when('/captura',{
            templateUrl    :'vistas/captura.html',
            controller     :'capturaslCtrl',
            resolve:{
                datos:function(loading,carga,$rootScope){
                    loading.cargando('Cargando Informacón');
                    return carga.flujo($rootScope.id);
                }
            }
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

    $routeProvider.when('/facturacionEx',{
            templateUrl    :'vistas/facturacionEx.html',
            controller     :'facturacionExCtrl',
            resolve       :{
                datos:function(find,loading,$q){
                    loading.cargando('Cargando Informacion');
                    var promesa = $q.defer(),
                        empresas = find.empresasweb(),
                        triages = find.triages(),
                        riesgos = find.riesgos(),
                        posiciones = find.posiciones();

                    $q.all([empresas,triages,posiciones,riesgos]).then(function (data){
                        // console.log(data);
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/facturacionExBeta',{
            templateUrl    :'vistas/facturacionExBeta.html',
            controller     :'facturacionExBetaCtrl',
            resolve       :{
                datos:function(find,loading,$q){
                    loading.cargando('Cargando Informacion');
                    var promesa = $q.defer(),
                        empresas = find.empresasweb(),
                        triages = find.triages(),
                        riesgos = find.riesgos(),
                        posiciones = find.posiciones();

                    $q.all([empresas,triages,posiciones,riesgos]).then(function (data){
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/saceco',{
            templateUrl    :'vistas/saceco.html',
            controller     :'sacecoCtrl',
            resolve       :{
                datos:function(find,loading,$q){
                    loading.cargando('Cargando Informacion');
                    var promesa = $q.defer(),
                        empresas = find.empresasweb(),
                        triages = find.triages(),
                        riesgos = find.riesgos(),
                        posiciones = find.posiciones();

                    $q.all([empresas,triages,posiciones,riesgos]).then(function (data){
                        // console.log(data);
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/saceco/autorizadosSC',{
            templateUrl    :'vistas/autorizadosSC.html',
            controller     :'autorizadosSCCtrl',
             resolve       :{
                datos:function(find,loading,$q){
                    loading.cargando('Cargando Informacion');
                    var promesa = $q.defer(),
                        empresas = find.empresasweb(),
                        triages = find.triages(),
                        riesgos = find.riesgos(),
                        posiciones = find.posiciones();

                    $q.all([empresas,triages,posiciones,riesgos]).then(function (data){
                        // console.log(data);
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/facturacionEx/autorizados',{
            templateUrl    :'vistas/autorizados.html',
            controller     :'autorizadosCtrl',
            resolve       :{
                datos:function(facturacionExpress,loading,webStorage){
                    loading.cargando('Cargando Informacion');
                    var datos = JSON.parse( webStorage.local.get('facturacionExpressData') );
                    return facturacionExpress.autorizados(datos);
                }
            }
    });

    $routeProvider.when('/facturacionEx/rechazados',{
            templateUrl    :'vistas/rechazados.html',
            controller     :'rechazadosCtrl',
            resolve       :{
                datos:function(facturacionExpress,loading,webStorage){
                    loading.cargando('Cargando Informacion');
                    var datos = JSON.parse( webStorage.local.get('facturacionExpressData') );
                    return facturacionExpress.rechazados(datos);
                }
            }
    });


    $routeProvider.when('/facturacionEx/solicitados',{
            templateUrl    :'vistas/solicitados.html',
            controller     :'solicitadosCtrl',
            resolve       :{
                datos:function(facturacionExpress,loading,webStorage){
                    loading.cargando('Cargando Informacion');
                    var datos = JSON.parse( webStorage.local.get('facturacionExpressData') );
                    return facturacionExpress.solicitados(datos);
                }
            }
    });

    $routeProvider.when('/facturacionEx/cancelacion',{
            templateUrl    :'vistas/cancelacion.html',
            controller     :'cancelacionCtrl'
    });

    $routeProvider.when('/facturacionEx/cartas',{
            templateUrl    :'vistas/cartas.html',
            controller     :'cartasCtrl',
            resolve       :{
                datos:function(facturacionExpress,loading,webStorage){
                    loading.cargando('Cargando Informacion');
                    var datos = JSON.parse( webStorage.local.get('facturacionExpressData') );
                    return facturacionExpress.solicitados(datos);
                }
            }
    });

    $routeProvider.when('/edicionDatos',{
            templateUrl   : 'vistas/edicionDatos.html',
            controller    : 'edicionDatosCtrl',
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

    $routeProvider.when('/flujoManual',{
            templateUrl    :'vistas/flujoArea.html',
            controller     :'flujoAreaCtrl',
            resolve:{
                datos:function(loading,carga,$rootScope){
                    loading.cargando('Cargando Informacón');
                    return carga.flujo($rootScope.userM);
                }
            }
    });

    $routeProvider.when('/flujopagos',{
            templateUrl   : 'vistas/flujopagos.html',
            controller    : 'pagosCtrl',
            resolve       :{
                datos:function(loading,find,carga,$rootScope,$q,$http,api){

                    loading.cargando('Cargando información');
                    var info = {
                        fechainiPag:primerdiames,
                        fechafinPag:FechaAct,
                        unidad:'',
                        empresa:'',
                        folio:''
                    },
                    promesa = $q.defer(),
                    pagos = find.listaPagos(info),
                    info  = $http.get(api+'flujo/consulta/'+ $rootScope.id);

                    $q.all([info]).then(function (data){

                        // console.log(data);
                        var respuesta = {
                            activos:pagos,
                            rechazos:data[0].data.rechazos,
                            recepcion:data[0].data.xrecibir
                        }

                        promesa.resolve(respuesta);

                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/formatoqualitas',{
            templateUrl   : 'vistas/formatoqualitas.html',
            controller    : 'formatoQualitasCtrl'
    });

    $routeProvider.when('/formatoqualitasFacEx',{
            templateUrl   : 'vistas/formatoqualitasFacEx.html',
            controller    : 'formatoQualitasFacExCtrl'
    });

    $routeProvider.when('/formatoqualitasconsulta',{
            templateUrl   : 'vistas/formatoqualitasconsulta.html',
            controller    : 'formatoQualitasConsultaCtrl'
    });

    $routeProvider.when('/formatoqualitasFEconsulta',{
            templateUrl   : 'vistas/formatoqualitasFEconsulta.html',
            controller    : 'formatoQualitasFEconsultaCtrl'
    });

    $routeProvider.when('/formatoqualitasarchivos',{
            templateUrl   : 'vistas/formatoqualitasarchivos.html',
            controller    : 'formatoQualitasArchivosCtrl'
    });

    $routeProvider.when('/formatoqualitasFEarchivos',{
            templateUrl   : 'vistas/formatoqualitasFEarchivos.html',
            controller    : 'formatoQualitasFEarchivosCtrl'
    });

    $routeProvider.when('/formatoqualitasenviado',{
            templateUrl   : 'vistas/formatoqualitasenviado.html',
            controller    : 'formatoQualitasEnviadoCtrl'
    });

    $routeProvider.when('/formatoqualitasFEenviado',{
            templateUrl   : 'vistas/formatoqualitasFEenviado.html',
            controller    : 'formatoQualitasFEenviadoCtrl'
    });

    $routeProvider.when('/formatoqualitasrechazados',{
            templateUrl   : 'vistas/formatoqualitasrechazados.html',
            controller    : 'formatoQualitasRechazadosCtrl'
    });

    $routeProvider.when('/formatoqualitasFErechazados',{
            templateUrl   : 'vistas/formatoqualitasFErechazados.html',
            controller    : 'formatoQualitasFErechazadosCtrl'
    });

    $routeProvider.when('/formatoqualitasrenombrar',{
            templateUrl   : 'vistas/formatoqualitasrenombrar.html',
            controller    : 'formatoQualitasRenombrarCtrl'
    });

    $routeProvider.when('/formatoqualitasFErenombrar',{
            templateUrl   : 'vistas/formatoqualitasFErenombrar.html',
            controller    : 'formatoQualitasFErenombrarCtrl'
    });

    $routeProvider.when('/formatoqualitasincompletos',{
            templateUrl   : 'vistas/formatoqualitasincompletos.html',
            controller    : 'formatoQualitasIncompletosCtrl'
    });

    $routeProvider.when('/formatoqualitasFEincompletos',{
            templateUrl   : 'vistas/formatoqualitasFEincompletos.html',
            controller    : 'formatoQualitasFEincompletosCtrl'
    });

    $routeProvider.when('/reportes/facturas',{
            templateUrl   : 'vistas/reporteFacturas.html',
            controller    : 'reporteFacturasCtrl'
    });

    $routeProvider.when('/reportes/pagoUnidades',{
            templateUrl   : 'vistas/pagoUnidades.html',
            controller    : 'pagoUnidadesCtrl'
    });

    $routeProvider.when('/reportes/listadoPagos',{
            templateUrl   : 'vistas/listadoPagos.html',
            controller    : 'listadoPagosCtrl'
    });

    $routeProvider.when('/reportes/listadoSinDocumentacion',{
            templateUrl   : 'vistas/listadoSinDocumentacion.html',
            controller    : 'listadoSinDocumentacionCtrl'
    });

     $routeProvider.when('/reportes/listadoCedulasSinCapturar',{
            templateUrl   : 'vistas/listadoCedulasSinCapturar.html',
            controller    : 'listadoCedulasSinCapturarCtrl'
    });

    $routeProvider.when('/reportes/ticketsFE',{
            templateUrl   : 'vistas/ticketFE.html',
            controller    : 'ticketFECtrl'
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

    $routeProvider.when('/listadoEntregasAreas/:area',{
            templateUrl   : 'vistas/listadoentrega.html',
            controller    : 'listadoEntregasAreaCtrl',
            resolve       :{
                datos:function($rootScope,loading,find){
                    loading.cargando('Cargando Entregas');
                    return find.listadoentrega($rootScope.userM);
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

    $routeProvider.when('/listadoRecepcionarea/:area',{
            templateUrl   : 'vistas/listadoRecepcion.html',
            controller    : 'listadoRecepcionAreaCtrl',
            resolve       :{
                datos:function($rootScope,loading,find){
                    loading.cargando('Cargando Entregas');
                    return find.listadorecepcion($rootScope.userM);
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
                datos:function(loading,find,carga,$rootScope,$q,$http,api){

                    loading.cargando('Cargando información');
                    var info = {
                        fechainiPag:primerdiames,
                        fechafinPag:FechaAct
                    },

                    promesa = $q.defer(),
                    pagos = find.listaPagos(info),
                    info  = $http.get(api+'flujo/consulta/'+ $rootScope.id);

                    $q.all([info]).then(function (data){

                        var respuesta = {
                            activos:pagos,
                            rechazos:data[0].data.rechazos,
                            recepcion:data[0].data.xrecibir
                        }
                        promesa.resolve(respuesta);

                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/rechazados',{
            templateUrl    :'vistas/rechazados.html'
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

    $routeProvider.when('/Rechazosarea/:area',{
            templateUrl   : 'vistas/rechazos.html',
            controller    : 'rechazosAreaCtrl',
            resolve       :{
                datos:function(loading,find,$rootScope){
                    loading.cargando('Cargando rechazos');
                    return find.listadorechazos($rootScope.userM);
                }
            }
    });

    $routeProvider.when('/Recepcion',{
            templateUrl   : 'vistas/recepcion.html',
            controller    : 'recepcionCtrl',
            resolve:{
                datos:function(loading,carga,$rootScope){
                    loading.cargando('Cargando Información');
                    return carga.flujo($rootScope.id);
                }
            }
    });

    $routeProvider.when('/relaciona/globales',{
            templateUrl   : 'vistas/globales.html',
            controller    : 'globalesCtrl'
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
            controller    : 'menuticketCtrl'
            // resolve       :{
            //     datos:function($q,find,loading){

            //         loading.cargando('Cargando Tickets');

            //         var datos = {
            //             fechaini:FechaAct,
            //             fechafin:FechaAct
            //         }
            //         var promesa = $q.defer(),
            //             clientes = find.empresasweb(),
            //             status = find.statusweb(),
            //             unidades = find.unidadesweb(),
            //             usuarios = find.usuariosweb();

            //         $q.all([clientes,status,unidades,usuarios]).then(function (data){
            //             promesa.resolve(data);
            //         });

            //         return promesa.promise;
            //     }
            // }
    });

    $routeProvider.when('/ticket/:foliointerno/:folioweb',{
            templateUrl   : 'vistas/ticket.html',
            controller    : 'editaTicketCtrl',
            resolve       :{
                datos:function($q,find,loading,$route){

                    loading.cargando('Cargando Ticket');

                    var promesa = $q.defer(),
                        clientes = find.empresasweb(),
                        status = find.statusweb(),
                        unidades = find.unidadesweb(),
                        categorias = find.categorias(),
                        ticket = find.detalleticket($route.current.params.foliointerno,$route.current.params.folioweb);


                    $q.all([clientes,status,unidades,categorias,ticket]).then(function (data){
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/ticketpagos',{
            templateUrl   : 'vistas/menuticketPagos.html',
            controller    : 'menuticketPagosCtrl',
            resolve       :{
                datos:function($q,find,loading){

                    loading.cargando('Cargando Tickets');

                    var datos = {
                        fechaini:FechaAct,
                        fechafin:FechaAct
                    }
                    var promesa = $q.defer(),
                        clientes = find.empresasweb(),
                        status = find.statuspagos(),
                        unidades = find.unidadesweb(),
                        usuarios = find.usuariosweb(),
                        tickets = find.ticketspagosxfecha(datos);

                    $q.all([clientes,status,unidades,usuarios,tickets]).then(function (data){
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/ticketpagos/:foliointerno/:folioweb',{
            templateUrl   : 'vistas/ticketpagos.html',
            controller    : 'editaTicketPagosCtrl',
            resolve       :{
                datos:function($q,find,loading,$route){

                    loading.cargando('Cargando Ticket');

                    var promesa = $q.defer(),
                        clientes = find.empresasweb(),
                        status = find.statuspagos(),
                        unidades = find.unidadesweb(),
                        categorias = find.categoriaspagos(),
                        ticket = find.detalleticketpagos($route.current.params.foliointerno,$route.current.params.folioweb);


                    $q.all([clientes,status,unidades,categorias,ticket]).then(function (data){
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/traspasos/:area',{
            templateUrl   : 'vistas/traspasos.html',
            controller    : 'traspasosCtrl'
    });

    $routeProvider.when('/usuarios',{
            templateUrl   : 'vistas/usuarios.html',
            controller    : 'controllerUsuarios'
    });

    $routeProvider.when('/unidades',{
            templateUrl   : 'vistas/unidades.html',
            controller    : 'unidadCtrl'
    });

    $routeProvider.when('/cancelaSolicitud',{
            templateUrl   : 'vistas/cancelaSolicitud.html',
            controller    : 'cancelaSolCtrl'
    });

    ////////  codigo pagos ////
    ///
    $routeProvider.when('/detalleAtencion/:folio',{
            templateUrl   : 'vistas/detalleFactura.html',
            controller    : 'detalleFacturaCtrl'
    });

    $routeProvider.when('/detalleAtencionZima/:folio',{
            templateUrl   : 'vistas/detalleFacturaZima.html',
            controller    : 'detalleFacturaZimaCtrl'
    });

    $routeProvider.when('/controlFacturas',{
            templateUrl   : 'vistas/controlFacturas.html',
            controller    : 'controlFacturasCtrl'
    });

    $routeProvider.when('/controlFacturasZima',{
            templateUrl   : 'vistas/controlFacturasZima.html',
            controller    : 'controlFacturasZimaCtrl'
    });

    $routeProvider.when('/pagoManual',{
            templateUrl   : 'vistas/pagoManual.html',
            controller    : 'pagoManualCtrl'
    });

    $routeProvider.when('/ordenPago',{
            templateUrl   : 'vistas/ordenPago.html',
            controller    : 'ordenPagosCtrl'
    });

    $routeProvider.when('/detallerelacion/:relacion',{
            templateUrl   : 'vistas/detallerelacion.html',
            controller    : 'detalleRelacionCtrl'
    });

    $routeProvider.when('/subeFactura',{
            templateUrl   : 'vistas/subeFactura.html',
            controller    : 'subeFacturaCtrl'
    });

    $routeProvider.when('/altaproveedor',{
            templateUrl   : 'vistas/altaProveedores.html',
            controller    : 'altaProveedorCtrl'

    });

    $routeProvider.when('/listadosinFactura',{
            templateUrl   : 'vistas/listadosinFactura.html',
            controller    : 'listadosinFacturaCtrl'

    });

    $routeProvider.when('/listadoManual',{
            templateUrl   : 'vistas/listadoManual.html',
            controller    : 'listadoManualCtrl'

    });

    $routeProvider.when('/notaCredito',{
            templateUrl   : 'vistas/notaCredito.html',
            controller    : 'notaCreditoCtrl'

    });

    $routeProvider.when('/pagoPropias',{
            templateUrl   : 'vistas/pagoPropias.html',
            controller    : 'pagoPropiasCtrl'

    });

    $routeProvider.when('/buscaFacturas',{
            templateUrl   : 'vistas/buscaFactura.html',
            controller    : 'buscaFacturaCtrl'

    });

    $routeProvider.when('/relaciona',{
            templateUrl   : 'vistas/relacion.html',
            controller    : 'relacionCtrl',
            resolve       :{
                datos:function($q,find,loading){

                    loading.cargando('Cargando Folios');

                    var datos = {
                        fechaini:FechaAct,
                        fechafin:FechaAct
                    }
                    var promesa = $q.defer(),
                        clientes = find.empresasweb(),
                        status = find.statuspagos(),
                        unidades = find.unidadesweb(),
                        usuarios = find.usuariosweb(),
                        tickets = find.ticketspagosxfecha(datos);

                    $q.all([clientes,status,unidades,usuarios,tickets]).then(function (data){
                        promesa.resolve(data);
                    });

                    return promesa.promise;
                }
            }
    });

    $routeProvider.when('/relacionNP',{
        templateUrl   : 'vistas/relacionNoPagada.html',
        controller    : 'relacionNoPagadaCtrl',
        resolve       :{
            datos:function($q,find,loading){

                loading.cargando('Cargando Folios');

                var datos = {
                    fechaini:FechaAct,
                    fechafin:FechaAct
                }
                var promesa = $q.defer(),
                    clientes = find.empresasweb(),
                    status = find.statuspagos(),
                    unidades = find.unidadesweb(),
                    usuarios = find.usuariosweb(),
                    tickets = find.ticketspagosxfecha(datos);

                $q.all([clientes,status,unidades,usuarios,tickets]).then(function (data){
                    promesa.resolve(data);
                });

                return promesa.promise;
            }
        }
    });

    $routeProvider.when('/subirDocumentos',{
            templateUrl   : 'vistas/subirDocumentos.html',
            controller    : 'subirDocumentosCtrl'

    });

    $routeProvider.when('/documentosDigitales',{
            templateUrl   : 'vistas/documentosDigitales.html',
            controller    : 'documentosDigitalesCtrl'

    });

    $routeProvider.when('/listadoRecepcionPagos',{
            templateUrl   : 'vistas/reporteRecepcionPagos.html',
            controller    : 'listadoRecepcionPagoCtrl'

    });

    $routeProvider.when('/pagosSinrelacion',{
            templateUrl   : 'vistas/listadosinRelacion.html',
            controller    : 'listadosinRelacionCtrl'

    });


    // ngClipProvider.setPath("lib/ZeroClipboard.swf");

    $routeProvider.otherwise({redirectTo:'/login'});

    //$locationProvider.html5Mode(true);

    $idleProvider.idleDuration(2700); // tiempo en activarse el modo en reposo
    $idleProvider.warningDuration(10); // tiempo que dura la alerta de sesion cerrada
    $keepaliveProvider.interval(10); //

});
