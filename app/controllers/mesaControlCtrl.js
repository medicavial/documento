
//Area de mesa de control
app.controller('mesaControlCtrl',function ($scope, $rootScope, find , loading, $http, checkFolios){

	$scope.inicio = function(){

		$rootScope.area = 4;
		$scope.tituloR = "Mesa de Control";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.recibidos = 0;

		// $scope.empresas();
		// $scope.Altaunidades();
		// $scope.productos();
		$scope.mensaje = '';
		$scope.fechaini = '';
		$scope.fechafin = '';
		$scope.folio = '';
		$scope.lesionado = '';
		$scope.cargar = false;


		
		$scope.verareaoperativa();
		$scope.cargaEntrada();
		$scope.Altarechazados();
		$scope.pendientesRecibir();

	}

	//carga todos los folios del area activos por usuario
	$scope.cargaEntrada = function(){

		loading.cargando('Buscando Folios');

		find.listadogeneral($rootScope.id).success( function (data){
       
        	if(data.respuesta){
        		loading.mensaje(data.respuesta);
        		$scope.listado = [];
        	}else{
        		$scope.listado = data;
        	}

        	loading.despedida();
        	$scope.mensaje = '';
			
		}).error( function (xhr,status,data){

			loading.despedida();
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});
	}



	///Enlista las areas disponibles
	$scope.verareaoperativa = function(){

		find.areaoperativa().success( function (data) {

			$scope.areas = data;

		 });

	}

	//enlista los usuarios de cada area 
	$scope.altausuariosarea = function(area){

		if ($rootScope.area == area) {

			alert('No puedes emitir entregas a tu misma area');
			$scope.areaOp = '';

		}else{

			$scope.area = area;
			find.usuariosarea(area).success( function (data){

				$scope.usuarios = data;

			 });
		}
	}

	//guardamos pero antes verificamos que tengamos documentos seleccionados
	$scope.entrega = function(){

		
		if ($scope.selectos.length > 0) {
			$scope.validainfo();

		}else{
			alert('No se ha seleccionado ningun documento');
		}
	}

	//valida la informacion
	// $scope.validainfo = function(){

	// 	$scope.mensaje = '';
	// 	$('#boton').button('loading');

	// 	//console.log($scope.selectos);
	// 	for (var i = 0; i < $scope.selectos.length; i++) {

	// 		try{
	// 			var documento = $scope.selectos[i];

	// 			console.log(documento);

	// 			//Si es Etapa 2 o 3 y Etapa 1 no esta capturada
	// 			if(documento.Etapa > 1 && documento.CapEt2 == 0){
	// 				throw 'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede entregar debido a que la etapa 1 no esta capturada';
	// 			}

	// 			//Si se envia a Facturación y no es original ó ya fue enviado anteriormente manda mensaje de error
	// 			//se agrego indexof(busca el contenido que se ponga aqui) por que javascript no soporta muchos && y || en un mismo if 
	// 			if( (documento.FaxOrigianl.indexOf('O') == -1  && $scope.areaOp == 5) || ($scope.areaOp == 5 && documento.FLD_AROent == 5 && documento.USU_ent != 'null')||($scope.areaOp == 5 && documento.EnvFac == 'SI' && documento.Etapa == 1) ){
	// 				throw 'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede enviar a Facturación debido a que no es etapa 1 o ya fue mandado';
	// 			}

	// 			//Si se envia a Facturación y no es etapa 1
	// 			if($scope.areaOp == 5 && documento.Etapa > 1) {
	// 				throw 'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede enviar a Facturación debido a que no es etapa 1';
	// 			}

	// 			//Si se envia a pagos y no es original 
	// 			if($scope.areaOp == 6 && documento.EnvFac.indexOf('SI') == -1 && documento.Etapa == 1) {

	// 				if(confirm('El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se a enviado a Facturación. ¿Desea proseguir?')){							
	// 					//si es facturacion agrega un juego mas al flujo

	// 					$scope.actualizaFlujo(i);

	// 					throw 1;
	// 				}
	// 				else{

	// 					throw 1;
	// 				}
	// 			}

	// 			//Si se envia a Facturación y es mesa de control
	// 			if($scope.areaOp == 5 && $rootScope.area == 4) {

	// 				$scope.guardaFlujo(i);
	// 				throw 1;
					
	// 			}else if($scope.areaOp == 5 && $rootScope.area != 4){
	// 				throw 'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede enviar a Facturación tu usuario no tiene permisos';
	// 			}

	// 			$scope.actualizaFlujo(i);

	// 			if (i == Number($scope.selectos.length) - 1) {

	// 				$('#boton').button('reset');
	// 				//$scope.mensaje = 'Rechazos con exito';
	// 				//$scope.tipoalerta = 'alert-success';
	// 				$scope.cargaEntrada();
	// 				$scope.quitaselectos();
	// 				//$scope.gridOptions.$gridScope.toggleSelectAll(false);
				
	// 			};

	// 		}catch(err){

	// 			if(err != 1){
	// 				alert(err);
	// 			}

	// 			if (i == Number($scope.selectos.length) - 1) {

	// 				$('#boton').button('reset');
	// 				//$scope.mensaje = 'Rechazos con exito';
	// 				//$scope.tipoalerta = 'alert-success';
	// 				$scope.cargaEntrada();
	// 				$scope.quitaselectos();
	// 				//$scope.gridOptions.$gridScope.toggleSelectAll(false);
				
	// 			};
				
	// 		}
	// 	} //Termina for

	// 	//$('#boton').button('reset');
	// 	//$scope.mensaje = 'Termino el Envio';
	// 	// $scope.quitaselectos();
	// 	//$scope.cargaEntrada();

	// }

	$scope.validainfo = function(){

		$scope.mensaje = '';
		$('#boton').button('loading');

		var promesa = checkFolios.enviaFolios($scope.selectos,$scope.areaOp,$scope.user,$rootScope.id,$rootScope.area);

		promesa.then(function (data){

			
			$scope.mensaje = data.respuesta;
			$scope.tipoalerta = 'alert-success';
			$scope.cargaEntrada();
			$('#boton').button('reset');
			if (data.rechazos.length > 0) {
				$scope.rechazos = data.rechazos;
				console.log($scope.rechazos);
				$('#myModal3').modal();
			};

		},function (error){

			$scope.mensaje = error;
			$scope.tipoalerta = 'alert-warning';

		});

	}

	$scope.mandanpc = function(){

		$scope.mensaje = '';
		$('#boton2').button('loading');

		//console.log($scope.selectos);
		for (var i = 0; i < $scope.selectos.length; i++) {

			try{

				var documentoEnv = $scope.selectos[i];

				var datos = {
					folio:documentoEnv.Folio,
					etapa:documentoEnv.Etapa,
					cantidad:documentoEnv.Cantidad,
					documento:Number(documentoEnv.documento),
					usuarioentrega:$rootScope.id,
					areaentrega:Number(documentoEnv.area),
					clave:Number(documentoEnv.FLD_claveint),
					observaciones:documentoEnv.Observaciones
				};

				console.log(datos);

			    $http({
					url:'/documento/api/insertanpc',
					method:'POST', 
					contentType: 'application/json', 
					dataType: "json", 
					data:datos
				}).success( function (data){
					
					//console.log(data);
					$scope.mensaje = data.respuesta;
					$scope.tipoalerta = 'alert-success';
					//$scope.cargaEntrada();	


					if (i == Number($scope.selectos.length)) {

						$('#boton2').button('reset');
						//$scope.mensaje = 'Rechazos con exito';
						//$scope.tipoalerta = 'alert-success';
						$scope.cargaEntrada();
						$scope.quitaselectos();
					
					};		

				}).error( function (data){

					$('#boton2').button('reset');
					$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
					$scope.tipoalerta = 'alert-warning';

				}); 
				
				// usuariorecibe:Number($scope.user),
				// 	arearecibe:Number($scope.areaOp),

			}catch(err){
				
				alert(err);
				
			}
		} //Termina for
	}

	//caso de juego de facturacion
	$scope.guardaFlujo = function(indice){

		var documentoEnv = $scope.selectos[indice];

		var datos = {
			folio:documentoEnv.Folio,
			etapa:documentoEnv.Etapa,
			cantidad:documentoEnv.Cantidad,
			documento:Number(documentoEnv.documento),
			usuarioentrega:$rootScope.id,
			areaentrega:Number(documentoEnv.area),
			usuariorecibe:Number($scope.user),
			arearecibe:Number($scope.areaOp),
			clave:Number(documentoEnv.FLD_claveint),
			observaciones:documentoEnv.Observaciones
		};

		console.log(datos);

	    $http({
			url:'/documento/api/altaentrega',
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:datos
		}).success( function (data){
			
			//console.log(data);
			$scope.mensaje = data.respuesta;
			$scope.tipoalerta = 'alert-success';
			//$scope.cargaEntrada();			

		}).error( function (data){

			$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
			$scope.tipoalerta = 'alert-warning';

		});
	}

	$scope.actualizaFlujo = function(indice){

		//seleccionamos el folio a mandar 
		var documentoEnv = $scope.selectos[indice];
		
		console.log(documentoEnv);
		//generamos el JSON necesario incluyendo los datos del area y usuario para enviarlo mediante post 
		var datos = {
			folio:documentoEnv.Folio,
			etapa:documentoEnv.Etapa,
			cantidad:documentoEnv.Cantidad,
			documento:Number(documentoEnv.documento),
			usuarioentrega:$rootScope.id,
			areaentrega:Number(documentoEnv.area),
			usuariorecibe:Number($scope.user),
			arearecibe:Number($scope.areaOp),
			clave:Number(documentoEnv.FLD_claveint),
			observaciones:documentoEnv.Observaciones
		};

	    $http({
			url:'/documento/api/actualizaentrega',
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:datos
		}).success( function (data){
			        	
			$scope.mensaje = data.respuesta;
			$scope.tipoalerta = 'alert-success';
			//$scope.cargaEntrada();			

		}).error( function (data){

			$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
			$scope.tipoalerta = 'alert-warning';

		});
	}



	$scope.pendientesRecibir = function(){

		find.listadorecepcion($rootScope.id).success( function (data){
       
        	if(data.respuesta){
        		$scope.recibidos = 0;
        	}else{
        		$scope.recibidos = data.length;
        	}

        	//console.log($scope.recibidos);

		});

	}

	///Busquedas 

	//busca clientes
	$scope.empresas = function(){

		find.empresas().success( function (data) {

			$scope.clientes = data;

		 });
	}

	//busca productos
	$scope.productos = function(){

		find.productos().success( function (data) {

			$scope.productosini = data;

		 });
	}


	//busca unidades
	$scope.Altaunidades = function(){

		find.unidades().success( function (data) {

			$scope.unidades = data;

		 });
	}

	//busca rechazos
	$scope.Altarechazados = function(){

		find.listadorechazos($rootScope.id).success( function (data) {
			
			console.log(data);
			if(data.respuesta){
        		$scope.rechazados = 0;
        	}else{
        		$scope.rechazados = data.length;
        	}

		 });
	}


	//////LLena el grid y toma filtros

	///filtros

	$scope.selectos = [];

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
    	enableCellSelection: true,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
                    { field:'Folio', width: 120, pinned:true, enableCellEdit: true },
		            { field:'Etapa', width: 120 },
		            { field:'Cantidad', width: 100 },
		            { field:'Empresa', width: 120 },
		            { field:'Unidad', width: 200 },
		            { field:'FaxOrigianl', width: 120 },
		            { field:'FechaRecepcion', width: 130 },
		            { field:'FLD_claveint', width: 100, visible:false },
		            { field:'documento', width: 100, visible:false },
		            { field:'CapEt2', width: 100, visible:false },
		            { field:'EnvFac', width: 100, visible:true },
		            { field:'FLD_AROent', width: 100, visible:false },
		            { field:'area', width: 100, visible:false },
		            { field:'USU_ent', width: 100, visible:false },
		            { field:'Observaciones', width: 320, enableCellEdit: true}
		            
        ],
        showFooter: true,
        showFilter:false
    };

    $scope.$on('ngGridEventRows', function (newFilterText){

    	var filas = newFilterText.targetScope.renderedRows;

    	$scope.exportables = [];

    	angular.forEach(filas , function(item){
    		$scope.exportables.push(item.entity);
    	});

    });

    $scope.filtra = function(){

    	//$scope.filterOptions.filterText = "";
    	//var filtro = "";
    	//console.log($scope.fechaini);

    	if($scope.unidad == undefined || $scope.unidad == 0){
    		var objeto1 = "";
    	}else{
    		var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
    		
    	}
    	if($scope.cliente == undefined || $scope.cliente == 0){
    		var objeto2 = "";
    	}else{
    		var objeto2 = "Empresa:" + $scope.cliente.nombre + "; ";
    	}
    	if($scope.tipo == 'fax'){
    		var objeto3 = "FaxOrigianl:F; ";
    	}else if($scope.tipo == 'original'){
    		var objeto3 = "FaxOrigianl:O; ";
    	}else{
    		var objeto3 = ""; 
    	}

    	if($scope.folio.length == 0){
    		var objeto4 = "";
    	}else{
    		var objeto4 = "Folio:" + $scope.folio + "; ";	
    	}

    	if($scope.lesionado.length == 0){
    		var objeto5 = "";
    	}else{
    		var objeto5 = "Lesionado:" + $scope.lesionado + "; ";	
    	}

    	if($scope.producto == undefined || $scope.producto == 0){
    		var objeto6 = "";
    	}else{
    		var objeto6 = "Producto:" + $scope.producto.nombre + "; ";
    		
    	}

    	if($scope.etapa == undefined || $scope.etapa == 0){
    		var objeto7 = "";
    	}else{
    		var objeto7 = "Etapa:" + $scope.etapa + "; ";
    		
    	}


    	var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6 + objeto7;

    	$scope.filterOptions.filterText = filtro;

    	//console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = ''; 
    	$scope.unidad = 0; 
    	$scope.cliente = 0;
    	$scope.folio = '';
    	$scope.fechaini = '';
    	$scope.fechafin = '';
    	$scope.lesionado = '';
    	$scope.foliosxarea();
    
    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }

});

