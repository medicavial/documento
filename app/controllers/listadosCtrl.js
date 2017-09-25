///Folios rechazados
function rechazosCtrl( $scope, $rootScope, $routeParams, $location, find, loading, checkFolios,datos,$upload, api,leexml){

    loading.despedida();

	//Con parametros de inicio
	$scope.inicio = function(){

		$scope.tituloRC = "Documentos Rechazados";
		$scope.listadoRechazos = datos.data;
        $scope.folio = '';
        $scope.mensaje = '';
        $scope.empresas();
        $scope.unidades();
        $scope.verareaoperativa();
        $scope.area = $routeParams.area;
        $scope.areaEntrega = $rootScope.areaUsuario;

	}

	//Carga la lista de archivos a enviar
	$scope.cargaRechazos = function(){

		find.listadorechazos($rootScope.id).success( function (data){

        	if(data){
        		$scope.listadoRechazos = data;
        	}else{
        		$scope.listadoRechazos = [];
        	}

        	$scope.gridOptions.$gridScope.toggleSelectAll(false);

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

        console.log($rootScope.area);

		if ($rootScope.area == area) {

            if (area == 4 && $rootScope.id != 130) {

                alert('No puedes emitir entregas a tu misma area');
    			$scope.areaOp = '';

            }else{

                $scope.area = area;
                find.usuariosarea(area).success( function (data){

                    $scope.usuarios = data;

                 });
            }


		}else if ($rootScope.area != 4 && area == 5) {
			alert('No puedes emitir entregas a facturacion tu usuario no tiene permisos');
			$scope.areaOp = '';
		}else{

			$scope.area = area;
			find.usuariosarea(area).success( function (data){

				$scope.usuarios = data;

			 });
		}

	}

	$scope.empresas = function(){

		find.empresas().success( function (data) {

			$scope.clientes = data;

		 });

	}

	$scope.unidades = function(){

		find.unidades().success( function (data) {

			$scope.unidades = data;

		 });

	}

	//guardamos pero antes verificamos que tengamos documentos seleccionados
	$scope.entrega = function(){

		if ($scope.selectos.length > 0) {

			$scope.validainfo();

		}else{
			alert('No se ha seleccionado ningun documento');
		}

	}
	$scope.validainfo = function(){

		$scope.mensaje = '';
		$('#boton').button('loading');

		var promesa = checkFolios.enviaFolios($scope.selectos,$scope.areaOp,$scope.user,$rootScope.id,$scope.areaEntrega);
		promesa.then(function (data){

			$scope.mensaje = data.respuesta;
			$scope.tipoalerta = 'alert-success';
			$scope.cargaRechazos();
			$('#boton').button('reset');
			if (data.rechazos.length > 0) {
				$scope.rechazos = data.rechazos;
				// console.log($scope.rechazos);
				$('#myModal3').modal();
			};

		},function (error){

			$scope.mensaje = error;
			$scope.tipoalerta = 'alert-warning';

		});

	}


	//////Todo lo necesario para el grid

    //inicalizamos archivos seleccionados
    $scope.selectos = [];

	///filtros
	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
	};


	var csvOpts = { columnOverrides: { obj: function (o) {
	    return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
	    } },
	    iEUrl: 'downloads/download_as_csv'
	};

    $scope.gridOptions = {
    	data: 'listadoRechazos',
    	enableColumnResize:true,
    	enablePinning: true,
    	enableRowSelection:true,
    	showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
    	multiSelect:true,
    	selectedItems: $scope.selectos,
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
		            { field:'PAS_folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
		            { field:'USURechazo', displayName:'UsuarioRechazo', width: 200 },
		            { field:'FLD_motivoRechazo', displayName:'MotivoRechazo', width: 220 },
		            { field:'FLD_etapa', displayName:'Etapa', width: 120 },
		            { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
		            { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
		            { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
		            { field:'FLD_formaRecep', displayName:'Tipo', width: 120 },
		            { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
		            { field:'', displayName:'DocRevision', width: 100 },
		            { field:'FLD_claveint', displayName:'FLD_claveint', width: 100, visible:false },
		            { field:'DOC_claveint', displayName:'documento', width: 100, visible:false },
		            { field:'CapEt2', displayName:'CapEt2', width: 100, visible:false },
		            { field:'EnvFac', displayName:'EnvFac', width: 100, visible:true },
		            { field:'FLD_AROent', displayName:'FLD_AROent', width: 100, visible:false },
		            { field:'ARO_porRecibir', displayName:'area', width: 100, visible:false },
		            { field:'USU_ent', displayName:'USU_ent', width: 100, visible:false },
		            { field:'FLD_observaciones', displayName:'Observaciones', width: 320, enableCellEdit: true}
        ],
        showFooter: true,
        showFilter:true

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

    	// if($scope.tipo == 'Fax'){
    	// 	var objeto3 = "Fax:x; ";
    	// }else if($scope.tipo == 'Original'){
    	// 	var objeto3 = "Original:x; ";
    	// }else{
    	// 	var objeto3 = "";
    	// }

    	if($scope.folio.length == 0){
    		var objeto3 = "";
    	}else{
    		var objeto3 = "Folio:" + $scope.folio + "; ";
    	}

    	// if($scope.lesionado.length == 0){
    	// 	var objeto5 = "";
    	// }else{
    	// 	var objeto5 = "Lesionado:" + $scope.lesionado + "; ";
    	// }

    	// if($scope.producto == undefined || $scope.producto == 0){
    	// 	var objeto6 = "";
    	// }else{
    	// 	var objeto6 = "Producto:" + $scope.producto.nombre + "; ";

    	// }

    	// if($scope.etapa == undefined || $scope.etapa == 0){
    	// 	var objeto7 = "";
    	// }else{
    	// 	var objeto7 = "Etapa:" + $scope.etapa + "; ";

    	// }


    	var filtro = objeto1 + objeto2 + objeto3;// + objeto4 + objeto5 + objeto6 + objeto7;

    	$scope.filterOptions.filterText = filtro;

    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = '';
    	$scope.unidad = 0;
    	$scope.cliente = 0;

    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);

    }

};

///Folios rechazados x area
function rechazosAreaCtrl( $scope, $rootScope, $routeParams, $location, find, loading, checkFolios,datos){

    loading.despedida();

	//Con parametros de inicio
	$scope.inicio = function(){

		$scope.tituloRC = "Documentos Rechazados";
		$scope.listadoRechazos = datos.data;
        $scope.folio = '';
        $scope.mensaje = '';
        $scope.empresas();
        $scope.unidades();
        $scope.verareaoperativa();
        $scope.area = $routeParams.area;
        $scope.areaEntrega = $rootScope.areaUsuario;

	}


	//Carga la lista de archivos a enviar
	$scope.cargaRechazos = function(){



		find.listadorechazos($rootScope.userM).success( function (data){

        	if(data){
        		$scope.listadoRechazos = data;
        	}else{
        		$scope.listadoRechazos = [];
        	}

        	$scope.gridOptions.$gridScope.toggleSelectAll(false);

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

        console.log($rootScope.area);

		if ($rootScope.area == area) {

            if (area == 4 && $rootScope.id != 130) {

                alert('No puedes emitir entregas a tu misma area');
    			$scope.areaOp = '';

            }else{

                $scope.area = area;
                find.usuariosarea(area).success( function (data){

                    $scope.usuarios = data;

                 });
            }


		}else if ($rootScope.area != 4 && area == 5) {
			alert('No puedes emitir entregas a facturacion tu usuario no tiene permisos');
			$scope.areaOp = '';
		}else{

			$scope.area = area;
			find.usuariosarea(area).success( function (data){

				$scope.usuarios = data;

			 });
		}

	}

	$scope.empresas = function(){

		find.empresas().success( function (data) {

			$scope.clientes = data;

		 });

	}

	$scope.unidades = function(){

		find.unidades().success( function (data) {

			$scope.unidades = data;

		 });

	}

	//guardamos pero antes verificamos que tengamos documentos seleccionados
	$scope.entrega = function(){

		if ($scope.selectos.length > 0) {

			$scope.validainfo();

		}else{
			alert('No se ha seleccionado ningun documento');
		}

	}

	$scope.validainfo = function(){

		$scope.mensaje = '';
		$('#boton').button('loading');

		var promesa = checkFolios.enviaFolios($scope.selectos,$scope.areaOp,$scope.user,$rootScope.id,$scope.areaEntrega);
		promesa.then(function (data){

			$scope.mensaje = data.respuesta;
			$scope.tipoalerta = 'alert-success';
			$scope.cargaRechazos();
			$('#boton').button('reset');
			if (data.rechazos.length > 0) {
				$scope.rechazos = data.rechazos;
				// console.log($scope.rechazos);
				$('#myModal3').modal();
			};

		},function (error){

			$scope.mensaje = error;
			$scope.tipoalerta = 'alert-warning';

		});

	}


	//////Todo lo necesario para el grid

    //inicalizamos archivos seleccionados
    $scope.selectos = [];

	///filtros
	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
	};


	var csvOpts = { columnOverrides: { obj: function (o) {
	    return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
	    } },
	    iEUrl: 'downloads/download_as_csv'
	};

    $scope.gridOptions = {
    	data: 'listadoRechazos',
    	enableColumnResize:true,
    	enablePinning: true,
    	enableRowSelection:true,
    	showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
    	multiSelect:true,
    	selectedItems: $scope.selectos,
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
		            { field:'PAS_folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
		            { field:'USURechazo', displayName:'UsuarioRechazo', width: 200 },
		            { field:'FLD_motivoRechazo', displayName:'MotivoRechazo', width: 220 },
		            { field:'FLD_etapa', displayName:'Etapa', width: 120 },
		            { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
		            { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
		            { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
		            { field:'FLD_formaRecep', displayName:'Tipo', width: 120 },
		            { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
		            { field:'', displayName:'DocRevision', width: 100 },
		            { field:'FLD_claveint', displayName:'FLD_claveint', width: 100, visible:false },
		            { field:'DOC_claveint', displayName:'documento', width: 100, visible:false },
		            { field:'CapEt2', displayName:'CapEt2', width: 100, visible:false },
		            { field:'EnvFac', displayName:'EnvFac', width: 100, visible:true },
		            { field:'FLD_AROent', displayName:'FLD_AROent', width: 100, visible:false },
		            { field:'ARO_porRecibir', displayName:'area', width: 100, visible:false },
		            { field:'USU_ent', displayName:'USU_ent', width: 100, visible:false },
		            { field:'FLD_observaciones', displayName:'Observaciones', width: 320, enableCellEdit: true}
        ],
        showFooter: true,
        showFilter:true

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

    	// if($scope.tipo == 'Fax'){
    	// 	var objeto3 = "Fax:x; ";
    	// }else if($scope.tipo == 'Original'){
    	// 	var objeto3 = "Original:x; ";
    	// }else{
    	// 	var objeto3 = "";
    	// }

    	if($scope.folio.length == 0){
    		var objeto3 = "";
    	}else{
    		var objeto3 = "Folio:" + $scope.folio + "; ";
    	}

    	// if($scope.lesionado.length == 0){
    	// 	var objeto5 = "";
    	// }else{
    	// 	var objeto5 = "Lesionado:" + $scope.lesionado + "; ";
    	// }

    	// if($scope.producto == undefined || $scope.producto == 0){
    	// 	var objeto6 = "";
    	// }else{
    	// 	var objeto6 = "Producto:" + $scope.producto.nombre + "; ";

    	// }

    	// if($scope.etapa == undefined || $scope.etapa == 0){
    	// 	var objeto7 = "";
    	// }else{
    	// 	var objeto7 = "Etapa:" + $scope.etapa + "; ";

    	// }


    	var filtro = objeto1 + objeto2 + objeto3;// + objeto4 + objeto5 + objeto6 + objeto7;

    	$scope.filterOptions.filterText = filtro;

    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = '';
    	$scope.unidad = 0;
    	$scope.cliente = 0;

    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);

    }

};

function traspasosCtrl($scope, $rootScope, $routeParams,$http, find, loading){

	$scope.inicio = function(){

		$scope.tituloT = 'Traspasos';
		$scope.area = $routeParams.area;
		$scope.cargaEntrada();
		$scope.altausuariosarea();

	}

	//Carga la lista de archivos a enviar
	$scope.cargaEntrada = function(){

		loading.cargando('Buscando Folios');

		find.listadogeneral($rootScope.id).success( function (data){

        	if(data.respuesta){
        		loading.mensaje(data.respuesta);
        		$scope.listadoEntrega = [];

        	}else{
        		$scope.listadoEntrega = data;
        	}

        	loading.despedida();

		}).error( function (xhr,status,data){

			loading.despedida();
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});
	}

	//enlista los usuarios de cada area
	$scope.altausuariosarea = function(){


		find.usuariosarea($rootScope.areaUsuario).success( function (data){

			$scope.usuarios = data;

		 });
	}

	//Carga la lista de folios activos del usuario a enviar
	$scope.buscaFolios = function(usuario){

		if(usuario == $rootScope.id){
			alert('No puedes generar traspasos a ti mismo');
		}else{

			loading.cargando('Buscando Folios');

			find.listadogeneral(usuario).success( function (data){

	        	if(data.respuesta){
	        		loading.mensaje(data.respuesta);
	        		$scope.listadoEntrega2 = [];

	        	}else{
	        		$scope.listadoEntrega2 = data;
	        	}

	        	loading.despedida();

			}).error( function (xhr,status,data){

				loading.despedida();
				alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

			});

		}

	}

	$scope.mandaFolios = function(numero){

		if (numero == 1){
			var datos = $scope.selectos;

		}else{
			var datos = $scope.selectos2;
		}

		// console.log(datos.length);


		for (var i = 0; i < datos.length; i++) {


			var documentoEnv = datos[i];

			if (numero == 1){
				var entrega = Number($rootScope.id);
				var recibe = Number($scope.user);

			}else{
				var datos = $scope.selectos2;
				var entrega = Number($scope.user);
				var recibe = Number($rootScope.id);
			}

			// //generamos el JSON necesario incluyendo los datos del area y usuario para enviarlo mediante post
			var info = {
				folio:documentoEnv.Folio,
				etapa:documentoEnv.Etapa,
				cantidad:documentoEnv.Cantidad,
				documento:Number(documentoEnv.documento),
				usuarioentrega:entrega,
				areaentrega:Number(documentoEnv.area),
				usuariorecibe:recibe,
				arearecibe:Number($scope.areaOp),
				clave:Number(documentoEnv.FLD_claveint),
				uasuarioemitio:$rootScope.id,
				observaciones:documentoEnv.Observaciones
			};

			// console.log(info);

		    $http({
				url:'/documento/api/traspaso',
				method:'POST',
				contentType: 'application/json',
				dataType: "json",
				data:info
			}).success( function (data){

				$scope.mensaje = data.respuesta;
				$scope.tipoalerta = 'alert-success';
				$scope.quitaselectos();

			}).error( function (data){

				$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
				$scope.tipoalerta = 'alert-warning';

			});


		}


		$scope.cargaEntrada();
		$scope.buscaFolios($scope.user);

	}


	$scope.verificacampo = function(){

		if ($scope.selectos.length == 0 || $scope.listadoEntrega2.length == 0) {
			return true;
		}else{
			return false;
		}
	}

	$scope.verificacampo2 = function(){

		if ($scope.selectos2.length == 0 || $scope.listadoEntrega2.length == 0) {
			return true;
		}else{
			return false;
		}
	}


	//////Todo lo necesario para el grid 1

    //inicalizamos archivos seleccionados
    $scope.selectos = [];


    ////opciones del grid
    $scope.gridOptions = {
    	data: 'listadoEntrega',
    	enableColumnResize:true,
    	enablePinning: true,
    	enableRowSelection:true,
    	multiSelect:true,
    	showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
    	enableCellSelection: false,
    	selectedItems: $scope.selectos,
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
                    { field:'Folio', width: 120, enableCellEdit:true, pinned:true },
		            { field:'Etapa', width: 120 },
		            { field:'Cantidad', width: 100 },
		            { field:'Empresa', width: 120 },
		            { field:'Unidad', width: 200 },
		            { field:'FLD_claveint', width: 100, visible:false },
		            { field:'documento', width: 100, visible:false },
		            { field:'CapEt2', width: 100, visible:false },
		            { field:'FLD_AROent', width: 100, visible:false },
		            { field:'area', width: 100, visible:false },
		            { field:'USU_ent', width: 100, visible:false },

        ],
        showFooter: false,
        showFilter:true,
        plugins: [new ngGridCsvExportPlugin()]
    };



    //////Todo lo necesario para el grid 2

    //inicalizamos archivos seleccionados

    ////opciones del grid

    $scope.selectos2 = [];


    $scope.gridOptions2 = {
    	data: 'listadoEntrega2',
    	enableColumnResize:true,
    	enablePinning: true,
    	enableRowSelection:true,
    	multiSelect:true,
    	showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
    	enableCellSelection: false,
    	selectedItems: $scope.selectos2,
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
                    { field:'Folio', width: 120,  enableCellEdit:true, pinned:true , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
		            { field:'Etapa', width: 120 },
		            { field:'Cantidad', width: 100 },
		            { field:'Empresa', width: 120 },
		            { field:'Unidad', width: 200 },
		            { field:'FLD_claveint', width: 100, visible:false },
		            { field:'documento', width: 100, visible:false },
		            { field:'CapEt2', width: 100, visible:false },
		            { field:'FLD_AROent', width: 100, visible:false },
		            { field:'area', width: 100, visible:false },
		            { field:'USU_ent', width: 100, visible:false },

        ],
        showFooter: false,
        showFilter:true,
        plugins: [new ngGridCsvExportPlugin()]
    };

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    	$scope.gridOptions2.$gridScope.toggleSelectAll(false);
    }

};

//// Generacion de entregas
function entregasCtrl($scope, $rootScope, $routeParams, find, loading, $http){
	//Carga Configuracion Inicial
	$scope.inicio = function(){

		$scope.tituloE = 'Entregas de ' + $routeParams.area;
		$scope.area = $routeParams.area;
		$scope.cargaEntrada();
		$scope.empresas();
		$scope.altaunidades();
		$scope.verareaoperativa();
		$scope.mensaje = '';

	}

	//Carga la lista de archivos a enviar
	$scope.cargaEntrada = function(){

		loading.cargando('Buscando Folios');

		find.listadogeneral($rootScope.id).success( function (data){

        	if(data.respuesta){
        		loading.mensaje(data.respuesta);
        		$scope.listadoEntrega = [];

        	}else{
        		$scope.listadoEntrega = data;
        	}

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

	$scope.validainfo = function(){

		$scope.mensaje = '';
		$('#boton').button('loading');

		//console.log($scope.selectos);
		for (var i = 0; i < $scope.selectos.length; i++) {

			try{
				var documento = $scope.selectos[i];

				//Si es Etapa 2 o 3 y Etapa 1 no esta capturada
				if(documento.Etapa > 1 && documento.CapEt2 == 0){
					throw 'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede entregar debido a que la etapa 1 no esta capturada';
				}

				//Si se envia a Facturación y no es original ó ya fue enviado anteriormente manda mensaje de error
				//se agrego indexof(busca el contenido que se ponga aqui) por que javascript no soporta muchos && y || en un mismo if
				if( (documento.FaxOrigianl.indexOf('O') == -1  && $scope.areaOp == 5) || ($scope.areaOp == 5 && documento.FLD_AROent == 5 && documento.USU_ent != 'null')||($scope.areaOp == 5 && documento.EnvFac == 'SI' && documento.Etapa == 1) ){
					throw 'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede enviar a Facturación debido a que no es etapa 1 o ya fue mandado';
				}

				//Si se envia a Facturación y no es etapa 1
				if($scope.areaOp == 5 && documento.Etapa > 1) {
					throw 'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede enviar a Facturación debido a que no es etapa 1';
				}

				//Si se envia a pagos y no es original
				if($scope.areaOp == 6 && documento.EnvFac != 'SI' && documento.Etapa == 1) {

					if(confirm('El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se a enviado a Facturación. ¿Desea proseguir?')){
						//si es facturacion agrega un juego mas al flujo

						$scope.actualizaFlujo(i);

						throw 1;
					}
				}


				//Si se envia a Facturación y es mesa de control
				if($scope.areaOp == 5 && $rootScope.area == 4) {

					$scope.guardaFlujo(i);
					throw 1;
				}else if($scope.areaOp == 5 && $rootScope.area != 4){
					throw 'El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se puede enviar a Facturación tu usuario no tiene permisos';
				}


				$scope.actualizaFlujo(i);

			}catch(err){

				if(err != 1){
					alert(err);
				}

			}
		} //Termina for

		if (i == $scope.selectos.length -1) {
			$('#boton').button('reset');
			$scope.mensaje = 'Termino el Envio';
			$scope.inicio();
		};


	}

	$scope.guardaFlujo = function(indice){

		var documentoEnv = $scope.selectos[indice];
		// console.log(documentoEnv);

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
			reasignado:documentoEnv.Reasignado,
			observaciones:documentoEnv.Observaciones
		};

		//console.log(datos);

	    $http({
			url:'/documento/api/altaentrega',
			method:'POST',
			contentType: 'application/json',
			dataType: "json",
			data:datos
		}).success( function (data){

			// console.log(data);
			$scope.mensaje = data.respuesta;
			$scope.tipoalerta = 'alert-success';

		}).error( function (data){

			$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
			$scope.tipoalerta = 'alert-warning';

		});
	}

	$scope.actualizaFlujo = function(indice){

		//seleccionamos el folio a mandar
		var documentoEnv = $scope.selectos[indice];

		// console.log(documentoEnv);
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
			reasignado:documentoEnv.Reasignado,
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

		}).error( function (data){

			$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
			$scope.tipoalerta = 'alert-warning';

		});
	}

    //////Todo lo necesario para el grid

    //inicalizamos archivos seleccionados
    $scope.selectos = [];

	///filtros
	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
	};

	var csvOpts = { columnOverrides: { obj: function (o) {
	    return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
	    } },
	    iEUrl: 'downloads/download_as_csv'
	};


	var checkboxCellTemplate='<div style="margin-top:10px;" class="text-center"><input  type="checkbox" ng-model="row.entity.Reasignado"/></div>';

    ////opciones del grid
    $scope.gridOptions = {
    	data: 'listadoEntrega',
    	enableColumnResize:true,
    	enablePinning: true,
    	enableRowSelection:true,
    	multiSelect:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
    	enableCellSelection: true,
    	selectedItems: $scope.selectos,
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
                    { field:'Folio', width: 120, pinned:true , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
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
		            { field:'Reasignado', cellTemplate:checkboxCellTemplate, width: 90 },
		            { field:'Observaciones', width: 320, enableCellEdit: true}

        ],
        showFooter: true,
        showFilter:true
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

    	if($scope.unidad == undefined || $scope.unidad == 0){
    		var objeto1 = "";
    	}else{
    		var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";

    	}
    	if($scope.cliente != undefined || $scope.cliente != 0){
    		var objeto2 = "Empresa:" + $scope.cliente.nombre + "; ";
    	}else{
    		var objeto2 = "";
    	}

    	if($scope.tipo == 'option2'){
    		var objeto3 = "Fax:x; ";
    	}else if($scope.tipo == 'option3'){
    		var objeto3 = "Original:x; ";
    	}else{
    		var objeto3 = "";
    	}

    	var filtro = objeto1 + objeto2 + objeto3;


    	$scope.filterOptions.filterText = filtro;

    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = '';
    	$scope.unidad = 0;
    	$scope.cliente = 0;

    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }

};

//mustra los documentos entregados pendientes de recibir
function listadoEntregasCtrl($scope, $rootScope, $routeParams, find, loading, checkFolios,datos,$filter){


    loading.despedida();
    //Carga Configuracion Inicial
    $scope.inicio = function(){

        $scope.tituloLE = 'Listado de Entregas efectuadas'; //+ $routeParams.area;
        $scope.area = $routeParams.area;
        $scope.folio = '';
        $scope.mensaje = '';
        $scope.empresas();
        $scope.altaunidades();
        $scope.listadoEntregas = datos.data;

        $scope.filtrado = {
            EMP_nombrecorto : '',
            UNI_nombrecorto : ''
        };


    }

    //Carga la lista de archivos a Recibir de otras areas
    $scope.cargaEntregas = function(){

        find.listadoentrega($rootScope.id).success( function (data){
            //console.log(data);
            if(data){
                $scope.listadoEntregas = data;
            }else{
                $scope.listadoEntregas = [];
            }

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

	//elimina la seleccion o al que le apretaron
	$scope.elimina = function(dato){

		$scope.mensaje = '';
		var datos = [dato.entity];
        $('#boton').button('loading');

		checkFolios.enviaRechazos(datos,$rootScope.area,$rootScope.id).then(
			function (data){
				$scope.gridOptions.$gridScope.toggleSelectAll(false);
				$scope.mensaje = data.respuesta;
				$scope.tipoalerta = 'alert-success';
				$scope.cargaEntregas();
                $('#boton').button('reset');
			},
			function (error){
				$scope.mensaje = error;
				$scope.tipoalerta = 'alert-warning';
                $('#boton').button('reset');
			}
		);

	}


	$scope.eliminaMultiple = function(){

        $('#boton').button('loading');
        $scope.mensaje = '';
        var datos = $scope.selectos;

		checkFolios.enviaRechazos(datos,$rootScope.area,$rootScope.id).then(
			function (data){
				$scope.gridOptions.$gridScope.toggleSelectAll(false);
				$scope.mensaje = data.respuesta;
				$scope.tipoalerta = 'alert-success';
				$scope.cargaEntregas();

				if (data.rechazos.length > 0) {
					$scope.rechazos = data.rechazos;
					$('#myModal4').modal();
				};

                $('#boton').button('reset');
            },
            function (error){
                $scope.mensaje = error;
                $scope.tipoalerta = 'alert-warning';
                $('#boton').button('reset');
            }
        );


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
    	data: 'listadoEntregas',
    	enableColumnResize:true,
    	enablePinning: true,
    	enableRowSelection:true,
    	multiSelect:true,
    	showFooter: true,
        showFilter:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
    	selectedItems: $scope.selectos,
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
    				{ field:'PorEntregarA', displayName:'PorEntregarA', width: 120 },
                    { field:'PAS_folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
		            { field:'FLD_etapa', displayName:'Etapa', width: 120 },
		            { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
		            { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
		            { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
		            { field:'FLD_formaRecep', displayName:'FaxOrigianl', width: 120 },
		            { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
		            { field:'Triage', width: 120 },
		            { field:'ROC', displayName:'ROC', width: 100, visible:false },
		            { field:'DOC_claveint', width: 100, visible:false },
		            { field:'FLD_claveint', width: 100, visible:false },
		            { field:'FLD_AROent', width: 100, visible:false },
		            { field:'ARO_porRecibir', width: 100, visible:false },
		            { displayName:'Accion' ,cellTemplate:'  <a href="" ng-click="elimina(row)">Quitar</a>'}
		]

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
            $scope.filtrado.UNI_nombrecorto = '';
    	}else{
    		var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
            $scope.filtrado.UNI_nombrecorto = $scope.unidad.nombre;

    	}
    	if($scope.cliente == undefined || $scope.cliente == 0){
    		var objeto2 = "";
            $scope.filtrado.EMP_nombrecorto = '';
    	}else{
    		var objeto2 = "Empresa:" + $scope.cliente.nombre + "; ";
            $scope.filtrado.EMP_nombrecorto = $scope.cliente.nombre;
    	}

    	if($scope.folio.length == 0){
    		var objeto3 = "";
    	}else{
    		var objeto3 = "Folio:" + $scope.folio + "; ";
    	}



    	var filtro = objeto1 + objeto2 + objeto3;

    	$scope.filterOptions.filterText = filtro;

    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = '';
    	$scope.unidad = 0;
    	$scope.cliente = 0;

        $scope.filtrado = {
            EMP_nombrecorto : '',
            UNI_nombrecorto : ''
        };

    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }

    $scope.exporta = function(){
        $scope.exportables = $filter('filter')($scope.listadoEntregas, $scope.filtrado);
        JSONToCSVConvertor($scope.exportables,'Reporte',true);
    }

};

//mustra los documentos entregados pendientes de recibir
function listadoEntregasAreaCtrl($scope, $rootScope, $routeParams, find, loading, checkFolios,datos,$filter){


    loading.despedida();
    //Carga Configuracion Inicial
    $scope.inicio = function(){

        $scope.tituloLE = 'Listado de Entregas efectuadas'; //+ $routeParams.area;
        $scope.area = $routeParams.area;
        $scope.folio = '';
        $scope.mensaje = '';
        $scope.empresas();
        $scope.altaunidades();
        $scope.listadoEntregas = datos.data;

        $scope.filtrado = {
            EMP_nombrecorto : '',
            UNI_nombrecorto : ''
        };


    }

    //Carga la lista de archivos a Recibir de otras areas
    $scope.cargaEntregas = function(){

        find.listadoentrega($rootScope.userM).success( function (data){
            //console.log(data);
            if(data){
                $scope.listadoEntregas = data;
            }else{
                $scope.listadoEntregas = [];
            }

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

	//elimina la seleccion o al que le apretaron
	$scope.elimina = function(dato){

		$scope.mensaje = '';
		var datos = [dato.entity];
        $('#boton').button('loading');

		checkFolios.enviaRechazos(datos,$rootScope.area,$rootScope.id).then(
			function (data){
				$scope.gridOptions.$gridScope.toggleSelectAll(false);
				$scope.mensaje = data.respuesta;
				$scope.tipoalerta = 'alert-success';
				$scope.cargaEntregas();
                $('#boton').button('reset');
			},
			function (error){
				$scope.mensaje = error;
				$scope.tipoalerta = 'alert-warning';
                $('#boton').button('reset');
			}
		);

	}


	$scope.eliminaMultiple = function(){

        $('#boton').button('loading');
        $scope.mensaje = '';
        var datos = $scope.selectos;

		checkFolios.enviaRechazos(datos,$rootScope.area,$rootScope.id).then(

			function (data){
				$scope.gridOptions.$gridScope.toggleSelectAll(false);
				$scope.mensaje = data.respuesta;
				$scope.tipoalerta = 'alert-success';
				$scope.cargaEntregas();

				if (data.rechazos.length > 0) {
					$scope.rechazos = data.rechazos;
					$('#myModal4').modal();
				};

                $('#boton').button('reset');
            },
            function (error){
                $scope.mensaje = error;
                $scope.tipoalerta = 'alert-warning';
                $('#boton').button('reset');
            }
        );


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
    	data: 'listadoEntregas',
    	enableColumnResize:true,
    	enablePinning: true,
    	enableRowSelection:true,
    	multiSelect:true,
    	showFooter: true,
        showFilter:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
    	selectedItems: $scope.selectos,
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
    				{ field:'PorEntregarA', displayName:'PorEntregarA', width: 120 },
                    { field:'PAS_folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
		            { field:'FLD_etapa', displayName:'Etapa', width: 120 },
		            { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
		            { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
		            { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
		            { field:'FLD_formaRecep', displayName:'FaxOrigianl', width: 120 },
		            { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
		            { field:'Triage', width: 120 },
		            { field:'ROC', displayName:'ROC', width: 100, visible:false },
		            { field:'DOC_claveint', width: 100, visible:false },
		            { field:'FLD_claveint', width: 100, visible:false },
		            { field:'FLD_AROent', width: 100, visible:false },
		            { field:'ARO_porRecibir', width: 100, visible:false },
		            { displayName:'Accion' ,cellTemplate:'  <a href="" ng-click="elimina(row)">Quitar</a>'}
		]

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
            $scope.filtrado.UNI_nombrecorto = '';
    	}else{
    		var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
            $scope.filtrado.UNI_nombrecorto = $scope.unidad.nombre;

    	}
    	if($scope.cliente == undefined || $scope.cliente == 0){
    		var objeto2 = "";
            $scope.filtrado.EMP_nombrecorto = '';
    	}else{
    		var objeto2 = "Empresa:" + $scope.cliente.nombre + "; ";
            $scope.filtrado.EMP_nombrecorto = $scope.cliente.nombre;
    	}

    	if($scope.folio.length == 0){
    		var objeto3 = "";
    	}else{
    		var objeto3 = "Folio:" + $scope.folio + "; ";
    	}



    	var filtro = objeto1 + objeto2 + objeto3;

    	$scope.filterOptions.filterText = filtro;

    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = '';
    	$scope.unidad = 0;
    	$scope.cliente = 0;

        $scope.filtrado = {
            EMP_nombrecorto : '',
            UNI_nombrecorto : ''
        };

    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }

    $scope.exporta = function(){
        $scope.exportables = $filter('filter')($scope.listadoEntregas, $scope.filtrado);
        JSONToCSVConvertor($scope.exportables,'Reporte',true);
    }

};

//muestra los folios por recibir
function listadoRecepcionCtrl($scope, $rootScope, $routeParams, find, loading , $http, carga, checkFolios,datos,$location,$upload, api, leexml, FacturaNormal){

    $scope.listadoRecepcion = datos.data;
    loading.despedida();

    //Carga Configuracion Inicial
	$scope.inicio = function(){

		$scope.tituloLR = 'Listado Pendientes de Recibir';
		$scope.area = $routeParams.area;
		$scope.mensaje = '';
		$scope.folio = '';
		$scope.selectosAc = [];
		$scope.empresas();
		$scope.altaunidades();
		$scope.recibe = true;
		$scope.subeFactGlo = false;
		$scope.subeFactInd = false;
		$scope.tipoTramite();
		$scope.borratemporales();

		$scope.PagoG = {

        	unidad: '',
        	folio: '',
        	tipotramite: '',
        	concepto: '',
        	etapa: '',
        	foliofiscal: '',
	        subtotal: '',
	        descuento: '',
	        total: '',
	        fechaemision: '',
	        observacion: '',
	        rfcemisor: '',
	        serie:'',
	        foliointerno: '',
	        emisor: '',
	        impuesto: '',
	        tasa: '',
	        usuarioentrega: ''

        }

        $scope.PagoI = {

        	unidad: '',
        	folio: '',
        	tipotramite: '',
        	concepto: '',
        	etapa: '',
        	foliofiscal: '',
	        subtotal: '',
	        descuento: '',
	        total: '',
	        fechaemision: '',
	        observacion: '',
	        rfcemisor: '',
	        serie:'',
	        foliointerno: '',
	        emisor: '',
	        impuesto: '',
	        tasa: '',
	        usuarioentrega: ''

        }

        $scope.archivos = [];

	}

	$scope.borratemporales = function(){

      find.borratemporales($rootScope.user).success(function (data){

      });

    }


	//Carga la lista de archivos a Recibir de otras areas
	$scope.cargaRecepcion = function(){

		find.listadorecepcion($rootScope.id).success( function (data){

        	if(data.length>0){
        		$scope.listadoRecepcion = data;
            }else{
                $scope.listadoRecepcion = [];
        	}

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

	$scope.aceptaEntregas = function(){

		$scope.mensaje = '';
		$('#boton').button('loading');

		if ($scope.selectos.length > 0) {
			console.log($scope.selectos);

			checkFolios.aceptaEntrega($scope.selectos)
			.success(function (data){
                $scope.mensaje = data.respuesta;
                $scope.tipoalerta = 'alert-success';
                $scope.cargaRecepcion();
                $scope.gridOptions.$gridScope.toggleSelectAll(false);
				$('#boton').button('reset');
			})
			.error(function (data){
				$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
                $scope.tipoalerta = 'alert-error';
				$('#boton').button('reset');
			});

		};
	}

	$scope.rechazaEntregas = function(){

		$scope.mensaje = '';
		$('#boton2').button('loading');

		if ($scope.selectos.length > 0) {

            checkFolios.rechazaEntrega($scope.selectos,$rootScope.id)
            .then(
	            function (data){
	                $('#boton2').button('reset');
	                $scope.mensaje = data.respuesta;
	                $scope.tipoalerta = 'alert-success';
	                $scope.cargaRecepcion();
	                $scope.gridOptions.$gridScope.toggleSelectAll(false);
	            },
	            function (error){
	            	$('#boton2').button('reset');
	                $scope.mensaje = error;
	                $scope.tipoalerta = 'alert-error';
	            }
            );

        };

	}


	$scope.selectos = [];

	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
	};

	$scope.filtra = function(){

    	//$scope.filterOptions.filterText = "";
    	//var filtro = "";
    	// console.log($scope.unidad);

    	if($scope.unidad == undefined || $scope.unidad == 0){
    		var objeto1 = "";
    	}else{
    		var objeto1 = "claveunidad:" + $scope.unidad + "; ";
    	}
    	if($scope.cliente == undefined || $scope.cliente == 0){
    		var objeto2 = "";
    	}else{
    		var objeto2 = "Empresa:" + $scope.cliente + "; ";
    	}

    	if($scope.folio.length == 0){
    		var objeto3 = "";
    	}else{
    		var objeto3 = "Folio:" + $scope.folio + "; ";
    	}


    	var filtro = objeto1 + objeto2 + objeto3;


    	$scope.filterOptions.filterText = filtro;

    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = '';
    	$scope.unidad = 0;
    	$scope.cliente = 0;
    	$scope.folio = '';

    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }


    var csvOpts = { columnOverrides: { obj: function (o) {
	    return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
	    } },
	    iEUrl: 'downloads/download_as_csv'
	};

	//Cargamos el grid con los datos
	$scope.gridOptions = {
    	data: 'listadoRecepcion',
    	enableColumnResize:true,
    	enablePinning: true,
    	enableRowSelection:true,
    	multiSelect:true,
    	showFooter: true,
        showFilter:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
    	selectedItems: $scope.selectos,
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
    				{ field:'EntregadoPor', displayName:'EntregadoPor', width: 120, pinned:true},
                    { field:'PAS_folio', displayName:'Folio', width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
		            { field:'FLD_etapa', displayName:'Etapa', width: 120 },
		            { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
		            { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
		            { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
		            { field:'FLD_formaRecep', displayName:'FaxOrigianl', width: 120 },
		            { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
		            { field:'Triage', width: 120 },
		            { field:'FLD_fechaent', displayName:'FechaEntrega', width: 100, visible:true },
		            { field:'', displayName:'DocRevision', width: 100 },
		            { field:'DOC_claveint', width: 100, visible:false },
		            { field:'FLD_claveint', width: 100, visible:false },
		            { field:'FLD_AROrec', width: 100, visible:false },
		            { field:'USU_rec', width: 100, visible:false },
		            { field:'USU_recibe', width: 100, visible:false },
		            { field:'', displayName:'motivo', width: 20, visible:false },
		            { field:'ARO_porRecibir', width: 100, visible:false },
		            { field:'FLD_AROent', width: 100, visible:false },
		            { field:'USU_ent', width: 100, visible:false },
		            { field:'UNI_claveint', displayName:'claveunidad',width: 100, visible:false }
        ]
    };

    $scope.$on('ngGridEventRows', function (newFilterText){

    	var filas = newFilterText.targetScope.renderedRows;

    	$scope.exportables = [];

    	angular.forEach(filas , function(item){
    		$scope.exportables.push(item.entity);
    	});

    });

    $scope.subtipotramite = function(idx,tipotramite){

        find.conceptotramite(tipotramite).success( function (data){

            $scope.conceptost = data;

        });
    }

    $scope.tipoTramite = function(){
        find.tipotramite().success( function (data) {

            $scope.tipostramites = data;

        });
    }

   $scope.IngresaFacturaGlo = function(success){

    	console.log($scope.selectos);
    	$scope.relaciones = {
    		tipofactura: 2

    	}

    	if ($scope.unidad == '' || $scope.unidad == undefined) {

    		alert('Debes Realizar busqueda x Unidad');
    		location.reload();
    	};

    	$scope.recibe = false;
		$scope.subeFactGlo = true;

        $scope.relacionesFol= [];
        for (var i = 0; i < $scope.selectos.length; i++){

             $scope.relacionesFol.push($scope.selectos[i]);

        };
        // console.log($scope.relacionesFol[0].claveunidad);
        // find.unidadesref($scope.relacionesFol[0].claveunidad).success( function (data) {

            // var referencia = data.ref;

        if ($scope.relacionesFol.length > 0){

            console.log($scope.relacionesFol);

            $scope.iniciorelacion = false;
            $scope.finrelacion = true;
            $scope.tituloFinRelacion = "Relación de Folios";

            console.log($scope.relacionesFol);

            $scope.detalles = $scope.relacionesFol;
            $scope.referencia = $scope.relacionesFol[0].referencia;

    }else{

        swal("Oops...", "No seleccionaste Folios", "error")

    }
// });

    }
$scope.subeXML = function($files){

        var aux = $files[0].name.split('.');

        if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

         for (var i = 0; i < $files.length; i++){
         var file = $files[i];
         var amt = 0;
          $scope.upload = $upload.upload({
                url: api+'entregas/upload/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                method: 'POST',
                data: $scope.PagoM,
                file: file // or list of files ($files) for html5 only
        }).success(function (data){

            leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
            courses  = x2js.xml_str2json(data);

                FacturaNormal.consultaFolioFiscal(courses.Comprobante.Complemento.TimbreFiscalDigital._UUID).success(function (data){
                    if (data[0].count != 0){

                        swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                        $scope.borratemporales();
                        $scope.PagoG.importe = '';
                        $scope.PagoG.total = '';
                        $scope.PagoG.foliofiscal = '';
                        $scope.PagoG.fechaemision = '';
                        $scope.PagoG.descuento = '';
                        $scope.PagoG.emisor = '';
                        $scope.PagoG.descuento = '';
                        $scope.PagoG.serie = '';
                        $scope.PagoG.elimina = false;

                    }
                });
                // FacturaNormal.validaUnidad($scope.unidad).success(function (data){
                //         if (data.length > 0){

                //             $scope.PagoG.rfcemisor = data[0].rfc;
                //             $scope.PagoG.unidad = data[0].unidad;

                //         if ($scope.PagoG.rfcemisor == courses.Comprobante.Emisor._rfc){

			                $scope.PagoG.serie = courses.Comprobante._serie;
			                $scope.PagoG.foliointerno = courses.Comprobante._folio;
			                $scope.PagoG.subtotal = courses.Comprobante._subTotal;
			                $scope.PagoG.total = courses.Comprobante._total;
			                $scope.PagoG.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
			                $scope.PagoG.fechaemision = courses.Comprobante._fecha;
			                $scope.PagoG.descuento = courses.Comprobante._descuento;
			                $scope.PagoG.emisor = courses.Comprobante.Emisor._nombre;
			                $scope.PagoG.rfcemisor = courses.Comprobante.Emisor._rfc;
			                $scope.PagoG.impuesto = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
			                $scope.PagoG.tasa = courses.Comprobante.Impuestos.Traslados.Traslado._tasa;
			                $scope.PagoG.usuarioentrega = Number($rootScope.id);
			                // $scope.PagoG.areaentrega =Number(areaEntrega);
			                // $scope.PagoG.usuariorecibe =Number(usuarioRecibe);
			                // $scope.PagoG.arearecibe =Number(areaRecibe);
			                // $scope.PagoG.folio = data.Folios;
			                $scope.PagoG.tipoorden = 2;
                            $scope.btndelete = true;

                    //     }else{

                    //         swal('Upss','Tu Factura no coincide con el Emisor','error');

                    //         // var archivo = $scope.datos.leexml;
                    //         // $scope.elimina_ahora(archivo);

                    //     }
                    // }else{

                    //   swal("Upss", "El proveedor no se encuentra en el sistema, Solicitalo al area de Sistemas", "error");

                    // }

                // });

            });

                $scope.archivos = data.ruta;

                console.log(data.ruta);

        }).error( function (xhr,status,data){

                  alert('Ocurrio un error');

                });
            }

        }else{

               alert('La extensión debe ser xml');
        }

}

$scope.enviaOrdenPagoGlo = function(){



    $scope.OPago = {

        seleccionados : $scope.detalles,
        archivos : $scope.archivos,
        usucarpeta: $rootScope.user,
        factura: $scope.PagoG,
        subtotaltotal: $scope.subtotalPago,
        iva: $scope.ivaPago,
        total: $scope.totalPago,
        usuario: $rootScope.id,
        unidad: $scope.unidad

    }
console.log($scope.OPago );

    	var areaRecibe = 6;
        var areaEntrega = 6;
        var usuarioRecibe = $rootScope.id;

        var ruta = api+'entregas/ordenPago';

    	    $http.post(ruta,$scope.OPago).success(function (data){

    	    	$scope.borratemporales();
    	    	swal("ok","Se Genero una Orden de Pago","success");
    	    	location.reload();


            }).error( function (data){

                alert('Error, Intentalo de Nuevo');

            });




}

$scope.eliminaxmlGlo = function(){

    $http.post(api+'entregas/eliminaxml/'+$rootScope.user).success(function (data){

      $scope.PagoG.foliointerno = '';
      $scope.PagoG.serie = '';
      $scope.PagoG.foliofiscal = '';
      $scope.PagoG.emisor = '';
      $scope.PagoG.rfcemisor = '';
      $scope.PagoG.subtotal = '';
      $scope.PagoG.tasa = '';
      $scope.PagoG.total = '';
      $scope.PagoG.fechaemision = '';

    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

    });

}




//////////// factura individual //////////////////

$scope.IngresaFacturaInd = function(){

	console.log($scope.selectos);

    	$scope.relaciones = {
    		tipofactura: 1

    }

    if ($scope.unidad == '' || $scope.unidad == undefined) {

		alert('Debes Realizar busqueda x Unidad');
		location.reload();
	};

    	$scope.recibe = false;
		$scope.subeFactInd = true;
		$scope.subefactura = true;

		$scope.detalles = $scope.selectos;

		        $scope.relacionesFol= [];
        for (var i = 0; i < $scope.selectos.length; i++){

             $scope.relacionesFol.push($scope.selectos[i]);

        };
        // console.log($scope.relacionesFol[0].claveunidad);
        // find.unidadesref($scope.relacionesFol[0].claveunidad).success( function (data) {

            // var referencia = data.ref;

        if ($scope.relacionesFol.length > 0){

            console.log($scope.relacionesFol);

            $scope.iniciorelacion = false;
            $scope.finrelacion = true;
            $scope.tituloFinRelacion = "Relación de Folios";

            console.log($scope.relacionesFol);

            $scope.detalles = $scope.relacionesFol;
            $scope.referencia = $scope.relacionesFol[0].referencia;

            var suma = 0;
            var suma1 = 0;
            var suma2 = 0;
            var suma3 = 0;
            var suma4 = 0;
            for (var i = 0; i < $scope.detalles.length; i++){

                if ($scope.detalles[i].total != ''){
                    console.log($scope.detalles[i].total);
                    var valor2 = $scope.detalles[i].total;
                    var numero2 = valor2.replace(",",'');
                    suma2 += parseFloat(numero2);
                    var sumas2 = suma2.toFixed(2);
                    $scope.totalimporte= sumas2;
                }

                if ($scope.detalles[i].subtotal!= ''){
                    var valor3 = $scope.detalles[i].subtotal;
                    var numero3 = valor3.replace(",",'');
                    suma3 += parseFloat(numero3);
                    var sumas3 = suma3.toFixed(2);
                    $scope.totalsubtotal= sumas3;
                }

                if ($scope.detalles[i].tasa!= ''){
                    var valor4 = $scope.detalles[i].tasa;
                    var numero4 = valor4.replace(",",'');
                    suma4 += parseFloat(numero4);
                    var sumas4 = suma4.toFixed(2);
                    $scope.totaltasa= sumas4;
                }

            }


            // console.log($scope.detalles[1].tasa);

        //   swal({
        //       title: "",
        //       text:  data[0].ref + "_" + "" + "Ingresa N° Relación",
        //       type: "input",
        //       imageUrl: "images/relacion.png",
        //       closeOnConfirm: false,
        //       animation: "slide-from-top",
        //       inputPlaceholder: "N° Relación" },

        //       function(inputValue){
        //         if (inputValue === false) return false;
        //         if (inputValue === ""){

        //         inputValue = 0;
        //           // swal.showInputError("Ocurrio un Error!!");
        //           // return false
        //         }
        //         $scope.numrelacion = data[0].ref + "_" +inputValue;
        //         swal("OK!", "El N° Relación Factura es: " + data[0].ref + "_" + inputValue, "success");
        //         $('#ventanarelacion').modal('show');


        // });
    }else{

        swal("Oops...", "No seleccionaste Folios", "error")

    }



}

$scope.subeXMLInd = function(idx,$files){

    var aux = $files[0].name.split('.');

    if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

                for (var i = 0; i < $files.length; i++){
                 var file = $files[i];
                  var amt = 0;
                  $scope.upload = $upload.upload({
                        url: api+'entregas/upload/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        data: $scope.datos,
                        file: file // or list of files ($files) for html5 only
                  }).success(function (data){

                    for (var ii = 0; ii < data.archivo.length; ii++){

                        console.log(data.archivo[ii]);

                        leexml.getxmltemporal($rootScope.user,data.archivo[ii]).success(function(data){
                        courses  = x2js.xml_str2json(data);

                           FacturaNormal.consultaFolioFiscal(courses.Comprobante.Complemento.TimbreFiscalDigital._UUID).success(function (data){
                                  if (data[0].count != 0){

                                    swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                                    $scope.borratemporales();
			                        $scope.detalles[idx].importe = '';
			                        $scope.detalles[idx].total = '';
			                        $scope.detalles[idx].foliofiscal = '';
			                        $scope.detalles[idx].fechaemision = '';
			                        $scope.detalles[idx].descuento = '';
			                        $scope.detalles[idx].emisor = '';
			                        $scope.detalles[idx].descuento = '';
			                        $scope.detalles[idx].serie = '';
                                    $scope.detalles[idx].elimina = false;
                                    $scope.btndelete = false;

                                  }
                            });
                                // if ($scope.datos.rfc == courses.Comprobante.Emisor._rfc){

                                    var suma1 = 0;

					                $scope.detalles[idx].serie = courses.Comprobante._serie;
					                $scope.detalles[idx].foliointerno = courses.Comprobante._folio;
					                $scope.detalles[idx].subtotal = courses.Comprobante._subTotal;
					                $scope.detalles[idx].total = courses.Comprobante._total;
					                $scope.detalles[idx].foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
					                $scope.detalles[idx].fechaemision = courses.Comprobante._fecha;
					                $scope.detalles[idx].descuento = courses.Comprobante._descuento;
					                $scope.detalles[idx].emisor = courses.Comprobante.Emisor._nombre;
					                $scope.detalles[idx].rfcemisor = courses.Comprobante.Emisor._rfc;
					                $scope.detalles[idx].impuesto = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
					                $scope.detalles[idx].tasa = courses.Comprobante.Impuestos.Traslados.Traslado._tasa;
					                $scope.detalles[idx].usuarioentrega = Number($rootScope.id);
					                $scope.detalles[idx].tipoorden = 2;
                                    $scope.detalles[idx].elimina = true;
                                    $scope.btndelete = true;

                                    for (var i = 0; i < $scope.detalles.length; i++){

                                    var valor1 = $scope.detalles[i].total;
                                    var numero1 = valor1.replace(",",'');
                                    suma1 += parseFloat(numero1);
                                    var sumas1 = suma1.toFixed(2);
                                    $scope.totalimporte= sumas1;

                                    console.log($scope.totalimporte);

                                    }
                                // }else{

                                //     swal('Upss','Tu Factura no coincide con el Emisor','error');

                                //     // var archivo = $scope.datos.leexml;
                                //     // $scope.elimina_ahora(archivo);
                                //     $scope.detalles[idx].importe =  '';
                                //     $scope.detalles[idx].total = '';
                                //     $scope.detalles[idx].foliofiscal = '';
                                //     $scope.detalles[idx].fechaemision = '';
                                //     $scope.detalles[idx].descuento = '';
                                //     $scope.detalles[idx].emisor = '';
                                //     $scope.detalles[idx].elimina = false;
                                //     $scope.btndelete = false;

                                // }

                      });
                   }
                        $scope.archivos = data.archivo;

                    }).error( function (xhr,status,data){

                          alert('Ocurrio un error');

                    });
                }

                }else{

                       alert('La extensión debe ser xml');
                  // return false;

                }

}

$scope.enviaOrdenPagoInd = function(){

    $scope.OPago = {

        seleccionados : $scope.detalles,
        archivos : $scope.archivos,
        usucarpeta: $rootScope.user,
        factura: $scope.detalles,
        subtotaltotal: $scope.totalsubtotal,
        iva: $scope.totaltasa,
        total: $scope.totalimporte,
        usuario: $rootScope.id,
        unidad: $scope.unidad

    }
console.log($scope.OPago );

    	var areaRecibe = 6;
        var areaEntrega = 6;
        var usuarioRecibe = $rootScope.id;

        var ruta = api+'entregas/ordenPagoIndividual';

	    $http.post(ruta,$scope.OPago).success(function (data){

	    	$scope.borratemporales();
	    	swal("ok","Se Genero una Orden de Pago","success");
	    	location.reload();


        }).error( function (data){

            alert('Error, Intentalo de Nuevo');

        });
}

$scope.eliminaxmlInd = function(idx){

    var archivo = $scope.archivos[idx];
    console.log(archivo);
    console.log(idx);

    $http.post(api+'entregas/eliminaxmlInd/' + archivo, {usuario:$rootScope.user}).success(function (data){

        $scope.detalles[idx].importe = '';
        $scope.detalles[idx].total = '';
        $scope.detalles[idx].foliofiscal = '';
        $scope.detalles[idx].fechaemision = '';
        $scope.detalles[idx].descuento = '';
        $scope.detalles[idx].emisor = '';
        $scope.detalles[idx].descuento = '';
        $scope.detalles[idx].serie = '';

    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

    });
}

};

//muestra los folios por recibir
function listadoRecepcionAreaCtrl($scope, $rootScope, $routeParams, find, loading , $http, carga, checkFolios,datos){

    $scope.listadoRecepcion = datos.data;
    loading.despedida();

    //Carga Configuracion Inicial
	$scope.inicio = function(){

		$scope.tituloLR = 'Listado Pendientes de Recibir';
		$scope.area = $routeParams.area;
		$scope.mensaje = '';
		$scope.folio = '';
		$scope.selectosAc = [];
		$scope.empresas();
		$scope.altaunidades();

	}

	//Carga la lista de archivos a Recibir de otras areas
	$scope.cargaRecepcion = function(){

		find.listadorecepcion($rootScope.userM).success( function (data){

        	if(data.length>0){
        		$scope.listadoRecepcion = data;
            }else{
                $scope.listadoRecepcion = [];
        	}

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

	$scope.aceptaEntregas = function(){

		$scope.mensaje = '';
		$('#boton').button('loading');

		if ($scope.selectos.length > 0) {

			checkFolios.aceptaEntrega($scope.selectos)
			.success(function (data){
                $scope.mensaje = data.respuesta;
                $scope.tipoalerta = 'alert-success';
                $scope.cargaRecepcion();
                $scope.gridOptions.$gridScope.toggleSelectAll(false);
				$('#boton').button('reset');
			});

		};

	}


	$scope.rechazaEntregas = function(){

		$scope.mensaje = '';
		$('#boton2').button('loading');

		if ($scope.selectos.length > 0) {

            checkFolios.rechazaEntrega($scope.selectos,$rootScope.id)
            .then(function (data){
                $('#boton2').button('reset');
                $scope.mensaje = data.respuesta;
                $scope.tipoalerta = 'alert-success';
                $scope.cargaRecepcion();
                $scope.gridOptions.$gridScope.toggleSelectAll(false);
            });

        };

	}


	$scope.selectos = [];

	$scope.filterOptions = {
	    filterText: '',
	    useExternalFilter: false
	};

	$scope.filtra = function(){

    	//$scope.filterOptions.filterText = "";
    	//var filtro = "";
    	// console.log($scope.unidad);

    	if($scope.unidad == undefined || $scope.unidad == 0){
    		var objeto1 = "";
    	}else{
    		var objeto1 = "Unidad:" + $scope.unidad + "; ";
    	}
    	if($scope.cliente == undefined || $scope.cliente == 0){
    		var objeto2 = "";
    	}else{
    		var objeto2 = "Empresa:" + $scope.cliente + "; ";
    	}

    	if($scope.folio.length == 0){
    		var objeto3 = "";
    	}else{
    		var objeto3 = "Folio:" + $scope.folio + "; ";
    	}


    	var filtro = objeto1 + objeto2 + objeto3;


    	$scope.filterOptions.filterText = filtro;

    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = '';
    	$scope.unidad = 0;
    	$scope.cliente = 0;
    	$scope.folio = '';

    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }


    var csvOpts = { columnOverrides: { obj: function (o) {
	    return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
	    } },
	    iEUrl: 'downloads/download_as_csv'
	};

	//Cargamos el grid con los datos
	$scope.gridOptions = {
    	data: 'listadoRecepcion',
    	enableColumnResize:true,
    	enablePinning: true,
    	enableRowSelection:true,
    	multiSelect:true,
    	showFooter: true,
        showFilter:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
    	selectedItems: $scope.selectos,
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
    				{ field:'EntregadoPor', displayName:'EntregadoPor', width: 120, pinned:true},
                    { field:'PAS_folio', displayName:'Folio', width: 120 },
		            { field:'FLD_etapa', displayName:'Etapa', width: 120 },
		            { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
		            { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
		            { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
		            { field:'FLD_formaRecep', displayName:'FaxOrigianl', width: 120 },
		            { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
		            { field:'Triage', width: 120 },
		            { field:'', displayName:'DocRevision', width: 100 },
		            { field:'DOC_claveint', width: 100, visible:false },
		            { field:'FLD_claveint', width: 100, visible:false },
		            { field:'FLD_AROrec', width: 100, visible:false },
		            { field:'USU_rec', width: 100, visible:false },
		            { field:'USU_recibe', width: 100, visible:false },
		            { field:'', displayName:'motivo', width: 20, visible:false },
		            { field:'ARO_porRecibir', width: 100, visible:false },
		            { field:'FLD_AROent', width: 100, visible:false },
		            { field:'USU_ent', width: 100, visible:false }
        ]
    };

    $scope.$on('ngGridEventRows', function (newFilterText){

    	var filas = newFilterText.targetScope.renderedRows;

    	$scope.exportables = [];

    	angular.forEach(filas , function(item){
    		$scope.exportables.push(item.entity);
    	});

    });


};

function listadoRecepcionPagoCtrl($scope, $rootScope, $routeParams, find, loading , $http, carga, checkFolios){

    // $scope.listadoRecepcion = datos.data;
    loading.despedida();

    //Carga Configuracion Inicial
	$scope.inicio = function(){

		// $scope.altaunidades();

		$scope.datos = {

			fechaini: '',
			fechafin: '',
			unidad: ''

		}

	}

	//Carga la lista de archivos a Recibir de otras areas
	$scope.cargaPagosxUnidad = function(){
		
		loading.cargando('Buscando Folio'); 

		find.listadoxUnidadPagos($scope.datos).success( function (data){


        	if(data.length>0){
        		loading.despedida();
        		$scope.listadoxUnidad = data;
            }else{
                $scope.listadoxUnidad = [];
        	}

		});
	}


	//Enlista las unidades
	$scope.altaunidades = function(){

		find.unidades().success( function (data) {

			$scope.unidades = data;

		});
	}



    var csvOpts = { columnOverrides: { obj: function (o) {
	    return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
	    } },
	    iEUrl: 'downloads/download_as_csv'
	};

	//Cargamos el grid con los datos
    $scope.gridOptions = { 
        data: 'listadoxUnidad', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:true,
        multiSelect:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectedRows, 
        filterOptions: $scope.filterOptions,
        enableCellEdit: true,
        columnDefs: [
                    { field:'USUNombre', width: 120, pinned: true},
                    { field:'Producto', width: 120 },
                    { field:'Triage', width: 120 },
                    { field:'Cliente', width: 100 },
                    { field:'Unidad', width: 220 },
                    // { field:'Folio', width: 120, pinned: false},
                    { field:'Folio', displayName:'Folio' , width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'Lesionado', width: 330 },
                    { field:'Etapa', width: 120 },
                    { field:'Entrega', width: 80 },
                    { field:'FAtencion', width: 120},
                    { field:'FormaRecep', width: 90 },
                    { field:'fechaRecepcion', width: 120},
                    { field:'FechaRecepPag', width: 120,  cellFilter: 'date:\'dd/MM/yyyy\'' },
                    { field:'Tipo', width: 120 },
                    { field:'Lesion', width: 120 },
                    { field:'Relacion', width: 120 },
                    { field:'FRelacion', displayName:'F.relacion', width: 120 },
                    { field:'FRelPago', displayName:'F.Pago.Rel.', width: 120 },
                    { field:'FRelPagoReg', displayName:'F.Pago.Rel.Reg.', width: 120 },
                    { field:'PasC', width: 120 },
                    { field:'FPasCobrado', width: 120 },
                    { field:'Pago', width: 120 },
                    { field:'Reserva', width: 120 },
                    { field:'FacturaRelacion', width: 80 },
                    { field:'FacDoc', width: 80 },
                    { field:'RelP', width: 80 },
                    { field:'Pagado', width: 80 },
                    { field:'Cobrado', width: 80 }
        ],
        showFooter: true,
        showFilter:false,

    };

    $scope.$on('ngGridEventRows', function (newFilterText){

    	var filas = newFilterText.targetScope.renderedRows;

    	$scope.exportables = [];

    	angular.forEach(filas , function(item){
    		$scope.exportables.push(item.entity);
    	});

    });

    $scope.exportar = function(){

        $scope.selectos = $scope.listadoxUnidad;
        JSONToCSVConvertor($scope.selectos,'Reporte',true);        
    }



};

function listadosinRelacionCtrl($scope, $rootScope, $routeParams, find, loading , $http, carga, checkFolios){

    // $scope.listadoRecepcion = datos.data;
    loading.despedida();

    //Carga Configuracion Inicial
	$scope.inicio = function(){

		// $scope.altaunidades();

		$scope.datos = {

			fechaini: '',
			fechafin: '',
			unidad: ''

		}

	}

	//Carga la lista de archivos a Recibir de otras areas
	$scope.cargaPagosxUnidad = function(){
		
		loading.cargando('Buscando Folio'); 

		find.listadosinRelacion($scope.datos).success( function (data){


        	if(data.length>0){
        		loading.despedida();
        		$scope.listado= data;
            }else{
                loading.despedida();
                $scope.listado = [];
        	}

		});
	}

	//Enlista las unidades
	$scope.altaunidades = function(){

		find.unidades().success( function (data) {

			$scope.unidades = data;

		});
	}



    var csvOpts = { columnOverrides: { obj: function (o) {
	    return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
	    } },
	    iEUrl: 'downloads/download_as_csv'
	};

	//Cargamos el grid con los datos
    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:true,
        multiSelect:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectedRows, 
        filterOptions: $scope.filterOptions,
        enableCellEdit: true,
        columnDefs: [
                    { field:'USUNombre', width: 120, pinned: true},
                    { field:'Producto', width: 120 },
                    { field:'Triage', width: 120 },
                    { field:'Cliente', width: 100 },
                    { field:'Unidad', width: 220 },
                    // { field:'Folio', width: 120, pinned: false},
                    { field:'Folio', displayName:'Folio' , width: 120 , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'Lesionado', width: 330 },
                    { field:'Etapa', width: 120 },
                    { field:'Entrega', width: 80 },
                    { field:'FAtencion', width: 120},
                    { field:'FormaRecep', width: 90 },
                    { field:'fechaRecepcion', width: 120},
                    { field:'FechaRecepPag', width: 120,  cellFilter: 'date:\'dd/MM/yyyy\'' },
                    { field:'Tipo', width: 120 },
                    { field:'Lesion', width: 120 },
                    { field:'Relacion', width: 120 },
                    { field:'FRelacion', displayName:'F.relacion', width: 120 },
                    { field:'FRelPago', displayName:'F.Pago.Rel.', width: 120 },
                    { field:'FRelPagoReg', displayName:'F.Pago.Rel.Reg.', width: 120 },
                    { field:'PasC', width: 120 },
                    { field:'FPasCobrado', width: 120 },
                    { field:'Pago', width: 120 },
                    { field:'Reserva', width: 120 },
                    { field:'FacturaRelacion', width: 80 },
                    { field:'FacDoc', width: 80 },
                    { field:'RelP', width: 80 },
                    { field:'Pagado', width: 80 },
                    { field:'Cobrado', width: 80 }
        ],
        showFooter: true,
        showFilter:false,

    };

    $scope.$on('ngGridEventRows', function (newFilterText){

    	var filas = newFilterText.targetScope.renderedRows;

    	$scope.exportables = [];

    	angular.forEach(filas , function(item){
    		$scope.exportables.push(item.entity);
    	});

    });

    $scope.exportar = function(){

        $scope.selectos = $scope.listado;
        JSONToCSVConvertor($scope.selectos,'Reporte',true);        
    }



};


rechazosCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'find', 'loading', 'checkFolios','datos'];
rechazosAreaCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'find', 'loading', 'checkFolios','datos'];
traspasosCtrl.$inject = ['$scope', '$rootScope', '$routeParams','$http', 'find', 'loading'];
entregasCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading', '$http'];
listadoEntregasCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading', 'checkFolios','datos','$filter'];
listadoEntregasAreaCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading', 'checkFolios','datos','$filter'];
listadoRecepcionCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading' , '$http', 'carga', 'checkFolios','datos','$location','$upload','api','leexml','FacturaNormal'];
listadoRecepcionAreaCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading' , '$http', 'carga', 'checkFolios','datos'];
listadoRecepcionPagoCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading' , '$http', 'carga', 'checkFolios'];
listadosinRelacionCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading' , '$http', 'carga', 'checkFolios'];


app.controller('rechazosCtrl',rechazosCtrl);
app.controller('rechazosAreaCtrl',rechazosAreaCtrl);
app.controller('traspasosCtrl', traspasosCtrl);
app.controller('entregasCtrl', entregasCtrl);
app.controller('listadoEntregasCtrl', listadoEntregasCtrl);
app.controller('listadoEntregasAreaCtrl', listadoEntregasAreaCtrl);
app.controller('listadoRecepcionCtrl', listadoRecepcionCtrl);
app.controller('listadoRecepcionAreaCtrl', listadoRecepcionAreaCtrl);
app.controller('listadoRecepcionPagoCtrl', listadoRecepcionPagoCtrl);
app.controller('listadosinRelacionCtrl', listadosinRelacionCtrl);
