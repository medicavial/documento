//Area de facturacion
function facturacionExCtrl($scope, $rootScope, $filter, find , loading, checkFolios,datos,$timeout,facturacionExpress,webStorage,operacion,tickets){


	$rootScope.tituloFE = 'Facturación Express 2.0';
    $scope.clientes = datos[0].data;
    $scope.triages = datos[1].data;
    $scope.posiciones = datos[2].data;
    $scope.riesgos = datos[3].data;

    loading.despedida();
    var expediente;

	$scope.inicio = function(){

        $scope.datos = {
            cliente:7,
            fechaini:primerdiames,
            fechafin:FechaAct
        }

        $scope.criterio = '';
        $scope.unidad = '';
        $scope.digital = '';

        $scope.consultaPendientes();


	}

    $scope.nuevoTicket = function(){

        $scope.ticket = {
            folioweb:expediente,
            folioIn:'',
            cliente:'',
            unidad:'',
            etapa:'',
            categoria:'',
            subcategoria:'',
            statusa:'',
            asignado:'',
            fechaasignado:'',
            notas:'',
            comunicacion:'',
            fechacomunica:'',
            observaciones:'',
            diagnostico:false,
            firma:false,
            notamedica:false,
            finiquito:false,
            refactura:false,
            pase:false,
            suministro:false,
            identificacion:false,
            verificacion:false,
            notamedicain:false,
            informe:false,
            reverso:false,
            verificapar:false,
            nocoincide:false,
            pasemedico:false,
            nombrein:false,
            folioseg:false,
            sinpase:false,
            fueravigencia:false,
            sinpoliza:false,
            sindeducible:false,
            cedulaT:false,
            cedulaI:false,
            sincuestionario:false,
            firmamedico:false,
            cruce:false,
            usuario:$rootScope.userWeb,
            usuariomv:$rootScope.id
        }

        $scope.ultimoTicket();
    }

    $scope.ultimoTicket = function(){
        find.ultimoticket().success(function (data){
            $scope.ticket.folioIn = Number(data) + 1; 
        });
    }

    $scope.regresar = function(){
        $scope.edicion = false;
    }

    //funcion para capturar cuestionario
    $scope.enviarCuestionario = function(){
        
        if ($scope.cuestionario.pase == '') {

            $('#botonCue').button('loading');

            operacion.capturaCuestionario($scope.cuestionario).success(function (data){
                $scope.vistaCuestionario = false;
                $scope.sinCuestionario = false;
                $('#botonCue').button('loading');
            }) 
            

        }else{

            alert('Por favor captura primero antes de capturar cuestionario');
        }
        
    }

    // guardamos ticket generado
    $scope.guardaTicket = function(){

        $('#botonGuardaTodo').button('loading');
        $scope.mensaje = '';

        tickets.guardar($scope.ticket).success( function (data){

            $scope.mensajeTicket = 'Folio registrado correctamente con el ticket ' + $scope.ticket.folioIn;
            $scope.tipoalerta = 'alert-success';
            $('#botonGuardaTodo').button('reset');            
            $scope.nuevoTicket();

        }).error( function (data){
            
            $scope.original.folio = '';
            $scope.mensajeTicket = 'Ocurrio un error al guardar el ticket intenta registrarlo de forma independiente';
            $scope.tipoalerta = 'alert-warning';
            $('#botonGuardaTodo').button('reset');

        });

    }


    //consulta de medicos segun la unidad 
    $scope.buscaMedicos = function(unidad){
        
        find.medicos(unidad).success(function (data){
            $scope.medicos = data;
        });

    }


    //consulta de ajustadores segun la compañia 
    $scope.buscaAjustadores = function(id){
        
        find.ajustadores(id).success(function (data){
            $scope.ajustadores = data;
        });

    }

    //consulta tipos de lesion existentes
    $scope.buscaTipoLesiones = function(id){
        
        find.tiposLesion(id).success(function (data){
            $scope.tipoLesiones = data;
        });

    }

    // busca la lesion segun el tipo de lesion 
    $scope.buscaLesiones = function(id){
        find.lesiones(id).success(function (data){
            $scope.lesiones = data;
        });
    }

    //verifica el tabulador 
    $scope.verificaTabulador = function(lesion){

        find.tabulador(lesion.LES_claveEmp,expediente).success(function (data){
            $scope.captura.claveTabulador = data.claveTabulador;
            $scope.captura.importe = data.importe;
            $scope.tabuladorListo  = true;
        }).error(function (data){
            alert('Intenta ingresar la lesion nuevamente por favor');
        });

    }

    $scope.imagen = function(archivo){
        //se obtiene la extension del archivo
        var extn = archivo.split(".").pop();

        if (extn == 'jpg' || extn == 'jpeg' || extn == 'png' || extn == 'PNG' ) {
            return true;
        }else{
            return false;
        }
    }

    $scope.file = function(archivo){
        //se obtiene la extension del archivo
        var extn = archivo.split(".").pop();
        if (extn == 'pdf' || extn == 'PDF') {
            return true;
        }else{
            return false;
        }
    }


    $scope.verificaDatos = function(){

        if ($scope.capturaForm.$valid && $scope.tabuladorListo == true && $scope.captura.Ajustador != '') {
            return false
        }else{
            return true;
        }

    }


    //consultamos lo que tenemos pendiente de mandar de axa 
    $scope.consultaPendientes = function(){

        loading.cargando('Cargando Información');

        webStorage.local.add('facturacionExpressData', JSON.stringify($scope.datos));

        find.foliosFePendientes($scope.datos).success(function (data){
            // console.log(data);
            $scope.listado = data.listado;
            $scope.rechazados = data.numeros.Rechazados;
            $scope.autorizados = data.numeros.AutorizadoNoFacturado;
            $scope.solicitados = data.numeros.XAutorizar;
            loading.despedida();

        }).error(function (data){

            alert('Surgio un problema intente nuevamente');
            loading.despedida();

        });
        
    }

    //////LLena el grid y toma filtros

    ///filtros

    $scope.selectos = [];

    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: false
    };

    var csvOpts = { columnOverrides: { obj: function (o) {
        return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
        } },
        iEUrl: 'downloads/download_as_csv'
    };

    var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';


    //aqui cargamos el detalle del folio e inicializamos valores
    $scope.onDblClickRow = function(row){
        
        $scope.sinCaptura = true;
        $scope.bloqueoLesion = false;

        loading.cargando('Cargando detalle de folio');
        expediente = row.entity.Exp_folio;

        find.recepcionxfolio(expediente).success(function (data){
            console.log(data);
            if (data.length > 0) {
                $scope.sinCaptura = false;
            };
        });

        find.detalleFolioWeb(expediente).success(function (data){

            loading.despedida();

            $scope.edicion = false;
            $scope.vistaArchivos = false;
            $scope.vistaCuestionario = false;
            $scope.sinCuestionario = true;
            $scope.tabuladorListo  = false;
            $scope.nuevoAjustador = false;
            $scope.ocultaBotones = false;
            $scope.rotar = false;
            $scope.vistaTicket = false;
            
            $scope.buscaAjustadores(data.captura.EMPClave);
            $scope.buscaMedicos(data.captura.UNIClave);

            $scope.autorizacion = {
                usuario:$rootScope.userWeb,
                folio:expediente
            }

            //verificamos el tipo lesion segun cliente producto y localidad segun sea el caso 
            if ( (data.captura.EMPClave == 43) || (data.captura.EMPClave == 44) ){
                $scope.tipoLes = 1;
            }else if ( data.captura.EMPClave == 20 && data.captura.PROClave == 9){
                $scope.tipoLes = 8;
            }else if (data.captura.PROClave == 4) {
                $scope.tipoLes = 2;
            }else if ( data.captura.PROClave == 2 && ( data.captura.EMPClave == 12 || data.captura.EMPClave == 8) && data.captura.Localidad != 99 ){
                $scope.tipoLes = 5;
            }else if  ( data.captura.PROClave == 6 || data.captura.PROClave == 8 ){
                $scope.tipoLes = 3;
            }else{
                if ( data.captura.EMPClave == 22 || data.captura.EMPClave == 24 ) {
                    $scope.tipoLes = 7;
                }else{
                    $scope.tipoLes = 6;
                }
            }


            //verificamos las lesiones disponibles segun el tipo
            $scope.buscaTipoLesiones($scope.tipoLes);

            
            $scope.cuestionario = { 

                tipoCuestionario:6,
                pregunta38:'',
                pregunta39:'',
                pregunta40:'',
                pregunta41:'',
                pregunta42:'',
                pregunta43:'',
                pregunta44:'',
                pregunta45:'',
                pregunta46:'',
                pregunta47:'',
                pregunta48:'',
                telefono:'',
                pase : '',
                folio:expediente,
                usuario:$rootScope.id
            }

            $scope.mensajeAut = '';
            $scope.mensaje = '';
            $scope.detalle = data;
            $scope.captura = data.captura;
            $scope.suministros = data.suministros;
            $scope.edicion = true;
            $scope.vistaArchivos = false;
            $scope.captura.triage = String(data.captura.triage);
            $scope.captura.MedicoMV = String(data.captura.MedicoMV);
            $scope.captura.RIEClave = String(data.captura.RIEClave);
            console.log($scope.datos.cliente);

            //verificamos cliente para condiciones de texto
            if ($scope.datos.cliente == 19) {

                $scope.SiniestroMin = 11;
                $scope.SiniestroMax = 11;

                $scope.PolizaMin = 10;
                $scope.PolizaMax = 10;

                $scope.ReporteMin = 11;
                $scope.ReporteMax = 11;

                $scope.FolioElecMin = 12;
                $scope.FolioElecMax = 12;
                $scope.textoAutorizacion = 'Generar Factura';

                $scope.validaCobertura($scope.captura.RIEClave);

            }else{

                $scope.SiniestroMin = '';
                $scope.SiniestroMax = 100;

                $scope.PolizaMin = '';
                $scope.PolizaMax = 100;

                $scope.ReporteMin = '';
                $scope.ReporteMax = 100;

                $scope.FolioElecMin = '';
                $scope.FolioElecMax = 100;

                $scope.textoAutorizacion = 'Solicitar Autorización';

            }

            if (data.hospitalario.length > 0 && $scope.datos.cliente == 19) {
                alert('La Atención Tiene Salida de Paquete');
                $scope.captura.tipoLes = '5';
                $scope.buscaLesiones('5');
                $scope.bloqueoLesion = true;
            };

            $scope.captura.POSClave = data.captura.POSClave == null ? '4' :String(data.captura.POSClave);
            $scope.procesado = false;
        });
      
    };

    $scope.validafecha = function(){

        var fecha1 = moment($scope.captura.FExpedicion, 'DD/MM/YYYY');
        var fecha2 = moment($scope.captura.FAtencion, 'DD/MM/YYYY');
        
        if(fecha1 > fecha2){
            $scope.captura.FExpedicion = FechaAct;
            alert('La fecha no debe ser mayor a la fecha de atencion ' + fecha2);
        }
    }

    // al dar click selecciona el tipo de documento que quiere ver 
    $scope.muestraArchivos  = function(archivos){

        $scope.vistaArchivos = false;
        //se crea un delay por que carge la imagen de forma correcta
        $timeout(function(){
            $scope.archivos = archivos;
            $scope.vistaArchivos = true;
        }, 1000);

    }

    $scope.validaCobertura = function(riesgo){
        
        if (riesgo == '1' || riesgo == '5') {
            $scope.cobertura = '4';
        }else if (riesgo == '10') {
            $scope.cobertura = '13';
        }else if (riesgo == '2') {
            $scope.cobertura = '15';
        }else if (riesgo == '8') {
            $scope.cobertura = '3';
        }else if (riesgo == '9') {
            $scope.cobertura = '18';
        }else{
            $scope.cobertura = '';
        }

    }


    //obtiene la ruta de las imagenes que se solicitaron
    $scope.obtenerFrame = function(src) {
        return 'http://medicavial.net/registro/' + src;
    };

    //captura de ajustador nuevo

    $scope.guardaAjustador = function(){

        if ($scope.ajustador == '') {

            alert('Debes ingresar ajustador')
        }else{

            //validamos que realmente no exista el ajustador haciendo filtro en la lista que tenemos
            var encontrados = $filter('filter')($scope.ajustadores, $scope.ajustador);

            if (encontrados.length == 0) {

                var info = {
                    nombre:$scope.ajustador,
                    cliente:$scope.captura.EMPClave
                }

                facturacionExpress.capturaAjustador(info).success(function (data){
                    $scope.captura.Ajustador = data;
                    $scope.ocultaBotones = true;
                });

            }else{
                alert('Este ajustador ya se encuentra registrado consultalo en la lista');
            }


            // console.log(encontrados);

        }

    }


    //guarda captura
    $scope.capturaFE = function(){

        $('#botonAct').button('loading');

        $scope.detalle.expediente.poliza = $scope.captura.Poliza;
        $scope.detalle.expediente.siniestro = $scope.captura.Siniestro;
        $scope.detalle.expediente.reporte = $scope.captura.Reporte;


        var datos = {
            folio:expediente,
            captura:$scope.captura,
            suministros:$scope.suministros,
            usuario:$rootScope.id
        };


        //actualizamos datos en web para verificar que la informacion este actualizada
        facturacionExpress.actualizaFolio($scope.detalle.expediente).success(function (data){

            //despues de que todo salio bien en web guardamos en proceso interno la captura de FE
            facturacionExpress.captura(datos).success(function (data){
                
                $('#botonAct').button('reset');
                $scope.mensaje = data.respuesta;
                $scope.cuestionario.pase = data.clavePase;
                //quitamos el true de sinCaptura por que ya esta capturado XD 
                $scope.sinCaptura = false;
                // $('#DatosModal').modal('hide');

            }).error(function (data){
                alert('Surgio un problema intente nuevamente');
                $('#botonAct').button('reset');
            })

        }).error(function (data){
            alert('Surgio un problema intente nuevamente');
            $('#botonAct').button('reset');
        })
    }

    //aqui se solicita autorización
    $scope.solicitaAut = function(){

        $('#botonAut').button('loading');

        facturacionExpress.solicitarAutorizacion($scope.autorizacion).success(function (data){

            $('#botonAut').button('reset');
            $scope.mensajeAut = data.respuesta;
            $scope.consultaPendientes();
            operacion.guardaImagenes(expediente);

            $scope.procesado = true;

        }).error(function (data){

            if (data.flash != undefined) {
                alert(data.flash);
            }else{
                alert('Surgio un problema intente nuevamente');
            }
            $('#botonAut').button('reset');
            $scope.procesado = true;
        });

    }



    ////opciones del grid                 
    $scope.gridOptions = { 
    	data: 'listado', 
    	enableColumnResize:true,
    	enablePinning: true, 
    	enableRowSelection:false,
    	multiSelect:false,
    	showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
    	enableCellSelection: true,
        plugins: [new ngGridCsvExportPlugin()],
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
        rowTemplate: rowTempl,
    	columnDefs: [
                    { field:'Exp_folio', displayName:'Folio', width: 120, pinned:true, enableCellEdit: false },
                    { field:'Exp_fecreg', displayName:'Fecha Atención', width: 120, pinned:false },
                    { field:'FExpedicion', displayName:'Fecha Expedición', width: 120, pinned:false },
                    { field:'UNI_nombreMV', displayName:'Unidad', width: 180, pinned:false },
                    { field:'DocumentosDigitales', displayName:'Digitalizado', width: 120, pinned:false },
                    { field:'EXP_fechaCaptura', displayName:'Fecha Captura', width: 120, pinned:false },
                    { field:'Exp_poliza', displayName:'Poliza', width: 120, pinned:false },
                    { field:'Exp_siniestro', displayName:'Siniestro', width: 120, pinned:false },
                    { field:'Exp_reporte', displayName:'Reporte', width: 120, pinned:false },
                    { field:'Exp_completo', displayName:'Lesionado', width: 250, pinned:false },
                    { field:'RIE_nombre', displayName:'Riesgo', width: 120, pinned:false },
                    { field:'Triage_nombre', displayName:'Triage', width: 120, pinned:false },
                    { field:'EXP_costoEmpresa', displayName:'Costo', width: 120, pinned:false },
                    { field:'UNI_propia', width: 120,visible:false}
        ],
        showFooter: true,
        showFilter:false
    };

    $scope.$on('ngGridEventRows', function (newFilterText){

    	var filas = newFilterText.targetScope.renderedRows;

    	$scope.exportables = [];

    	angular.forEach(filas , function(item){
    		$scope.exportables.push(item.entity);
    	});

    });

    $scope.filtra = function(){

    	//$scope.filterOptions.filterText = "";
    	//var filtro = "";
    	// console.log($scope.unidad);

    	if($scope.unidad == undefined || $scope.unidad == 0){
    		var objeto1 = "";
    	}else{
    		var objeto1 = "UNI_propia:" + $scope.unidad + "; ";
    	}

        if($scope.digital == undefined || $scope.digital == 0){
            var objeto2 = "";
        }else{
            var objeto2 = "DocumentosDigitales:" + $scope.digital + "; ";
        }

    	var filtro = objeto1 + objeto2 +  $scope.criterio;

    	$scope.filterOptions.filterText = filtro;

    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = ''; 
    	$scope.unidad = 0; 
    	$scope.cliente = 0;
    	$scope.folio = '';
    	$scope.fechaini = '';
    	$scope.fechafin = '';
    	$scope.lesionado = '';
    	$scope.foliosxarea();
    
    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);

    }

};

