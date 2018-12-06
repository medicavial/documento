app.controller('redmedicaCtrl', function ($scope, loading, find,operacion,$rootScope) {

	$scope.tituloUni = "Red Medica Ambulatoria";
	$scope.estatus = '';
	$scope.criterio = '';
	
    //*********RECIBO EL JSON DEL SERVICIO GET**********
	$scope.consultaUnidad = function (){
		loading.cargando('Buscando Unidades');
		find.contactoRedMedica().success(function (data){
			$scope.listado = data;
			loading.despedida();

		});
	}
	//*********MUESTRA LOS DATOS DE LA FUNCION EN EL GRID**********	
	$scope.inicio = function (){

		$scope.consultaUnidad();
	}

	$scope.filtra = function(){

    	//$scope.filterOptions.filterText = "";
    	//var filtro = "";
    	// console.log($scope.estatus);

    	if($scope.estatus == undefined){
    		var objeto1 = "";
    	}else{
    		var objeto1 = "activa:" + $scope.estatus + "; ";
    	}

    	var filtro = objeto1 + $scope.criterio;
    	// console.log(filtro);

    	$scope.filterOptions.filterText = filtro;

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

					{ field:'nombreCorto', displayName:'Nombre corto' , width: 160, pinned:true,},
	                { field:'nombre', displayName:'Nombre', width: 300, visible:true },
	                { field:'ejecutivo', displayName:'Ejecutivo', width: 160, visible:true },
	                { field:'correo', displayName:'Correo Ejecutivo', width: 180 },
	                { field:'celular', displayName:'Telefono Contacto', width: 120 },
	                { field:'rfc', displayName:'RFC', width: 120, visible: true},
	                { field:'activa',displayName:'Estatus', cellTemplate:'<div ng-if="row.entity.activa == 0">Activo</div> <div ng-if="row.entity.activa == 1">Inactivo</div>', width: 80 },
	                //SE GENERAN LOS BOTONES CON LA FUNCIONALIDAD DE ACTIVAR O DESACTIVAR VALOR.
	                // { displayName:'Accion' ,cellTemplate:'  <button  class="btn btn-default" ng-if="row.entity.activa == 1" ng-click="cambio(row.entity.id,0)">Activar</button> <button class="btn btn-default" ng-if="row.entity.activa == 0" ng-click="cambio(row.entity.id,1)">Desactivar</button>' }

				    ],

		showFooter: true,
		showFilter:false
	};


	$scope.cambio = function(unidad,estatus){
		operacion.cambioUnidad(unidad,estatus,$rootScope.id).success(function (data){
			console.log(data)
            alert("Cambio Exitoso") 
            $scope.consultaUnidad();
        })

        .error (function (data){
            alert("Ocurrio un error en el cambio, intente nuevamente")
        });
	}
});