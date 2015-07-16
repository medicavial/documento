/// Facturas qualitas
function formatoQualitasCtrl($scope, $rootScope,$http, find, loading,api , qualitas){

	$scope.inicio = function(){

		$scope.tituloFQ = "Formato de Facturas Qualitas";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.listado = [];
		$scope.buscafacturas();
		$scope.productos();
		$('#modalEx').on('hidden.bs.modal', function (e) {
			$scope.gridOptions.$gridScope.toggleSelectAll(false);
		 	$scope.buscafacturas();
		});
		
	}

	//busca productos
	$scope.productos = function(){

		find.productos().success( function (data) {

			$scope.productosini = data;

		 });
	}

	//muestra facturas sin procesar
	$scope.buscafacturas = function(){

		loading.cargando('Buscando Factura(s)');

		//armamos los datos a enviar segun tipo de consulta (tipo)
		$scope.datos = {fechaini:$scope.fechaini,fechafin:$scope.fechafin};

		qualitas.sinProcesar($scope.datos).success( function (data){
			 
			if(data){
        		$scope.listado = data;
        		$scope.cantidad = data.length -1;
        	}else{
        		$scope.listado = [];
        	}
    		
    		loading.despedida();
			
		});

	}


	$scope.generarListado = function(){

    	JSONToXLSConvertor($scope.listado, "Facturas", true);

    }

    //genera el archivo una vez verificados
    $scope.generaarchivos = function(){

    	var datos = {correctos:$scope.listos,incorrectos:$scope.incorrectos};

		qualitas.procesaEnvio(datos).success(function (data){
			// console.log(data);
			JSONToXLSConvertor($scope.listos, "Reporte", true);
			qualitas.descargaEnvio($scope.ruta);
		});

    }

    //prepara los folios y busca las imagenes para el envio
    $scope.generarSelectos = function(){

    	$('#boton').button('loading');
    	qualitas.generaEnvio($scope.selectos).success( function (data){
			 
			if (data.correctos.length == 0) {

				loading.error('No se encontraron archivos de nungun folio');

			}else{

				$scope.total = $scope.selectos.length;
				$scope.numerocorrectos = data.correctos.length;
				$scope.compresos = data.comprimidos.length;
				$scope.incorrectos = data.incorrectos;
				$scope.correctos = data.correctos;
				$scope.listos = data.comprimidos;
				$scope.ruta = data.archivo;
				$('#modalEx').modal({
					backdrop:'static',
					keyboard:false
				});
			}

			$('#boton').button('reset');
			
		}).error( function (xhr,status,data){
			$('#boton').button('reset');
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
    	selectWithCheckboxOnly:false,
    	multiSelect:true,
    	pagingOptions: $scope.pagingOptions,
    	showSelectionCheckbox:false,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	enableCellEdit: true,
    	columnDefs: [
                    { field:'folioElectronico',displayName:'FOLIO QUA', width: 120, pinned: true},
                    { field:'folioAdministradora',displayName:'FOLIO ADMIN', width: 120, pinned: false},
                    { field:'folioSistema',displayName:'FOLIO SISTEMA', width: 120 },
                    { field:'claveproovedor',displayName:'PROVEEDOR', width: 120 },
                    { field:'claveprestador',displayName:'PROV SERV', width: 120 },
                    { field:'Siniestro',displayName:'SINIESTRO', width: 120 },
		            { field:'Reporte',displayName:'REPORTE', width: 120 },
		            { field:'Poliza',displayName:'POLIZA', width: 120 },
		            { field:'Lesionado',displayName:'LESIONADO', width: 330 },
		            { field:'Afectado',displayName:'AFECTADO', width: 120},
		            { field:'Cobertura',displayName:'COBERTURA', width: 120 },
		            { field:'Subtotal',displayName:'SUBTOTAL', width: 120 },
		            { field:'iva',displayName:'IVA', width: 120 },
		            { field:'Descuento',displayName:'DESCUENTO', width: 120 },
		            { field:'Total',displayName:'TOTAL', width: 120 },
		            { field:'FechaCaptura',visible:false, width: 120 },
		            { field:'TipoUnidad',visible:false, width: 120 }
        ],
        showFooter: true,
        showFilter:false
    };


    $scope.selecciona = function(limite){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);

    	var numero = Number(limite);
		angular.forEach($scope.listado, function(item, index){
			
			if (index < numero) {
				//$scope.selectos.push(item);
				$scope.gridOptions.selectItem(index, true);
			};

		});

		// console.log($scope.selectos);
	};
	
	$scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }

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
    		// console.log('entro a fax');
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

    	//console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = ''; 

    	//console.log($scope.buscarXfecha);

    	if ($scope.buscarXfecha == 1) {

    		$scope.buscarXfecha = 0;
    		$scope.foliosxarea();
    	};
    	
    
    }

};

