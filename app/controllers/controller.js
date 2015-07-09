function decimal(e, field) {
  
  key = e.keyCode ? e.keyCode : e.which
  // backspace
  if (key == 8) return true
  // 0-9
  if (key > 47 && key < 58) {
    if (field.value == "") return true
    regexp = /.[0-9]{2}$/
    return !(regexp.test(field.value))
  }
  // .
  if (key == 46) {
    if (field.value == "") return false
    regexp = /^[0-9]+$/
    return regexp.test(field.value)
  }
  // other key
  return false

}

function utf8_decode(str_data) {


  var tmp_arr = [],
    i = 0,
    ac = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0,
    c4 = 0;

  str_data += '';

  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 <= 191) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if (c1 <= 223) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else if (c1 <= 239) {
      // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      c4 = str_data.charCodeAt(i + 3);
      c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
      c1 -= 0x10000;
      tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
      tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
      i += 4;
    }
  }

  return tmp_arr.join('');

}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    //CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   

    
    //this trick will generate a temp "a" tag
    var link = document.createElement("a");    
    link.id="lnkDwnldLnk";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);

    var csv = CSV;

    blob = new Blob([csv], { type: 'data:application/vnd.ms-excel;charset=utf-8' }); 
    var csvUrl = window.webkitURL.createObjectURL(blob);
    var filename = 'Reporte.csv';
    $("#lnkDwnldLnk")
    .attr({
        'download': filename,
        'href': csvUrl
    }); 

    $('#lnkDwnldLnk')[0].click();    
    document.body.removeChild(link);

}

function JSONToXLSConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    //CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "Reporte_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".xls";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}

//Solo numeros enteros
function entero(e, field) {
  
  key = e.keyCode ? e.keyCode : e.which
  // backspace
  if (key == 8) return true
  // 0-9
  if (key > 47 && key < 58) {
    if (field.value == "") return true
    regexp = /.[0-9]{5}$/
    return !(regexp.test(field.value))
  }
  // other key
  return false

}

//Declaramos fecha actual

// var hoy = new Date();

var hoy = new Date(); 
var dd = hoy.getDate(); 
var mm = hoy.getMonth()+1;//enero es 0! 
if (mm < 10) { mm = '0' + mm; }
if (dd < 10) { dd = '0' + dd; }

var yyyy = hoy.getFullYear();
//armamos fecha para los datepicker
var FechaAct = dd + '/' + mm + '/' + yyyy;
var primerdiames = '01/' + mm + '/' + yyyy;

//inicio de sesion
function loginCtrl($rootScope , $scope , auth){
	
	$scope.inicio = function(){

		$rootScope.username = '';
		$rootScope.mensaje = '';
		$scope.titulo = 'Bienvenido';
		//$('html').removeClass('lockscreen');

	}
	

	$scope.login = function(){
		$rootScope.mensaje = '';
        auth.login($scope.username, $scope.password);
    }

};

/// Home de la app
function homeCtrl($scope, $rootScope, auth){
	$scope.tituloH = "Sistema MV";
	$scope.area = $rootScope.areaUsuario;

};

