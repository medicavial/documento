(function(){

    /** Sergio Alcala (2017)
    *Controlador de SACE
    *Une Facturacion express con Analisis 
    *Aqui se ven las Unidades de Red con sistema SACE y entran todas las compañias 
    *que usen el sistema 
    */

    'use strict';

    angular.module('app')
    .controller('sacecoCtrl',sacecoCtrl)
    .controller('solicitadosCtrl',solicitadosCtrl)
    .controller('autorizadosCtrl',autorizadosCtrl)
    .controller('rechazadosCtrl',rechazadosCtrl)

    sacecoCtrl.$inject =['$scope', '$rootScope', '$filter', 'find', 'loading', 'checkFolios','datos','$timeout','facturacionExpress','webStorage','saceco','operacion'];
    solicitadosCtrl.$inject =['$scope', '$rootScope', 'datos','loading'];
    autorizadosCtrl.$inject =['$scope', '$rootScope', 'datos','loading'];
    rechazadosCtrl.$inject =['$scope', '$rootScope', 'datos','loading','facturacionExpress'];   

    
    //Area de facturacion
    function sacecoCtrl($scope, $rootScope, $filter, find , loading, checkFolios,datos,$timeout,facturacionExpress,webStorage,saceco,$location,operacion){


        $rootScope.tituloFE = 'Facturación Express General';
        $scope.clientes = datos[0].data;
        $scope.triages = datos[1].data;
        $scope.posiciones = datos[2].data;    
        $scope.riesgos = datos[3].data;
        $scope.usrWeb = sessionStorage.getItem("userWeb");    
        $scope.usrMV = sessionStorage.getItem("userWeb");    
        loading.despedida();
        var expediente;

        $scope.inicio = function(){

            $scope.datos = {
                cliente:19,
                fechaini:primerdiames,
                fechafin:FechaAct
            }       
            $scope.criterio = '';
            $scope.unidad = '';
            $scope.digital = '';
            $scope.checkUno=true;
            $scope.verMotivos=false;
            $scope.consultaPendientes();
            $scope.validaciones={};

        }

        $scope.verRespuesta=false;

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

        $scope.imagen = function(archivo){
            //se obtiene la extension del archivo
            var extn = archivo.split(".").pop();

            if (extn == 'jpg' || extn == 'jpeg' || extn == 'png' || extn == 'PNG' || extn == 'JPG' ) {
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

            webStorage.local.set('facturacionExpressData', JSON.stringify($scope.datos));
            
            find.foliosSacecoPendientes($scope.datos).success(function (data){
                // console.log(data);
                $scope.listado = data.listado;
                $scope.rechazados = data.numeros.Rechazados;
                $scope.autorizados = data.numeros.AutorizadoNoFacturado;
                $scope.solicitados = data.numeros.XAutorizar;
                loading.despedida();

            }).error(function (data){
                console.log(data);
                alert('Surgio un problema intente nuevamente');
                loading.despedida();

            });
            
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
            expediente  = row.entity.Exp_folio;
            atencion    = row.entity.ATN_clave;

            find.recepcionxfolio(expediente).success(function (data){
                if (data.length > 0) {
                    $scope.sinCaptura = false;
                };
            });
           

            find.detalleFolioSaceco(expediente, atencion).success(function (data){            
                loading.despedida();
                console.log(data);
                $scope.datosExpediente = data.expediente;            
                $scope.cveCia=data.expediente.claveEmpresa;
                $scope.tipLesion = data.lesion.TLE_claveint;

                $scope.edicion = false;
                $scope.vistaArchivos = false;
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

        $scope.validafecha = function(){

            var fecha1 = moment($scope.captura.FExpedicion, 'DD/MM/YYYY');
            var fecha2 = moment($scope.captura.FAtencion, 'DD/MM/YYYY');
            
            if(fecha1 > fecha2){
                $scope.captura.FExpedicion = FechaAct;
                alert('La fecha no debe ser mayor a la fecha de atencion ' + fecha2);
            }
        }

        $scope.validarEstatus = function(){

            var listado = $scope.listDocmuento; 
            $scope.verGuardaTicket=0;         
            for (index = 0; index < listado.length; ++index) {
                value = listado[index].Arc_estatus; 
                console.log(value);
                if(value==2){
                    $scope.verGuardaTicket=1;    
                }                 
            }        
        }

        // al dar click selecciona el tipo de documento que quiere ver 
        $scope.muestraArchivos  = function(tipoDoc){       
            /*result = $scope.listDocmuento;
            archivos=[];
            for(var k in result) {
                if(result[k].TID_clave==tipoDoc){
                  archivos.push(result[k].Arc_archivo+'/'+result[k].Arc_clave);  
                }           
            }*/

            /*console.log(archivos);*/

            $scope.vistaArchivos = false;
            //se crea un delay por que carge la imagen de forma correcta
            $timeout(function(){
                $scope.mostrarArcTipoDoc=tipoDoc;
                //$scope.archivos = archivos;
                $scope.vistaArchivos = true;
            }, 1000);

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
            //se crea un delay por que carge la imagen de forma correcta
           

        }

        $scope.verificaEstatus  = function(){       
           
            console.log($scope.check1);
            $scope.verMotivos=true;
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
                        { field:'Exp_completo', displayName:'Lesionado', width: 250, pinned:false },
                        /*{ field:'Exp_fecreg', displayName:'Fecha Atención', width: 120, pinned:false },*/
                        { field:'ATN_fecreg', displayName:'Fecha Expedición', width: 120, pinned:false },
                        { field:'FECHA_CAPTURA', displayName:'Fecha Captura', width: 120, pinned:false },
                        { field:'Cia_nombrecorto', displayName:'Compañia', width: 120, pinned:false },
                        { field:'UNI_nombreMV', displayName:'Unidad', width: 180, pinned:false },                    
                        { field:'TIA_nombre', displayName:'Tipo de Atención', width: 180, pinned:false },                    
                        { field:'Exp_poliza', displayName:'Poliza', width: 120, pinned:false },
                        { field:'Exp_siniestro', displayName:'Siniestro', width: 120, pinned:false },
                        { field:'Exp_reporte', displayName:'Reporte', width: 120, pinned:false },
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

        $scope.cerrarVentana = function(){
            $scope.vistaArchivos=false;

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

        $scope.cerrarVentana = function(){
            $scope.vistaArchivos=false;

        }

        $scope.recargarPagina = function(){
            //alert('hola');
            location.reload(true);
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

        //////LLena el grid y toma filtros

        ///filtros

        $scope.selectos = [];

        $scope.filterOptions = {
            filterText: '',
            useExternalFilter: false
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


})();


    