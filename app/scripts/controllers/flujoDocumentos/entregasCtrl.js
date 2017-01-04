(function(){

    /** Sergio Alcala (2017)
    *Controlador de Entregas
    *Los Documentos mostrados son todos aquellos que fueron entregados a algun area
    *por usuario y por area para el flujo manual
    */

    'use strict';

    angular.module('app')
    .controller('listadoEntregasCtrl',listadoEntregasCtrl)
    .controller('listadoEntregasAreaCtrl',listadoEntregasAreaCtrl); 

    listadoEntregasCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading', 'checkFolios','datos','$filter'];
    listadoEntregasAreaCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading', 'checkFolios','datos','$filter'];

    //mustra los documentos entregados pendientes de recibir
    function listadoEntregasCtrl($scope, $rootScope, $routeParams, find, loading, checkFolios,datos,$filter){
        

        loading.despedida();
        //Carga Configuracion Inicial
        $scope.inicio = function(){

            $scope.tituloLE = 'Listado de Entregas efectuadas'; //+ $routeParams.area;
            $scope.area = $routeParams.area;
            $scope.folio = '';
            $scope.mensaje = '';
            $scope.empresas();
            $scope.altaunidades();
            $scope.listadoEntregas = datos.data;

            $scope.filtrado = {
                EMP_nombrecorto : '',
                UNI_nombrecorto : ''
            };


        }

        //Carga la lista de archivos a Recibir de otras areas 
        $scope.cargaEntregas = function(){

            find.listadoentrega($rootScope.id).success( function (data){
                //console.log(data);
                if(data){
                    $scope.listadoEntregas = data;
                }else{
                    $scope.listadoEntregas = [];
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

        //elimina la seleccion o al que le apretaron
        $scope.elimina = function(dato){
            
            $scope.mensaje = '';
            var datos = [dato.entity];
            $('#boton').button('loading');

            checkFolios.enviaRechazos(datos,$rootScope.area,$rootScope.id).then(
                function (data){
                    $scope.gridOptions.$gridScope.toggleSelectAll(false);
                    $scope.mensaje = data.respuesta;
                    $scope.tipoalerta = 'alert-success';
                    $scope.cargaEntregas(); 
                    $('#boton').button('reset');    
                },
                function (error){
                    $scope.mensaje = error;
                    $scope.tipoalerta = 'alert-warning';
                    $('#boton').button('reset');
                }
            );
            
        }


        $scope.eliminaMultiple = function(){

            $('#boton').button('loading');
            $scope.mensaje = '';
            var datos = $scope.selectos;

            checkFolios.enviaRechazos(datos,$rootScope.area,$rootScope.id).then(
                function (data){
                    $scope.gridOptions.$gridScope.toggleSelectAll(false);
                    $scope.mensaje = data.respuesta;
                    $scope.tipoalerta = 'alert-success';
                    $scope.cargaEntregas(); 

                    if (data.rechazos.length > 0) {
                        $scope.rechazos = data.rechazos;
                        $('#myModal4').modal();
                    };  
                    
                    $('#boton').button('reset');
                },
                function (error){
                    $scope.mensaje = error;
                    $scope.tipoalerta = 'alert-warning';
                    $('#boton').button('reset');
                }
            );


        }

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


        ////opciones del grid                 
        $scope.gridOptions = { 
            data: 'listadoEntregas', 
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
                        { field:'PorEntregarA', displayName:'PorEntregarA', width: 120 },
                        { field:'PAS_folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                        { field:'FLD_etapa', displayName:'Etapa', width: 120 },
                        { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
                        { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
                        { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
                        { field:'FLD_formaRecep', displayName:'FaxOrigianl', width: 120 },
                        { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
                        { field:'Triage', width: 120 },
                        { field:'ROC', displayName:'ROC', width: 100, visible:false },
                        { field:'DOC_claveint', width: 100, visible:false },
                        { field:'FLD_claveint', width: 100, visible:false },
                        { field:'FLD_AROent', width: 100, visible:false },
                        { field:'ARO_porRecibir', width: 100, visible:false },
                        { displayName:'Accion' ,cellTemplate:'  <a href="" ng-click="elimina(row)">Quitar</a>'}
            ]
            
        };

        $scope.$on('ngGridEventRows', function (newFilterText){

            var filas = newFilterText.targetScope.renderedRows;

            $scope.exportables = [];

            angular.forEach(filas , function(item){
                $scope.exportables.push(item.entity);
            });

        });

        $scope.filtra = function(){


            if($scope.unidad == undefined || $scope.unidad == 0){
                var objeto1 = "";
                $scope.filtrado.UNI_nombrecorto = '';
            }else{
                var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
                $scope.filtrado.UNI_nombrecorto = $scope.unidad.nombre;
                
            }
            if($scope.cliente == undefined || $scope.cliente == 0){
                var objeto2 = "";
                $scope.filtrado.EMP_nombrecorto = '';
            }else{
                var objeto2 = "Empresa:" + $scope.cliente.nombre + "; ";
                $scope.filtrado.EMP_nombrecorto = $scope.cliente.nombre;
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

            $scope.filtrado = {
                EMP_nombrecorto : '',
                UNI_nombrecorto : ''
            };
        
        }

        $scope.quitaselectos = function(){

            $scope.gridOptions.$gridScope.toggleSelectAll(false);
        }

        $scope.exporta = function(){
            $scope.exportables = $filter('filter')($scope.listadoEntregas, $scope.filtrado);
            JSONToCSVConvertor($scope.exportables,'Reporte',true);
        }

    };

    //mustra los documentos entregados pendientes de recibir
    function listadoEntregasAreaCtrl($scope, $rootScope, $routeParams, find, loading, checkFolios,datos,$filter){
        

        loading.despedida();
        //Carga Configuracion Inicial
        $scope.inicio = function(){

            $scope.tituloLE = 'Listado de Entregas efectuadas'; //+ $routeParams.area;
            $scope.area = $routeParams.area;
            $scope.folio = '';
            $scope.mensaje = '';
            $scope.empresas();
            $scope.altaunidades();
            $scope.listadoEntregas = datos.data;

            $scope.filtrado = {
                EMP_nombrecorto : '',
                UNI_nombrecorto : ''
            };


        }

        //Carga la lista de archivos a Recibir de otras areas 
        $scope.cargaEntregas = function(){

            find.listadoentrega($rootScope.userM).success( function (data){
                //console.log(data);
                if(data){
                    $scope.listadoEntregas = data;
                }else{
                    $scope.listadoEntregas = [];
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

        //elimina la seleccion o al que le apretaron
        $scope.elimina = function(dato){
            
            $scope.mensaje = '';
            var datos = [dato.entity];
            $('#boton').button('loading');

            checkFolios.enviaRechazos(datos,$rootScope.area,$rootScope.id).then(
                function (data){
                    $scope.gridOptions.$gridScope.toggleSelectAll(false);
                    $scope.mensaje = data.respuesta;
                    $scope.tipoalerta = 'alert-success';
                    $scope.cargaEntregas(); 
                    $('#boton').button('reset');    
                },
                function (error){
                    $scope.mensaje = error;
                    $scope.tipoalerta = 'alert-warning';
                    $('#boton').button('reset');
                }
            );
            
        }


        $scope.eliminaMultiple = function(){

            $('#boton').button('loading');
            $scope.mensaje = '';
            var datos = $scope.selectos;

            checkFolios.enviaRechazos(datos,$rootScope.area,$rootScope.id).then(
                
                function (data){
                    $scope.gridOptions.$gridScope.toggleSelectAll(false);
                    $scope.mensaje = data.respuesta;
                    $scope.tipoalerta = 'alert-success';
                    $scope.cargaEntregas(); 

                    if (data.rechazos.length > 0) {
                        $scope.rechazos = data.rechazos;
                        $('#myModal4').modal();
                    };  
                    
                    $('#boton').button('reset');
                },
                function (error){
                    $scope.mensaje = error;
                    $scope.tipoalerta = 'alert-warning';
                    $('#boton').button('reset');
                }
            );


        }

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


        ////opciones del grid                 
        $scope.gridOptions = { 
            data: 'listadoEntregas', 
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
                        { field:'PorEntregarA', displayName:'PorEntregarA', width: 120 },
                        { field:'PAS_folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                        { field:'FLD_etapa', displayName:'Etapa', width: 120 },
                        { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
                        { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
                        { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
                        { field:'FLD_formaRecep', displayName:'FaxOrigianl', width: 120 },
                        { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
                        { field:'Triage', width: 120 },
                        { field:'ROC', displayName:'ROC', width: 100, visible:false },
                        { field:'DOC_claveint', width: 100, visible:false },
                        { field:'FLD_claveint', width: 100, visible:false },
                        { field:'FLD_AROent', width: 100, visible:false },
                        { field:'ARO_porRecibir', width: 100, visible:false },
                        { displayName:'Accion' ,cellTemplate:'  <a href="" ng-click="elimina(row)">Quitar</a>'}
            ]
            
        };

        $scope.$on('ngGridEventRows', function (newFilterText){

            var filas = newFilterText.targetScope.renderedRows;

            $scope.exportables = [];

            angular.forEach(filas , function(item){
                $scope.exportables.push(item.entity);
            });

        });

        $scope.filtra = function(){


            if($scope.unidad == undefined || $scope.unidad == 0){
                var objeto1 = "";
                $scope.filtrado.UNI_nombrecorto = '';
            }else{
                var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
                $scope.filtrado.UNI_nombrecorto = $scope.unidad.nombre;
                
            }
            if($scope.cliente == undefined || $scope.cliente == 0){
                var objeto2 = "";
                $scope.filtrado.EMP_nombrecorto = '';
            }else{
                var objeto2 = "Empresa:" + $scope.cliente.nombre + "; ";
                $scope.filtrado.EMP_nombrecorto = $scope.cliente.nombre;
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

            $scope.filtrado = {
                EMP_nombrecorto : '',
                UNI_nombrecorto : ''
            };
        
        }

        $scope.quitaselectos = function(){

            $scope.gridOptions.$gridScope.toggleSelectAll(false);
        }

        $scope.exporta = function(){
            $scope.exportables = $filter('filter')($scope.listadoEntregas, $scope.filtrado);
            JSONToCSVConvertor($scope.exportables,'Reporte',true);
        }

    };

    
})();