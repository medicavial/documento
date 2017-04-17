function pagoPropiasCtrl($scope, $rootScope, loading,$filter,$location,$http,checkFolios,api, find, $upload, leexml, pagoPropias, xeditable){

    loading.despedida();

    $scope.inicio = function(){

        $scope.tituloPP = "Pagos Propias";

        $scope.datosCaptura = {

            fechaini: '',
            fechafin: ''
        }
    }


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
        enableRowSelection:true,
        multiSelect:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectedRows, 
        filterOptions: $scope.filterOptions,
        enableCellEdit: true,
        columnDefs: [
                    { field:'Cliente',displayName:'Proveedor', width: 120, pinned: true},
                    { field:'Folio', displayName:'Folio' , width: 120 , pinned: true, cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'Lesionado', width: 330, pinned: true },
                    { field:'FAtencion', width: 80 , pinned: true},
                    { field:'HAtencion', width: 150, pinned: true },
                    { field:'FRecepcion', width: 120 },
                    { field:'FCaptura', width: 120 },
                    { field:'MedicoTrat', width: 120 },
                    { field:'Unidad', width: 120 },
                    { field:'Usuario', width: 120 },
                    { field:'LesPrimaria', width: 120 },
                    { field:'EMPClave', width: 120 },
                    { field:'UNIClave', width: 100 },
                    { field:'USUClave', width: 220 },
                    { field:'NoPago', width: 120},
                    { field:'MotivoNoPago', width: 90 },
                    { field:'Producto', width: 120}
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

    });

    $scope.listadoPropias = function(){

        loading.cargando('Buscando Folios(s)');

        pagoPropias.listadoPropias($scope.datosCaptura).success(function (data){

            $scope.listado = data;
            loading.despedida();
        });

    }

    $scope.exporta = function(){

        $scope.selectos = $filter('filter')($scope.listado, $scope.filtrado);
        JSONToCSVConvertor($scope.selectos,'Reporte',true);        
    }

}

pagoPropiasCtrl.$inject = ['$scope', '$rootScope',  'loading','$filter','$location','$http','checkFolios','api','find', '$upload', 'leexml', 'pagoPropias', 'xeditable'];
app.controller('pagoPropiasCtrl',pagoPropiasCtrl);
