//Area de facturacion
function facturacionCtrl($scope, $rootScope, find , loading, $http, checkFolios, carga, api,datos){

	loading.despedida();
	// $scope.listado = datos.activos;
	// $scope.rechazados = datos.rechazos.length;
	// $scope.recibidos = datos.recepcion.length;

	$scope.rechazados = datos.rechazos;
	$scope.recibidos = datos.recepcion;
	datos.activos.success(function (data){
		$scope.listado = data;
	});

	$scope.inicio = function(){

		$rootScope.area = 5;
		$scope.tituloR = "Facturación";
		$scope.push = false;

		$scope.mensaje = '';
		$scope.fechaini = '';
		$scope.fechafin = '';
		$scope.folio = '';
		$scope.lesionado = '';
		$scope.cargar = false;

		$scope.cargaInfo();

	}

	$scope.cargaInfo = function(){

		carga.informacion().then(function(data){

			// console.log(data);
			$scope.clientes = data.clientes;
			$scope.unidades = data.unidades;
			$scope.productosini = data.productos;
			$scope.productos = data.productos;
			$scope.areas = data.areaOperativa;
			$scope.escolaridades = data.escolaridad;

		});
	}

	//carga todos los folios del area activos, rechazados y por recibir por usuario
	$scope.cargaFlujo = function(){

		carga.activos($rootScope.id).then(function (data){
            
            if (data) {
                $scope.listado = data;         
            }else{
                $scope.listado = [];
            }
           
            $scope.mensaje = '';

        })
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

		
		$('#boton').button('loading');

		if ($scope.selectos.length > 0) {
			
			var promesa = checkFolios.enviaFolios($scope.selectos,$scope.areaOp,$scope.user,$rootScope.id,$rootScope.area);
			promesa.then(
				function (data){

					// console.log(data);
					$scope.mensaje = data.respuesta;
					$scope.tipoalerta = 'alert-success';
					$scope.cargaFlujo();
					$('#boton').button('reset');
					if (data.rechazos.length > 0) {
						$rootScope.rechazos = data.rechazos;
						// console.log($scope.rechazos);
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

	$scope.mandanpc = function(){

		$scope.mensaje = '';

		$('#boton2').button('loading');

		if ($scope.selectos.length > 0) {

			$http.post(api+'insertanpc',$scope.selectos).success(function (data){
				$scope.mensaje = data.respuesta;
				$scope.tipoalerta = 'alert-success';
				$scope.cargaFlujo();
				$('#boton2').button('reset');
			}).error( function (data){
				
				$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
				$scope.tipoalerta = 'alert-warning';
				$('#boton2').button('reset');

			}); 

			

		}else{
			alert('No se ha seleccionado ningun documento');
		}

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
    	showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
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
		            { field:'FLD_fechaRec', displayName:'FechaRecepcion', width: 130 },
		            { field:'FLD_claveint', displayName:'FLD_claveint', width: 100, visible:false },
		            { field:'DOC_claveint', displayName:'documento', width: 100, visible:false },
		            { field:'CapEt2', displayName:'CapEt2', width: 100, visible:false },
		            { field:'EnvFac', displayName:'EnvFac', width: 100, visible:true },
		            { field:'FLD_AROent', displayName:'FLD_AROent', width: 100, visible:false },
		            { field:'ARO_activa', displayName:'area', width: 100, visible:false },
		            { field:'USU_ent', displayName:'USU_ent', width: 100, visible:false },
		            { field:'FLD_observaciones', displayName:'Observaciones', width: 320, enableCellEdit: true},
		            { field:'FLD_fechaRecep', width: 130 }
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

};

facturacionCtrl.$inject =['$scope', '$rootScope', 'find', 'loading', '$http', 'checkFolios', 'carga', 'api','datos'];

app.controller('facturacionCtrl',facturacionCtrl);