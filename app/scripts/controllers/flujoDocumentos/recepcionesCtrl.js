(function(){

    /** Sergio Alcala (2017)
    *Controlador de Por Recibir
    *Los Documentos mostrados son todos aquellos que fueron enviados a algun usuario
    *o area por el flujo manual
    */

    'use strict';

    angular.module('app')
    .controller('listadoRecepcionCtrl',listadoRecepcionCtrl)
    .controller('listadoRecepcionAreaCtrl',listadoRecepcionAreaCtrl); 

    listadoRecepcionCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading' , '$http', 'carga', 'checkFolios','datos'];
    listadoRecepcionAreaCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading' , '$http', 'carga', 'checkFolios','datos'];

    //muestra los folios por recibir
    function listadoRecepcionCtrl($scope, $rootScope, $routeParams, find, loading , $http, carga, checkFolios,datos){
        
        $scope.listadoRecepcion = datos.data;
        loading.despedida();

        //Carga Configuracion Inicial
        $scope.inicio = function(){

            $scope.tituloLR = 'Listado Pendientes de Recibir';
            $scope.area = $routeParams.area;
            $scope.mensaje = '';
            $scope.folio = '';
            $scope.selectosAc = [];
            $scope.empresas();
            $scope.altaunidades();
            
        }

        //Carga la lista de archivos a Recibir de otras areas 
        $scope.cargaRecepcion = function(){

            find.listadorecepcion($rootScope.id).success( function (data){
           
                if(data.length>0){
                    $scope.listadoRecepcion = data;
                }else{
                    $scope.listadoRecepcion = [];
                }
                
            });
        }

        //enlista los clientes
        $scope.empresas = function(){

            find.empresas().success( function (data) {

                $scope.clientes = data;

             });
        }

        //Enlista las unidades
        $scope.altaunidades = function(){

            find.unidades().success( function (data) {

                $scope.unidades = data;

            });
        }

        $scope.aceptaEntregas = function(){

            $scope.mensaje = '';
            $('#boton').button('loading');

            if ($scope.selectos.length > 0) {

                checkFolios.aceptaEntrega($scope.selectos)
                .success(function (data){
                    $scope.mensaje = data.respuesta;
                    $scope.tipoalerta = 'alert-success';
                    $scope.cargaRecepcion();
                    $scope.gridOptions.$gridScope.toggleSelectAll(false);
                    $('#boton').button('reset');
                })
                .error(function (data){
                    $scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
                    $scope.tipoalerta = 'alert-error';
                    $('#boton').button('reset');    
                });
                
            };
            
        }

        $scope.rechazaEntregas = function(){

            $scope.mensaje = '';
            $('#boton2').button('loading');

            if ($scope.selectos.length > 0) {

                checkFolios.rechazaEntrega($scope.selectos,$rootScope.id)
                .then(
                    function (data){
                        $('#boton2').button('reset');
                        $scope.mensaje = data.respuesta;
                        $scope.tipoalerta = 'alert-success';
                        $scope.cargaRecepcion();
                        $scope.gridOptions.$gridScope.toggleSelectAll(false);
                    },
                    function (error){
                        $('#boton2').button('reset');
                        $scope.mensaje = error;
                        $scope.tipoalerta = 'alert-error';
                    }
                );
                
            };

        }

        
        $scope.selectos = [];

        $scope.filterOptions = {
            filterText: '',
            useExternalFilter: false
        };

        $scope.filtra = function(){

            //$scope.filterOptions.filterText = "";
            //var filtro = "";
            // console.log($scope.unidad);

            if($scope.unidad == undefined || $scope.unidad == 0){
                var objeto1 = "";
            }else{
                var objeto1 = "Unidad:" + $scope.unidad + "; ";
            }
            if($scope.cliente == undefined || $scope.cliente == 0){
                var objeto2 = "";
            }else{
                var objeto2 = "Empresa:" + $scope.cliente + "; ";
            }

            if($scope.folio.length == 0){
                var objeto3 = "";
            }else{
                var objeto3 = "Folio:" + $scope.folio + "; ";   
            }


            var filtro = objeto1 + objeto2 + objeto3;

            
            $scope.filterOptions.filterText = filtro;

            // console.log(filtro);

        }

        $scope.quitafiltro = function(){

            $scope.filterOptions.filterText = ''; 
            $scope.unidad = 0; 
            $scope.cliente = 0;
            $scope.folio = '';
        
        }

        $scope.quitaselectos = function(){

            $scope.gridOptions.$gridScope.toggleSelectAll(false);
        }


        var csvOpts = { columnOverrides: { obj: function (o) {
            return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
            } },
            iEUrl: 'downloads/download_as_csv'
        };

        //Cargamos el grid con los datos
        $scope.gridOptions = { 
            data: 'listadoRecepcion', 
            enableColumnResize:true,
            enablePinning: true, 
            enableRowSelection:true,
            multiSelect:true,
            showFooter: true,
            showFilter:true,
            showSelectionCheckbox: true,
            selectWithCheckboxOnly: false,
            selectedItems: $scope.selectos, 
            filterOptions: $scope.filterOptions, 
            columnDefs: [
                        { field:'EntregadoPor', displayName:'EntregadoPor', width: 120, pinned:true},
                        { field:'PAS_folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                        { field:'FLD_etapa', displayName:'Etapa', width: 120 },
                        { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
                        { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
                        { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
                        { field:'FLD_formaRecep', displayName:'FaxOrigianl', width: 120 },
                        { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
                        { field:'Triage', width: 120 },
                        { field:'FLD_fechaent', displayName:'FechaEntrega', width: 100, visible:true },
                        { field:'', displayName:'DocRevision', width: 100 },
                        { field:'DOC_claveint', width: 100, visible:false },
                        { field:'FLD_claveint', width: 100, visible:false },
                        { field:'FLD_AROrec', width: 100, visible:false },
                        { field:'USU_rec', width: 100, visible:false },
                        { field:'USU_recibe', width: 100, visible:false },
                        { field:'', displayName:'motivo', width: 20, visible:false },
                        { field:'ARO_porRecibir', width: 100, visible:false },
                        { field:'FLD_AROent', width: 100, visible:false },
                        { field:'USU_ent', width: 100, visible:false }
            ]
        };

        $scope.$on('ngGridEventRows', function (newFilterText){

            var filas = newFilterText.targetScope.renderedRows;

            $scope.exportables = [];

            angular.forEach(filas , function(item){
                $scope.exportables.push(item.entity);
            });

        });

    };

    //muestra los folios por recibir
    function listadoRecepcionAreaCtrl($scope, $rootScope, $routeParams, find, loading , $http, carga, checkFolios,datos){
        
        $scope.listadoRecepcion = datos.data;
        loading.despedida();

        //Carga Configuracion Inicial
        $scope.inicio = function(){

            $scope.tituloLR = 'Listado Pendientes de Recibir';
            $scope.area = $routeParams.area;
            $scope.mensaje = '';
            $scope.folio = '';
            $scope.selectosAc = [];
            $scope.empresas();
            $scope.altaunidades();
            
        }

        //Carga la lista de archivos a Recibir de otras areas 
        $scope.cargaRecepcion = function(){

            find.listadorecepcion($rootScope.userM).success( function (data){
           
                if(data.length>0){
                    $scope.listadoRecepcion = data;
                }else{
                    $scope.listadoRecepcion = [];
                }
                
            });
        }

        //enlista los clientes
        $scope.empresas = function(){

            find.empresas().success( function (data) {

                $scope.clientes = data;

             });
        }

        //Enlista las unidades
        $scope.altaunidades = function(){

            find.unidades().success( function (data) {

                $scope.unidades = data;

            });
        }

        $scope.aceptaEntregas = function(){

            $scope.mensaje = '';
            $('#boton').button('loading');

            if ($scope.selectos.length > 0) {

                checkFolios.aceptaEntrega($scope.selectos)
                .success(function (data){
                    $scope.mensaje = data.respuesta;
                    $scope.tipoalerta = 'alert-success';
                    $scope.cargaRecepcion();
                    $scope.gridOptions.$gridScope.toggleSelectAll(false);
                    $('#boton').button('reset');
                });
                
            };
            
        }


        $scope.rechazaEntregas = function(){

            $scope.mensaje = '';
            $('#boton2').button('loading');

            if ($scope.selectos.length > 0) {

                checkFolios.rechazaEntrega($scope.selectos,$rootScope.id)
                .then(function (data){
                    $('#boton2').button('reset');
                    $scope.mensaje = data.respuesta;
                    $scope.tipoalerta = 'alert-success';
                    $scope.cargaRecepcion();
                    $scope.gridOptions.$gridScope.toggleSelectAll(false);
                });
                
            };

        }

        
        $scope.selectos = [];

        $scope.filterOptions = {
            filterText: '',
            useExternalFilter: false
        };

        $scope.filtra = function(){

            //$scope.filterOptions.filterText = "";
            //var filtro = "";
            // console.log($scope.unidad);

            if($scope.unidad == undefined || $scope.unidad == 0){
                var objeto1 = "";
            }else{
                var objeto1 = "Unidad:" + $scope.unidad + "; ";
            }
            if($scope.cliente == undefined || $scope.cliente == 0){
                var objeto2 = "";
            }else{
                var objeto2 = "Empresa:" + $scope.cliente + "; ";
            }

            if($scope.folio.length == 0){
                var objeto3 = "";
            }else{
                var objeto3 = "Folio:" + $scope.folio + "; ";   
            }


            var filtro = objeto1 + objeto2 + objeto3;

            
            $scope.filterOptions.filterText = filtro;

            // console.log(filtro);

        }

        $scope.quitafiltro = function(){

            $scope.filterOptions.filterText = ''; 
            $scope.unidad = 0; 
            $scope.cliente = 0;
            $scope.folio = '';
        
        }

        $scope.quitaselectos = function(){

            $scope.gridOptions.$gridScope.toggleSelectAll(false);
        }


        var csvOpts = { columnOverrides: { obj: function (o) {
            return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
            } },
            iEUrl: 'downloads/download_as_csv'
        };

        //Cargamos el grid con los datos
        $scope.gridOptions = { 
            data: 'listadoRecepcion', 
            enableColumnResize:true,
            enablePinning: true, 
            enableRowSelection:true,
            multiSelect:true,
            showFooter: true,
            showFilter:true,
            showSelectionCheckbox: true,
            selectWithCheckboxOnly: false,
            selectedItems: $scope.selectos, 
            filterOptions: $scope.filterOptions, 
            columnDefs: [
                        { field:'EntregadoPor', displayName:'EntregadoPor', width: 120, pinned:true},
                        { field:'PAS_folio', displayName:'Folio', width: 120 },
                        { field:'FLD_etapa', displayName:'Etapa', width: 120 },
                        { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
                        { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
                        { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
                        { field:'FLD_formaRecep', displayName:'FaxOrigianl', width: 120 },
                        { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
                        { field:'Triage', width: 120 },
                        { field:'', displayName:'DocRevision', width: 100 },
                        { field:'DOC_claveint', width: 100, visible:false },
                        { field:'FLD_claveint', width: 100, visible:false },
                        { field:'FLD_AROrec', width: 100, visible:false },
                        { field:'USU_rec', width: 100, visible:false },
                        { field:'USU_recibe', width: 100, visible:false },
                        { field:'', displayName:'motivo', width: 20, visible:false },
                        { field:'ARO_porRecibir', width: 100, visible:false },
                        { field:'FLD_AROent', width: 100, visible:false },
                        { field:'USU_ent', width: 100, visible:false }
            ]
        };

        $scope.$on('ngGridEventRows', function (newFilterText){

            var filas = newFilterText.targetScope.renderedRows;

            $scope.exportables = [];

            angular.forEach(filas , function(item){
                $scope.exportables.push(item.entity);
            });

        });

    };


})();