function solicitadosCtrl($scope, $rootScope, datos, loading){

    // console.log(datos);

    $rootScope.tituloFES = 'Folios Solicitados a Autorizar';
    loading.despedida();

    $scope.listado = datos.data;

    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectos, 
        filterOptions: $scope.filterOptions,
        // rowTemplate: rowTempl,
        columnDefs: [
                    { field:'Exp_folio', displayName:'Folio', width: 120, pinned:true, enableCellEdit: false },
                    { field:'Exp_fecreg', displayName:'Fecha Atención', width: 120, pinned:false },
                    // { field:'FExpedicion', displayName:'Fecha Expedición', width: 120, pinned:false },
                    { field:'UNI_nombreMV', displayName:'Unidad', width: 180, pinned:false },
                    // { field:'DocumentosDigitales', displayName:'Digitalizado', width: 120, pinned:false },
                    { field:'EXP_fechaCaptura', displayName:'Fecha Captura', width: 120, pinned:false },
                    { field:'Exp_poliza', displayName:'Poliza', width: 120, pinned:false },
                    { field:'Exp_siniestro', displayName:'Siniestro', width: 120, pinned:false },
                    { field:'Exp_reporte', displayName:'Reporte', width: 120, pinned:false },
                    { field:'Exp_completo', displayName:'Lesionado', width: 250, pinned:false },
                    { field:'RIE_nombre', displayName:'Riesgo', width: 120, pinned:false },
                    { field:'Triage_nombre', displayName:'Triage', width: 120, pinned:false },
                    { field:'EXP_costoEmpresa', displayName:'Costo', width: 120, pinned:false },
                    { field:'UNI_propia', width: 120,visible:false}
        ],
        showFooter: true,
        showFilter:false
    };
};

