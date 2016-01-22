//Area de facturacion
function facturacionExCtrl($scope, $rootScope, find , loading, checkFolios){

	$rootScope.tituloFE = 'Facturación Express 2.0';

	$scope.inicio = function(){

	}

    $scope.consultaPendientes = function(id){
        
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
    	columnDefs: [
                    { field:'Exp_folio', displayName:'Folio', width: 120, pinned:true, enableCellEdit: true },
		            { field:'UNI_nombre', displayName:'Unidad', width: 180 },
		            { field:'DocumentosDigitales', displayName:'Digitalizado', width: 120 },
		            { field:'EXP_fechaCaptura', displayName:'Fecha Captura', width: 120 },
		            { field:'Exp_poliza', displayName:'Poliza', width: 120 },
		            { field:'Exp_siniestro', displayName:'Siniestro', width: 120 },
		            { field:'Exp_reporte', displayName:'Reporte', width: 120 },
		            { field:'Exp_completo', displayName:'Lesionado', width: 250 },
		            { field:'RIE_nombre', displayName:'Riesgo', width: 120 },
		            { field:'Triage_nombre', displayName:'Triage', width: 120 },
		            { field:'EXP_costoEmpresa', displayName:'Costo', width: 120 }
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
    	if($scope.tipo == 'fax'){
    		var objeto3 = "FaxOrigianl:F; ";
    	}else if($scope.tipo == 'original'){
    		var objeto3 = "FaxOrigianl:O; ";
    	}else{
    		var objeto3 = ""; 
    	}

    	if($scope.folio.length == 0){
    		var objeto4 = "";
    	}else{
    		var objeto4 = "Folio:" + $scope.folio + "; ";	
    	}

    	if($scope.lesionado.length == 0){
    		var objeto5 = "";
    	}else{
    		var objeto5 = "Lesionado:" + $scope.lesionado + "; ";	
    	}

    	if($scope.producto == undefined || $scope.producto == 0){
    		var objeto6 = "";
    	}else{
    		var objeto6 = "Producto:" + $scope.producto.nombre + "; ";
    		
    	}

    	if($scope.etapa == undefined || $scope.etapa == 0){
    		var objeto7 = "";
    	}else{
    		var objeto7 = "Etapa:" + $scope.etapa + "; ";
    		
    	}


    	var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6 + objeto7;

    	$scope.filterOptions.filterText = filtro;

    	//console.log(filtro);

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

facturacionExCtrl.$inject =['$scope', '$rootScope', 'find' , 'loading', 'checkFolios'];

app.controller('facturacionExCtrl',facturacionExCtrl);