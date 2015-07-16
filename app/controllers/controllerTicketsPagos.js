//edicion de tickets

function editaTicketPagosCtrl($scope,$rootScope, $http, find, $routeParams, datos, loading,ticketpagos){

	loading.despedida();

	$scope.clientes = datos[0].data;
	$scope.status = datos[1].data;
	$scope.unidades = datos[2].data;
	$scope.categorias = datos[3].data;
	
	$scope.inicio = function(){

		$scope.tituloT = "Generar Ticket";
		$scope.mensaje = '';
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
			usuario:$rootScope.userWeb,
			usuariomv:$rootScope.id
		}

		$scope.cargar = false;
		$scope.edicion = true;

		$scope.muestraticket(datos[4].data);

	}

	$scope.altasubcategorias = function(id){
		
		find.subcategoriaspagos(id).success(function (data){
			$scope.subcategorias = data;
		});
	}


	$scope.muestraticket = function(data){

		$scope.nombre = data.expediente.Exp_completo;
		$scope.compania = data.expediente.Cia_nombrecorto;
		$scope.siniestro = data.expediente.Exp_siniestro;
		$scope.reporte = data.expediente.Exp_reporte;
		$scope.poliza = data.expediente.Exp_poliza;
		$scope.telefono = data.expediente.Exp_telefono;
		$scope.mail = data.expediente.Exp_mail;
		$scope.fechana = data.expediente.Exp_fechaNac;
		$scope.sexo = data.expediente.Exp_sexo;

		$scope.datos.folioweb = data.ticket.Exp_folio;
		$scope.datos.folioIn = data.ticket.TSeg_clave;
		$scope.datos.categoria = data.ticket.TCat_clave;
		$scope.datos.asignado = data.ticket.TSeg_asignado;
		$scope.datos.fechaasignado = data.ticket.TSeg_asignadofecha;
		$scope.datos.etapa = data.ticket.TSeg_etapa;

		$scope.altasubcategorias(data.ticket.TCat_clave);

		$scope.datos.subcategoria = data.ticket.TSub_clave;
		$scope.datos.statusa = data.ticket.TStatus_clave;
		$scope.datos.observaciones = data.ticket.TSeg_obs;

		$scope.notas = data.notas;

	}

	$scope.guardaTicket = function(){

		// console.log($scope.datos);
		$('#boton').button('loading');

		ticketpagos.actualiza($scope.datos).success( function (data){  

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
function menuticketPagosCtrl($scope, $location, find, loading,datos){

	loading.despedida();

	$scope.clientes = datos[0].data;
	$scope.status = datos[1].data;
	$scope.unidades = datos[2].data;
	$scope.usuarios = datos[3].data;
	$scope.listado = datos[4].data;

	$scope.inicio = function(){

		$scope.tituloTi = "Tickets";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.interno = '';
		$scope.web = '';

	}





	$scope.ticketxfoliointerno = function(){

		loading.cargando('Buscando Ticket(s)');

		find.ticketspagosxfoliointerno($scope.interno).success( function (data) {

			$scope.listado = data;
			loading.despedida();
			$scope.quitafiltro();

		});

	}


	$scope.ticketxfolio = function(){

		loading.cargando('Buscando Ticket(s)');

		find.ticketspagosxfolio($scope.web).success( function (data) {

			$scope.listado = data;
			loading.despedida();
			$scope.quitafiltro();

		 });

	}

	$scope.ticketsxfecha = function(){

		loading.cargando('Buscando Ticket(s)');
		var datos = {fechaini:$scope.fechaini,fechafin:$scope.fechafin};
		find.ticketspagosxfecha(datos).success( function (data){
        		$scope.listado = data;
        		loading.despedida();
		});

	}	


	//////LLena el grid y toma filtros
	$scope.selectos = [];
	///filtros
	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
	};

	var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

	$scope.onDblClickRow = function(row){
	  // console.log(row.entity.Folio_Interno);
	  $location.path('/ticketpagos/'+row.entity.Folio_Interno+'/'+row.entity.Folio_Web );
	};

    ////opciones del grid                 
    $scope.gridOptions = { 
    	data: 'listado', 
    	enableColumnResize:true,
    	enablePinning: true, 
    	enableRowSelection:true,
    	multiSelect:false,
    	rowTemplate: rowTempl,
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

//generacion de tickets
function ticketPagoCtrl($scope,$rootScope, find, ticketpagos){

	$scope.inicio = function(){

		$scope.bloqueado = false;
		$scope.mensaje = '';

		if ($rootScope.userWeb == undefined){
			$scope.mensaje = 'No tienes usuario para dar de alta ticket solicitalo en el area de sistemas';
			$scope.bloqueado = true;
		};

		$scope.tituloT = "Generar Ticket de Pagos"
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

		find.categoriaspagos().success(function (data){
			$scope.categorias = data;
		});
		
	}

	$scope.altasubcategorias = function(id){
		
		find.subcategoriaspagos(id).success(function (data){
			$scope.subcategorias = data;
		});
	}

	$scope.altastatus = function(){

		find.statuspagos().success(function (data){
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

		ticketpagos.guardar($scope.datos).success( function (data){
			        	
			$scope.mensaje2 = data.respuesta;
			$scope.datos.folioIn = data.foliointerno;
			$scope.tipoalerta = 'alert-success';
			$('#boton').button('reset');			

		}).error( function (data){

			$scope.mensaje2 = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
			$scope.tipoalerta = 'alert-warning';
			$('#boton').button('reset');

		});

	}

};


ticketPagoCtrl.$inject = ['$scope','$rootScope', 'find', 'ticketpagos'];
menuticketPagosCtrl.$inject = ['$scope', '$location', 'find', 'loading','datos'];
editaTicketPagosCtrl.$inject = ['$scope','$rootScope', '$http', 'find', '$routeParams', 'datos', 'loading','ticketpagos'];

app.controller('ticketPagoCtrl',ticketPagoCtrl);
app.controller('menuticketPagosCtrl',menuticketPagosCtrl);
app.controller('editaTicketPagosCtrl',editaTicketPagosCtrl);