function cartasCtrl($scope, $rootScope, datos, loading,facturacionExpress,find,$filter){

    // console.log(datos);

    $scope.archivo='';
    var fecha=new Date();
    var ayer=new Date(fecha.getTime() - 24*60*60*1000);
    var mes='';
    $scope.criterio='';
    $scope.unidad='';
    $scope.digital='';
    $scope.origen='';
    if(ayer.getMonth()+1<10){
        mes='0'+parseInt(ayer.getMonth()+1);
    }
    $scope.fecha = ayer.getDate()+"/"+mes+"/"+ayer.getFullYear();
    $scope.fecha1 = ayer.getDate()+"/"+mes+"/"+ayer.getFullYear();    

    find.cartas($scope.fecha,$scope.fecha1).success( function (data){           
            $scope.listado =data;
            $scope.tipoalerta = 'alert-success';
            $scope.mensaje = data.respuesta;
            $('#boton').button('reset');
        }).error(function (data){
            $scope.tipoalerta = 'alert-warning';
            $scope.mensaje = 'Algo salio mal intentalo nuevamente';
            $('#boton').button('reset');
        })

    $rootScope.tituloFES = 'Cartas Qualitas';
    loading.despedida();

    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: false
    };

    var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';
    

    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectos, 
        filterOptions: $scope.filterOptions,
        rowTemplate: rowTempl,
        // rowTemplate: rowTempl,
        columnDefs: [
                    { field:'FOLIO', displayName:'Folio', width: 120, pinned:true, enableCellEdit: false },                    
                    { field:'NOMBRE', displayName:'Lesionado', width: 220, pinned:false },
                    { field:'UNI_nombreMV', displayName:'Unidad', width: 190, pinned:false },
                    { field:'Exp_fecreg', displayName:'Fecha Atención', width: 180, pinned:false },
                    // { field:'DocumentosDigitales', displayName:'Digitalizado', width: 120, pinned:false },                        
                    { field:'Folio_electronico', displayName:'Folio Electrónico', width: 140, pinned:false },
                    { field:'CEDULA', displayName:'Cedula Electrónica', width: 140, pinned:false },                    
                    { field:'Cont', displayName:'Pase Digitalizado', width: 130, pinned:false },                    
        ],
        showFooter: true,
        showFilter:false
    };

    $scope.onDblClickRow = function(row){
        //if(row.UNI_clave);        
        $('#myModal').modal();

        info = row.entity;
        if(info.UNI_clave==232||info.UNI_clave==249||info.UNI_clave==125||info.UNI_clave==110||info.UNI_clave==266||info.UNI_clave==65||info.UNI_clave==301){
            if(info.Arc_archivo!=null){
                $scope.archivo=info.Arc_archivo+'/'+info.Arc_clave;
            }else{
                $scope.archivo=null;
            }
        }else{
            $scope.archivo=info.Arc_archivo;    
        }
        console.log(info.Cont);        
    }
    $scope.obtenerFrame = function(src) {
        return 'http://medicavial.net/registro/' + src;
    };
     $scope.imagen = function(archivo){
        //se obtiene la extension del archivo
        if(archivo!=null){
            var extn = archivo.split(".").pop();

            if (extn == 'jpg' || extn == 'jpeg' || extn == 'png' || extn == 'PNG' || extn == 'JPG' ) {
                return true;
            }else{
                return false;
            }
        }else{
            return null;
        }
    }

    $scope.file = function(archivo){
        //se obtiene la extension del archivo
        if(archivo!=null){
            var extn = archivo.split(".").pop();
            if (extn == 'pdf' || extn == 'PDF') {
                return true;
            }else{
                return false;
            }
        }else{
            return null;
        }
    }

    //consultamos lo que tenemos pendiente de mandar de axa 
    $scope.consultaCartas = function(){

        loading.cargando('Cargando Información');

       find.cartas($scope.fecha, $scope.fecha1).success( function (data){           
            $scope.listado =data;
            $scope.tipoalerta = 'alert-success';
            $scope.mensaje = data.respuesta;
            $('#boton').button('reset');
            loading.despedida();
        }).error(function (data){
            $scope.tipoalerta = 'alert-warning';
            $scope.mensaje = 'Algo salio mal intentalo nuevamente';
            $('#boton').button('reset');
            loading.despedida();
        })   
    }

    $scope.$on('ngGridEventRows', function (newFilterText){

        var filas = newFilterText.targetScope.renderedRows;

        $scope.exportables = [];

        angular.forEach(filas , function(item){
            $scope.exportables.push(item.entity);
        });

    });

    $scope.filtra = function(){

        //$scope.filterOptions.filterText = "";
        //var filtro = "";
        // console.log($scope.unidad);

        if($scope.unidad == undefined || $scope.unidad == 0){
            var objeto1 = "";
        }else{
            var objeto1 = "UNI_propia:" + $scope.unidad + "; ";
        }

        if($scope.digital == undefined || $scope.digital == 0){
            var objeto2 = "";
        }else{
            var objeto2 = "DocumentosDigitales:" + $scope.digital + "; ";
        }

        if($scope.origen == undefined || $scope.origen == 0){
            var objeto3 = "";
        }else{
            var objeto3 = "SACE:" + $scope.origen + "; ";
        }

        var filtro = objeto1 + objeto2 + objeto3 + $scope.criterio;

        $scope.filterOptions.filterText = filtro;

        // console.log(filtro);

    }


};

