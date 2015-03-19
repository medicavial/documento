//flujo de pagos general
app.controller('flujoPagosCtrl',function ($scope,$rootScope, find,loading, $http){


	$scope.inicio = function(){

		$rootScope.area = 6;
		$scope.tituloFP = "Flujo de Pagos";

		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
		$scope.fechainiPag = primerdiames;
    	$scope.fechafinPag = FechaAct;
    	$scope.fechainiRec = FechaAct;
    	$scope.fechafinRec = FechaAct;
		$scope.folio = '';
		$scope.lesionado = '';
		$scope.relacion = '';
		$scope.cargar = false;
		$scope.buscarXfecha = 0;

		$scope.foliosXfecha('Pagos');

	}

	//Busqueda de folios x area
	$scope.foliosxarea = function(){

		$('#busca2').button('loading');
		loading.cargando('Buscando Folio');

		find.listadopagos().success( function (data){
        	
        	if(data.respuesta){

        		$('#busca2').button('reset');
        		loading.mensaje(data.respuesta);
        		loading.despedida();
        		$scope.listado = [];

        	}else{

        		$('#busca2').button('reset');
        		$scope.listado = data;
        		$scope.cantidad = data.length -1;
        		loading.despedida();
        	
        	}
			
			//console.log(data);
		}).error( function (xhr,status,data){

			loading.despedida();
			$('#busca2').button('reset');
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});

	}


	$scope.foliosXfecha = function(tipo){

		loading.cargando('Buscando Folio');

		// var fechaini = '';
		// var fechafin = '';

		//valida el campo de fecha en caso de que alguno este lleno y el otro no

		if (tipo == 'Pagos') {

			// if ($scope.fechainiPag == '' && $scope.fechafinPag != '') {
			// 	$scope.fechainiPag = $scope.fechafinPag;
			// }else if ($scope.fechafinPag == '' && $scope.fechafinPag != '') {
			// 	$scope.fechafinPag = $scope.fechainiPag;
			// };

			fechaini = $scope.fechainiPag;
			fechafin = $scope.fechafinPag;

			var url="/documento/api/listapagosfechas"

		}else{

			// if ($scope.fechainiRec == '' && $scope.fechafinRec != '') {
			// 	$scope.fechainiRec = $scope.fechafinRec;
			// }else if ($scope.fechafinRec == '' && $scope.fechafinRec != '') {
			// 	$scope.fechafinRec = $scope.fechainiRec;
			// };

			fechaini = $scope.fechainiRec;
			fechafin = $scope.fechafinRec;

			var url="/documento/api/listapagosfechasrecepcion"

		};

		//armamos los datos a enviar segun tipo de consulta (tipo)
		$scope.datos = {fechaini:fechaini,fechafin:fechafin};
		console.log($scope.datos);

		$http({
			url:url,
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:$scope.datos
		}).success( function (data){
			  
			if(data.respuesta){

        	
        		loading.mensaje(data.respuesta);
        		loading.despedida();
        		$scope.listado = [];

        	}else{

  
        		$scope.listado = data;
        		$scope.cantidad = data.length -1;
        		loading.despedida();
        		$scope.buscarXfecha = 1;
        	}
			
		}).error( function (xhr,status,data){

			loading.despedida();
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});

	}


	///Busquedas 

	//busca clientes
	$scope.empresas = function(){

		find.empresas().success( function (data) {

			$scope.clientes = data;

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		 });
	}

	//busca productos
	$scope.productos = function(){

		find.productos().success( function (data) {

			$scope.productosini = data;

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		 });
	}


	//busca unidades
	$scope.Altaunidades = function(){

		find.unidades().success( function (data) {

			$scope.unidades = data;

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

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
    	multiSelect:false,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	enableCellEdit: true,
    	columnDefs: [
                    { field:'USUNombre', width: 120, pinned: true},
                    { field:'Folio', width: 120, pinned: false},
                    { field:'Cliente', width: 100 },
                    { field:'Unidad', width: 220 },
                    { field:'Lesionado', width: 330 },
                    //{ field:'Producto', width: 120 },
		            { field:'Etapa', width: 120 },
		            { field:'Entrega', width: 80 },
		            { field:'FormaRecep', width: 90 },
		            { field:'fechaRecepcion', width: 120},
		            { field:'FechaRecepPag', width: 120,  cellFilter: 'date:\'dd/MM/yyyy\'' },
		            { field:'Relacion', width: 120 },
		            { field:'RelP', width: 120 },
		            { field:'PasC', width: 120 },
		            { field:'FPasCobrado', width: 120 },
		            { field:'Pago', width: 120 },
		            { field:'Reserva', width: 120 },
		            { field:'LNombre', width: 120 },
		            { field:'TNombre', width: 120 },
		            { field:'Pagado', width: 80 },
		            { field:'Cobrado', width: 80 },
		            { field:'FacturaRelacion', width: 80 },
		            { field:'FacturaControl', width: 80 }
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
    		var objeto2 = "Cliente:" + $scope.cliente.nombre + "; ";
    	}

    	if($scope.tipo == 'fax'){
    		console.log('entro a fax');
    		var objeto3 = "FormaRecep:F; ";
    	}else if($scope.tipo == 'original'){
    		var objeto3 = "FormaRecep:O; ";
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

    	if($scope.relacion.length == 0){
    		var objeto8 = "";
    	}else{
    		var objeto8 = "Relacion:" + $scope.relacion + "; ";	
    	}

    	if ($scope.relacionado) {
    		var objeto9 = "RelP:X ; ";	
    	}else{
    		var objeto9 = "";
    	}

    	if ($scope.cobrado) {
    		var objeto10 = "Cobrado:1 ; ";	
    	}else{
    		var objeto10 = "";
    	}

    	if ($scope.pagado) {
    		var objeto11 = "Pagado:1 ; ";	
    	}else{
    		var objeto11 = "";
    	}


    	var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6 + objeto7 + objeto8 + objeto9 + objeto10 + objeto11;

    	$scope.filterOptions.filterText = filtro;

    	console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = ''; 
    	$scope.unidad = 0; 
    	$scope.cliente = 0;
    	$scope.tipo = 0;
    	$scope.folio = '';
    	$scope.fechaini = '';
    	$scope.fechafin = '';
    	$scope.lesionado = '';
    	$scope.lesionado = '';
    	$scope.fechainiPag = '';
    	$scope.fechafinPag = '';
    	$scope.fechainiRec = '';
    	$scope.fechainiRec = '';

    	console.log($scope.buscarXfecha);

    	if ($scope.buscarXfecha == 1) {

    		$scope.buscarXfecha = 0;
    		$scope.foliosxarea();
    	};
    	
    
    }

});

//Area de pagos
app.controller('pagosCtrl',function ($scope, $rootScope, find , loading, $http, barra){

	$scope.inicio = function(){
		barra.inicia();
		$rootScope.area = 6;
		$scope.tituloR = "Pagos";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.recibidos = 0;

		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
		$scope.fechainiPag = primerdiames;
    	$scope.fechafinPag = FechaAct;
    	$scope.fechainiRec = FechaAct;
    	$scope.fechafinRec = FechaAct;
		$scope.folio = '';
		$scope.lesionado = '';
		$scope.relacion = '';
		$scope.cargar = false;
		$scope.buscarXfecha = 0;

		$scope.foliosXfecha('Pagos');
		$scope.Altarechazados();
		$scope.pendientesRecibir();

	}

	$scope.pendientesRecibir = function(){

		find.listadorecepcion($rootScope.id).success( function (data){
       
        	if(data.respuesta){
        		$scope.recibidos = 0;
        	}else{
        		$scope.recibidos = data.length;
        	}

        	//console.log($scope.recibidos);
        	barra.termina();

		});

	}

	//Busqueda de folios x area
	$scope.foliosxarea = function(){

		$('#busca2').button('loading');
		loading.cargando('Buscando Folio');

		find.listadopagos().success( function (data){
        	
        	if(data.respuesta){

        		$('#busca2').button('reset');
        		loading.mensaje(data.respuesta);
        		loading.despedida();
        		$scope.listado = [];

        	}else{

        		$('#busca2').button('reset');
        		$scope.listado = data;
        		$scope.cantidad = data.length -1;
        		loading.despedida();
        	
        	}
			
			//console.log(data);
		}).error( function (xhr,status,data){

			loading.despedida();
			$('#busca2').button('reset');
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});

	}


	$scope.foliosXfecha = function(tipo){

		loading.cargando('Buscando Folio');

		// var fechaini = '';
		// var fechafin = '';

		//valida el campo de fecha en caso de que alguno este lleno y el otro no

		if (tipo == 'Pagos') {

			// if ($scope.fechainiPag == '' && $scope.fechafinPag != '') {
			// 	$scope.fechainiPag = $scope.fechafinPag;
			// }else if ($scope.fechafinPag == '' && $scope.fechafinPag != '') {
			// 	$scope.fechafinPag = $scope.fechainiPag;
			// };

			fechaini = $scope.fechainiPag;
			fechafin = $scope.fechafinPag;

			var url="/documento/api/listapagosfechas"

		}else{

			// if ($scope.fechainiRec == '' && $scope.fechafinRec != '') {
			// 	$scope.fechainiRec = $scope.fechafinRec;
			// }else if ($scope.fechafinRec == '' && $scope.fechafinRec != '') {
			// 	$scope.fechafinRec = $scope.fechainiRec;
			// };

			fechaini = $scope.fechainiRec;
			fechafin = $scope.fechafinRec;

			var url="/documento/api/listapagosfechasrecepcion"

		};

		//armamos los datos a enviar segun tipo de consulta (tipo)
		$scope.datos = {fechaini:fechaini,fechafin:fechafin};
		console.log($scope.datos);

		$http({
			url:url,
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:$scope.datos
		}).success( function (data){
			  
			if(data.respuesta){

        	
        		loading.mensaje(data.respuesta);
        		loading.despedida();
        		$scope.listado = [];

        	}else{

  
        		$scope.listado = data;
        		$scope.cantidad = data.length -1;
        		loading.despedida();
        		$scope.buscarXfecha = 1;
        	}
			
		}).error( function (xhr,status,data){

			loading.despedida();
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});

	}


	///Busquedas 

	//busca clientes
	$scope.empresas = function(){

		find.empresas().success( function (data) {

			$scope.clientes = data;

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		 });
	}

	//busca productos
	$scope.productos = function(){

		find.productos().success( function (data) {

			$scope.productosini = data;

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		 });
	}


	//busca unidades
	$scope.Altaunidades = function(){

		find.unidades().success( function (data) {

			$scope.unidades = data;

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

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

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

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
    	multiSelect:false,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	enableCellEdit: true,
    	columnDefs: [
                    { field:'USUNombre', width: 120, pinned: true},
                    { field:'Folio', width: 120, pinned: false},
                    { field:'Cliente', width: 100 },
                    { field:'Unidad', width: 220 },
                    { field:'Lesionado', width: 330 },
                    //{ field:'Producto', width: 120 },
		            { field:'Etapa', width: 120 },
		            { field:'Entrega', width: 80 },
		            { field:'FormaRecep', width: 90 },
		            { field:'fechaRecepcion', width: 120},
		            { field:'FechaRecepPag', width: 120,  cellFilter: 'date:\'dd/MM/yyyy\'' },
		            { field:'Relacion', width: 120 },
		            { field:'RelP', width: 120 },
		            { field:'PasC', width: 120 },
		            { field:'FPasCobrado', width: 120 },
		            { field:'Pago', width: 120 },
		            { field:'Reserva', width: 120 },
		            { field:'LNombre', width: 120 },
		            { field:'TNombre', width: 120 },
		            { field:'Pagado', width: 80 },
		            { field:'Cobrado', width: 80 },
		            { field:'FacturaRelacion', width: 80 },
		            { field:'FacturaControl', width: 80 }
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
    	//console.log($scope.relacionado);



    	if($scope.unidad == undefined || $scope.unidad == 0){
    		var objeto1 = "";
    	}else{
    		var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
    		
    	}
    	if($scope.cliente == undefined || $scope.cliente == 0){
    		var objeto2 = "";
    	}else{
    		var objeto2 = "Cliente:" + $scope.cliente.nombre + "; ";
    	}

    	if($scope.tipo == 'fax'){
    		console.log('entro a fax');
    		var objeto3 = "FormaRecep:F; ";
    	}else if($scope.tipo == 'original'){
    		var objeto3 = "FormaRecep:O; ";
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

    	if($scope.relacion.length == 0){
    		var objeto8 = "";
    	}else{
    		var objeto8 = "Relacion:" + $scope.relacion + "; ";	
    	}

    	if ($scope.relacionado) {
    		var objeto9 = "RelP:X ; ";	
    	}else{
    		var objeto9 = "";
    	}

    	if ($scope.cobrado) {
    		var objeto10 = "Cobrado:1 ; ";	
    	}else{
    		var objeto10 = "";
    	}

    	if ($scope.pagado) {
    		var objeto11 = "Pagado:1 ; ";	
    	}else{
    		var objeto11 = "";
    	}


    	var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6 + objeto7 + objeto8 + objeto9 + objeto10 + objeto11;

    	$scope.filterOptions.filterText = filtro;

    	console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = ''; 
    	$scope.unidad = 0; 
    	$scope.cliente = 0;
    	$scope.tipo = 0;
    	$scope.folio = '';
    	$scope.fechaini = '';
    	$scope.fechafin = '';
    	$scope.lesionado = '';
    	$scope.lesionado = '';
    	$scope.fechainiPag = '';
    	$scope.fechafinPag = '';
    	$scope.fechainiRec = '';
    	$scope.fechainiRec = '';

    	console.log($scope.buscarXfecha);

    	if ($scope.buscarXfecha == 1) {

    		$scope.buscarXfecha = 0;
    		$scope.foliosxarea();
    	};
    	
    
    }

});