//mustra los documentos entregados pendientes de recibir
app.controller('nopagarCtrl',function ($scope, $rootScope, $routeParams, find, $http, loading){
	//Carga Configuracion Inicial
	$scope.inicio = function(){

		$scope.tituloLE = 'Listado No pagar hasta cobrar'; //+ $routeParams.area;
		$scope.area = 'mesacontrol';
		$scope.empresas();
		$scope.folio = '';
		$scope.altaunidades();
		$scope.cargaEntregas();
		$scope.mensaje = '';

	}

	//Carga la lista de archivos a Recibir de otras areas 
	$scope.cargaEntregas = function(){

		loading.cargando('Buscando Folios');

		find.listadogeneralnpc($rootScope.id).success( function (data){
       
        	if(data.respuesta){
        		loading.mensaje(data.respuesta);
        		$scope.listado = [];
        	}else{
        		$scope.listado = data;
        	}

        	console.log(data);

        	loading.despedida();
			
		}).error( function (xhr,status,data){

			loading.despedida();
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});
	}

	//enlista los clientes
	$scope.empresas = function(){

		find.empresas().success( function (data) {

			$scope.clientes = data;

		 });
	}

	//Enlista las unidades
	$scope.altaunidades = function(){

		find.unidades().success( function (data) {

			$scope.unidades = data;

		 });
	}

	$scope.eliminaNPC = function(){

		$('#boton').button('loading');

		for (var i = 0; i < $scope.selectos.length; i++) {

			try{

				$scope.mensaje = '';
				
				var documentoEnv = $scope.selectos[i];

				var datos = {
					folio:documentoEnv.Folio,
					etapa:documentoEnv.Etapa,
					cantidad:documentoEnv.Cantidad,
					documento:Number(documentoEnv.documento),
					usuarioentrega:$rootScope.id,
					areaentrega:Number(documentoEnv.area),
					usuariorecibe:Number($scope.user),
					arearecibe:Number($scope.areaOp),
					clave:Number(documentoEnv.FLD_claveint),
					observaciones:documentoEnv.Observaciones
				};
				
				console.log(datos);

				$http({
					url:'/documento/api/eliminanpc',
					method:'POST', 
					contentType: 'application/json', 
					dataType: "json", 
					data:datos
				}).success(function (data){
					
					//console.log(data);
					$scope.mensaje = data.respuesta;
					$scope.tipoalerta = 'alert-success';
								

				}).error( function (data){

					$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
					$scope.tipoalerta = 'alert-warning';

				});

				if (i == Number($scope.selectos.length) - 1) {

					$scope.cargaEntregas();
					$scope.gridOptions.$gridScope.toggleSelectAll(false);
					$('#boton').button('reset');
				
				};



			}
			catch(err)
			{
				alert(err);
			}

		}

	}

	$scope.selectos = [];

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
    	enableCellSelection: true,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
                    { field:'Folio', width: 120, pinned:true, enableCellEdit: true },
		            { field:'Etapa', width: 120 },
		            { field:'Cantidad', width: 100 },
		            { field:'Empresa', width: 120 },
		            { field:'Unidad', width: 200 },
		            { field:'FaxOrigianl', width: 120 },
		            { field:'FechaRecepcion', width: 130 },
		            { field:'FLD_claveint', width: 100, visible:false },
		            { field:'documento', width: 100, visible:false },
		            { field:'CapEt2', width: 100, visible:false },
		            { field:'EnvFac', width: 100, visible:true },
		            { field:'FLD_AROent', width: 100, visible:false },
		            { field:'area', width: 100, visible:false },
		            { field:'USU_ent', width: 100, visible:false },
		            { field:'Observaciones', width: 320, enableCellEdit: true}
		            
        ],
        showFooter: true,
        showFilter:false
    };


    $scope.$on('ngGridEventRows', function (newFilterText){

    	var filas = newFilterText.targetScope.renderedRows;

    	$scope.exportables = [];

    	angular.forEach(filas , function(item){
    		$scope.exportables.push(item.entity);
    	});

    });

    $scope.filtra = function(){


    	if($scope.unidad == undefined || $scope.unidad == 0){
    		var objeto1 = "";
    	}else{
    		var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
    		
    	}
    	if($scope.cliente == undefined || $scope.cliente == 0){
    		var objeto2 = "";
    	}else{
    		var objeto2 = "Empresa:" + $scope.cliente.nombre + "; ";
    	}

    	if($scope.folio.length == 0){
    		var objeto3 = "";
    	}else{
    		var objeto3 = "Folio:" + $scope.folio + "; ";	
    	}



    	var filtro = objeto1 + objeto2 + objeto3;

    	$scope.filterOptions.filterText = filtro;

    	console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = ''; 
    	$scope.unidad = 0; 
    	$scope.cliente = 0;
    
    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }

});