// Facturas Qualitas que no tuvieron imagenes disponibles
function formatoQualitasArchivosCtrl($scope, $rootScope, find, loading, qualitas, reportes){

	$scope.inicio = function(){

		$scope.tituloFQA = "Facturas Invalidas por falta de archivo";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.muestra = false;
		$scope.mensaje = '';
		$scope.listado = [];

		$('#modalEx').on('hidden.bs.modal', function (e) {
		 	$scope.buscafacturas();
		});

	}

	$scope.buscafacturas = function(){

		$scope.gridOptions.$gridScope.toggleSelectAll(false);
		
		loading.cargando('Buscando Factura(s)');

		//armamos los datos a enviar segun tipo de consulta (tipo)

		var datos = {fechaini:$scope.fechaini,fechafin:$scope.fechafin};

		qualitas.sinArchivo(datos).success( function (data){
			
			if(data.listado){
        		$scope.listado = data.listado;
        		$scope.cantidad = data.listado.length -1;
        		$scope.detalle = data.detalle;
        	}else{
        		$scope.listado = [];
        	}
    		
    		loading.despedida();
			
		}).error( function (xhr,status,data){
			loading.despedida();
		});

	}

	$scope.quitalistado = function(item){
		// console.log(item);
	}

	$scope.selecciona = function(limite){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);

    	var numero = Number(limite);
		angular.forEach($scope.listado, function(item, index){
			
			if (index < numero) {
				//$scope.selectos.push(item);
				$scope.gridOptions.selectItem(index, true);
			};

		});

		// console.log($scope.selectos);
	};


	$scope.generarListado = function(){

    	JSONToXLSConvertor($scope.listado, "Facturas", true);

    }

    //genera el archivo una vez verificados
    $scope.generaarchivos = function(){

    	var datos = {correctos:$scope.listos,incorrectos:$scope.incorrectos};

		qualitas.procesaEnvio(datos).success(function (data){
			// console.log(data);
			JSONToXLSConvertor($scope.listos, "Reporte", true);
			qualitas.descargaEnvio($scope.ruta);
		});

    }

    //prepara los folios y busca las imagenes para el envio
    $scope.generarSelectos = function(){

    	$('#boton').button('loading');
    	qualitas.generaEnvio($scope.selectos).success( function (data){
			 
			if (data.correctos.length == 0) {

				loading.error('No se encontraron archivos de nungun folio');

			}else{

				$scope.total = $scope.selectos.length;
				$scope.numerocorrectos = data.correctos.length;
				$scope.compresos = data.comprimidos.length;
				$scope.incorrectos = data.incorrectos;
				$scope.correctos = data.correctos;
				$scope.listos = data.comprimidos;
				$scope.ruta = data.archivo;
				$('#modalEx').modal({
					backdrop:'static',
					keyboard:false
				});
			}

			$('#boton').button('reset');
			
		}).error( function (xhr,status,data){
			$('#boton').button('reset');
		});

    }

 	var CellTemplate ='<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-model="row.entity.Procesado" ng-change="verifica(row.entity.Procesado,row.entity)" checked/></div>';
	///filtros
	$scope.selectos = [];

	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
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
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	enableCellEdit: false,
    	columnDefs: [
                    { field:'folioElectronico',displayName:'FOLIO QUA', width: 120, pinned: true},
                    { field:'folioAdministradora',displayName:'FOLIO ADMIN', width: 120, pinned: false},
                    { field:'folioSistema',displayName:'FOLIO SISTEMA', width: 120 },
                    { field:'claveproovedor',displayName:'PROVEEDOR', width: 120 },
                    { field:'claveprestador',displayName:'PROV SERV', width: 120 },
                    { field:'Siniestro',displayName:'SINIESTRO', width: 120 },
		            { field:'Reporte',displayName:'REPORTE', width: 120 },
		            { field:'Poliza',displayName:'POLIZA', width: 120 },
		            { field:'Lesionado',displayName:'LESIONADO', width: 330 },
		            { field:'Afectado',displayName:'AFECTADO', width: 120},
		            { field:'Cobertura',displayName:'COBERTURA', width: 120 },
		            { field:'Subtotal',displayName:'SUBTOTAL', width: 120 },
		            { field:'iva',displayName:'IVA', width: 120 },
		            { field:'Descuento',displayName:'DESCUENTO', width: 120 },
		            { field:'Total',displayName:'TOTAL', width: 120 },
		            { field:'FechaCaptura',visible:false, width: 120 },
		            { field:'TipoUnidad',visible:false, width: 120 }
        ],
        showFooter: true,
        showFilter:false
    };

    $scope.verifica = function(valor,item){
    	// console.log(item);
    	if (item) {
    		$scope.rechazados.push(item);
    	};
    }

    $scope.exporta = function(){
    	
        reportes.descargar($scope.detalle);
        
    }

};