function cancelacionCtrl($scope, $rootScope, loading,facturacionExpress,find,webStorage){
    $scope.folio='';
    $scope.nombre='';
    $scope.validacion= false;  
    $scope.usr = webStorage.session.get('userWeb');  
    $scope.datos={
        folioCancelar:'',
        motivoCat:'',
        motivo:'',
        folioSustituto:'',
        observaciciones:'',
        usr_login:$scope.usr
    }

    $scope.consultaFolio = function(){        
        $scope.datos ={'folio':$scope.folio,'nombre':$scope.nombre};
        loading.cargando('Cargando Información');
        if($scope.folio!='' || $scope.nombre!=''){
            find.folioDetalleCancel($scope.datos).success( function (data){           
                 $scope.listado =data;
                 loading.despedida();             
             }).error(function (data){
                 $scope.tipoalerta = 'alert-warning';
                 $scope.mensaje = 'Algo salio mal intentalo nuevamente';
                 $('#boton').button('reset');
                 loading.despedida();
             })   
            $scope.validacion= false;
        }else{
            $scope.validacion= true;
            loading.despedida();
        }        
    }

    var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectos, 
        filterOptions: $scope.filterOptions,
        rowTemplate: rowTempl,
        columnDefs: [
                    { field:'FOLIO', displayName:'Folio', width: 120, pinned:true, enableCellEdit: false },
                    { field:'FECHA_REGISTRO', displayName:'Fecha Atención', width: 120, pinned:false },
                    // { field:'FExpedicion', displayName:'Fecha Expedición', width: 120, pinned:false },
                    { field:'NOMBRE', displayName:'Nombre', width: 180, pinned:false },
                    // { field:'DocumentosDigitales', displayName:'Digitalizado', width: 120, pinned:false },
                    { field:'UNIDAD', displayName:'Unidad', width: 120, pinned:false },
                    { field:'COMPANIA', displayName:'Compañia', width: 120, pinned:false },
                    { field:'ESTATUS', displayName:'Estatus', width: 120, pinned:false },
                    { field:'MOTIVO_CANCELACION', displayName:'Motivo de cancelación', width: 120, pinned:false },
                    { field:'SOLICITUD_CANCELACION', displayName:'Solicitud de Cancelación', width: 250, pinned:false },
                    { field:'OBSERVACIONES', displayName:'Observaciones', width: 120, pinned:false },                   
        ],
        showFooter: true,
        showFilter:false
    };

    $scope.onDblClickRow = function(row){        
        $scope.datos.folioCancelar=row.entity.FOLIO;  
        console.log(row);     
        console.log(row.rowIndex);     
        $('#modalCancelacion').modal();
        
    }

    $scope.enviaDatosCancelacion = function(){  
        loading.cargando('Cargando Información');      
        facturacionExpress.cancelaFolio($scope.datos).success( function (data){
             loading.despedida();         
             console.log('Se canceló correctamente');    
        });    
    }

};



