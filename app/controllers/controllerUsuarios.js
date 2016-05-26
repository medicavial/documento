app.controller('controllerUsuarios', function ($scope, loading, find, operacion){

	// inicializa los datos del formulario usuario al abrir el modal
	$('#myModalUser').on('show.bs.modal', function (e) {
	 	$scope.nuevoUsuario();
	});

	// limpiamos variables
	$scope.nuevoUsuario = function(){
		$scope.datos = {
			nombre:'',
			password:'',
			login:'',
			userweb:'',
			areaOp:'',
			usuactivo:'1',
			captura:false,
			controldoc:false,
			consulindiv:false,
			tickets:false,
			flujomanual:false,
			qualitas:false,
			reportes:false,
			flujopagos:false,
			flujodoc:false,
			usuarios:false,
			ticketspagos:false,
			facexpress:false

		}
			$scope.campoVisible=true;
			$scope.edicion=true;
	}

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

	var rowTempl = '<div ng-dblClick="editaUsurio(row.entity)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

	$scope.gridOptions = { 
		data: 'listado', 
		enableColumnResize:true,	
		enablePinning: true, 
		enableRowSelection:false,
		rowTemplate: rowTempl,
		selectedItems: $scope.selectos, 
		filterOptions: $scope.filterOptions,
		columnDefs: [

					{ field:'USU_nombre', displayName:'Nombre' , width: 190, pinned:true,},
	                { field:'USU_password', displayName:'Password', width: 120, visible:false },
	                { field:'USU_login', displayName:'Login', width: 80 },
	                { field:'USU_factivo', displayName:'UsuarioActivo', width: 100 },
	                { field:'USU_usuarioWeb', displayName:'UsuarioWeb', width: 100, visible: true},
	                { field:'ARO_claveint', displayName:'AreaOperativa', width: 100, visible: true}, 
	                { field:'USU_fcaptura', displayName:'Captura', width: 90 },
	                { field:'USU_fcontrolDocumentos', displayName:'ControlDocumentos', width: 140 },
	                { field:'USU_fconsultaIndividual', displayName:'ConsultaIndividual', width: 130 },
	                { field:'USU_ftickets', displayName:'Tickets', width: 70, visible:true },
	                { field:'USU_fmanual', displayName:'FlujoManual', width: 100, visible:true },
	                { field:'USU_fqualitas', displayName:'Qualitas', width: 70, visible:true },
	                { field:'USU_freportes', displayName:'Reportes', width: 70, visible:true },
	                { field:'USU_fpagos', displayName:'FlujoPagos', width: 80, visible:true },
	                { field:'USU_fdocumentos', displayName:'FlujoDocumentos', width: 120, visible:true },
	                { field:'USU_fusuarios', displayName:'Usuarios', width: 70, visible:true },
	                { field:'USU_fticketPagos', displayName:'TicketPagos', width: 100, visible:true },
	                { field:'USU_fexpress', displayName:'FacturacionExpress', width: 120, visible:true }

				    ],

		showFooter: true,
		showFilter:false
	};	

 //***********ENLISTA LOS USUARIOS DE CADA AREA***********
    $scope.altausuariosarea = function(area){

        $scope.area = area;
        find.usuariosarea(area).success( function (data){

            $scope.usuarios = data;

        });
        
    }

    $scope.guardaUsuario = function (){

    	if(edicion = true){

    		operacion.guardaUser($scope.datos).success(function (data){
    			console.log(data)
		        $scope.datos = [];

		        $scope.mensaje = "Se guardo correctamente";
		        $scope.tipoalerta = 'alert-success';
		    })
		    .error (function (data){
		        $scope.mensaje = "Ocurrio un error al guardar";
		        $scope.tipoalerta = 'alert-warning';
		    });

    	}else{
    		
    		$scope.editaUsurio();
    	}

	}

	//*******MUESTRA LOS DATOS DEL USUARIO EN EL MODAL**** 
	$scope.editaUsurio =function(usuario){
		console.log(usuario);
		$('#myModalUser').modal('show');
		$scope.datos = {
			nombre:usuario.USU_nombre,
			password:usuario.USU_password,
			login:usuario.USU_login,
			userweb:usuario.USU_usuarioWeb,
			areaOp:usuario.ARO_claveint,
			usuactivo:'1',
			captura:Number(usuario.USU_fcaptura),
			controldoc:Number(usuario.USU_fcontrolDocumentos),
			consulindiv:Number(usuario.USU_fconsultaIndividual),
			tickets:Number(usuario.USU_ftickets),
			flujomanual:Number(usuario.USU_fmanual),
			qualitas:Number(usuario.USU_fqualitas),
			reportes:Number(usuario.USU_freportes),
			flujopagos:Number(usuario.USU_fpagos),
			flujodoc:Number(usuario.USU_fdocumentos),
			usuarios:Number(usuario.USU_fusuarios),
			ticketspagos:Number(usuario.USU_fticketPagos),
			facexpress:Number(usuario.USU_fexpress)
		}

		$scope.campoVisible=false;
		$scope.edicion=false;
	}


	$scope.cambiaPass=function(){
		$scope.campoVisible=true;
		$scope.datos.password='';
	}

	$scope.filtra=function(){

		if($scope.login == undefined){
    		var objeto1 = "";
    		
    	}else{
    		var objeto1 = "nombre:" + $scope.login + "; ";
    	}

    	var filtro = objeto1 + $scope.busca;
    	// console.log(filtro);

    	$scope.filterOptions.filterText = filtro;
	}	

	$scope.limpiaDatos = function(){
    	$scope.datos = [];
		console.log($scope.datos);
    }
});