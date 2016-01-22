//Area de facturacion
function facturacionExCtrl($scope, $rootScope, find , loading, checkFolios,datos){

	$rootScope.tituloFE = 'Facturación Express 2.0';
    console.log(datos);
    $scope.clientes = datos.data;
    loading.despedida();

	$scope.inicio = function(){

        $scope.datos = {
            cliente:'',
            fechaini:primerdiames,
            fechafin:FechaAct
        }

        $scope.criterio = '';
        $scope.unidad = '';
        $scope.digital = '';
        $scope.edicion = false;

	}

    $scope.consultaPendientes = function(id){
        loading.cargando('Cargando Información');
        find.foliosFePendientes($scope.datos).success(function (data){
            // console.log(data);
            $scope.listado = data;
            loading.despedida();
        }).error(function (data){
            alert('Surgio un problema intente nuevamente');
            loading.despedida();
        })
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

    $scope.onDblClickRow = function(row){
      console.log(row.entity.Exp_folio);
      $scope.edicion = true;
      
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
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
        rowTemplate: rowTempl,
    	columnDefs: [
                    { field:'Exp_folio', displayName:'Folio', width: 120, pinned:true, enableCellEdit: false },
		            { field:'UNI_nombreMV', displayName:'Unidad', width: 180 },
		            { field:'DocumentosDigitales', displayName:'Digitalizado', width: 120 },
		            { field:'EXP_fechaCaptura', displayName:'Fecha Captura', width: 120 },
		            { field:'Exp_poliza', displayName:'Poliza', width: 120 },
		            { field:'Exp_siniestro', displayName:'Siniestro', width: 120 },
		            { field:'Exp_reporte', displayName:'Reporte', width: 120 },
		            { field:'Exp_completo', displayName:'Lesionado', width: 250 },
		            { field:'RIE_nombre', displayName:'Riesgo', width: 120 },
		            { field:'Triage_nombre', displayName:'Triage', width: 120 },
		            { field:'EXP_costoEmpresa', displayName:'Costo', width: 120 },
                    { field:'UNI_propia', width: 120,visible:false }
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

facturacionExCtrl.$inject =['$scope', '$rootScope', 'find' , 'loading', 'checkFolios','datos'];

app.controller('facturacionExCtrl',facturacionExCtrl);