function autorizadosCtrl($scope, $rootScope, datos, loading){

    // console.log(datos);

    $rootScope.tituloFEA = 'Folios Autorizados';
    loading.despedida();

    $scope.listado = datos.data;

    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectos, 
        filterOptions: $scope.filterOptions,
        // rowTemplate: rowTempl,
        columnDefs: [
                    { field:'Exp_folio', displayName:'Folio', width: 120, pinned:true, enableCellEdit: false },
                    { field:'Exp_fecreg', displayName:'Fecha Atención', width: 120, pinned:false },
                    // { field:'FExpedicion', displayName:'Fecha Expedición', width: 120, pinned:false },
                    { field:'UNI_nombreMV', displayName:'Unidad', width: 180, pinned:false },
                    // { field:'DocumentosDigitales', displayName:'Digitalizado', width: 120, pinned:false },
                    { field:'EXP_fechaCaptura', displayName:'Fecha Captura', width: 120, pinned:false },
                    { field:'Exp_poliza', displayName:'Poliza', width: 120, pinned:false },
                    { field:'Exp_siniestro', displayName:'Siniestro', width: 120, pinned:false },
                    { field:'Exp_reporte', displayName:'Reporte', width: 120, pinned:false },
                    { field:'Exp_completo', displayName:'Lesionado', width: 250, pinned:false },
                    { field:'RIE_nombre', displayName:'Riesgo', width: 120, pinned:false },
                    { field:'Triage_nombre', displayName:'Triage', width: 120, pinned:false },
                    { field:'EXP_costoEmpresa', displayName:'Costo', width: 120, pinned:false },
                    { field:'UNI_propia', width: 120,visible:false}
        ],
        showFooter: true,
        showFilter:false
    };
};


