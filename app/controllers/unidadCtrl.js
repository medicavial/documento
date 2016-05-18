app.controller('unidadCtrl', function ($scope) {

	$scope.tituloUni = "Unidades";


	//*********SE DECLARA EL GRID Y SUS COLUMNAS********
	$scope.listado = [];
	///filtros
	$scope.filterOptions = {
		filterText: '',
		useExternalFilter: false
	};

	$scope.gridOptions = { 
		data: 'listado', 
		enableColumnResize:true,	
		enablePinning: true, 
		enableRowSelection:false,
		selectedItems: $scope.selectos, 
		filterOptions: $scope.filterOptions,
		columnDefs: [

					{ field:'UNI_nombrecorto', displayName:'Nombre corto' , width: 120, pinned:true,},
	                { field:'UNI_nombre', displayName:'Nombre', width: 120, visible:true },
	                { field:'USU_login', displayName:'Estado', width: 100 },
	                { field:'UNI_colonia', displayName:'Localidad', width: 120 },
	                { field:'UNI_rfc', displayName:'RFC', width: 100, visible: true},
	                { field:'UNI_callenum', displayName:'Direccion', width: 100 },
	                { field:'UNI_activa', displayName:'Estatus', width: 120 } 

				    ],

		showFooter: true,
		showFilter:false
	};		
});