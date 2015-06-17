function recepcionCtrl( $scope, $rootScope, $filter, $location, $http, find, loading, checkFolios, carga, api){
	
	//Con parametros de inicio
	$scope.inicio = function(){

		$rootScope.area = 1;
		$scope.tituloR = "Recepcion de Documentos";
		$scope.tipodocumentos = [{id:1,nombre:'Primera atención'},{id:2,nombre:'Subsecuencia'},{id:3,nombre:'Rehabilitación'}];	
		$scope.limpia();
		$scope.cargaInfo();
	}
	
	$scope.limpia = function(){
		$scope.FaxOriginal = true;
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.datos = {
			fechaini:FechaAct,
			fechafin:FechaAct,
			folio:'',
			lesionado:'',
			cliente:'',
			unidad:''
		};
		$scope.fechaini = '';
		$scope.fechafin = '';
		$scope.folio = '';
		$scope.lesionado = '';
		$scope.mensaje = '';
		$scope.cargar = false;
	}

	$scope.cargaInfo = function(){

		loading.cargando('Buscando Folios');

		carga.informacion().then(function(data){

			// console.log(data);
			$scope.clientes = data.clientes;
			$scope.unidades = data.unidades;
			$scope.productosini = data.productos;
			$scope.productos = data.productos;
			$scope.areas = data.areaOperativa;
			$scope.escolaridades = data.escolaridad;

			$scope.cargaFlujo();

		});
	}

	//carga todos los folios del area activos y rechazados por usuario
	$scope.cargaFlujo = function(){

		carga.flujo($rootScope.id).then(function (data){

			$scope.mensaje = '';
			// console.log(data);
			if(data.activos){
        		$scope.listado = data.activos;
        	}else{
        		$scope.listado = [];
        	}

        	if(data.rechazos){
        		$scope.rechazados = data.rechazos.length;
        	}else{
        		$scope.rechazados = 0;
        	}

			loading.despedida();
		})
	}

	// parte donde se captura el original

	//muestra Ventan de alta de Original
	$scope.muestraOriginal = function(){

		$('#myModal2').modal();

		$scope.original = {
			folio:'',
			documento:0,
			tipoDoc:'',
			remesa:'',
			fecha:FechaAct,
			cliente:'',
			lesionado:'',
			unidad:'',
			producto:'',
			escolaridad:'',
			usuario: $rootScope.id,
			fechafax: '',
			fechafe: '' ,
			internet:1 ,
			original:0,
			numentrega:1,
			incompleto:'',
			factura:'',
			totalfactura:0
		};

		$scope.mensaje = '';
		$scope.remesa = '';
		$scope.label1 = '';
		$scope.label2 = '';
		$scope.label3 = '';
		$scope.unidadref = '';//referencia para la unidad
		$scope.esfax = 0;
		$scope.esfe = 0;
		$scope.esoriginal = 0;
		$scope.revisado = 0;
		$scope.bloqueo = false;
		$scope.bloqueoUni = false;
		$scope.cargar = false;


		//detectamos cuando la ventana se cierra para buscar mas folios
		$('#myModal2').on('hidden.bs.modal', function (e) {
		 	$scope.cargaFlujo();
		});

		$('#folioO').focus();
	}

	//Verificamos si el fiolio esta dado de alta o se tiene que buscar en 
	$scope.validaOriginal = function(folio){

		$scope.limpiaVariables();
		$scope.cargar = true;
		$scope.mensaje = '';
		//verificamos si tiene primera atencion
		checkFolios.validaFolio(folio, 1)
		.then( function (data){
			
			$scope.original.tipoDoc = data.tipoDoc;
			$scope.original.documento = data.documento;
			$scope.original.fechafax = data.fechafax;
			$scope.original.fechafe = data.fechafe;
			$scope.original.cliente = data.cliente;
			$scope.original.lesionado = data.lesionado;
			$scope.original.unidad = data.unidad;
			$scope.original.documento = data.documento;

			$scope.productoOriginal($scope.original.cliente);
			$scope.referencia($scope.original.unidad);

			$scope.original.escolaridad = data.escolaridad;
			$scope.original.producto = data.producto;

			$scope.label2 = data.label2;
			$scope.label3 = data.label3;
			$scope.esfax = data.esfax;
			$scope.esfe = data.esfe;
			$scope.escolaridad = data.esoriginal;
			$scope.bloqueo = data.bloqueo;
			$scope.bloqueoUni = data.bloqueoUni;
			$scope.esoriginal = data.esoriginal;
			$scope.unidadref = data.unidadref;
			$scope.cargar = false;

		})
		.catch(function (err){
			alert(err);
			$scope.cargar = false;
		});
	}

	//busca el producto segun la empresa
	$scope.productoOriginal = function(empresa){

		find.producto(empresa).success( function (data) {

			$scope.productos = data;

		 });
	}

	//busqueda de referencias por unidad
	$scope.referencia = function(unidad){

		find.referenciaxunidad(unidad).success(function (data){
			$scope.label1 = data[0].referencia;
		});
	}

	///limpia variables del modal del original
	$scope.limpiaVariables = function(){

		//$scope.original.folio = '';
		$scope.original.documento = '';
		$scope.original.internet =  1;
		$scope.original.tipoDoc ='';
		$scope.original.remesa ='';
		$scope.remesa = '';
		$scope.original.fecha =FechaAct;
		$scope.original.cliente ='';
		$scope.original.lesionado ='';
		$scope.original.unidad ='';
		$scope.original.producto ='';
		$scope.original.escolaridad ='';
		$scope.original.fechafax = '';
		$scope.original.fechafe = '';
		$scope.original.factura = '';
		$scope.original.totalfactura = '';
		$scope.esoriginal = 0;
		$scope.unidadref = '';
		$scope.esfax = 0;
		$scope.esfe = 0;
		$scope.bloqueo = false;
		$scope.bloqueoUni = false;
	}

	/////////Inicia proceso de guardado 

	///Proceso de guardado ya sea de fax u original
	$scope.guardaDatos = function(){

		if ($scope.formOriginal.$valid) {

			$('#boton2').button('loading');
			$scope.mensaje = '';
			//Verificamos la informacion antes de guardar
			checkFolios.verificaInfo($scope.original.cliente, $scope.original.producto, $scope.original.escolaridad, $scope.original.fecha, $scope.original.folio)
			.then(function (data) {

				checkFolios.preparaGuardado($scope.original, $scope.esoriginal, $scope.esfax, $scope.esfe)
				.then(function (data){
					console.log(data);
					//actualiza folio (solo original)
					if (data.agregaOriginal) {
						var alta = $http.post(api+'altaoriginal',data.info);
						//agrega folio (solo original)
					}else if (data.actualizaOriginal) {
						var alta = $http.post(api+'actualizaoriginal',data.info);
					};

					alta.success(function (data){

						$('#boton2').button('reset');
						$scope.mensaje = data.respuesta;
					    $scope.tipoalerta = 'alert-success';
					    $scope.limpiaVariables();
					    $scope.original.folio = '';
					    $('#folioO').focus();
					})
					.error(function (data){
						$('#boton2').button('reset');
						alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');
					});

				},
				function (error){
					$scope.mensaje = error.mensaje;
					$scope.tipoalerta = error.tipoalerta;
					$('#boton2').button('reset');
				});

			}, function (error) {
				$scope.mensaje = error.mensaje;
				$scope.tipoalerta = error.tipoalerta;
				$('#boton2').button('reset');
			});

		};
	}

	//Guarda los datos de Original

	/////////Termina proceso de guardado 

	/////////////////Seccion de validaciones

	//Verifica que la fecha no sea mayor a la fecha que se esta capturando
	$scope.validafecha = function(){

		if($scope.original.fecha > FechaAct){
			$scope.original.fecha = FechaAct;
		}
	}

	//verificamos que tipo de atencion es y si ya tien fax capturado al momento de cambiar el tipo de documento 
	$scope.verificaatencion = function(){

		if(($scope.original.tipoDoc == 2 || $scope.original.tipoDoc == 3) && $scope.bloqueoUni == true){

			$scope.original.unidad = $scope.unidadref;//asignamos el valor de referencia por si queremos regresar al estado anterior
			$scope.bloqueoUni = false;
			

		}else if($scope.bloqueo == true && $scope.original.tipoDoc == 1){

			$scope.unidadref = $scope.original.unidad;
			$scope.bloqueoUni = true;
			$scope.referencia($scope.unidadref);

		}
	}

	//enlista los usuarios de cada area 
	$scope.altausuariosarea = function(area){

		if ($rootScope.area == area) {

			alert('No puedes emitir entregas a tu misma area');
			$scope.areaOp = '';
			
		}else if(area == 5){

			alert('No puedes emitir entregas a facturacion tu usuario no tiene permisos');
			$scope.areaOp = '';

		}else{
			
			$scope.area = area;
			find.usuariosarea(area).success( function (data){

				$scope.usuarios = data;

			 });
		}
	}

	//aqui termina 

	

	//guardamos pero antes verificamos que tengamos documentos seleccionados
	$scope.entrega = function(){

		$scope.mensaje = '';
		$('#boton').button('loading');

		if ($scope.selectos.length > 0) {
			
			var promesa = checkFolios.enviaFolios($scope.selectos,$scope.areaOp,$scope.user,$rootScope.id,$rootScope.area);

			promesa.then(
				
				function (data){

					$scope.mensaje = data.respuesta;
					$scope.tipoalerta = 'alert-success';
					$scope.cargaFlujo();
					$('#boton').button('reset');
					if (data.rechazos.length > 0) {
						$rootScope.rechazos = data.rechazos;
						console.log($scope.rechazos);
						$('#myModal3').modal();
					};

					$scope.gridOptions.$gridScope.toggleSelectAll(false);

				},function (error){

					$('#boton').button('reset');
					$scope.mensaje = error;
					$scope.tipoalerta = 'alert-warning';

				}
			);	

		}else{
			alert('No se ha seleccionado ningun documento');
		}
	}

	//////LLena el grid y toma filtros

	//donde se guardan los folios seleccionados
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

	//var csvOpts = { columnOverrides: { obj: function(o) { return o.a + '|' +  o.b; } } }

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
                    { field:'PAS_folio', displayName:'Folio', width: 120, pinned:true, enableCellEdit: true },
		            { field:'FLD_etapa', displayName:'Etapa', width: 120 },
		            { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
		            { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
		            { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
		            { field:'FLD_formaRecep', displayName:'FaxOrigianl', width: 120 },
		            { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
		            { field:'FLD_claveint', displayName:'FLD_claveint', width: 100, visible:false },
		            { field:'DOC_claveint', displayName:'documento', width: 100, visible:false },
		            { field:'CapEt2', displayName:'CapEt2', width: 100, visible:false },
		            { field:'EnvFac', displayName:'EnvFac', width: 100, visible:true },
		            { field:'FLD_AROent', displayName:'FLD_AROent', width: 100, visible:false },
		            { field:'ARO_activa', displayName:'area', width: 100, visible:false },
		            { field:'USU_ent', displayName:'USU_ent', width: 100, visible:false },
		            { field:'FLD_observaciones', displayName:'Observaciones', width: 320, enableCellEdit: true}
		            
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

    	// console.log(filtro);
    }

    $scope.quitaselectos = function(){

    	$scope.gridOptions.$gridScope.toggleSelectAll(false);
    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = ''; 
    	$scope.unidad = 0; 
    	$scope.cliente = 0;
    	$scope.folio = '';
    	$scope.fechaini = '';
    	$scope.fechafin = '';
    	$scope.lesionado = '';
    }

}

app.controller('recepcionCtrl', ['$scope', '$rootScope', '$filter', '$location', '$http', 'find', 'loading', 'checkFolios','carga','api', recepcionCtrl]);