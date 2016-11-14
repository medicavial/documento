app.controller('cancelaSolCtrl', function ($scope, loading, find, operacion){

	// limpiamos variables y muestra datos en el Grid
	$scope.inicio = function(){

		$scope.tituloSC = "Solicitudes de Cancelación";
		$scope.datos = {
			tipoCancel:'',
			motivoCancel:'',
			folioSust:'',
			observaciones:'',
			usuaCancela:'',
			datepicker:''
		}
		$scope.solicitudCancel();
	}

 	//********* RECIBO JSON DEL SERVICIO **********
	$scope.solicitudCancel = function(){
		loading.cargando('Cargando...');
		find.solicitud().success( function (data){
        		$scope.listado = data;
        		loading.despedida();
        		console.log(data);
		});

	}

	//***** LLENA EL GRID Y TOMA FILTROS *****

    $scope.listado = [];

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
        selectedItems: $scope.listado, 
        filterOptions: $scope.filterOptions,
        columnDefs: [

					{ field:'Exp_mcancelado', displayName:'Tipo de Cancelación' , width: 220, pinned:true,},
	                { field:'Usu_registro', displayName:'Usuario que Canceló', width: 170, visible: true},
	                { field:'Exp_motCancel', displayName:'Motivo de Cancelación', width: 180, visible:true },
	                { field:'Exp_duplicado', displayName:'Folio Sustituto', width: 135 },
	                { field:'Exp_cm', displayName:'Observaciones', width: 200 },
	                { field:'Exp_fcancelado', displayName:'Fecha de Solicitud', width: 208, visible: true,} 
	             
				    ],
        showFooter: true,
        showFilter:true
    };	


	$scope.limpiaDatos = function(){
    	$scope.datos = [];
		console.log($scope.datos);
    }
    

	$scope.quitaselectos = function(){

        $scope.gridOptions.$gridScope.toggleSelectAll(false);
    }

    $scope.cancela = function(){
    	$('#boton').button('loading');

    	if ($scope.listado.length > 0) {

                    // console.log(data);
                    $scope.mensaje = data.respuesta;
                    $scope.tipoalerta = 'alert-success';
                    $scope.cargaFlujo();
                    $('#boton').button('reset');
                    if (data.listado.length > 0) {
                        $rootScope.listado = data.listado;
                    };

                    $scope.gridOptions.$gridScope.toggleSelectAll(false);

                    $('#boton').button('reset');
                    $scope.mensaje = error;
                    $scope.tipoalerta = 'alert-warning';
        }else{
            alert('No se ha seleccionado ningun documento');
        }
    }	

});