///Folios rechazados
function rechazosCtrl( $scope, $rootScope, $routeParams, $location, find, loading, checkFolios,datos){

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

		if ($rootScope.area == area) {

			alert('No puedes emitir entregas a tu misma area');
			$scope.areaOp = '';

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
				console.log($scope.rechazos);
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
    	multiSelect:true,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
		            { field:'PAS_folio', displayName:'Folio', width: 120 },
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

		console.log(datos.length);


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

			console.log(info);

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
    	enableCellSelection: false,
    	selectedItems: $scope.selectos2, 
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
                    { field:'Folio', width: 120,  enableCellEdit:true, pinned:true },
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
			
			console.log(data);
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
    	enableCellSelection: true,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
                    { field:'Folio', width: 120, pinned:true },
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

};

//mustra los documentos entregados pendientes de recibir
function listadoEntregasCtrl($scope, $rootScope, $routeParams, find, loading, checkFolios,datos){
	

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
        showFilter:false,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
    				{ field:'PorEntregarA', displayName:'PorEntregarA', width: 120 },
                    { field:'PAS_folio', displayName:'Folio', width: 120 },
		            { field:'FLD_etapa', displayName:'Etapa', width: 120 },
		            { field:'FLD_numeroEntrega', displayName:'Cantidad', width: 100 },
		            { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
		            { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
		            { field:'FLD_formaRecep', displayName:'FaxOrigianl', width: 120 },
		            { field:'FLD_fechaRecep', displayName:'FechaRecepcion', width: 130 },
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

};

//muestra los folios por recibir
function listadoRecepcionCtrl($scope, $rootScope, $routeParams, find, loading , $http, carga, checkFolios,datos){
	
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
    	console.log($scope.unidad);

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
        showFilter:false,
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


//bloqueo de sesion
function bloqueoCtrl($scope, webStorage, $rootScope, auth){

	$scope.inicio = function(){

		$scope.usuario = webStorage.session.get('user');
        $scope.nombre = webStorage.session.get('username');;

         webStorage.session.clear();

		$rootScope.username = '';
		$rootScope.mensaje = '';

		$('html').addClass('lockscreen');

	}

	$scope.login = function(){

		
		$rootScope.mensaje = '';
		//console.log($scope.usuario);
        auth.login($scope.usuario, $scope.password);

    }

};


//buscar un folio
function consultaCtrl($scope,$rootScope, find){
	$scope.inicio = function(){

		$scope.tituloCon = "Consulta de Folio(s)";
		$scope.busqueda = false;
		$scope.cargando = false;
		$scope.tipo = 'folio';
		$scope.mensaje = '';
		$scope.folio = '';
        $scope.lesionado = '';
		$('.btn').button();
		$scope.listado = [];
	}

    $scope.verificaBusqueda = function(){
        if ($scope.tipo == 'folio') {
            $scope.foliosxfolio();
        }else{
            $scope.foliosxlesionado();
        }
    }

	//busqueda de folio especiico
	$scope.foliosxfolio = function(){

        console.log($scope.folio);
		$('#boton').button('loading');
		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;
		
		find.recepcionxfolio($scope.folio).success( function (data){
        	

    		$('#boton').button('reset');
    		$scope.listado = data;
        	$scope.busqueda = true;
			$scope.cargando = false;

		});



	}

	//busqueda de folios x lesionado
	$scope.foliosxlesionado = function(){

		$('#boton').button('loading');
		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;

		find.recepcionxlesionado($scope.lesionado).success( function (data){

    		$('#boton').button('reset');
    		$scope.listado = data;
        	$scope.busqueda = true;
			$scope.cargando = false;
			
		});

	}

};

//carga el historico del folio
function historialCtrl($scope,$routeParams, $rootScope, datos, loading){

    loading.despedida();
    // console.log($routeParams.folio);
    $scope.historias = datos.data;
    $scope.info = datos.data[0];

    console.log($scope.historias);

	$scope.inicio = function(){

		$scope.tituloTL = "Historial del Folio";
		$scope.cargar = false;
		$scope.numero = false;
		$scope.historial = false;
		$scope.mensaje = '';
	}
	
};

//buscar un folio en el flujo
function consultaFlujoCtrl($scope,$rootScope, find){

	$scope.inicio = function(){

		$scope.tituloCF = "Consulta de Folio en Flujo";
		$scope.busqueda = false;
		$scope.cargando = false;

		$scope.mensaje = '';
		$scope.criterio = '';
		$scope.listado = [];

	}

	//busqueda de folio especiico
	$scope.buscaFlujo = function(){

		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;
		
		find.listadofolio($scope.criterio).success( function (data){
        	
            if (data) {
            	$scope.listado  = data;
            	$scope.busqueda = true;
    			$scope.cargando = false;
            }else{
                $scope.mensaje = 'No se encontraron datos';
            }

		});

	}

};

//busqueda del control de documentos
function controlDocumentosCtrl($scope, $http, loading, find, api, $filter, reportes){

	$scope.inicio = function(){
		$scope.tituloCD = "Control de Documentos";
		$scope.fechaini = FechaAct;
		$scope.fechafin = FechaAct;
		$scope.folio = '';
		$scope.lesionado = '';
		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
		$scope.foliosxfecha();

        $scope.filtrado = {
            EMP_nombrecorto:'',
            Unidad:'',
            Fax:'',
            original:'',
            Etapa:'',
            PRO_nombre:'',
            Situacion:''
        };
	}

	//busquedas

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

	//busqueda de folios por fecha
	$scope.foliosxfecha = function(){

		loading.cargando('Buscando Folio(s)');
        var datos = {fechaini:$scope.fechaini,fechafin:$scope.fechafin};
        $http.post(api+'controldocumentos/fechas',datos)
        .success( function (data){

			if(data){
                $scope.listado = data;
            }else{
        		$scope.listado = [];
            } 

            $scope.quitafiltro();  
        	loading.despedida();

		});

	}	

	//busqueda de folio especiico
	$scope.foliosxfolio = function(){

		loading.cargando('Buscando Folio');

		var datos = {folio:$scope.folio};
        $http.post(api+'controldocumentos/folio',datos)
        .success( function (data){     
            if(data){
                $scope.listado = data;
            }else{
                $scope.listado = [];
            }  
            $scope.quitafiltro(); 
            loading.despedida();
        });

	}

	//busqueda de folios x lesionado
	$scope.foliosxlesionado = function(){

		loading.cargando('Buscando Folio(s)');

		var datos = {lesionado:$scope.lesionado};
        $http.post(api+'controldocumentos/lesionado',datos)
        .success( function (data){   

            if(data){
                $scope.listado = data;
            }else{
                $scope.listado = [];
            }   
            $scope.quitafiltro();
            loading.despedida();
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
                    { field:'Folio', displayName:'Folio', width: 120, pinned: true},
                    { field:'DOC_lesionado', displayName:'Lesionado', width: 320 },
                    { field:'EMP_nombrecorto', displayName:'Empresa', width: 90 },
                    { field:'Unidad', displayName:'Unidad', width: 220 },
                    { field:'PRO_nombre', displayName:'Producto', width: 120 },
		            { field:'Etapa', displayName:'Etapa', width: 120 },
		            { field:'etapaEntrega', displayName:'Numero', width: 80 },
		            { field:'Fax', displayName:'Fax', width: 80 },
		            { field:'FechaFax', displayName:'FechaFax', width: 120},
		            { field:'Original', displayName:'Original', width: 80 },
		            { field:'FechaOriginal', displayName:'FechaOriginal', width: 120 },
		            { field:'FacExp', displayName:'F.E.', width: 80 },
		            { field:'FechaFacExp', displayName:'FechaF.E.', width: 120 },
		            { field:'Situacion', displayName:'Situacion', width: 120 },
		            { field:'FechaPago', displayName:'FechaPago', width: 120 },
		            { field:'FechaCaptura', displayName:'FechaCaptura', width: 120 },
		            { field:'DOC_factura', displayName:'Factura', width: 120 },
		            { field:'DOC_remesa', displayName:'Remesa', width: 120 },
		            { field:'ESC_nombre', displayName:'Escolaridad', width: 120 },
		            { field:'Cancelado', displayName:'Cancelado', width: 120 }
        ],
        showFooter: true,
        showFilter:false
    };
    

    $scope.filtra = function(){

    	//$scope.filterOptions.filterText = "";
    	//var filtro = "";
    	//console.log($scope.fechaini);

    	if($scope.unidad == undefined || $scope.unidad == 0){
    		var objeto1 = "";
            $scope.filtrado.Unidad = '';
    	}else{
    		var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
            $scope.filtrado.Unidad = $scope.unidad.nombre;
    		
    	}
    	if($scope.cliente == undefined || $scope.cliente == 0){
    		var objeto2 = "";
            $scope.filtrado.EMP_nombrecorto = '';
    	}else{
    		var objeto2 = "Empresa:" + $scope.cliente.nombre + "; ";
            $scope.filtrado.EMP_nombrecorto = $scope.cliente.nombre;
    	}
    	if($scope.tipo == 'Fax'){
    		var objeto3 = "Fax:x; ";
            $scope.filtrado.Fax = 'x';
    	}else if($scope.tipo == 'Original'){
    		var objeto3 = "Original:x; ";
            $scope.filtrado.Original = 'x';
    	}else{
    		var objeto3 = "";
            $scope.filtrado.Original = '';
            $scope.filtrado.Fax = '';
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
            $scope.filtrado.PRO_nombre = '';
    	}else{
    		var objeto6 = "Producto:" + $scope.producto.nombre + "; ";
            $scope.filtrado.PRO_nombre = $scope.producto.nombre;
    		
    	}

    	if($scope.etapa == undefined || $scope.etapa == 0){
    		var objeto7 = "";
    	}else{
    		var objeto7 = "Etapa:" + $scope.etapa + "; ";
            $scope.filtrado.Etapa = $scope.etapa;
    	}

        if($scope.situacion == undefined || $scope.situacion == 0){
            var objeto8 = "";
        }else{
            var objeto8 = "Situacion:" + $scope.situacion + "; ";
            $scope.filtrado.Situacion = $scope.situacion;
        }


    	var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6 + objeto7 + objeto8;

    	$scope.filterOptions.filterText = filtro;

    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){

    	$scope.filterOptions.filterText = ''; 
    	$scope.unidad = 0; 
    	$scope.cliente = 0;
    	$scope.folio = '';
    	$scope.lesionado = '';
        $scope.filtrado = {
            EMP_nombrecorto:'',
            Unidad:'',
            Fax:'',
            original:'',
            Etapa:'',
            PRO_nombre:'',
            Situacion:''
        };
    
    }


    $scope.exporta = function(){

        $scope.selectos = $filter('filter')($scope.listado, $scope.filtrado);
        // reportes.descargar($scope.selectos);
        JSONToCSVConvertor($scope.selectos,'Reporte',true);
        
    }

};

/// detalle de folios
function infoPaseCtrl($scope, $rootScope, $routeParams){

	$scope.inicio = function(){
		$scope.tituloIP = "Info Pase";
		if ($routeParams.folio == undefined) {
			$scope.buscar = true;
		}else{
			$scope.buscar = false;
			$scope.folio = $routeParams.folio;
		}

		$scope.i = 1;
	}

	// presiona Folio
	$scope.presionaFolio = function(evento){


		//contamos la cadena completa
		var cantidad = $scope.criterio.length;

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

		if ($scope.criterio != '') {

			var totalletras = $scope.criterio.length;

			var letras = $scope.criterio.substr(0,4);
			var numeros = $scope.criterio.substr(4,totalletras);

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

			$scope.criterio = letras + numeros;

			$scope.foliosxfolio();
		}	

	}

};

//buscar un folio en el flujo
function busquedaDocumentoCtrl($scope,$rootScope, find){

	$scope.inicio = function(){

		$scope.tituloCon = "Consulta de Documento(s)";
		$scope.busqueda = false;
		$scope.cargando = false;
		$scope.tipo = 'folio';
		$scope.mensaje = '';
		$scope.criterio = '';
		$('.btn').button();
		$scope.listado = [];
	}


	// presiona Folio
	$scope.presionaFolio = function(evento){

		if($scope.tipo == 'folio'){

			//contamos la cadena completa
			var cantidad = $scope.criterio.length;

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
		}else{

			if (evento.keyCode == 13 || evento.keyCode == 9) {

		      	$scope.foliosxlesionado();

		    }

		}

	}

	$scope.verificaFolio = function(){

		if ($scope.criterio != '') {

			var totalletras = $scope.criterio.length

			var letras = $scope.criterio.substr(0,4);
			var numeros = $scope.criterio.substr(4,totalletras);

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

			$scope.criterio = letras + numeros;

			$scope.foliosxfolio();
		}	

	}

	//busqueda de folio especiico
	$scope.foliosxfolio = function(){

		$('#boton').button('loading');
		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;
		
		find.recepcionxfolio($scope.criterio).success( function (data){
        	
        
        	if(data.respuesta){

        		$('#boton').button('reset');
        		$scope.mensaje  = data.respuesta;

        	}else{

        		$('#boton').button('reset');
        		$scope.listado = data;
        		console.log(data);

        	}

        	$scope.busqueda = true;
			$scope.cargando = false;
			
			//console.log(data);
		}).error( function (xhr,status,data){

			$('#boton').button('reset');

			$scope.cargando = false;
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});

	}

	//busqueda de folios x lesionado
	$scope.foliosxlesionado = function(){

		$('#boton').button('loading');
		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;

		find.recepcionxlesionado($scope.criterio).success( function (data){
        	
        	if(data.respuesta){

        		$('#boton').button('reset');
        		$scope.mensaje = data.respuesta;

        	}else{

        		$('#boton').button('reset');
        		$scope.listado = data;

        	}

        	$scope.busqueda = true;
			$scope.cargando = false;
			
			//console.log(data);
		}).error( function (xhr,status,data){

			$('#boton').button('reset');
			$scope.cargando = false;
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});

	}

};


loginCtrl.$inject = ['$rootScope' , '$scope' , 'auth'];
homeCtrl.$inject = ['$scope', '$rootScope', 'auth'];
rechazosCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'find', 'loading', 'checkFolios','datos'];
traspasosCtrl.$inject = ['$scope', '$rootScope', '$routeParams','$http', 'find', 'loading'];
entregasCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading', '$http'];
listadoEntregasCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading', 'checkFolios','datos'];
listadoRecepcionCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find', 'loading' , '$http', 'carga', 'checkFolios','datos'];
bloqueoCtrl.$inject = ['$scope', 'webStorage', '$rootScope', 'auth'];
consultaCtrl.$inject = ['$scope','$rootScope', 'find'];
historialCtrl.$inject = ['$scope','$routeParams', '$rootScope', 'datos', 'loading'];
consultaFlujoCtrl.$inject = ['$scope','$rootScope', 'find'];
controlDocumentosCtrl.$inject = ['$scope', '$http', 'loading', 'find', 'api', '$filter', 'reportes'];
infoPaseCtrl.$inject = ['$scope', '$rootScope', '$routeParams'];
busquedaDocumentoCtrl.$inject = ['$scope','$rootScope', 'find'];

app.controller('loginCtrl',loginCtrl); 
app.controller('homeCtrl',homeCtrl);
app.controller('rechazosCtrl',rechazosCtrl);
app.controller('traspasosCtrl', traspasosCtrl);
app.controller('entregasCtrl', entregasCtrl);
app.controller('listadoEntregasCtrl', listadoEntregasCtrl);
app.controller('listadoRecepcionCtrl', listadoRecepcionCtrl);
app.controller('bloqueoCtrl', bloqueoCtrl);
app.controller('consultaCtrl', consultaCtrl);
app.controller('historialCtrl', historialCtrl);
app.controller('consultaFlujoCtrl',consultaFlujoCtrl);
app.controller('controlDocumentosCtrl',controlDocumentosCtrl);
app.controller('infoPaseCtrl',infoPaseCtrl);
app.controller('busquedaDocumentoCtrl',busquedaDocumentoCtrl);
