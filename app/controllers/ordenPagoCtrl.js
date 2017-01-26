/// Facturas qualitas
function ordenPagosCtrl($scope, $rootScope,$http, find, loading,api , Ordenes){

    $scope.inicio = function(){

        $scope.tituloOP = "Ordenes de Pago Pendientes";
        $rootScope.area = 6;
        $scope.cargaOrdenes();

    }

    $scope.cargaOrdenes= function(){

        Ordenes.listadoOrdenPago($rootScope.area).success( function (data){
       
            if(data.length>0){
                $scope.listadoOrdenPago = data;
            }else{
                $scope.listadoOrdenPago = [];
            }
        });
    }

    $scope.selectos = [];

    //Cargamos el grid con los datos
    $scope.gridOptions = { 
        data: 'listadoOrdenPago', 
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
                    { field:'tipoorden', displayName:'TipoOrden', width: 120, pinned:true},
                    { field:'Folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'etapa', displayName:'Etapa', width: 120 },
                    { field:'entrega', displayName:'Entrega', width: 100 },
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

    $scope.aceptaOrden = function(){

        $scope.mensaje = '';
        $('#boton').button('loading');
        // console.log($scope.selectos);
        if ($scope.selectos.length > 0) {

            Ordenes.aceptaOrden($scope.selectos)
            .success(function (data){
                $scope.mensaje = data.respuesta;
                $scope.tipoalerta = 'alert-success';
                $scope.cargaOrdenes();
                $scope.gridOptions.$gridScope.toggleSelectAll(false);
                $('#boton').button('reset');
            });
            
        };
    }


};

ordenPagosCtrl.$inject = ['$scope', '$rootScope','$http', 'find', 'loading', 'api', 'Ordenes'];
app.controller('ordenPagosCtrl',ordenPagosCtrl);
