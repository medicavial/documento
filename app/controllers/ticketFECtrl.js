function TicketCtrl($scope,$rootScope, $http, find, $routeParams, datos, loading,tickets){

	loading.despedida();
};
//generacion de tickets
function ticketFECtrl($scope,$rootScope, $http, find, tickets){

	$scope.inicio = function(){

		$scope.bloqueado = false;
		$scope.mensaje = '';

		if ($rootScope.userWeb == undefined){
			$scope.mensaje = 'No tienes usuario para dar de alta ticket solicitalo en el area de sistemas';
			$scope.bloqueado = true;
		};

		$scope.tituloT = "Generar Ticket"
		$scope.mensaje2 = '';
		$scope.datos = {
			folioweb:'',
			folioIn:'',
			cliente:'',
			unidad:'',
			etapa:'',
			categoria:'',
			subcategoria:'',
			statusa:'',
			asignado:'',
			fechaasignado:'',
			notas:'',
			comunicacion:'',
			fechacomunica:'',
			observaciones:'',
			diagnostico:false,
			firma:false,
			notamedica:false,
			finiquito:false,
			refactura:false,
			pase:false,
			suministro:false,
			identificacion:false,
			verificacion:false,
			notamedicain:false,
			informe:false,
			reverso:false,
			verificapar:false,
			nocoincide:false,
			pasemedico:false,
			nombrein:false,
			folioseg:false,
			sinpase:false,
			fueravigencia:false,
			sinpoliza:false,
			sindeducible:false,
			cedulaT:false,
			cedulaI:false,
			sincuestionario:false,
			firmamedico:false,
			cruce:false,
			usuario:$rootScope.userWeb,
			usuariomv:$rootScope.id
		}

		// $('.btn').button('toggle');
		$('.btn').removeClass('active');

		$scope.cargar = false;
		$scope.edicion = false;
		$scope.altacategorias();
		$scope.altastatus();
		$scope.empresasWeb();
		$scope.unidadesWeb();
		$scope.datos.folioIn = 'NUEVO';

	}

	$scope.ValidaInfo = function(){

		if ($scope.bloqueado) {
			return true;
		}else{
			return $scope.formTicket.$invalid;
		}
	}

	$scope.siguiente = function(){

		if ($scope.datos.folioIn == 'NUEVO') {

			find.ultimoticket().success(function (data){
				
				$scope.datos.folioIn = Number(data) + 1; 
				$scope.guardaTicket();

			});

		}else{

			$scope.tipoalerta = 'alert-warning';
			$scope.mensaje2  = 'El folio interno ya fue guardado';

		}
		
	}

	//busca clientes
	$scope.empresasWeb = function(){

		find.empresasweb().success( function (data) {

			$scope.clientes = data;

		 });

	}
	//busca unidades
	$scope.unidadesWeb = function(){

		find.unidadesweb().success( function (data) {

			$scope.unidades = data;

		});

	}

	$scope.altacategorias = function(){

		find.categorias().success(function (data){
			$scope.categorias = data;
		});
		
	}

	$scope.altasubcategorias = function(id){
		
		find.subcategorias(id).success(function (data){
			$scope.subcategorias = data;
		});
	}

	$scope.altastatus = function(){

		find.statusweb().success(function (data){
			$scope.status = data;
		});
	}

	//busqueda de folio especiico
	$scope.foliosxfolio = function(folio){

		if ($scope.datos.folioweb) {
			$scope.mensaje = '';
			$scope.cargar = true;
			
			find.folioweb($scope.datos.folioweb).success( function (data){
	        	
	        
	        	if(data.length == 0){

	        		$scope.mensaje  = 'No se encontro el Folio Solicitado';

	        	}else{


	        		$scope.datos.cliente = data[0].Cia_clave;
	        		$scope.datos.unidad = data[0].Uni_clave;

	        		find.ticketsxfolio($scope.datos.folioweb).success(function (data){
	        			// console.log(data);
	        			if (data.length == 0) {
	        				$scope.datos.etapa = '1';
	        			}else{
	        				$scope.datos.etapa = '2';
	        			}
	        			// console.log($scope.datos.etapa);
	        		});

	        	}

				$scope.cargar = false;
				
				//console.log(data);
			});			
		};

	}

	$scope.guardaTicket = function(){

		$('#boton').button('loading');

		tickets.guardar($scope.datos).success( function (data){
			        	
			$scope.mensaje2 = data.respuesta;
			$scope.tipoalerta = 'alert-success';
			$('#boton').button('reset');			

		}).error( function (data){

			$scope.mensaje2 = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
			$scope.tipoalerta = 'alert-warning';
			$('#boton').button('reset');

		});

	}

};

//menu de tickets donde se imprimen los generados al dia
function menuticketCtrl($scope, $location, find, loading){

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

TicketCtrl.$inject = ['$scope','$rootScope', '$http', 'find', '$routeParams','datos','loading','tickets'];
ticketFECtrl.$inject = ['$scope','$rootScope', '$http', 'find','tickets'];
menuticketCtrl.$inject = ['$scope', '$location', 'find', 'loading'];

app.controller('TicketCtrl',TicketCtrl);
app.controller('ticketFECtrl', ticketFECtrl);
app.controller('menuticketCtrl', menuticketCtrl);