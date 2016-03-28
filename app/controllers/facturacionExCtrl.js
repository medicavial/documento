//Area de facturacion
function facturacionExCtrl($scope, $rootScope, $filter, find , loading, checkFolios,datos,$timeout,facturacionExpress,webStorage){


	$rootScope.tituloFE = 'Facturación Express 2.0';
    $scope.clientes = datos[0].data;
    $scope.triages = datos[1].data;
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

        loading.cargando('Cargando detalle de folio');
        expediente = row.entity.Exp_folio;

        find.recepcionxfolio(expediente).success(function (data){
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
            
            $scope.buscaAjustadores(data.captura.EMPClave);

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

        });
      
    };

    // al dar click selecciona el tipo de documento que quiere ver 
    $scope.muestraArchivos  = function(archivos){

        $scope.vistaArchivos = false;
        //se crea un delay por que carge la imagen de forma correcta
        $timeout(function(){
            $scope.archivos = archivos;
            $scope.vistaArchivos = true;
        }, 1000);

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

        }).error(function (data){
            alert('Surgio un problema intente nuevamente');
            $('#botonAut').button('reset');
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

facturacionExCtrl.$inject =['$scope', '$rootScope', '$filter', 'find', 'loading', 'checkFolios','datos','$timeout','facturacionExpress','webStorage'];
solicitadosCtrl.$inject =['$scope', '$rootScope', 'datos','loading'];
autorizadosCtrl.$inject =['$scope', '$rootScope', 'datos','loading'];
rechazadosCtrl.$inject =['$scope', '$rootScope', 'datos','loading','facturacionExpress'];


app.controller('facturacionExCtrl',facturacionExCtrl);
app.controller('solicitadosCtrl',solicitadosCtrl);
app.controller('autorizadosCtrl',autorizadosCtrl);
app.controller('rechazadosCtrl',rechazadosCtrl);