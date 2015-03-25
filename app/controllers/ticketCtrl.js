///controlador para editar el ticket 
app.controller('editaTicketCtrl', function ($scope,$rootScope, $http, find, $routeParams){
	
	$scope.inicio = function(){

		$scope.tituloT = "Generar Ticket"
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
		$scope.altacategorias();
		$scope.altastatus();
		$scope.empresasWeb();
		$scope.unidadesWeb();

		$scope.muestraticket();

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

	$scope.muestraticket = function(){

		find.detalleticket($routeParams.foliointerno,$routeParams.folioweb).success(function (data){

			$scope.nombre = data.expediente[0].Nombre;
			$scope.compania = data.expediente[0].Cia_nombrecorto;
			$scope.siniestro = data.expediente[0].Exp_siniestro;
			$scope.reporte = data.expediente[0].Exp_reporte;
			$scope.poliza = data.expediente[0].Exp_poliza;
			$scope.telefono = data.expediente[0].Exp_telefono;
			$scope.mail = data.expediente[0].Exp_mail;
			$scope.fechana = data.expediente[0].Exp_fechaNac;
			$scope.sexo = data.expediente[0].Exp_sexo;

			$scope.datos.folioweb = data.ticket[0].Exp_folio;
			$scope.datos.folioIn = data.ticket[0].TSeg_clave;
			$scope.datos.categoria = data.ticket[0].TCat_clave;
			$scope.datos.asignado = data.ticket[0].TSeg_asignado;
			$scope.datos.fechaasignado = data.ticket[0].TSeg_asignadofecha;
			$scope.datos.etapa = data.ticket[0].TSeg_etapa;

			$scope.altasubcategorias(data.ticket[0].TCat_clave);

			$scope.datos.subcategoria = data.ticket[0].TSub_clave;
			$scope.datos.statusa = data.ticket[0].TStatus_clave;
			$scope.observaciones = data.ticket[0].TSeg_obs;

			$scope.notas = data.notas;
			$scope.comunicaciones = data.comunicacion;

		});
	}

	// presiona Folio
	$scope.presionaFolio = function(evento){

		//contamos la cadena completa
		var cantidad = $scope.datos.folioweb.length;

		//los primero cuatro caracteres NO deben ser numeros
		if(cantidad < 3){
			if (evento.keyCode >= 48 && evento.keyCode <= 57 || evento.keyCode >= 96 && evento.keyCode <= 105) {
		      	evento.preventDefault();
		    }
		}

		//los ultimos 6 NO deben ser letras
		if(cantidad > 3 && cantidad < 9){
			if (evento.keyCode >= 65 && evento.keyCode <= 90) {
		      	evento.preventDefault();
		    }
		}

		//Si son mas de 10 digitos no escribas mas
		if(cantidad > 9){
			if (evento.keyCode != 8  && evento.keyCode != 46 ) {

		      	evento.preventDefault();
		    }      	
		}

		//Si se da enter o salto de linea ejecuta la funcion verifica folio pasandole que es de tipo fax
		if (evento.keyCode == 13 || evento.keyCode == 9) {

	      	$scope.verificaFolio();

	    }	

	}

	$scope.verificaFolio = function(){

		if ($scope.datos.folioweb != '') {

			var totalletras = $scope.datos.folioweb.length

			var letras = $scope.datos.folioweb.substr(0,4);
			var numeros = $scope.datos.folioweb.substr(4,totalletras);

			if(letras.length < 4 ){

				var faltantes = 4 - letras.length;

				for (var i = 0; i < faltantes; i++) {

					var letra = letras.charAt(i);
					letras = letras + "0";
				}
			}

			if(numeros.length < 6 ){

				var faltantes = 6 - numeros.length;

				for (var i = 0; i < faltantes; i++) {
					
					numeros = "0" + numeros;
				}
			}

			$scope.datos.folioweb = letras + numeros;

			$scope.foliosxfolio();
		}	

	}

	//busqueda de folio especiico
	$scope.foliosxfolio = function(){

		$scope.mensaje = '';
		$scope.cargar = true;
		
		find.folioweb($scope.datos.folioweb).success( function (data){
        	
        
        	if(data.length == 0){

        		$scope.mensaje  = 'No se encontro el Folio Solicitado';

        	}else{

        		console.log(data[0].Cia_clave);
        		console.log(data[0].Uni_clave);

        		$scope.datos.cliente = data[0].Cia_clave;
        		$scope.datos.unidad = data[0].Uni_clave;

        		find.listaticketsfolio($scope.datos.folioweb).success(function (data){

        			if (data.length > 0 ) {

        				$scope.datos.etapa = 2;
        			}else{
        				$scope.datos.etapa = 1;
        			}
        		});

        	}

			$scope.cargar = false;
			
			//console.log(data);
		}).error( function (xhr,status,data){

			$scope.cargar = false;
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});

	}

	$scope.siguiente = function(){

		console.log($scope.datos);

		$http({
				url:'/documento/api/actualizaticket',
				method:'POST', 
				contentType: 'application/json', 
				dataType: "json", 
				data:$scope.datos
			}).success( function (data){
				        	
				$scope.mensaje2 = data.respuesta;
				$scope.tipoalerta = 'alert-success';

				$scope.muestraticket();			

			}).error( function (data){

				$scope.mensaje2 = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
				$scope.tipoalerta = 'alert-warning';

			});

	}

});
	
//generacion de tickets
app.controller('ticketCtrl', function ($scope,$rootScope, $http, find){

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

	$scope.siguiente = function(){

		if ($scope.datos.folioIn == 'NUEVO') {

			find.ultimoticket().success(function (data){
				$scope.datos.folioIn = Number(data[0].ultimo) + 1; 
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

	// presiona Folio
	$scope.presionaFolio = function(evento){

		//contamos la cadena completa
		var cantidad = $scope.datos.folioweb.length;

		//los primero cuatro caracteres NO deben ser numeros
		if(cantidad < 3){
			if (evento.keyCode >= 48 && evento.keyCode <= 57 || evento.keyCode >= 96 && evento.keyCode <= 105) {
		      	evento.preventDefault();
		    }
		}

		//los ultimos 6 NO deben ser letras
		if(cantidad > 3 && cantidad < 9){
			if (evento.keyCode >= 65 && evento.keyCode <= 90) {
		      	evento.preventDefault();
		    }
		}

		//Si son mas de 10 digitos no escribas mas
		if(cantidad > 9){
			if (evento.keyCode != 8  && evento.keyCode != 46 ) {

		      	evento.preventDefault();
		    }      	
		}

		//Si se da enter o salto de linea ejecuta la funcion verifica folio pasandole que es de tipo fax
		if (evento.keyCode == 13 || evento.keyCode == 9) {

	      	$scope.verificaFolio();

	    }	

	}

	$scope.verificaFolio = function(){

		if ($scope.datos.folioweb != '') {

			var totalletras = $scope.datos.folioweb.length

			var letras = $scope.datos.folioweb.substr(0,4);
			var numeros = $scope.datos.folioweb.substr(4,totalletras);

			if(letras.length < 4 ){

				var faltantes = 4 - letras.length;

				for (var i = 0; i < faltantes; i++) {

					var letra = letras.charAt(i);
					letras = letras + "0";
				}
			}

			if(numeros.length < 6 ){

				var faltantes = 6 - numeros.length;

				for (var i = 0; i < faltantes; i++) {
					
					numeros = "0" + numeros;
				}
			}

			$scope.datos.folioweb = letras + numeros;

			$scope.foliosxfolio();
		}	

	}

	//busqueda de folio especiico
	$scope.foliosxfolio = function(){

		$scope.mensaje = '';
		$scope.cargar = true;
		
		find.folioweb($scope.datos.folioweb).success( function (data){
        	
        
        	if(data.length == 0){

        		$scope.mensaje  = 'No se encontro el Folio Solicitado';

        	}else{

        		console.log(data[0].Cia_clave);
        		console.log(data[0].Uni_clave);

        		$scope.datos.cliente = data[0].Cia_clave;
        		$scope.datos.unidad = data[0].Uni_clave;

        		find.listaticketsfolio($scope.datos.folioweb).success(function (data){

        			if (data.length > 0 ) {

        				$scope.datos.etapa = 2;
        			}else{
        				$scope.datos.etapa = 1;
        			}
        		});

        	}

			$scope.cargar = false;
			
			//console.log(data);
		}).error( function (xhr,status,data){

			$scope.cargar = false;
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});

	}

	$scope.guardaTicket = function(){

		console.log($scope.datos);

		$http({
				url:'/documento/api/altaticket',
				method:'POST', 
				contentType: 'application/json', 
				dataType: "json", 
				data:$scope.datos
			}).success( function (data){
				        	
				$scope.mensaje2 = data.respuesta;
				$scope.tipoalerta = 'alert-success';			

			}).error( function (data){

				$scope.mensaje2 = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
				$scope.tipoalerta = 'alert-warning';

			});

	}

});

//menu de tickets donde se imprimen los generados al dia

app.controller('menuticketCtrl', function ($scope, $rootScope, $http, find, loading, $location,$window,$compile,$filter){

	$scope.inicio = function(){

		$scope.tituloTi = "Tickets";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.interno = '';
		$scope.web = '';
		$scope.empresasWeb();
		$scope.statusweb();
		$scope.unidadesWeb();
		$scope.usuariosWeb();

		$scope.ticketsxfecha();

	}

	//busquedas
	//busca clientes
	$scope.empresasWeb = function(){

		find.empresasweb().success( function (data) {

			$scope.clientes = data;

		 });
	}

	//busca status
	$scope.statusweb = function(){

		find.statusweb().success( function (data) {

			$scope.status = data;

		 });
	}


	//busca unidades
	$scope.unidadesWeb = function(){

		find.unidadesweb().success( function (data) {

			$scope.unidades = data;

		 });
	}

	$scope.ticketxfolio = function(){

		loading.cargando('Buscando Ticket(s)');

		find.listatickets($scope.interno).success( function (data) {

			$scope.listado = data;
			loading.despedida();

		 });

		 $scope.quitafiltro();
	}


	// presiona Folio
	$scope.presionaFolio = function(evento){

		//contamos la cadena completa
		var cantidad = $scope.web.length;

		//los primero cuatro caracteres NO deben ser numeros
		if(cantidad < 3){
			if (evento.keyCode >= 48 && evento.keyCode <= 57 || evento.keyCode >= 96 && evento.keyCode <= 105) {
		      	evento.preventDefault();
		    }
		}

		//los ultimos 6 NO deben ser letras
		if(cantidad > 3 && cantidad < 9){
			if (evento.keyCode >= 65 && evento.keyCode <= 90) {
		      	evento.preventDefault();
		    }
		}

		//Si son mas de 10 digitos no escribas mas
		if(cantidad > 9){
			if (evento.keyCode != 8  && evento.keyCode != 46 ) {

		      	evento.preventDefault();
		    }      	
		}

		//Si se da enter o salto de linea ejecuta la funcion verifica folio pasandole que es de tipo fax
		if (evento.keyCode == 13 || evento.keyCode == 9) {

	      	$scope.verificaFolio();

	    }	

	}

	$scope.verificaFolio = function(){

		if ($scope.web != '') {

			var totalletras = $scope.web.length

			var letras = $scope.web.substr(0,4);
			var numeros = $scope.web.substr(4,totalletras);

			if(letras.length < 4 ){

				var faltantes = 4 - letras.length;

				for (var i = 0; i < faltantes; i++) {

					var letra = letras.charAt(i);
					letras = letras + "0";
				}
			}

			if(numeros.length < 6 ){

				var faltantes = 6 - numeros.length;

				for (var i = 0; i < faltantes; i++) {
					
					numeros = "0" + numeros;
				}
			}

			$scope.web = letras + numeros;

			$scope.ticketxweb();
		}	

	}

	$scope.ticketxweb = function(){

		loading.cargando('Buscando Ticket(s)');

		find.listaticketsfolio($scope.web).success( function (data) {

			$scope.listado = data;
			loading.despedida();

		 }).error( function (xhr,status,data){

		 	loading.despedida();
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		 });

		$scope.quitafiltro();
	}


	//busca usuarios
	$scope.usuariosWeb = function(){

		find.usuariosweb().success( function (data) {

			$scope.usuarios = data;

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		 });
	}


	$scope.ticketsxfecha = function(){

		loading.cargando('Buscando Ticket(s)');

		$http({
			url:'/documento/api/listatickets',
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:{fechaini:$scope.fechaini,fechafin:$scope.fechafin}
		}).success( function (data){

				//console.log(data);
        		$scope.listado = data;
        		loading.despedida();

		}).error( function (data){

			loading.despedida();
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');


		});

	}	


	//////LLena el grid y toma filtros
	$scope.selectos = [];
	///filtros
	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
	};

	// var csvOpts = { columnOverrides: { obj: function (o) {
	//     return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
	//     } },
	//     iEUrl: 'downloads/download_as_csv'
	// };

	var csvOpts = { columnOverrides: { obj: function (o) {
	    return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
	    } },
	    iEUrl: 'downloads/download_as_csv'
	};

	//var csvOpts = { columnOverrides: { obj: function(o) { return o.a + '|' +  o.b; } } }

	var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

	$scope.onDblClickRow = function(row){
	  console.log(row.entity.Folio_Interno);
	  $location.path('/editaticket/'+row.entity.Folio_Interno+'/'+row.entity.Folio_Web );
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
        showFilter:false,
        plugins: [new ngGridCsvExportPlugin(csvOpts,$http,$window,$compile,$filter)]
    };

    $scope.filtra = function(){

    	//$scope.filterOptions.filterText = "";
    	//var filtro = "";

    	console.log($scope.unidad.Nombre);

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

    	// if($scope.etapa == undefined || $scope.etapa == 0){
    	// 	var objeto7 = "";
    	// }else{
    	// 	var objeto7 = "Etapa:" + $scope.Nombre + "; ";
    		
    	// }


    	var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6; //+ objeto7;

    	$scope.filterOptions.filterText = filtro;

    	console.log(filtro);

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

});