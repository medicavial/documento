/// Facturas qualitas
function controlFacturasCtrl($scope, $rootScope,$http, find, loading,api , FacturaUnidades, $location){

	$scope.inicio = function(){

		$scope.tituloFQ = "Factura x Atención";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.listado = [];
        $scope.Altaunidades();
		// $scope.buscafacturas();

		$('#modalEx').on('hidden.bs.modal', function (e){
			$scope.gridOptions.$gridScope.toggleSelectAll(false);
		 	// $scope.buscafacturas();
		});
	}
	//muestra facturas sin procesar
	$scope.buscafacturas = function(){

		loading.cargando('Buscando Folios(s)');
		//armamos los datos a enviar segun tipo de consulta (tipo)
		$scope.datos = {fechaini:$scope.fechaini,fechafin:$scope.fechafin};

		FacturaUnidades.buscaFolios($scope.datos).then(function (data){	
			if(data){
                console.log(data);

        		$scope.listado = data.data;
        		$scope.cantidad = data.length -1;

        	}else{
        		$scope.listado = [];
        	}		
    		loading.despedida();
		});

	}

	//////LLena el grid y toma filtros

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
        alert('hola');

      $scope.dfolios = [];

      $scope.dfolios = row.entity.Folio;
      $location.path('/detalleAtencion/'+row.entity.Folio);

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
                    { field:'Unidad',displayName:'Proveedor', width: 120, pinned: true},
                    { field:'Folio', displayName:'Folio' , width: 120 , pinned: true},
                    { field:'Lesionado', width: 330, pinned: true },
                    { field:'Producto', width: 120 },
                    { field:'Cliente', width: 100 },
                    { field:'fechaReg', width: 120,  cellFilter: 'date:\'dd/MM/yyyy\'' },
                    { field:'tiporecepcion', width: 120 },
        ],
        showFooter: true,
        showFilter:false,
    }

$scope.listadoFact = function(){

    loading.cargando('Cargando Folios(s)');
    $scope.datos = '';

    FacturaUnidades.buscalistado($scope.datos).success(function (data){
        if(data){

            $scope.listado = data;
        }else{
            $scope.listado = [];
        }       
        loading.despedida();
    });
}

$scope.enviaFolios = function(){

    $('#boton').button('loading');

    // console.log($scope.selectedRows);

    if ($scope.selectedRows.length > 0){
        FacturaUnidades.enviaFolios($scope.selectedRows, $rootScope.userWeb).success(function (data){

            var areaRecibe = 6;
            var areaEntrega = 13;
            var usuarioRecibe = 78;

            var ruta = api+'FacturaUnidades/actualiza';  
            var folios = [];
            for (var i = 0; i < $scope.selectedRows.length; i++){

                folios.push($scope.selectedRows[i].Folio); 

            };
            var datos = {

                folios:{folio:folios},//este el el conjunto de folios validos de nuestra primer promesa devuelta
                usuarioentrega:Number($rootScope.id),
                areaentrega:Number(areaEntrega),
                usuariorecibe:Number(usuarioRecibe),
                arearecibe:Number(areaRecibe)
            };

            $http.post(ruta,datos,{timeout: 10000})
            .success( function (data){

                // alert('hola');
                $scope.listadoFact();
                $('#boton').button('reset');

            }).error( function (data){

                $('#boton').button('reset');
                alert('Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas')

            });
                  

            });


    }else{

        alert('No se generó ninguna entrega');

    }
    
}

$scope.Altaunidades = function(){

    FacturaUnidades.unidades().success( function (data) {
        $scope.unidades = data;
        
     });
}

$scope.buscaxUnidad = function(id){

    loading.cargando('Buscando Folios');
    FacturaUnidades.buscaxUnidad(id).success(function (data){

        if(data){
            console.log(data);

            
            $scope.listado = data;
            // $scope.norelacion.referencia = data[0].referencia;

        }else{

            loading.despedida();
            $scope.listado = [];
            // $scope.norelacion.referencia = '';
        }

        if ($scope.listado.length == 0 ) {

            $scope.activaboton = false;

        }else{
            $scope.activaboton = true;
        }

        loading.despedida();

    });

}

};

controlFacturasCtrl.$inject = ['$scope', '$rootScope','$http', 'find', 'loading', 'api', 'FacturaUnidades', '$location'];


app.controller('controlFacturasCtrl',controlFacturasCtrl);
