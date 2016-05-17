app.controller('controllerUsuarios', function ($scope, loading, find, operacion){

 //*********RECIBO EL JSON DEL SERVICIO GET**********
	$scope.cargaUsuarios = function(){
		loading.cargando('Buscando Usuarios');
		find.usuarios().success( function (data){
        		$scope.listado = data;
        		loading.despedida();
		});

	}

 //*********MUESTRA LOS DATOS DE LA FUNCION EN EL GRID**********	
	$scope.inicio = function (){

		$scope.cargaUsuarios();
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

					{ field:'USU_nombre', displayName:'Nombre' , width: 120, pinned:true,},
	                { field:'USU_password', displayName:'Password', width: 120, visible:false },
	                { field:'USU_login', displayName:'Login', width: 100 },
	                { field:'USU_factivo', displayName:'UsuarioActivo', width: 120 },
	                { field:'USU_usuarioWeb', displayName:'UsuarioWeb', width: 100, visible: true},
	                { field:'USU_fcaptura', displayName:'Captura', width: 100 },
	                { field:'USU_fcontrolDocumentos', displayName:'ControlDocumentos', width: 120 },
	                { field:'USU_fconsultaIndividual', displayName:'ConsultaIndividual', width: 130 },
	                { field:'USU_ftickets', displayName:'Tickets', width: 100, visible:false },
	                { field:'USU_fmanual', displayName:'FlujoManual', width: 100, visible:false },
	                { field:'USU_fqualitas', displayName:'Qualitas', width: 100, visible:false },
	                { field:'USU_freportes', displayName:'Reportes', width: 100, visible:true },
	                { field:'USU_fpagos', displayName:'FlujoPagos', width: 100, visible:false },
	                { field:'USU_fdocumentos', displayName:'FlujoDocumentos', width: 100, visible:false },
	                { field:'USU_fusuarios', displayName:'Usuarios', width: 100, visible:false },
	                { field:'USU_fticketPagos', displayName:'TicketPagos', width: 100, visible:true },
	                { field:'USU_fexpress', displayName:'FacturacionExpress', width: 100, visible:true }

				    ],

		showFooter: true,
		showFilter:false
	};	

	// $scope. limpiaDatos = function (){
	// 	$scope.datos = [];
	// }

 //***********ENLISTA LOS USUARIOS DE CADA AREA***********
    $scope.altausuariosarea = function(area){

        $scope.area = area;
        find.usuariosarea(area).success( function (data){

            $scope.usuarios = data;

        });
        
    }

    $scope.guardaUsuario = function (){

        operacion.guardaUser($scope.datos).success(function (data){
            console.log(data)
            $scope.datos = [];
        })
	}

	$scope.limpiaDatos = function(){
    	$scope.datos = [];
		console.log($scope.datos);
    }
});