function relacionCartasQualitasCtrl($scope, $rootScope, datos, loading, facturacionExpress){

    loading.despedida();
    


    $scope.inicio = function(){


        console.log(datos.data);
        $scope.listadoCartas    = datos.data;
        $scope.folioBusqueda    = '';
        $scope.nombreBusqueda   = '';
        $scope.cargador         = false;  
        $scope.cargador1        = false; 
        $scope.mensaje='';   

        $scope.datosFolio = {
            nombre : '',
            unidad : ''
        }

        $scope.datosRelacion = {
            nombreCedula : '',
            nombreRegistro : ''
        } 

        $scope.mjs='';
        $scope.msjExito= '';


        $scope.conusultaFolioSinCeluda();
    }


    $scope.conusultaFolioSinCeluda = function(cedula){
       facturacionExpress.buscaFoliosSinCedula().success( function (data){
            $scope.unidades = data;       
        });
    }

    $scope.abrirVentana= function(folioAut){
           url = "http://172.17.10.9/PDFCQ/"+folioAut+".pdf";        
           return popitup(url);
    }

    $scope.abrirVentanaRelacion= function(ruta,nomArchivo,unidad){
        
            if(unidad==232||unidad==249||unidad==125||unidad==110||unidad==266||unidad==65||unidad==185||unidad==269)   {
                url = "http://medicavial.net/registro/"+ruta+'/'+nomArchivo;             
            }else{
                url = "http://medicavial.net/registro/"+ruta;             
            }                
           return popitup(url);
    }


    $scope.buscaRelacion = function(cedula){
        $('#relacionaFolio').modal();
        $scope.listado='';
        $scope.cedula =cedula; 
        console.log($scope.cedula);
        $scope.datosFolio.nombre = $scope.cedula.CQ_paciente;  
    }

    $scope.busquedaFolio = function(){
         $scope.cargador         = true;
         $scope.mensaje='';
         console.log($scope.datosFolio);
         facturacionExpress.buscaDatosFolio($scope.datosFolio).success( function (data){
            console.log(data);      
            if(data.length>0){
                $scope.mensaje='';
                $scope.listado = data;
            }else{
               $scope.listado = ''; 
               $scope.mensaje = 'No hay resultados para la búsqueda'; 
            } 
            $scope.cargador         = false;
        });
    }

    var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectos, 
        filterOptions: $scope.filterOptions,
        rowTemplate: rowTempl,
        columnDefs: [
                    { field:'Exp_folio', displayName:'Folio', width: 120, pinned:true, enableCellEdit: false },
                    { field:'Exp_nombre', displayName:'Nombre', width: 120, pinned:false},
                    { field:'EXP_paterno', displayName:'Paterno', width: 120, pinned:false},
                    { field:'EXP_materno', displayName: 'Materno', width: 120, pinned:false},
                    { field:'Exp_fecreg', displayName:'Fecha Atención', width: 120, pinned:false },
                    // { field:'FExpedicion', displayName:'Fecha Expedición', width: 120, pinned:false },
                    { field:'Uni_nombrecorto', displayName:'Unidad', width: 180, pinned:false },
                    // { field:'DocumentosDigitales', displayName:'Digitalizado', width: 120, pinned:false },                  
                    { field:'Exp_poliza', displayName:'Poliza', width: 120, pinned:false },
                    { field:'Exp_siniestro', displayName:'Siniestro', width: 120, pinned:false },
                    { field:'Exp_reporte', displayName:'Reporte', width: 120, pinned:false },
                    { field:'EXP_regCompania', displayName:'Folio Electrónico', width: 120, pinned:false },                    
        ],
        showFooter: true,
        showFilter:false
    };

    $scope.buscarNombre = function(){        
        facturacionExpress.buscaPorNombre($scope.nombreBusqueda).success( function (data){
            console.log(data);       
        });
       
    }

    $scope.onDblClickRow = function(row){
        $scope.paseDigital = '';     
        $scope.msjExito='';   
        facturacionExpress.buscaPaseDig(row.entity.Exp_folio).success( function (data){
            $("#modalRelacion").modal();
            if (data.length>0) {                
                $scope.datosRelacion.nombreCedula = $scope.cedula.CQ_paciente;
                $scope.datosRelacion.nombreRegistro= row.entity.Exp_completo;
                $scope.datosRelacion.CQ_folio = $scope.cedula.CQ_folioautorizacion;
                $scope.datosRelacion.Exp_folio = row.entity.Exp_folio; 
                $scope.verPase=true;
                $scope.paseDigital = data;
                console.log($scope.paseDigital);
            }else{
                $scope.datosRelacion.nombreCedula = $scope.cedula.CQ_paciente;
                $scope.datosRelacion.nombreRegistro= row.entity.Exp_completo; 
                $scope.datosRelacion.CQ_folio = $scope.cedula.CQ_folioautorizacion;
                $scope.datosRelacion.Exp_folio = row.entity.Exp_folio; 
            }
            
        });    
       
    }

    $scope.guardarRelacion = function(){
        $scope.cargador1 = true; 
        $scope.msj='';
        $scope.msjExito = ''; 
        if($scope.datosRelacion.nombreCedula==$scope.datosRelacion.nombreRegistro){            
            facturacionExpress.guardarRelacionCartas($scope.datosRelacion).success( function (data){                       
               if(data!='error'){
                    console.log(data);
                    $scope.msjExito = '¡Correcto!. El folio relacionado es: '+data;
                    facturacionExpress.cedulasSinRelacion().success( function (data){
                        $scope.listadoCartas = data;
                        
                        $scope.cargador1 = false; 
                    });
                    
               }
            });    
            
        }else{
            $scope.msj='Los nombres deben ser iguales, modifica el nombre incorrecto';
            $scope.cargador1 = false; 
        }


        
       
    }
  
};

