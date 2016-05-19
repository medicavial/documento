app.controller('unidadCtrl', function ($scope, loading, find,operacion) {

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

	// $scope.action = function (){

	// }

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
	                { field:'activa',displayName:'Estatus', cellTemplate:'<div ng-if="row.entity.activa == 0">Activo</div> <div ng-if="row.entity.activa == 1">Inactivo</div>', width: 120 },
	                //SE GENERAN LOS BOTONES CON LA FUNCIONALIDAD DE ACTIVAR O DESACTIVAR VALOR.
	                { displayName:'Accion' ,cellTemplate:'  <button  class="btn btn-default" ng-if="row.entity.activa == 1" ng-click="cambio(row.entity.id,row.entity.activa)">Activar</button> <button class="btn btn-default" ng-if="row.entity.activa == 0" ng-click="cambio(row.entity.id,row.entity.activa)">Desactivar</button>' }

				    ],

		showFooter: true,
		showFilter:false
	};


	$scope.cambio = function(unidad,estatus){
		operacion.cambiounidad(unidad,estatus).success(function (data){
			console.log(data)
            alert("Cambio Exitoso") 
            $scope.consultaUnidad();
        })

        .error (function (data){
            alert("Ocurrio un error en el cambio, intente nuevamente")
        });
	}
});