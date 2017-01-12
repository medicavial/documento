//Area de facturacion Express Fusion normal y nuevo
function facturacionExBetaCtrl($scope, $rootScope, $filter, find , loading, checkFolios,datos,$timeout,facturacionExpress,webStorage,operacion,tickets){

    $scope.tituloFEBeta = 'Facturacion Express 3.0';
    $scope.clientes = datos[0].data;
    $scope.triages = datos[1].data;
    $scope.posiciones = datos[2].data;
    $scope.riesgos = datos[3].data;
    $scope.usrWeb = sessionStorage.getItem("userWeb");    
    $scope.usrMV = sessionStorage.getItem("userWeb");
    $scope.verRespuesta=false;

    loading.despedida();

    var expediente;
    var atencion;
    var info;

	$scope.inicio = function(){

        $scope.datos = {
            cliente:'',
            fechaini:primerdiames,
            fechafin:FechaAct
        }

        $scope.criterio = '';
        $scope.unidad = '';
        $scope.digital = '';
        $scope.edicionFE = false;
        $scope.edicionSACE = false;
        $scope.checkUno=true;
        $scope.verMotivos=false;
        $scope.validaciones = {};

	}

	//consultamos lo que tenemos pendiente de mandar de axa 
    $scope.consultaPendientes = function(){

        loading.cargando('Cargando Información');

        webStorage.local.add('facturacionExpressData', JSON.stringify($scope.datos));

        find.foliosFeBetaPendientes($scope.datos).success(function (data){
            console.log(data);
            //estatus normal
            $scope.listado = data.listado;
            $scope.rechazados = data.numeros.Rechazados;
            $scope.autorizados = data.numeros.AutorizadoNoFacturado;
            $scope.solicitados = data.numeros.XAutorizar;

            //estatus SACE
            $scope.autorizadosSACE = data.numerosSACE.Autorizados;
            $scope.autorizadosSNCaptura = data.numerosSACE.AutorizadosSinCaptura;
            $scope.rechazadosSACE = data.numerosSACE.Rechazados;
            loading.despedida();

        }).error(function (data){

            alert('Surgio un problema intente nuevamente');
            loading.despedida();

        });
        
    }


    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: false
    };

    var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

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
                    { field:'UNI_nombreMV', displayName:'Unidad', width: 180, pinned:false },
                    { field:'DocumentosDigitales', displayName:'Digitalizado', width: 120, pinned:false },
                    { field:'SACE', displayName:'Origen', width: 120, pinned:false },
                    { field:'EstatusSACE', displayName:'EstatusSACE', width: 120, pinned:false },
                    { field:'Exp_poliza', displayName:'Poliza', width: 120, pinned:false },
                    { field:'Exp_siniestro', displayName:'Siniestro', width: 120, pinned:false },
                    { field:'Exp_reporte', displayName:'Reporte', width: 120, pinned:false },
                    { field:'Exp_completo', displayName:'Lesionado', width: 250, pinned:false },
                    { field:'RIE_nombre', displayName:'Riesgo', width: 120, pinned:false },
                    { field:'Triage_nombre', displayName:'Triage', width: 120, pinned:false },
                    { field:'FExpedicion', displayName:'Fecha Expedición', width: 120, pinned:false },
                    { field:'EXP_fechaCaptura', displayName:'Fecha Captura', width: 120, pinned:false },
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

        if($scope.origen == undefined || $scope.origen == 0){
            var objeto3 = "";
        }else{
            var objeto3 = "SACE:" + $scope.origen + "; ";
        }

    	var filtro = objeto1 + objeto2 + objeto3 + $scope.criterio;

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

    //aqui cargamos el detalle del folio e inicializamos valores
    $scope.onDblClickRow = function(row){
        
        $scope.sinCaptura = true;
        $scope.bloqueoLesion = false;

        loading.cargando('Cargando detalle de folio');
        info = row.entity;
        expediente = info.Exp_folio;
        atencion   = info.ATN_clave;

        find.recepcionxfolio(expediente).success(function (data){
            if (data.length > 0) {
                $scope.sinCaptura = false;
            };
        });

        //verificamos si es proveniente de sistema SACE
        if (info.SACE == 'SACE') {
            $scope.edicionSACE = true;

            find.detalleFolioSaceco(expediente, atencion).success(function (data){            
                loading.despedida();
                console.log(data);
                $scope.datosExpediente = data.expediente;            
                $scope.cveCia=data.expediente.claveEmpresa;
                $scope.tipLesion = data.lesion.TLE_claveint;

                $scope.edicion = false;
                $scope.vistaArchivosSACE = false;
                $scope.vistaCuestionario = false;
                $scope.sinCuestionario = true;
                $scope.tabuladorListo  = false;
                $scope.nuevoAjustador = false;
                $scope.ocultaBotones = false;
                $scope.rotar = false;            
                for (i = 0; i < data.anotaciones.length; i++) { 
                    if(data.anotaciones[i].REQ_valor =='Diagnostico'){
                        $scope.dx=data.anotaciones[i].ANT_valor;                    
                    }
                }       
                
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
                $scope.nomAtencion = data.atencion.TIA_nombre;            
                $scope.vistaArchivos = false;
                $scope.captura.triage = String(data.captura.triage);
                $scope.captura.MedicoMV = String(data.captura.MedicoMV);
                $scope.captura.RIEClave = String(data.captura.RIEClave);
                $scope.datos.cliente=data.captura.cliente;
                $scope.listDocmuento = data.documentos;
                $scope.motRechazo = data.motivoRechazo; 
                $scope.anotaciones= data.anotaciones;           
                $scope.estatusDocto='success';
                $scope.listArchivos = data.archivos;
                $scope.captura.Dx=$scope.dx; 
                if(data.lesion.LesE_clave){
                    console.log(data.lesion.LES_clave);
                    $scope.LesMV = data.lesion.lesionCIA; 
                    $scope.LESUnidad = data.lesion.LES_clave;              
                    $scope.verificaTabuladorOrigen($scope.LesMV);
                }
                $scope.captura.tipoLes= String($scope.tipLesion);
                 find.lesiones($scope.captura.tipoLes).success(function (data){
                    $scope.lesiones = data;
                    $scope.milesion = $filter('filter')( $scope.lesiones,{'LES_clave': $scope.LESUnidad });  
                    $scope.captura.Lesion = $scope.milesion[0];
                    console.log($scope.captura.Lesion);                               
                });  
                 
                   
                //$scope.captura.Lesion = $filter('filter')( $scope.lesionesUno,{'LES_claveEmp':'U_ECG1'});            
                //miArray = $scope.lesionesUno;
                
                for (contador in $scope.lesionesUno) {
                    console.log(contador);
                }
                
                //$scope.captura.Ajustador = String(data.expediente.cveAjustador);
                console.log($scope.captura.Lesion);
                $scope.nombreAjustador = data.expediente.ajustador;
                console.log($scope.captura.Ajustador);            

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

                }

                if (data.hospitalario.length > 0 && $scope.datos.cliente == 19) {
                    alert('La Atención Tiene Salida de Paquete');
                    $scope.captura.tipoLes = '5';
                    $scope.buscaLesiones('5');
                    $scope.bloqueoLesion = true;
                };

                $scope.captura.POSClave = data.captura.POSClave == null ? '4' :String(data.captura.POSClave);           

            });

        }else{

            $scope.edicionFE = true;

            find.detalleFolioWeb(expediente).success(function (data){

                loading.despedida();

                $scope.edicionFE = true;
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

        }

      
    };

    $scope.regresar = function(){
        $scope.edicionSACE = false;
        $scope.edicionFE = false;
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
            console.log($scope.ajustadores);
        });

    }

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

    //consulta tipos de lesion existentes
    $scope.buscaTipoLesiones = function(id){
        
        find.tiposLesion(id).success(function (data){
            console.log(data);
            $scope.tipoLesiones = data;
        });

    }

    // busca la lesion segun el tipo de lesion 
    $scope.buscaLesiones = function(id){
        find.lesiones(id).success(function (data){
            $scope.lesiones = data;
            console.log($scope.lesiones);
        });
    }

    //verifica el tabulador 
    $scope.verificaTabulador = function(lesion){

        find.tabulador(lesion.LES_claveEmp,expediente).success(function (data){
            console.log(data);
            $scope.captura.claveTabulador = data.claveTabulador;
            $scope.captura.importe = data.importe;
            $scope.tabuladorListo  = true;
        }).error(function (data){
            alert('Intenta ingresar la lesion nuevamente por favor');
        });

    }

    $scope.verificaTabuladorOrigen = function(lesion){

        find.tabulador(lesion,expediente).success(function (data){
            console.log(data);
            $scope.captura.claveTabulador = data.claveTabulador;
            $scope.captura.importe = data.importe;
            $scope.tabuladorListo  = true;
        }).error(function (data){
            alert('Intenta ingresar la lesion nuevamente por favor');
        });

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

    // al dar click selecciona el tipo de documento que quiere ver 
    $scope.muestraArchivos  = function(archivos){

        console.log('entro');
        console.log(info);
        if (info.SACE == 'FE') {

            $scope.vistaArchivos = false;
            //se crea un delay por que carge la imagen de forma correcta
            $timeout(function(){
                $scope.archivos = archivos;
                $scope.vistaArchivos = true;
            }, 1000);

        }else{
            
            $scope.vistaArchivosSACE = false;
            //se crea un delay por que carge la imagen de forma correcta
            $timeout(function(){
                $scope.mostrarArcTipoDoc = archivos;
                //$scope.archivos = archivos;
                $scope.vistaArchivosSACE = true;
            }, 1000);

        }


    }

    $scope.muestraArchivosTodos  = function(tipoDoc){       
        result = $scope.listArchivos.todos;
        console.log(result);
        archivos=[];
        /*for(var k in result) {           
              archivos.push(result);                        
        }*/

        //console.log(archivos);
        $scope.archvosTodos = result;

        $scope.vistaArchivosTodos = false;
        //se crea un delay por que carge la imagen de forma correcta
        $timeout(function(){
            $scope.mostrarArcTipoDoc=tipoDoc;
            //$scope.archivos = archivos;
            $scope.vistaArchivosTodos = true;
        }, 1000);

    }

    $scope.muestraTodosArchivos  = function(){       
        $scope.vistaTodosArchivos = true;
    }

    //obtiene la ruta de las imagenes que se solicitaron
    $scope.obtenerFrame = function(src) {
        return 'http://medicavial.net/registro/' + src;
    };

    //verifica si es imagen
    $scope.imagen = function(archivo){
        //se obtiene la extension del archivo
        var extn = archivo.split(".").pop();

        if (extn == 'jpg' || extn == 'jpeg' || extn == 'png' || extn == 'PNG' ) {
            return true;
        }else{
            return false;
        }
    }

    //verifica si es pdf
    $scope.file = function(archivo){
        //se obtiene la extension del archivo
        var extn = archivo.split(".").pop();
        if (extn == 'pdf' || extn == 'PDF') {
            return true;
        }else{
            return false;
        }
    }

    $scope.validafecha = function(){

        var fecha1 = moment($scope.captura.FExpedicion, 'DD/MM/YYYY');
        var fecha2 = moment($scope.captura.FAtencion, 'DD/MM/YYYY');
        
        if(fecha1 > fecha2){
            $scope.captura.FExpedicion = FechaAct;
            alert('La fecha no debe ser mayor a la fecha de atencion ' + fecha2);
        }
    }

    //verificamos la captura
    $scope.verificaDatos = function(){

        if ($scope.capturaForm.$valid && $scope.tabuladorListo == true && $scope.captura.Ajustador != '') {
            return false
        }else{
            return true;
        }

    }

    //guarda captura
    $scope.captura = function(){

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

        });
    
    }

    //aqui se solicita autorización de FE
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

    //veifcamos nuevo ticket
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

    //muestra el ultimo ticket
    $scope.ultimoTicket = function(){
        find.ultimoticket().success(function (data){
            $scope.ticket.folioIn = Number(data) + 1; 
        });
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

    //consultamos lo que tenemos pendiente de mandar de axa 
    $scope.validaEstatus = function(motivo,motivoDoc,cveDoc,arcEstatus,atdEstatus){        
        
        var listado = $scope.listDocmuento;
        var cont =1;  
        $scope.verGuardaTicket=0;
        $scope.verCaptura=1;         
        for (index = 0; index < listado.length; ++index) {
            value = listado[index].Arc_estatus;             
            if(value==2||value==0){
                $scope.verGuardaTicket=1; 
                $scope.verCaptura=2;      
            }                 
        }            
        for (index = 0; index < listado.length; ++index) {
            value = listado[index];            
            if(cveDoc==value['TID_clave']){
                if(value['Arc_estatus']==2||value['Arc_estatus']==0) {
                    cont=2;
                                                                  
                }
            }                          
        }                
        for (index = 0; index < listado.length; ++index) {
            value = listado[index];            
            if(cveDoc==value['TID_clave']){                
                value['ATD_estatus']=cont; 
                if(cont==1){
                   value['ATD_motivo']=''; 
                }
                if(value['Arc_estatus']==1){
                    value['Arc_motivo']='';
                }                                                                   
            }                          
        }
    
    }
    
    //consultamos lo que tenemos pendiente de mandar de axa 
    $scope.concatenarMotivo = function(motivo,motivoDoc,cveDoc,arcEstatus){        
        var listado = $scope.listDocmuento;          
        for (index = 0; index < listado.length; ++index) {
            value = listado[index]; 
            if(motivo!=undefined){
                if(value.TID_clave==cveDoc){
                    if(value.ATD_motivo==''||value.ATD_motivo==undefined){
                        value.ATD_motivo=motivo;    
                    }else{
                        value.ATD_motivo=value.ATD_motivo+', '+motivo;    
                    }
                    if(arcEstatus==2){
                        value.ATD_estatus=2;
                    }                
                    console.log(value.ATD_motivo); 
                }                                
            }              
        }        
    }

    $scope.cerrarVentana = function(){
        $scope.vistaArchivosSACE = false;

    }

    $scope.guardarValidacionDocumentos = function(){
        
        //var doctosVal = $scope.listDocmuento; 
        $scope.datosExpediente.usrMV=$scope.usrMV;

        var doctosVal = {
            doctos      :$scope.listDocmuento,
            user        :$scope.usrWeb,
            expediente  :$scope.datosExpediente
        };        
         loading.cargando('Actualizando Información');
        saceco.doctosValidados(doctosVal).success(function (data){
            if(data.respuesta=='exito'){
               if(data.imgs=='ok'){
                 operacion.guardaImagenes(data.fol);   
               }
            $("#myModal").modal("show");                
            }
            //$location.path("/saceco");
            loading.despedida();
            console.log(data);

        }).error(function (data){
            alert('Surgio un problema intente nuevamente');
            $('#botonAut').button('reset');
        });

    }

    $scope.recargarPagina = function(){
        
        // location.reload(true);
    }

};

facturacionExBetaCtrl.$inject = ['$scope', '$rootScope', '$filter', 'find', 'loading', 'checkFolios','datos','$timeout','facturacionExpress','webStorage','operacion','tickets'];

app.controller('facturacionExBetaCtrl',facturacionExBetaCtrl);
