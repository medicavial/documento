(function(){

    /** Sergio Alcala (2017)
    *Controlador de Rechazos
    *Los Documentos mostrados son todos aquellos que rechazaron por algun motivo la entrega
    *de los mismos por usuario y por area para el flujo manual
    */

    'use strict';

    angular.module('app')
    .controller('rechazosCtrl',rechazosCtrl)
    .controller('rechazosAreaCtrl',rechazosAreaCtrl); 

    rechazosCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'find', 'loading', 'checkFolios','datos'];
    rechazosAreaCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'find', 'loading', 'checkFolios','datos'];

    ///Folios rechazados
    function rechazosCtrl( $scope, $rootScope, $routeParams, $location, find, loading, checkFolios,datos){

        loading.despedida();

        //Con parametros de inicio
        $scope.inicio = function(){

            $scope.tituloRC = "Documentos Rechazados";
            $scope.listadoRechazos = datos.data;
            $scope.folio = '';
            $scope.mensaje = '';
            $scope.empresas();
            $scope.unidades();
            $scope.verareaoperativa();
            $scope.area = $routeParams.area;
            $scope.areaEntrega = $rootScope.areaUsuario;

        }


        //Carga la lista de archivos a enviar 
        $scope.cargaRechazos = function(){

            

            find.listadorechazos($rootScope.id).success( function (data){
           
                if(data){
                    $scope.listadoRechazos = data;
                }else{
                    $scope.listadoRechazos = [];
                }
                
                $scope.gridOptions.$gridScope.toggleSelectAll(false);
                
            });

        }

        ///Enlista las areas disponibles
        $scope.verareaoperativa = function(){

            find.areaoperativa().success( function (data) {

                $scope.areas = data;

             });

        }


        //enlista los usuarios de cada area 
        $scope.altausuariosarea = function(area){

            console.log($rootScope.area);

            if ($rootScope.area == area) {

                if (area == 4 && $rootScope.id != 130) {

                    alert('No puedes emitir entregas a tu misma area');
                    $scope.areaOp = '';
                    
                }else{

                    $scope.area = area;
                    find.usuariosarea(area).success( function (data){

                        $scope.usuarios = data;

                     });
                }


            }else if ($rootScope.area != 4 && area == 5) {
                alert('No puedes emitir entregas a facturacion tu usuario no tiene permisos');
                $scope.areaOp = '';
            }else{

                $scope.area = area;
                find.usuariosarea(area).success( function (data){

                    $scope.usuarios = data;

                 });
            }

        }

        $scope.empresas = function(){

            find.empresas().success( function (data) {

                $scope.clientes = data;

             });

        }

        $scope.unidades = function(){

            find.unidades().success( function (data) {

                $scope.unidades = data;

             });

        }

        //guardamos pero antes verificamos que tengamos documentos seleccionados
        $scope.entrega = function(){

            if ($scope.selectos.length > 0) {

                $scope.validainfo();

            }else{
                alert('No se ha seleccionado ningun documento');
            }

        }
        $scope.validainfo = function(){

            $scope.mensaje = '';
            $('#boton').button('loading');

            var promesa = checkFolios.enviaFolios($scope.selectos,$scope.areaOp,$scope.user,$rootScope.id,$scope.areaEntrega);
            promesa.then(function (data){

                $scope.mensaje = data.respuesta;
                $scope.tipoalerta = 'alert-success';
                $scope.cargaRechazos();
                $('#boton').button('reset');
                if (data.rechazos.length > 0) {
                    $scope.rechazos = data.rechazos;
                    // console.log($scope.rechazos);
                    $('#myModal3').modal();
                };

            },function (error){

                $scope.mensaje = error;
                $scope.tipoalerta = 'alert-warning';

            });

        }


        //////Todo lo necesario para el grid

        //inicalizamos archivos seleccionados
        $scope.selectos = [];

        ///filtros
        $scope.filterOptions = {
            filterText: '',
            useExternalFilter: false
        };


        var csvOpts = { columnOverrides: { obj: function (o) {
            return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
            } },
            iEUrl: 'downloads/download_as_csv'
        };
                        
        $scope.gridOptions = { 
            data: 'listadoRechazos', 
            enableColumnResize:true,
            enablePinning: true, 
            enableRowSelection:true,
            showSelectionCheckbox: true,
            selectWithCheckboxOnly: false,
            multiSelect:true,
            selectedItems: $scope.selectos, 
            filterOptions: $scope.filterOptions,
            columnDefs: [
                        { field:'PAS_folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                        { field:'USURechazo', displayName:'UsuarioRechazo', width: 200 },
                        { field:'FLD_motivoRechazo', displayName:'MotivoRechazo', width: 220 },
                        { field:'FLD_etapa', displayName:'Etapa', width: 120 },
                        { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
                        { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
                        { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
                        { field:'FLD_formaRecep', displayName:'Tipo', width: 120 },
                        { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
                        { field:'', displayName:'DocRevision', width: 100 },
                        { field:'FLD_claveint', displayName:'FLD_claveint', width: 100, visible:false },
                        { field:'DOC_claveint', displayName:'documento', width: 100, visible:false },
                        { field:'CapEt2', displayName:'CapEt2', width: 100, visible:false },
                        { field:'EnvFac', displayName:'EnvFac', width: 100, visible:true },
                        { field:'FLD_AROent', displayName:'FLD_AROent', width: 100, visible:false },
                        { field:'ARO_porRecibir', displayName:'area', width: 100, visible:false },
                        { field:'USU_ent', displayName:'USU_ent', width: 100, visible:false },
                        { field:'FLD_observaciones', displayName:'Observaciones', width: 320, enableCellEdit: true}
            ],
            showFooter: true,
            showFilter:true

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
            //console.log($scope.fechaini);

            if($scope.unidad == undefined || $scope.unidad == 0){
                var objeto1 = "";
            }else{
                var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
                
            }
            if($scope.cliente == undefined || $scope.cliente == 0){
                var objeto2 = "";
            }else{
                var objeto2 = "Empresa:" + $scope.cliente.nombre + "; ";
            }
            
            // if($scope.tipo == 'Fax'){
            //  var objeto3 = "Fax:x; ";
            // }else if($scope.tipo == 'Original'){
            //  var objeto3 = "Original:x; ";
            // }else{
            //  var objeto3 = "";
            // }

            if($scope.folio.length == 0){
                var objeto3 = "";
            }else{
                var objeto3 = "Folio:" + $scope.folio + "; ";   
            }

            // if($scope.lesionado.length == 0){
            //  var objeto5 = "";
            // }else{
            //  var objeto5 = "Lesionado:" + $scope.lesionado + "; ";   
            // }

            // if($scope.producto == undefined || $scope.producto == 0){
            //  var objeto6 = "";
            // }else{
            //  var objeto6 = "Producto:" + $scope.producto.nombre + "; ";
                
            // }

            // if($scope.etapa == undefined || $scope.etapa == 0){
            //  var objeto7 = "";
            // }else{
            //  var objeto7 = "Etapa:" + $scope.etapa + "; ";
                
            // }


            var filtro = objeto1 + objeto2 + objeto3;// + objeto4 + objeto5 + objeto6 + objeto7;

            $scope.filterOptions.filterText = filtro;

            // console.log(filtro);

        }

        $scope.quitafiltro = function(){

            $scope.filterOptions.filterText = ''; 
            $scope.unidad = 0; 
            $scope.cliente = 0;
            
        }

        $scope.quitaselectos = function(){

            $scope.gridOptions.$gridScope.toggleSelectAll(false);

        }

    };

    ///Folios rechazados x area
    function rechazosAreaCtrl( $scope, $rootScope, $routeParams, $location, find, loading, checkFolios,datos){

        loading.despedida();

        //Con parametros de inicio
        $scope.inicio = function(){

            $scope.tituloRC = "Documentos Rechazados";
            $scope.listadoRechazos = datos.data;
            $scope.folio = '';
            $scope.mensaje = '';
            $scope.empresas();
            $scope.unidades();
            $scope.verareaoperativa();
            $scope.area = $routeParams.area;
            $scope.areaEntrega = $rootScope.areaUsuario;

        }


        //Carga la lista de archivos a enviar 
        $scope.cargaRechazos = function(){

            

            find.listadorechazos($rootScope.userM).success( function (data){
           
                if(data){
                    $scope.listadoRechazos = data;
                }else{
                    $scope.listadoRechazos = [];
                }
                
                $scope.gridOptions.$gridScope.toggleSelectAll(false);
                
            });

        }

        ///Enlista las areas disponibles
        $scope.verareaoperativa = function(){

            find.areaoperativa().success( function (data) {

                $scope.areas = data;

             });

        }


        //enlista los usuarios de cada area 
        $scope.altausuariosarea = function(area){

            console.log($rootScope.area);

            if ($rootScope.area == area) {

                if (area == 4 && $rootScope.id != 130) {

                    alert('No puedes emitir entregas a tu misma area');
                    $scope.areaOp = '';
                    
                }else{

                    $scope.area = area;
                    find.usuariosarea(area).success( function (data){

                        $scope.usuarios = data;

                     });
                }


            }else if ($rootScope.area != 4 && area == 5) {
                alert('No puedes emitir entregas a facturacion tu usuario no tiene permisos');
                $scope.areaOp = '';
            }else{

                $scope.area = area;
                find.usuariosarea(area).success( function (data){

                    $scope.usuarios = data;

                 });
            }

        }

        $scope.empresas = function(){

            find.empresas().success( function (data) {

                $scope.clientes = data;

             });

        }

        $scope.unidades = function(){

            find.unidades().success( function (data) {

                $scope.unidades = data;

             });

        }

        //guardamos pero antes verificamos que tengamos documentos seleccionados
        $scope.entrega = function(){

            if ($scope.selectos.length > 0) {

                $scope.validainfo();

            }else{
                alert('No se ha seleccionado ningun documento');
            }

        }

        $scope.validainfo = function(){

            $scope.mensaje = '';
            $('#boton').button('loading');

            var promesa = checkFolios.enviaFolios($scope.selectos,$scope.areaOp,$scope.user,$rootScope.id,$scope.areaEntrega);
            promesa.then(function (data){

                $scope.mensaje = data.respuesta;
                $scope.tipoalerta = 'alert-success';
                $scope.cargaRechazos();
                $('#boton').button('reset');
                if (data.rechazos.length > 0) {
                    $scope.rechazos = data.rechazos;
                    // console.log($scope.rechazos);
                    $('#myModal3').modal();
                };

            },function (error){

                $scope.mensaje = error;
                $scope.tipoalerta = 'alert-warning';

            });

        }


        //////Todo lo necesario para el grid

        //inicalizamos archivos seleccionados
        $scope.selectos = [];

        ///filtros
        $scope.filterOptions = {
            filterText: '',
            useExternalFilter: false
        };


        var csvOpts = { columnOverrides: { obj: function (o) {
            return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
            } },
            iEUrl: 'downloads/download_as_csv'
        };
                        
        $scope.gridOptions = { 
            data: 'listadoRechazos', 
            enableColumnResize:true,
            enablePinning: true, 
            enableRowSelection:true,
            showSelectionCheckbox: true,
            selectWithCheckboxOnly: false,
            multiSelect:true,
            selectedItems: $scope.selectos, 
            filterOptions: $scope.filterOptions,
            columnDefs: [
                        { field:'PAS_folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                        { field:'USURechazo', displayName:'UsuarioRechazo', width: 200 },
                        { field:'FLD_motivoRechazo', displayName:'MotivoRechazo', width: 220 },
                        { field:'FLD_etapa', displayName:'Etapa', width: 120 },
                        { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
                        { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
                        { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
                        { field:'FLD_formaRecep', displayName:'Tipo', width: 120 },
                        { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
                        { field:'', displayName:'DocRevision', width: 100 },
                        { field:'FLD_claveint', displayName:'FLD_claveint', width: 100, visible:false },
                        { field:'DOC_claveint', displayName:'documento', width: 100, visible:false },
                        { field:'CapEt2', displayName:'CapEt2', width: 100, visible:false },
                        { field:'EnvFac', displayName:'EnvFac', width: 100, visible:true },
                        { field:'FLD_AROent', displayName:'FLD_AROent', width: 100, visible:false },
                        { field:'ARO_porRecibir', displayName:'area', width: 100, visible:false },
                        { field:'USU_ent', displayName:'USU_ent', width: 100, visible:false },
                        { field:'FLD_observaciones', displayName:'Observaciones', width: 320, enableCellEdit: true}
            ],
            showFooter: true,
            showFilter:true

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
            //console.log($scope.fechaini);

            if($scope.unidad == undefined || $scope.unidad == 0){
                var objeto1 = "";
            }else{
                var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
                
            }
            if($scope.cliente == undefined || $scope.cliente == 0){
                var objeto2 = "";
            }else{
                var objeto2 = "Empresa:" + $scope.cliente.nombre + "; ";
            }
            
            // if($scope.tipo == 'Fax'){
            //  var objeto3 = "Fax:x; ";
            // }else if($scope.tipo == 'Original'){
            //  var objeto3 = "Original:x; ";
            // }else{
            //  var objeto3 = "";
            // }

            if($scope.folio.length == 0){
                var objeto3 = "";
            }else{
                var objeto3 = "Folio:" + $scope.folio + "; ";   
            }

            // if($scope.lesionado.length == 0){
            //  var objeto5 = "";
            // }else{
            //  var objeto5 = "Lesionado:" + $scope.lesionado + "; ";   
            // }

            // if($scope.producto == undefined || $scope.producto == 0){
            //  var objeto6 = "";
            // }else{
            //  var objeto6 = "Producto:" + $scope.producto.nombre + "; ";
                
            // }

            // if($scope.etapa == undefined || $scope.etapa == 0){
            //  var objeto7 = "";
            // }else{
            //  var objeto7 = "Etapa:" + $scope.etapa + "; ";
                
            // }


            var filtro = objeto1 + objeto2 + objeto3;// + objeto4 + objeto5 + objeto6 + objeto7;

            $scope.filterOptions.filterText = filtro;

            // console.log(filtro);

        }

        $scope.quitafiltro = function(){

            $scope.filterOptions.filterText = ''; 
            $scope.unidad = 0; 
            $scope.cliente = 0;
            
        }

        $scope.quitaselectos = function(){

            $scope.gridOptions.$gridScope.toggleSelectAll(false);

        }

    };

})();