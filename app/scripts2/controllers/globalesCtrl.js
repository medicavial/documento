function globalesCtrl($scope, $rootScope, loading,$filter,$http,checkFolios){

    console.log(folios);




    $scope.gridOptions = { 

        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:true,
        enableCellSelection: true,
        selectedItems: $scope.selectedRows, 
        filterOptions: $scope.filterOptions,
        enableCellEdit: true,
        columnDefs: [
                    { field:'USUNombre', width: 120, pinned: true},
                    { field:'Producto', width: 120 },
                    { field:'Triage', width: 120 },
                    { field:'Cliente', width: 100 },
                    { field:'Unidad', width: 220 },
                    // { field:'Folio', width: 120, pinned: false},
                    { field:'Folio', displayName:'Folio' , width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'Lesionado', width: 330 },
                    { field:'Etapa', width: 120 },
                    { field:'Entrega', width: 80 },
                    { field:'FAtencion', width: 120},
                    { field:'FormaRecep', width: 90 },
                    { field:'fechaRecepcion', width: 120},
                    { field:'FechaRecepPag', width: 120,  cellFilter: 'date:\'dd/MM/yyyy\'' },
                    { field:'Tipo', width: 120 },
                    { field:'Lesion', width: 120 },
                    { field:'Relacion', width: 120 },
                    { field:'FRelacion', displayName:'F.relacion', width: 120 },
                    { field:'FRelPago', displayName:'F.Pago.Rel.', width: 120 },
                    { field:'FRelPagoReg', displayName:'F.Pago.Rel.Reg.', width: 120 },
                    { field:'PasC', width: 120 },
                    { field:'FPasCobrado', width: 120 },
                    { field:'Pago', width: 120 },
                    { field:'Reserva', width: 120 },
                    { field:'FacturaRelacion', width: 80 },
                    { field:'FacDoc', width: 80 },
                    { field:'RelP', width: 80 },
                    { field:'Pagado', width: 80 },
                    { field:'Cobrado', width: 80 }
        ],
        showFooter: true,
        showFilter:false,

    };



};

globalesCtrl.$inject = ['$scope', '$rootScope','loading','$filter','$http','checkFolios'];
app.controller('globalesCtrl',globalesCtrl);