function formatoQualitasConsultaCtrl($scope,$rootScope, find){

	$scope.inicio = function(){

		$scope.tituloCF = "Consulta de Folio";
		$scope.busqueda = false;
		$scope.cargando = false;

		$scope.mensaje = '';
		$scope.criterio = '';
		$scope.listado = [];

	}


	//busqueda de folio especiico
	$scope.foliosxfolio = function(){

		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;
		
		find.consultaFacturaQualitas($scope.criterio).success( function (data){
        	
        
        	if(data){
        		$scope.listado = data[0];
        	}else{
        		$scope.mensaje  = 'Datos No Encontrados';
        	}

    		$('#boton').button('reset');
        	$scope.busqueda = true;
			$scope.cargando = false;
			
		}).error( function (xhr,status,data){

			$('#boton').button('reset');
		});

	}

};

function formatoQualitasEnviadoCtrl($scope, $rootScope, find, loading, qualitas){

	$scope.inicio = function(){

		$scope.tituloFQE = "Facturas Generadas";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.muestra = false;
		$scope.invalidos = [];
		$scope.mensajeA = '';
		$('#modalEx').on('hidden.bs.modal', function (e) {

			$scope.gridOptions.$gridScope.toggleSelectAll(false);
		 	$scope.buscafacturas();

		});

		$scope.buscafacturas();

	}

	$scope.buscafacturas = function(){

		loading.cargando('Buscando Factura(s)');

		//armamos los datos a enviar segun tipo de consulta (tipo)
		var datos = {fechaini:$scope.fechaini,fechafin:$scope.fechafin};

		qualitas.envios(datos).success(function (data){
			
			if(data){
        		$scope.envios = data;
        		$scope.cantidad = data.length -1;
        	}else{
        		$scope.envios = [];
        	}

    		loading.despedida();

		});

	}

	$scope.detalle = function(index){

		var dato = $scope.envios[index];

		$scope.muestra = true;
		$scope.cargadetalle = true;
		$scope.mensajeA = '';

		$scope.claveenvio = dato.ENQ_claveint;

		qualitas.detalleEnvio(dato).then(function (data){
			
			if (dato.ENQ_procesado == 1) {
    			$scope.procesado = true;
    			$scope.validos = data.length;
    		}else{
    			$scope.procesado = false;
    		}
    		
    		$scope.listado = data;
    		$scope.cargadetalle = false;

		});

	}

	$scope.quitalistado = function(item){
		
	}

	$scope.guarda = function(){

		$('#boton').button('loading');

		qualitas.actualiza($scope.claveenvio,$scope.selectos).success(function (data){

			// console.log(data);
        	$scope.mensajeA = data.respuesta;
        	$scope.listado2 = data.faltantes;
        	$('#boton').button('reset');

        	if (data.faltantes.length > 0) {

        		$('#modalEx').modal({
					backdrop:'static',
					keyboard:false
				});

        	}else{

        		$scope.buscafacturas();
        	}
        	
        	$scope.cargadetalle = false;

		});

	}

	$scope.generarListado = function(){

    	JSONToXLSConvertor($scope.listado, "Facturas", true);

    }

	$scope.generarArchivos = function(){

		$('#boton2').button('loading');


		qualitas.generaEnvio($scope.selectos).success( function (data){
			 
			if (data.correctos.length == 0) {

				loading.error('No se encontraron archivos de nungun folio');

			}else{

				JSONToXLSConvertor(data.comprimidos, "Reporte", true);
				qualitas.descargaEnvio(data.archivo);

			}

			$('#boton2').button('reset');
			
		}).error( function (xhr,status,data){
			$('#boton2').button('reset');
		});

	}

	$scope.error = function(causa){

		//console.log(causa);
		if (causa == 'otro') {
			
			causa = prompt('Escribe el estatus del archivo');

		}
		
		angular.forEach($scope.selectos2, function(item, index){
			
			item.Motivo = causa;
			// console.log(item);

		});

		$scope.quitaselectos2();
	}

	$scope.quitaselectos2 = function(){

    	$scope.gridOptions2.$gridScope.toggleSelectAll(false);
    }


    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }



	$scope.guardaRechazo = function(){

		// console.log($scope.selectos2);
		// console.log($scope.listado2);

		$('#boton3').button('loading');

		qualitas.enviaRechazos($scope.listado2).success( function (data){
			
			$('#boton3').button('reset');
			$('#modalEx').modal('hide');
			$scope.buscafacturas();
			
		}).error( function (xhr,status,data){

			$('#boton3').button('reset');

		});
	}

 	var CellTemplate ='<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-model="row.entity.Procesado" ng-change="verifica(row.entity.Procesado,row.entity)" checked/></div>';
	///filtros
	$scope.selectos = [];
	$scope.selectos2 = [];

	$scope.rechazados = [];

	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
	};

    ////opciones del grid                 
    $scope.gridOptions = { 
    	data: 'listado', 
    	enableColumnResize:true,
    	enablePinning: true, 
    	enableRowSelection:true,
    	multiSelect:true,
    	showSelectionCheckbox: true,
    	// checkboxCellTemplate:CellTemplate,
    	// beforeSelectionChange: $scope.verifica,
    	selectWithCheckboxOnly: false,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	enableCellEdit: false,
    	columnDefs: [
                    { field:'folioElectronico',displayName:'FOLIO QUA', width: 120, pinned: true},
                    { field:'folioAdministradora',displayName:'FOLIO ADMIN', width: 120, pinned: false},
                    { field:'folioSistema',displayName:'FOLIO SISTEMA', width: 120 },
                    { field:'claveproovedor',displayName:'PROVEEDOR', width: 120 },
                    { field:'claveprestador',displayName:'PROV SERV', width: 120 },
                    { field:'Siniestro',displayName:'SINIESTRO', width: 120 },
		            { field:'Reporte',displayName:'REPORTE', width: 120 },
		            { field:'Poliza',displayName:'POLIZA', width: 120 },
		            { field:'Lesionado',displayName:'LESIONADO', width: 330 },
		            { field:'Afectado',displayName:'AFECTADO', width: 120},
		            { field:'Cobertura',displayName:'COBERTURA', width: 120 },
		            { field:'Subtotal',displayName:'SUBTOTAL', width: 120 },
		            { field:'iva',displayName:'IVA', width: 120 },
		            { field:'Descuento',displayName:'DESCUENTO', width: 120 },
		            { field:'Total',displayName:'TOTAL', width: 120 },
		            { field:'FechaCaptura',visible:false, width: 120 },
		            { field:'TipoUnidad',visible:false, width: 120 }
        ],
        showFooter: true,
        showFilter:false
    };

    $scope.$on('ngGridEventData', function(){

    	//if (!$scope.procesado) {
    		$scope.gridOptions.selectAll(true);
    		$scope.gridOptions2.selectAll(true);
       		$scope.allSelected = true;
    	//};
       	
    });

    $scope.verifica = function(valor,item){
    	// console.log(item);
    	if (item) {
    		$scope.rechazados.push(item);
    	};

    }

    $scope.gridOptions2 = { 
    	data: 'listado2', 
    	enableColumnResize:true,
    	enablePinning: true, 
    	enableRowSelection:true,
    	multiSelect:true,
    	showSelectionCheckbox: true,
    	selectWithCheckboxOnly: false,
    	selectedItems: $scope.selectos2, 
    	filterOptions: $scope.filterOptions,
    	enableCellEdit: false,
    	columnDefs: [
                    { field:'PAS_folio',displayName:'FOLIO SISTEMA', width: 120 },
                    { field:'Motivo',displayName:'MOTIVO RECHAZO', enableCellEdit:false, width: 420 }
        ],
        showFooter: true,
        showFilter:false
    };

};

