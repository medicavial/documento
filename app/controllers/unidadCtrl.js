app.controller('unidadCtrl', function ($scope, loading, find) {

	$scope.tituloUni = "Unidades";
	
    //*********RECIBO EL JSON DEL SERVICIO GET**********
	$scope.consultaUnidad = function (){
		loading.cargando('Buscando Unidades');
		find.unidadesred().success(function (data){
			$scope.listado = data;
			loading.despedida();

		});
	}
	//*********MUESTRA LOS DATOS DE LA FUNCION EN EL GRID**********	
	$scope.inicio = function (){

		$scope.consultaUnidad();
	}


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

					{ field:'nombreCorto', displayName:'Nombre corto' , width: 120, pinned:true,},
	                { field:'nombre', displayName:'Nombre', width: 120, visible:true },
	                { field:'estado', displayName:'Estado', width: 100 },
	                { field:'localidad', displayName:'Localidad', width: 120 },
	                { field:'rfc', displayName:'RFC', width: 100, visible: true},
	                { field:'direccion', displayName:'Direccion', width: 100 },
	                { displayName:'Estatus' ,cellTemplate:'  <a ng-if="row.entity.estatus == 0" href="" ng-click="elimina(row)">Desactivar</a> <a ng-if="row.entity.estatus == 1" href="" ng-click="elimina(row)">Activar</a>'}
	                // { field:'id', displayName:'Estatus', width: 120 }

				    ],

		showFooter: true,
		showFilter:false
	};		
});