function capturadosSinFacturaCtrl($scope, $rootScope, datos, loading, facturacionExpress, webStorage){
    

    $rootScope.tituloFEA = 'Folios Autorizados';
    loading.despedida();

    $scope.listado = datos.data.listado;
    console.log($scope.listado);

    $scope.riesgos  = datos.data.riesgo;

    $scope.usr = webStorage.session.get('id');  

    console.log($scope.usr);

    $scope.captura={};
    $scope.verDocsPropias=true;

    var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectos, 
        filterOptions: $scope.filterOptions,
        rowTemplate: rowTempl,
        columnDefs: [
                    { field:'Exp_folio', displayName:'Folio', width: 100, pinned:true, enableCellEdit: false },
                    { field:'carta', displayName:'Con carta', width: 240, pinned:false },
                    { field:'UNI_nombreMV', displayName:'Unidad', width: 180, pinned:false },
                    { field:'Exp_fecreg', displayName:'Fecha Atención', width: 120, pinned:false },
                    // { field:'FExpedicion', displayName:'Fecha Expedición', width: 120, pinned:false },                    
                    // { field:'DocumentosDigitales', displayName:'Digitalizado', width: 120, pinned:false },
                    { field:'EXP_fechaCaptura', displayName:'Fecha Captura', width: 120, pinned:false },
                    { field:'Exp_poliza', displayName:'Poliza', width: 100, pinned:false },
                    { field:'Exp_siniestro', displayName:'Siniestro', width: 100, pinned:false },
                    { field:'Exp_reporte', displayName:'Reporte', width: 100, pinned:false },
                    { field:'Exp_completo', displayName:'Lesionado', width: 240, pinned:false },
                    // { field:'carta', displayName:'Carta', width: 80, pinned:false },
                    { field:'Exp_completo', displayName:'Lesionado', width: 240, pinned:false },
                    
                    // { field:'RIE_nombre', displayName:'Riesgo', width: 120, pinned:false },
                    // { field:'Triage_nombre', displayName:'Triage', width: 120, pinned:false },
                    // { field:'EXP_costoEmpresa', displayName:'Costo', width: 120, pinned:false },
                    // { field:'UNI_propia', width: 120,visible:false}
        ],
        showFooter: true,
        showFilter:false
    };
    $scope.onDblClickRow = function(row){       
        $scope.mensaje='';        
        if(row.entity.carta=='si'){
            if(row.entity.SACE=='SACE'){
                $scope.verDocsPropias=false;
            }else{
                $scope.verDocsPropias=true;
            }
            facturacionExpress.getCedula(row.entity.Exp_folio).success( function (data){
                $scope.datosCedula = data['cedula'];
                    console.log(data);
                    $scope.archivos = data['archivos'];
                    if($scope.datosCedula.CQ_folioautorizacion){

                        facturacionExpress.DatosCaptura(row.entity.Exp_folio).success( function (data){
                            console.log(data);
                            $('#myModal').modal();

                            if(data.length==0){
                                $scope.mensaje='El folio no está capturado';
                            }else{
                                if(!data[0].fac_folio){
                                    $scope.captura.Nombre= data[0].Afe_nombre;
                                    $scope.captura.Siniestro = $scope.datosCedula.CQ_siniestro;
                                    $scope.captura.Poliza = $scope.datosCedula.CQ_poliza;
                                    $scope.captura.Reporte = $scope.datosCedula.CQ_reporte;
                                    $scope.captura.RegCompania = $scope.datosCedula.CQ_folioelectronico;
                                    $scope.captura.cedulaElectronica = $scope.datosCedula.CQ_folioautorizacion;
                                    $scope.captura.RIEClave = data[0].rie_clave;
                                    $scope.captura.folio = row.entity.Exp_folio;
                                    $scope.captura.usr = $scope.usr;
                                    $scope.validaCobertura($scope.captura.RIEClave);

                                }else{
                                    $scope.mensaje='El folio ya está facturado';  
                                    $scope.captura.Nombre= data[0].Afe_nombre;
                                    $scope.captura.Siniestro = data[0].das_siniestro;
                                    $scope.captura.Poliza = data[0].das_poliza;
                                    $scope.captura.Reporte = data[0].das_reporte; 
                                    $scope.captura.RegCompania = data[0].FolioElect;
                                    $scope.captura.cedulaElectronica = data[0].Atencion;
                                    $scope.captura.RIEClave = data[0].rie_clave;
                                    $scope.captura.folio = row.entity.Exp_folio;
                                    $scope.captura.usr = $scope.usr;
                                    $scope.validaCobertura($scope.captura.RIEClave);

                                }
                            }
                        }).error(function (data){
                            $scope.tipoalerta = 'alert-warning';
                            $scope.mensaje = 'Algo salio mal intentalo nuevamente';
                            $('#boton').button('reset');
                        })

            }else{
                alert('No se encontró cédula');
            }


            }).error(function (data){
                $scope.tipoalerta = 'alert-warning';
                $scope.mensaje = 'Algo salio mal intentalo nuevamente';
                $('#boton').button('reset');
            })    
            
        }else{
             $('#sinAtencion').modal();
        }

        

    }

     $scope.file = function(archivo){
        //se obtiene la extension del archivo
        var extn = archivo.split(".").pop();
        if (extn == 'pdf' || extn == 'PDF') {
            return true;
        }else{
            return false;
        }
    }

    $scope.imagen = function(archivo){
        //se obtiene la extension del archivo
        var extn = archivo.split(".").pop();

        if (extn == 'jpg' || extn == 'jpeg' || extn == 'png' || extn == 'PNG' ) {
            return true;
        }else{
            return false;
        }
    }

    $scope.obtenerFrame = function(src) {
        return 'http://medicavial.net/registro/' + src;
    };


    $scope.validaCobertura = function(riesgo){
        
        if (riesgo == '1' || riesgo == '5') {
            $scope.cobertura = '4';
        }else if (riesgo == '10') {
            $scope.cobertura = '13';
        }else if (riesgo == '2') {
            $scope.cobertura = '15';
        }else if (riesgo == '8') {
            $scope.cobertura = '3';
        }else if (riesgo == '9') {
            $scope.cobertura = '18';
        }else{
            $scope.cobertura = '';
        }

    }


    $scope.guardaEdicionCaptura = function(){
        loading.cargando('Guardando datos');
        facturacionExpress.editaCaptura($scope.captura).success(function (data){            
            $('#botonAct').button('reset');
            if(data=='exito'){
                facturacionExpress.capNoFacturados().success( function (data){
                    console.log(data); 
                    $scope.listado = data.listado;
                    $scope.mensaje = 'Los datos del folio se modificaron correctamente';  
                    loading.despedida();                                             
                }).error(function (data){
                    $scope.tipoalerta = 'alert-warning';
                    $scope.mensaje = 'Algo salio mal intentalo nuevamente';
                    $('#boton').button('reset');
                })
            }            
           

        }).error(function (data){
            alert('Surgio un problema intente nuevamente');
            $('#botonAct').button('reset');
        })
    }


};