function formatoQualitasIncompletosCtrl($scope, $rootScope,$http, find, loading, qualitas){

	$scope.inicio = function(){

		$scope.tituloFQI = "Facturas Incompletas";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.muestra = false;
		$scope.mensaje = '';

	}

	$scope.buscafacturas = function(){


		loading.cargando('Buscando Factura(s)');

		var datos = {fechaini:$scope.fechaini,fechafin:$scope.fechafin,producto:$scope.producto};
		//armamos los datos a enviar segun tipo de consulta (tipo)
		qualitas.incompletos(datos).success(function (data){

			if(data){
        		$scope.listado = data;
        		$scope.cantidad = data.length -1;
        	}else{
        		$scope.listado = [];
        	}
		
    		loading.despedida();
		}).error( function (xhr,status,data){

			loading.despedida();

		});

		

	}

	$scope.quitalistado = function(item){
		// console.log(item);
	}


	$scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }

    $scope.generarListado = function(){

    	JSONToXLSConvertor($scope.listado, "Facturas", true);

    }

 	var CellTemplate ='<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-model="row.entity.Procesado" ng-change="verifica(row.entity.Procesado,row.entity)" checked/></div>';
	///filtros
	$scope.selectos = [];

	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
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
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	enableCellEdit: false,
    	columnDefs: [
                    { field:'folioElectronico',displayName:'FOLIO QUA', width: 120, pinned: true},
                    { field:'folioAdministradora',displayName:'FOLIO ADMIN', width: 120, pinned: false},
                    { field:'folioSistema',displayName:'FOLIO SISTEMA', width: 120 },
                    { field:'claveproovedor',displayName:'PROVEEDOR', width: 120 },
                    { field:'claveprestador',displayName:'PROV SERV', width: 120 },
                    { field:'Siniestro',displayName:'SINIESTRO', width: 120 },
		            { field:'Reporte',displayName:'REPORTE', width: 120 },
		            { field:'Poliza',displayName:'POLIZA', width: 120 },
		            { field:'Lesionado',displayName:'LESIONADO', width: 330 },
		            { field:'Afectado',displayName:'AFECTADO', width: 120},
		            { field:'Cobertura',displayName:'COBERTURA', width: 120 },
		            { field:'Subtotal',displayName:'SUBTOTAL', width: 120 },
		            { field:'iva',displayName:'IVA', width: 120 },
		            { field:'Descuento',displayName:'DESCUENTO', width: 120 },
		            { field:'Total',displayName:'TOTAL', width: 120 },
		            { field:'Motivo', width: 220 },
		            { field:'FechaCaptura',visible:false, width: 120 },
		            { field:'TipoUnidad',visible:false, width: 120 }
        ],
        showFooter: true,
        showFilter:false
    };

};

