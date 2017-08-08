
function detalleRelacionCtrl($scope, $rootScope, find,loading,$filter,$location,$http,api, $routeParams, DetalleRelacion){

    $scope.inicio = function(){

        $rootScope.area = 6;
        $scope.tituloR = "Detalle de Relacion";
        $scope.detalleRelacion();


    }

    $scope.detalleRelacion = function(){

        loading.cargando('Buscando Folio');
        DetalleRelacion.listadetalleRelacion($routeParams.relacion).success(function (data){

            if(data){

                $scope.listado = data;
                $scope.cantidad = data.length -1;

            }else{

                loading.despedida();
                $scope.listado = [];
                
            }

            loading.despedida();

        });

    }
        ///filtros
    $scope.selectos = [];
    $scope.selectedRows = [];

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
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        // enableRowSelection:false,
        // multiSelect:false,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
        enableCellSelection: false,
        selectedItems: $scope.selectedRows, 
        filterOptions: $scope.filterOptions,
        enableCellEdit: true,
        columnDefs: [
                    { field:'Ref',displayName:'Ref', width: 50, pinned: true},
                    { field:'Aseguradora', displayName:'Aseguradora' , width: 120 , pinned: true, cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'FolioFiscal', displayName:'Folio Fiscal', width: 190, pinned: true },
                    { field:'Factura', displayName:'Factura', width: 120, pinned: true },
                    { field:'Subtotal',displayName:'Subtotal', width: 120 },
                    { field:'IVA',displayName:'IVA', width: 120 },
                    { field:'Total',displayName:'Total', width: 120 },
                    { field:'FechaCaptura',displayName:'Fecha Captura', width: 120 },
                    { field:'TipoLesion',displayName:'Tipo Lesion', width: 90 },
                    { field:'Diagnostico',displayName:'Diagnostico', width: 120 },
                    { field:'Etapa',displayName:'ET', width: 90 },
                    { field:'Entrega',displayName:'#', width: 90 },
                    { field:'SubtotalP',displayName:'Subtotal Pagar', width: 120 },
                    { field:'IVAP',displayName:'Paga Pagar', width: 120 },
                    { field:'TotalP',displayName:'Total Pagar', width: 120 },
                    { field:'Lesionado',displayName:'Nombre Lesionado', width: 120 },

// 'Ref','Aseguradora','N°','Factura', 'Folio Fiscal','Importe Factura','Total','Fecha Captura','Tipo Lesion','Diagnostico','ET','Pagar','Nombre Lesionado'

        ],
        showFooter: true,
        showFilter:false,

    };

    $scope.$on('ngGridEventRows', function (newFilterText){

        var filas = newFilterText.targetScope.renderedRows;
        $scope.exportables = [];
        allChecked = true;

        angular.forEach(filas , function(item){
            $scope.exportables.push(item.entity);
        });

        // if (!$scope.gridOptions.$gridScope.checker)
        // $scope.gridOptions.$gridScope.checker = {};
        // $scope.gridOptions.$gridScope.checker.checked = allChecked;

    });

    $scope.ExportaReporte = function(success){

        loading.cargando('Descargando');
        // alert('hola');

    DetalleRelacion.descargaExcel($routeParams.relacion).success(function (data){

         loading.despedida();

    }).error( function (data){


        $scope.mensajetramite = 'Error, Intenta otra vez';
        $scope.tipoalerta = 'alert-danger';

    }); 

    // $http.post(api+'DetalleRelacion/generaReporte2',$routeParams.relacion).success(function (data){
        
    //     // $scope.mensaje = data.respuesta;
    //     // $scope.tipoalerta = 'alert-success';
    //     // $scope.cargaFlujo();
    //     // $('#boton2').button('reset');
    //     // $scope.gridOptions.$gridScope.toggleSelectAll(false);

    // }).error( function (data){
        
    //     $scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
    //     $scope.tipoalerta = 'alert-warning';
    //     $('#boton2').button('reset');

    // }); 

}



}

detalleRelacionCtrl.$inject = ['$scope', '$rootScope', 'find', 'loading','$filter','$location','$http','api','$routeParams', 'DetalleRelacion'];
app.controller('detalleRelacionCtrl',detalleRelacionCtrl);