function rechazadosCtrl($scope, $rootScope, datos, loading,facturacionExpress){

    // console.log(datos);

    $scope.autorizar = function(){

        $('#boton').button('loading');

        $scope.mensaje = '';

        var datos = {
            folio:$scope.selectos,
            usuario:$rootScope.id
        }
        console.log(datos);

        facturacionExpress.solicitarAutorizacionRechazos(datos).success( function (data){
            $scope.tipoalerta = 'alert-success';
            $scope.mensaje = data.respuesta;
            $('#boton').button('reset');
        }).error(function (data){
            $scope.tipoalerta = 'alert-warning';
            $scope.mensaje = 'Algo salio mal intentalo nuevamente';
            $('#boton').button('reset');
        })
    }

    $rootScope.tituloFER = 'Folios Rechazados';
    loading.despedida();

    $scope.selectos = [];

    $scope.listado = datos.data;

    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:true,
        multiSelect:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectos, 
        filterOptions: $scope.filterOptions,
        // rowTemplate: rowTempl,
        columnDefs: [
                    { field:'Exp_folio', displayName:'Folio', width: 120, pinned:true, enableCellEdit: false },
                    { field:'Exp_motivoRechazo', displayName:'Motivo Rechazo', width: 400, pinned:false },
                    { field:'Exp_fechaRechazo', displayName:'Fecha Rechazo', width: 120, pinned:false },
                    { field:'Exp_fecreg', displayName:'Fecha Atención', width: 120, pinned:false },
                    { field:'UNI_nombreMV', displayName:'Unidad', width: 180, pinned:false },
                    { field:'EXP_fechaCaptura', displayName:'Fecha Captura', width: 120, pinned:false },
                    { field:'Exp_poliza', displayName:'Poliza', width: 120, pinned:false, enableCellEdit: true },
                    { field:'Exp_siniestro', displayName:'Siniestro', width: 120, pinned:false,  enableCellEdit: true },
                    { field:'Exp_reporte', displayName:'Reporte', width: 120, pinned:false,  enableCellEdit: true },
                    { field:'Exp_completo', displayName:'Lesionado', width: 250, pinned:false },
                    { field:'RIE_nombre', displayName:'Riesgo', width: 120, pinned:false },
                    { field:'Triage_nombre', displayName:'Triage', width: 120, pinned:false },
                    { field:'EXP_costoEmpresa', displayName:'Costo', width: 120, pinned:false },
                    { field:'UNI_propia', width: 120,visible:false}
        ],
        showFooter: true,
        showFilter:false
    };
};


function popitup(url)
{
    newwindow=window.open(url,'name','height=500,width=800,left=200, top=200'); 
    if (window.focus) {newwindow.focus()}
    return false;
}

facturacionExCtrl.$inject =['$scope', '$rootScope', '$filter', 'find', 'loading', 'checkFolios','datos','$timeout','facturacionExpress','webStorage','operacion','tickets'];
solicitadosCtrl.$inject =['$scope', '$rootScope', 'datos','loading'];
autorizadosCtrl.$inject =['$scope', '$rootScope', 'datos','loading'];
cartasCtrl.$inject =['$scope', '$rootScope', 'datos','loading','facturacionExpress','find'];
cancelacionCtrl.$inject =['$scope', '$rootScope','loading','facturacionExpress','find','webStorage'];
rechazadosCtrl.$inject =['$scope', '$rootScope', 'datos','loading','facturacionExpress'];
capturadosSinFacturaCtrl.$inject =['$scope', '$rootScope', 'datos','loading','facturacionExpress','webStorage'];
relacionCartasQualitasCtrl.$inject =['$scope', '$rootScope', 'datos','loading','facturacionExpress'];


app.controller('facturacionExCtrl',facturacionExCtrl);
app.controller('solicitadosCtrl',solicitadosCtrl);
app.controller('autorizadosCtrl',autorizadosCtrl);
app.controller('rechazadosCtrl',rechazadosCtrl);
app.controller('cartasCtrl',cartasCtrl);
app.controller('cancelacionCtrl',cancelacionCtrl);
app.controller('capturadosSinFacturaCtrl',capturadosSinFacturaCtrl);
app.controller('relacionCartasQualitasCtrl',relacionCartasQualitasCtrl);