//rechazados por qualitas
function formatoQualitasRechazadosCtrl($scope, $rootScope, find, loading, qualitas){

	$scope.inicio = function(){

		$scope.tituloFQR = "Facturas Invalidas por portal Qualitas";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.muestra = false;
		$scope.mensaje = '';
		$('#modalEx').on('hidden.bs.modal', function (e) {

			$scope.gridOptions.$gridScope.toggleSelectAll(false);
		 	$scope.buscafacturas();

		});

	}

	$scope.buscafacturas = function(){

		loading.cargando('Buscando Factura(s)');

		//armamos los datos a enviar segun tipo de consulta (tipo)
		var datos = {fechaini:$scope.fechaini,fechafin:$scope.fechafin};

		qualitas.invalidos(datos).success(function (data){
			if(data){
        		$scope.listado = data;
        		$scope.cantidad = data.length -1;
        	}else{
        		$scope.listado = [];
        	}
    		loading.despedida();
		});

	}

	$scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }

    $scope.Mandarprincipal = function(){

    
    	$('#boton3').button('loading');

    	qualitas.enviaPrincipal($scope.selectos).success(function (data){
			
			$scope.quitaselectos();
	 		$scope.buscafacturas();
			$('#boton3').button('reset');
    		
    	}).error( function (xhr,status,data){

			$('#boton3').button('reset');

		});

    }

	$scope.selecciona = function(limite){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);

    	var numero = Number(limite);
		angular.forEach($scope.listado, function(item, index){
			
			if (index < numero) {
				//$scope.selectos.push(item);
				$scope.gridOptions.selectItem(index, true);
			};

		});

		// console.log($scope.selectos);

	};

 	var CellTemplate ='<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-model="row.entity.Procesado" ng-change="verifica(row.entity.Procesado,row.entity)" checked/></div>';
	///filtros
	$scope.selectos = [];

	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
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
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	enableCellEdit: false,
    	columnDefs: [
                    { field:'folioElectronico',displayName:'FOLIO QUA', width: 120, pinned: true},
                    { field:'folioAdministradora',displayName:'FOLIO ADMIN', width: 120, pinned: false},
                    { field:'folioSistema',displayName:'FOLIO SISTEMA', width: 120 },
                    { field:'claveproovedor',displayName:'PROVEEDOR', width: 120 },
                    { field:'claveprestador',displayName:'PROV SERV', width: 120 },
                    { field:'Siniestro',displayName:'SINIESTRO', width: 120 },
		            { field:'Reporte',displayName:'REPORTE', width: 120 },
		            { field:'Poliza',displayName:'POLIZA', width: 120 },
		            { field:'Lesionado',displayName:'LESIONADO', width: 330 },
		            { field:'Afectado',displayName:'AFECTADO', width: 120},
		            { field:'Cobertura',displayName:'COBERTURA', width: 120 },
		            { field:'Subtotal',displayName:'SUBTOTAL', width: 120 },
		            { field:'iva',displayName:'IVA', width: 120 },
		            { field:'Descuento',displayName:'DESCUENTO', width: 120 },
		            { field:'Total',displayName:'TOTAL', width: 120 },
		            { field:'Motivo', width: 220 },
		            { field:'FechaCaptura',visible:false, width: 120 },
		            { field:'TipoUnidad',visible:false, width: 120 }
        ],
        showFooter: true,
        showFilter:false
    };

    $scope.generarListadoExcel = function(){

    	JSONToXLSConvertor($scope.listado, "Facturas", true);

    }


 //    $scope.generarListado = function(){

	// 	$('#boton2').button('loading');

	// 	$http({
	// 		url:'/documento/api/facturasQualitasImagenes',
	// 		method:'POST', 
	// 		contentType: 'application/json', 
	// 		dataType: "json", 
	// 		data: $scope.listado
	// 	}).success( function (data){
			 

 //        	$('#boton2').button('reset');

 //        	JSONToXLSConvertor(data.comprimidos, "Reporte", true);
 //    		document.location = data.archivo;
			
	// 	}).error( function (xhr,status,data){

	// 		$('#boton2').button('reset');
	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

	// 	});

	// }



    $scope.verifica = function(valor,item){
    	// console.log(item);
    	if (item) {
    		$scope.rechazados.push(item);
    	};
    }

};

