(function(){

    /** Sergio Alcala (2017)
    *Controlador del area de recepcion de documentos
    *Funciona Igual que el flujo de documentos pero se trato de generar areas unicas 
    *funcional a nivel de flujo se agrego la captura del folio
    */

    'use strict';

    angular.module('app')
    .controller('recepcionCtrl',recepcionCtrl)

    recepcionCtrl.$inject = ['$scope', '$rootScope', '$filter', '$location', '$http', 'find', 'loading', 'checkFolios','carga','api','datos'];

    function recepcionCtrl( $scope, $rootScope, $filter, $location, $http, find, loading, checkFolios, carga, api,datos){
		
		loading.despedida();

		$scope.rechazados = datos.rechazos;
		$scope.recibidos = datos.recepcion;
		datos.activos.success(function (data){
			$scope.listado = data;
		});

		//detectamos cuando la ventana se cierra para buscar mas folios
		$('#myModal2').on('hidden.bs.modal', function (e) {
		 	$scope.cargaFlujo();
		});


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

		//carga todos los folios del area activos y rechazados por usuario
		$scope.cargaFlujo = function(){

			$rootScope.prueba = false;

			carga.activos($rootScope.id).then(function (data){
	            
	            if (data) {
	                $scope.listado = data;         
	            }else{
	                $scope.listado = [];
	            }
	           
	            $scope.mensaje = '';

	        });
			
		}

		// parte donde se captura el original

		//muestra Ventan de alta de Original
		$scope.muestraOriginal = function(){

			$('#myModal2').modal();

		}

		//verificamos que tipo de atencion es y si ya tien fax capturado al momento de cambiar el tipo de documento 
		$scope.verificaatencion = function(){

			// console.log($scope.original.tipoDoc);
			// console.log($scope.bloqueoUni);

			if(($scope.original.tipoDoc == 2 || $scope.original.tipoDoc == 3) && $scope.bloqueoUni == false){

		
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
	                    { field:'PAS_folio', displayName:'Folio' , width: 120, pinned:true, enableCellEdit: true , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
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
			            { field:'DOC_situacionoriginal', displayName:'Capturado', width: 100, visible:true },
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
	

})();
