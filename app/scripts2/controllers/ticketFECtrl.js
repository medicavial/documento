//menu de tickets donde se imprimen los generados al dia
function ticketFECtrl($scope, $location, find, loading){

	// loading.despedida();

	// loading.cargando('Cargando Tickets');

	// $scope.clientes = datos[0].data;
	// $scope.status = datos[1].data;
	// $scope.unidades = datos[2].data;
	// $scope.usuarios = datos[3].data;

	find.empresasweb().success(function (data){
		$scope.clientes = data;	
	});
    find.statusweb().success(function (data){
    	$scope.status = data;	
    });
    find.unidadesweb().success(function (data){
    	$scope.unidades = data;	
    });
    find.usuariosweb().success(function (data){
    	$scope.usuarios = data;	
    });

	$scope.inicio = function(){

		$scope.tituloTi = "Tickets";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.interno = '';
		$scope.web = '';
		$scope.ticketsxfecha();

	}


	$scope.exportar = function(){
		JSONToCSVConvertor($scope.listado,'Reporte',true);
	}


	$scope.ticketxfoliointerno = function(){

		loading.cargando('Buscando Ticket(s)');

		find.ticketsxfoliointerno($scope.interno).success( function (data) {

			$scope.listado = data;
			loading.despedida();
			$scope.quitafiltro();

		});

	}


	$scope.ticketxfolio = function(){

		loading.cargando('Buscando Ticket(s)');

		find.ticketsxfolio($scope.web).success( function (data) {

			$scope.listado = data;
			loading.despedida();
			$scope.quitafiltro();

		 });

	}

	$scope.ticketsxfecha = function(){

		loading.cargando('Buscando Ticket(s)');
		var datos = {fechaini:$scope.fechaini,fechafin:$scope.fechafin};
		find.ticketsxfecha(datos).success( function (data){
        		$scope.listado = data;
        		loading.despedida();
		});

	}	


	//////LLena el grid y toma filtros
	$scope.listado = [];
	///filtros
	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
	};

    ////opciones del grid                 
    $scope.gridOptions = { 
    	data: 'listado', 
    	enableColumnResize:true,
    	enablePinning: true, 
    	enableRowSelection:false,
    	// multiSelect:false,
    	// rowTemplate: rowTempl,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
                    { field:'Cliente', width: 120, pinned: true},
                    { field:'Folio_Interno', width: 90 },
                    { field:'Folio_Web', width: 90 },
                    { field:'Asignado', width: 200 },
                    { field:'Categoria', width: 220 },
		            { field:'Etapa', width: 80 },
		            { field:'Lesionado', width: 320 },
		            { field:'Registro', width: 200 },
		            { field:'Status', width: 120},
		            { field:'Ultima_Actualizacion', width: 200 },
		            { field:'Subcategoria', width: 120 },
		            { field:'Unidad', width: 350 },
		            { field:'Usuario_Registro', width: 220 },
		            { field:'Observaciones', width: 350 }
		            // { field:'FechaPago', width: 120 },
		            // { field:'FechaCaptura', width: 120 },
		            // { field:'Factura', width: 120 },
		            // { field:'Remesa', width: 120 },
		            // { field:'Escolaridad', width: 120 },
		            // { field:'Cancelado', width: 120 }
        ],
        showFooter: true,
        showFilter:false
    };

    $scope.filtra = function(){

    	//$scope.filterOptions.filterText = "";
    	//var filtro = "";

    	// console.log($scope.unidad);

    	if($scope.unidad == undefined || $scope.unidad == 0){
    		var objeto1 = "";
    	}else{
    		var objeto1 = "Unidad:" + $scope.unidad.Nombre + "; ";
    		
    	}
    	if($scope.cliente == undefined || $scope.cliente == 0){
    		var objeto2 = "";
    	}else{
    		var objeto2 = "Cliente:" + $scope.cliente.Nombre + "; ";
    	}
    	if($scope.usuario == undefined || $scope.usuario == 0){
    		var objeto3 = "";
    	}else{
    		var objeto3 = "Usuario_Registro:" + $scope.usuario.Nombre + "; ";
    	}

    	if($scope.interno.length == 0){
    		var objeto4 = "";
    	}else{
    		var objeto4 = "Folio_Interno:" + $scope.interno + "; ";	
    	}

    	if($scope.web.length == 0){
    		var objeto5 = "";
    	}else{
    		var objeto5 = "Folio_Web:" + $scope.web + "; ";	
    	}

    	if($scope.statu == undefined || $scope.statu == 0){
    		var objeto6 = "";
    	}else{
    		var objeto6 = "Status:" + $scope.statu.Nombre + "; ";
    		
    	}


    	var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6; //+ objeto7;

    	$scope.filterOptions.filterText = filtro;

    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = ''; 
    	$scope.unidad = 0; 
    	$scope.cliente = 0;
    	$scope.statu = 0; 
    	$scope.usuario = 0;
    	$scope.interno = '';
		$scope.web = '';
    
    }

};

ticketFECtrl.$inject = ['$scope', '$location', 'find', 'loading'];

app.controller('ticketFECtrl', ticketFECtrl);