formatoQualitasCtrl.$inject = ['$scope', '$rootScope','$http', 'find', 'loading', 'api', 'qualitas'];
formatoQualitasArchivosCtrl.$inject = ['$scope', '$rootScope', 'find', 'loading', 'qualitas', 'reportes'];
formatoQualitasConsultaCtrl.$inject = ['$scope','$rootScope', 'find'];
formatoQualitasEnviadoCtrl.$inject = ['$scope', '$rootScope', 'find', 'loading', 'qualitas'];
formatoQualitasIncompletosCtrl.$inject = ['$scope', '$rootScope','$http', 'find', 'loading', 'qualitas'];
formatoQualitasRechazadosCtrl.$inject = ['$scope', '$rootScope', 'find', 'loading', 'qualitas'];

app.controller('formatoQualitasArchivosCtrl',formatoQualitasArchivosCtrl);
app.controller('formatoQualitasConsultaCtrl',formatoQualitasConsultaCtrl);
app.controller('formatoQualitasEnviadoCtrl',formatoQualitasEnviadoCtrl);
app.controller('formatoQualitasIncompletosCtrl', formatoQualitasIncompletosCtrl);
app.controller('formatoQualitasCtrl',formatoQualitasCtrl);
app.controller('formatoQualitasRechazadosCtrl',formatoQualitasRechazadosCtrl);