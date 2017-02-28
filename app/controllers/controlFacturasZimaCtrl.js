/// Facturas qualitas
function controlFacturasZimaCtrl($scope, $rootScope,$http, find, loading,api , FacturaZima, $location){

	$scope.inicio = function(){

		$scope.tituloFQ = "Facturas Zima";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.listado = [];
        $scope.Altaunidades();
        $scope.listadofacturas();

	}

    $scope.Altaunidades = function(){

        FacturaZima.unidades().success( function (data) {
            $scope.unidades = data;
            
         });
    }

    $scope.listadofacturas = function(){

        loading.cargando('Buscando Folios(s)');

        FacturaZima.listadoFactura().then(function (data){ 
            if(data){

                $scope.listado = data.data;
                $scope.cantidad = data.length -1;

            }else{
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

    var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

    $scope.onDblClickRow = function(row){

      $scope.dfolios = [];

      $scope.dfolios = row.entity.Folio;
      $location.path('/detalleAtencionZima/'+row.entity.Folio);
      console.log(row.entity);

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
        enableCellEdit: false,
        rowTemplate: rowTempl,
        columnDefs: [
                    { field:'nombreestatus',displayName:'Revisado', width: 120, pinned: true,  cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.estatus ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.estatus ==  \'1\'" class="glyphicon glyphicon-tags"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'Unidad',displayName:'Unidad', width: 250, pinned: true},
                    { field:'Folio', displayName:'Folio' , width: 120 , pinned: true},
                    { field:'Solicitud', displayName:'Solicitud' , width: 120 , pinned: true},
                    { field:'Lesionado', width: 330, pinned: true },
                    { field:'Producto', width: 120 },
                    { field:'Aseguradora', width: 100 },
                    { field:'FechaReg', width: 120,  cellFilter: 'date:\'dd/MM/yyyy\'' },
        ],
        showFooter: true,
        showFilter:false,
    }
};

controlFacturasZimaCtrl.$inject = ['$scope', '$rootScope','$http', 'find', 'loading', 'api', 'FacturaZima', '$location'];


app.controller('controlFacturasZimaCtrl',controlFacturasZimaCtrl);
