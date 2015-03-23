///Area recepcion de Documentos
function recepcionCtrl( $scope, $rootScope, $filter, $location, $http, find, loading, checkFolios,carga){
	
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

		carga.informacion($rootScope.id).then(function(data){

			// console.log(data);
			$scope.clientes = data.clientes;
			$scope.unidades = data.unidades;
			$scope.productosini = data.productos;
			$scope.productos = data.productos;
			$scope.areas = data.areaOperativa;
			$scope.escolaridades = data.escolaridad;

			$scope.cargaEntrada();
			$scope.Altarechazados();

        	$scope.mensaje = '';

		});
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
        	$scope.quitaselectos();
        	$scope.mensaje = '';
			
		}).error( function (xhr,status,data){

			loading.despedida();
			$scope.quitaselectos();
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});
	}

	//busca rechazos
	$scope.Altarechazados = function(){

		find.listadorechazos($rootScope.id).success( function (data) {
			
			if(data.respuesta){
        		$scope.rechazados = 0;
        	}else{
        		$scope.rechazados = data.length;
        	}
        	
		 });
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
			totalfactura:''
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
		 	$scope.cargaEntrada();
		});

		$('#folioO').focus();
	}

	//Verificamos si el fiolio esta dado de alta o se tiene que buscar en 
	$scope.validaOriginal = function(folio){

		$scope.limpiaVariables();
		$scope.cargar = true;
		$scope.mensaje = '';
		//verificamos si tiene primera atencion
		find.verificafolio(folio, 1).success( function (data){
					
			if(data.respuesta){

				//verificamos si es una segunda atencion o tercera pero la tercera es manual
				if (data.original == 1) {

					
					//segunda atencion
					$scope.original.tipoDoc = 2;
					$scope.bloqueo = true;
					$scope.bloqueoUni = false;
					$scope.esoriginal = 1;
					
				}else{

					$scope.original.documento = data.clave;
					//primera atencion
					$scope.original.tipoDoc = 1;

					//verificamos que sea fax 
					if(data.fax == 1){
						$scope.label2 = 'FAX RECIBIDO: ' + data.fechafax;
						$scope.original.fechafax = data.fechafax;
						$scope.esfax = 1;
					}
					//verificamos que sea factura express
					if(data.fe == 1){
						$scope.label2 = 'FAC. EXPRESS: ' + data.fefecha;
						$scope.original.fechafe = data.fechafe;
						$scope.esfe = 1;
					}

					//asignamos bloqueos de campos
					$scope.bloqueo = true;
					$scope.bloqueoUni = true;
					$scope.esoriginal = 0;

				}

				$scope.original.cliente = data.empresa;
				$scope.original.lesionado = data.lesionado;
				$scope.unidadref = data.unidad;
				$scope.original.unidad = data.unidad;
				$scope.original.documento = data.clave;
				$scope.cargar = false;

				$scope.productoOriginal($scope.original.cliente);
				$scope.referencia($scope.original.unidad);

				$scope.original.escolaridad = data.escuela;
				$scope.original.producto = data.producto;

			}else{

				//Como no ninguna atencion registrada en sql server buscamos en web 
				$scope.folioWebOriginal(folio);
				$scope.original.tipoDoc = 1;
				$scope.esoriginal = 0;

			}

		}).error( function (xhr,status,data){

			$scope.cargar = false;
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});
	}

	//Busca folio en la base del portal web 
	$scope.folioWebOriginal = function(folio){

		find.folioweb(folio).success( function (data){

			//console.log(data);
			if (data.length > 0) {
				$scope.original.cliente = data[0].CIAClaveMV;
				$scope.original.lesionado = data[0].Nombre + " " + data[0].Paterno + " " + data[0].Materno;
				$scope.productoOriginal($scope.original.cliente);
				$scope.unidadref = data[0].UNIClaveMV;
				$scope.original.unidad = data[0].UNIClaveMV;
				$scope.original.producto = data[0].PROClave;
				$scope.original.escolaridad = data[0].ESCClaveMV;
				$scope.original.internet = 1;
				$scope.label2 = 'NO SE RECIBIO FAX';
				$scope.label3 = 'NO ES FAC. EXPRESS';
				$scope.referencia($scope.original.unidad);
			}else{
				alert('El folio solicitado no es valido favor de verificarlo');
			}

			$scope.cargar = false;
			
		}).error( function (xhr,status,data){

			//Manda un error por que no se logro conectar a la base web
			$scope.original.internet = 0;
			$scope.tipoalerta = 'alert-danger';
			$scope.mensaje ='No es posible conectar con el folio Web. Para reiniciar la conexión favor de notificar al área de sistemas.';
			$scope.cargar = false;

		});
	}

	//busca el producto
	$scope.productoOriginal = function(empresa){

		find.producto(empresa).success( function (data) {

			$scope.productos = data;

		 });
	}

	//en caso de remesa solo se ocupan 5 numeros no mas
	$scope.presionaRemesa = function(evento){

		//contamos la cadena completa

		var cantidad = $scope.remesa.length;
		
		// NO deben ser letras
		if(cantidad < 5){
			if (evento.keyCode >= 65 && evento.keyCode <= 90) {
		      	evento.preventDefault();
		    }
		}

		//Si son mas de 6 digitos no escribas mas
		if(cantidad > 5){
			if (evento.keyCode != 8  && evento.keyCode != 46 ) {

		      	evento.preventDefault();
		    }      	
		}

		//Si se da enter o salto de linea ejecuta el autollenado de ceros
		if (evento.keyCode == 13 || evento.keyCode == 9) {
	      	if(cantidad < 5 ){

				var faltantes = 6 - cantidad;

				for (var i = 0; i < faltantes; i++) {
					
					$scope.remesa = "0" + $scope.remesa;
				}

			}
	    }
	}

	//rellena la remesa de 0 cuando son menos de 6 digitos
	$scope.verificaRemesa = function(){

		//contamos la cadena completa
		if ($scope.remesa) {
			var cantidad = $scope.remesa.length;

	      	if(cantidad < 5 ){

				var faltantes = 6 - cantidad;

				for (var i = 0; i < faltantes; i++) {
					
					$scope.remesa = "0" + $scope.remesa;
				}

			}
		};
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
	$scope.mandadatos = function(){

		if ($scope.formOriginal.$valid) {

			$('#boton2').button('loading');
			$scope.mensaje = '';
			//Verificamos la informacion antes de guardar
			checkFolios.verificaInfo($scope.original.cliente, $scope.original.producto, $scope.original.escolaridad, $scope.original.fecha, $scope.original.folio)
			.then(function (data) {
				$scope.revisado = data.revisado;
				$scope.guardaOriginal();
			}, function (error) {
				$scope.mensaje = error.mensaje;
				$scope.tipoalerta = error.tipoalerta;
				$('#boton2').button('reset');
			});

		};
	}

	//Guarda los datos de Original
	$scope.guardaOriginal = function(){

		$scope.original.remesa = $scope.remesa + "-" + $scope.label1;
		$scope.original.unidad = $scope.unidadref;//iguala al valor del select por si hubo cualquier cambio 

		//Verificamos si se asigno escolaridad en caso de ser AXA el cliente
		checkFolios.preparaGuardado($scope.original, $scope.esoriginal, $scope.esfax, $scope.esfe)
		.then(function (data){
			console.log(data);
			//actualiza folio (solo original)
			if (data.agregaOriginal) {
				var alta = $http.post('/documento/api/altafoliooriginal',data.info)

			//agrega folio (solo original)
			}else if (data.actualizaOriginal) {
				var alta = $http.post('/documento/api/actualizaoriginal',data.info)
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
	}

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
	//aqui termina 

	
	//Busqueda de folios x area
	$scope.foliosxarea = function(){

		$('#busca2').button('loading');
		loading.cargando('Buscando Folio');

		find.foliosxArea($rootScope.area).success( function (data){
        	
        	if(data.respuesta){

        		$('#busca2').button('reset');
        		loading.mensaje(data.respuesta);
        		loading.despedida();
        		$scope.listado = [];

        	}else{

        		$('#busca2').button('reset');
        		$scope.listado = data;
        		loading.despedida();
        	}
			
			//console.log(data);
		}).error( function (xhr,status,data){

			$('#busca2').button('reset');
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});
	}

	//busqueda de folios por fecha
	$scope.foliosxfecha = function(){

		loading.cargando('Buscando Folio');

		$http({
			url:'/documento/api/folioactivoareafecha',
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:{area:$rootScope.area,fechaini:$scope.fechaini,fechafin:$scope.fechafin}
		}).success( function (data){
			        	
			if(data.respuesta){

        		loading.mensaje(data.respuesta);
        		loading.despedida();
        		$scope.listado = [];

        	}else{


        		$scope.listado = data;
        		loading.despedida();
        	}	

		}).error( function (data){


			loading.despedida();
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});
	}	

	//busqueda de referencias por unidad
	$scope.referencia = function(unidad){

		find.referenciaxunidad(unidad).success(function (data){
			$scope.label1 = data.referencia;
		});
	}

	//enlista los usuarios de cada area 
	$scope.altausuariosarea = function(area){

		if ($rootScope.area == area) {

			alert('No puedes emitir entregas a tu misma area');
			$scope.areaOp = '';
			
		}else if($rootScope.area == 5){

			alert('No puedes emitir entregas a facturacion tu usuario no tiene permisos');
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

	//manda los folios seleccionados al area que mencionan
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

	$scope.guardaFlujo = function(indice){

		var documentoEnv = $scope.selectos[indice];
		console.log(documentoEnv);

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

		//console.log(datos);

	    $http({
			url:'/documento/api/altaentrega',
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:datos
		}).success( function (data){
			
			console.log(data);
			$scope.mensaje = data.respuesta;
			$scope.tipoalerta = 'alert-success';
			$scope.cargaEntrada();			

		}).error( function (data){

			$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
			$scope.tipoalerta = 'alert-warning';

		});
	}

	$scope.actualizaFlujo = function(folios){

		//seleccionamos el folio a mandar 
		// var documentoEnv = $scope.selectos[indice];
		
		//console.log(documentoEnv);
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
			// $scope.cargaEntrada();			

		}).error( function (data){

			$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
			$scope.tipoalerta = 'alert-warning';

		});
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

    	console.log(filtro);
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

app.controller('recepcionCtrl', ['$scope', '$rootScope', '$filter', '$location', '$http', 'find', 'loading', 'checkFolios','carga', recepcionCtrl]);