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

var tableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
  return function(table, name) {

    if (!table.nodeType) table = document.getElementById(table)

    	// console.log(table.innerHTML);

    var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
    window.location.href = uri + base64(format(template, ctx))
  }
})()


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
    
    //Generate a file name
    var fileName = "Reporte_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
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



//Area de archivo
function flujoCtrl($scope, $rootScope, find , loading, $http){

	$scope.inicio = function(){

		$rootScope.area = $rootScope.areaUsuario;
		$scope.tituloFL = "Mis folios";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.recibidos = 0;

		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
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

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

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

			 }).error( function (xhr,status,data){

				alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

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
			$scope.quitaselectos();
			$scope.cargaEntrada();

		};
	
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



	$scope.pendientesRecibir = function(){

		find.listadorecepcion($rootScope.id).success( function (data){
       
        	if(data.respuesta){
        		$scope.recibidos = 0;
        	}else{
        		$scope.recibidos = data.length;
        	}

        	console.log($scope.recibidos);

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

    	console.log(filtro);

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
	
}

//Area de archivo
function archivoCtrl($scope, $rootScope, find , loading, $http){

	$scope.inicio = function(){

		$rootScope.area = 7;
		$scope.tituloR = "Archivo";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.recibidos = 0;

		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
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

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

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

			 }).error( function (xhr,status,data){

				alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

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

		$('#boton').button('reset');
		$scope.mensaje = 'Termino el Envio';
		$scope.quitaselectos();
		$scope.cargaEntrada();

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



	$scope.pendientesRecibir = function(){

		find.listadorecepcion($rootScope.id).success( function (data){
       
        	if(data.respuesta){
        		$scope.recibidos = 0;
        	}else{
        		$scope.recibidos = data.length;
        	}

        	console.log($scope.recibidos);

		}).error( function (xhr,status,data){

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

    	console.log(filtro);

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
	
}

//bloqueo de sesion
function bloqueoCtrl($scope, $cookies, $cookieStore, $rootScope, auth){

	$scope.inicio = function(){

		$scope.usuario = $cookies.user;
        $scope.nombre = $cookies.username;

        $cookieStore.remove("username"),
        $cookieStore.remove("area");
        $cookieStore.remove("id");


		$rootScope.username = '';
		$rootScope.mensaje = '';

		$('html').addClass('lockscreen');

	}

	$scope.login = function(){

		
		$rootScope.mensaje = '';
		//console.log($scope.usuario);
        auth.login($scope.usuario, $scope.password);

    }

}

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

}

//Area de capturas
function capturaCtrl($scope, $rootScope, find , loading, $http){

	$scope.inicio = function(){

		$rootScope.area = 3;
		$scope.tituloR = "Captura";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.recibidos = 0;

		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
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
	$scope.validainfo = function(){

		$scope.mensaje = '';
		$('#boton').button('loading');

		var valor = 0;
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

				if (valor == $scope.selectos.length - 1) {

					$('#boton').button('reset');
					$scope.mensaje = 'Termino el Envio';
					$scope.quitaselectos();
					$scope.cargaEntrada();
				};

				valor++;

			}catch(err){

				if(err != 1){
					alert(err);
				}
				
			}
		} //Termina for

		

	}


	//caso de juego de facturacion
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
			$scope.cargaEntrada();			

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

        	console.log($scope.recibidos);

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

    	console.log(filtro);

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

}

//buscar un folio
function consultaCtrl($scope,$rootScope, find){

	$scope.inicio = function(){

		$scope.tituloCon = "Consulta de Folio(s)";
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

}

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

		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;
		
		find.listadofolio($scope.criterio).success( function (data){
        	
        
        	if(data.respuesta){

        		$('#boton').button('reset');
        		$scope.mensaje  = data.respuesta;

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

}

//Area de cordinacion
function cordinacionCtrl($scope, $rootScope, find , loading, $http){

	$scope.inicio = function(){

		$rootScope.area = 2;
		$scope.tituloR = "Cordinación Médica";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.recibidos = 0;

		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
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
	$scope.validainfo = function(){

		console.log($scope.selectos);

		$scope.mensaje = '';
		$('#boton').button('loading');

		var valor = 0;

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

				if (valor == $scope.selectos.length -1) {
					$('#boton').button('reset');
					$scope.mensaje = 'Termino el Envio';
					$scope.quitaselectos();
					$scope.cargaEntrada();
				};

				valor++;

			}catch(err){

				if(err != 1){
					alert(err);
				}
				
			}
		} //Termina for
		

	}


	//caso de juego de facturacion
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

        	console.log($scope.recibidos);

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

    	console.log(filtro);

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

}

//busqueda del control de documentos
function controlDocumentosCtrl($scope, $rootScope, $http, loading, find,$window,$compile,$filter){

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
		$scope.sinfiltro = true;
		$scope.tipodocumentos = [{id:1,nombre:'Primera atención'},{id:2,nombre:'Subsecuencia'},{id:3,nombre:'Rehabilitación'}];	
	}

	//muestra Ventan de alta de Original
	$scope.muestraOriginal = function(){

		$('#myModal2').modal();
		$scope.original = {folio:'',documento:0, tipoDoc:'',remesa:'', fecha:FechaAct, cliente:'',lesionado:'',unidad:'', producto:'',escolaridad:'', usuario: $rootScope.id, fechafax: '', fechafe: '' ,internet:1 , original:0, numentrega:1, incompleto:'',factura:'',totalfactura:''};
		$scope.escolaridad();
		$scope.empresas();
		$scope.Altaunidades();
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
		 	$scope.foliosxfecha();
		});

		$('#folioO').focus();

	}

	//Verifica que la fecha no sea mayor a la fecha que se esta capturando
	$scope.validafecha = function(){
			
		if(Date.parse($scope.original.fecha) > Date.parse(FechaAct)){

			alert('La fecha no debe ser mayor a la de hoy');
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

	//rellena la remesa de 0 cuando son menos de 6 digitos
	$scope.verificaRemesa = function(){

		//contamos la cadena completa
		var cantidad = $scope.remesa.length;

	      	if(cantidad < 5 ){

				var faltantes = 6 - cantidad;

				for (var i = 0; i < faltantes; i++) {
					
					$scope.remesa = "0" + $scope.remesa;
				}

			}
	}

	$scope.presionaFolioOriginal = function(evento){

		//contamos la cadena completa
		if ($scope.original.folio) {

			var cantidad = $scope.original.folio.length;

			//los primero cuatro caracteres NO deben ser numeros
			if(cantidad < 4){
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
				if (evento.keyCode != 8  && evento.keyCode != 46 && evento.keyCode != 9) {

			      	evento.preventDefault();
			    }      	
			}

			//Si se da enter o salto de linea ejecuta la funcion verifica folio pasandole que es de tipo fax
			if (evento.keyCode == 13 || evento.keyCode == 9) {

				$scope.mensaje = '';
		      	$scope.verificaFolioO('Original',  $scope.original.folio);

		    }

		};
	}

	//funcion para autocompletar el folio 
	$scope.verificaFolioO = function(tipo , folio){

		if (folio != '') {

			var totalletras = folio.length

			var letras = folio.substr(0,4);
			var numeros = folio.substr(4,totalletras);

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

			$scope.cargar = true;

			if(tipo == 'Fax'){

				$scope.fax.folio = letras + numeros;
				$scope.folioWeb('Fax', $scope.fax.folio);

			}else if(tipo == 'Original'){

				$scope.original.folio = letras + numeros;
				$scope.validaOriginal($scope.original.folio);			

			}

		}	

	}

	//Verificamos si el fiolio esta dado de alta o se tiene que buscar en 
	$scope.validaOriginal = function(folio){

		$scope.limpiaVariables();
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
							$scope.productoOriginal($scope.original.cliente);
							$scope.original.escolaridad = data.escuela;
							$scope.referencia($scope.original.unidad);
							$scope.original.producto = data.producto;
							$scope.original.documento = data.clave;
							$scope.cargar = false;

						}else{

							//Como no ninguna atencion registrada en sql server buscamos en web 
							$scope.folioWeb('Original',folio);
							$scope.original.tipoDoc = 1;
							$scope.esoriginal = 0;

						}


			}).error( function (xhr,status,data){

				$scope.cargar = false;
				alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

			});

	}

	//Busca folio en la base del portal web 
	$scope.folioWeb = function(tipo,folio){

		if(tipo == 'Fax'){

			$scope.limpiaVariablesF();

			find.folioweb(folio).success( function (data){		
				$scope.fax.cliente = data[0].CIAClaveMV;
				$scope.fax.lesionado = data[0].Nombre + " " + data[0].Paterno + " " + data[0].Materno;
				$scope.fax.unidad = data[0].UNIClaveMV;
				$scope.productoFax($scope.fax.cliente);
				$scope.fax.producto = data[0].PROClave;
				$scope.fax.escolaridad = data[0].ESCClaveMV;
				$scope.fax.internet = 1;
				$scope.cargar = false;
			}).error( function (xhr,status,data){
				//Manda un error por que no se logro conectar a la base web
				$scope.cargar = false;
				$scope.fax.internet = 0;
				$scope.mensaje = 'No es posible conectar con el folio Web. Para reiniciar la conexión favor de notificar al área de sistemas.';
				$scope.tipoalerta = 'alert-danger';
			});

		}else if(tipo == 'Original'){

			find.folioweb(folio).success( function (data){

				console.log(data[0].Exp_cancelado);
				if (data[0].Exp_cancelado == 1) {
					alert('El folio se encuentra cancelado en registro web favor de verificarlo');
				}else{
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
				}
				
				$scope.cargar = false;
				
			}).error( function (xhr,status,data){

				//Manda un error por que no se logro conectar a la base web
				$scope.original.internet = 1;
				$scope.tipoalerta = 'alert-danger';
				$scope.mensaje ='No es posible conectar con el folio Web. Para reiniciar la conexión favor de notificar al área de sistemas.';
				$scope.cargar = false;

			});
		}
	}


	///limpia variables 
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

	///Proceso de guardado ya sea de fax u original
	$scope.mandadatos = function(tipo){

		if(Date.parse($scope.original.fecha) > Date.parse(FechaAct)){

			alert('La fecha no debe ser mayor a la de hoy favor de modificar');

		}else{

			if(tipo == 'Fax'){
				$('#otro').button('loading');
				$scope.verificaInfo($scope.fax.cliente, $scope.fax.producto, $scope.fax.escolaridad, $scope.fax.fecha, $scope.fax.folio, tipo);
			}else{
				$scope.verificaInfo($scope.original.cliente, $scope.original.producto, $scope.original.escolaridad, $scope.original.fecha, $scope.original.folio, tipo);	
			}
			
		}		

	}

	//Verificamos la informacion al guardar
	$scope.verificaInfo = function(cliente, producto, escolaridad, fecha, folio, tipo){


		if(cliente == 20 && producto == 2 && (escolaridad == null || escolaridad == -1 || escolaridad == 0) ){

			$scope.mensaje = 'La escolaridad es requerida para AXA AP.';
			$scope.tipoalerta = 'alert-danger';

		}else{

			if (Date.parse(fecha) > Date.parse(FechaAct)) {

				$scope.mensaje = 'La fecha de captura no debe ser mayor al dia de hoy';
				$scope.tipoalerta = 'alert-danger';

			}else{

				if(producto == -1 || producto == null){

					$scope.mensaje = 'El campo producto es requerido';
					$scope.tipoalerta = 'alert-danger';

				}else{

					find.verificaprefijo(folio.substr(0,4),cliente).success(function (data){

						if(data.valido == 1){

							$scope.revisado = 1; //termina la validacion correctamente
							if(tipo == 'Fax'){
								$scope.guardaFax();
							}else{
								$scope.guardaOriginal();
							}

						}else{

							$scope.mensaje = 'El prefijo del folio no es valido. Favor de verificar';
							$scope.tipoalerta = 'alert-danger';

						}

					});

				}

			}
			
		}
		
	}

	//Guarda los datos de Original
	$scope.guardaOriginal = function(){


		$scope.original.remesa = $scope.remesa + "-" + $scope.label1;
		$scope.original.unidad = $scope.unidadref;//iguala al valor del select por si hubo cualquier cambio 

		//Verificamos si se asigno escolaridad en caso de ser AXA el cliente

		if($scope.revisado == 1){

			$('#boton2').button('loading');
			$scope.mensaje = '';

			//verificamos si el folio tiene documento registrado
			if($scope.original.documento == 0){

				//Si es primera atencion
				if($scope.original.tipoDoc == 1){

					//console.log($scope.fax);
					//Verificamos que el folio no este dado de alta en documentos

					//como es primera atencion se define como 1 el numero de entrega para la primera etapa (aunque solo debe ser 1 para la primera)
					$scope.original.numentrega = 1;

					find.verificafolio($scope.original.folio, 1).success( function (data){

						if(data.respuesta){

							$('#boton2').button('reset');
							$scope.mensaje = data.respuesta;
							$scope.tipoalerta = 'alert-danger';

						}else{
							
							//Segunda validacion para verificar que no esta en la tabla pase
							find.verificafoliopase($scope.original.folio).success( function (data){

								if(data.respuesta){

									$('#boton2').button('reset');
									$scope.mensaje = data.respuesta;
									$scope.tipoalerta = 'alert-danger';

								}else{

									$scope.agregaOriginal();
									
								}
								
							});
						}
					}).error( function (xhr,status,data){

						$('#boton2').button('reset');
						alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

					});
					


				}else{

					//en caso de que sea segunda atencion o tercera y se haya registrado por primera vez en sql server 
					$('#boton2').button('reset');
					$scope.mensaje = 'No se permite capturar una segunda atencion de un registro nuevo';
					$scope.tipoalerta = 'alert-danger';

				}
				

			}else{
			///Se actualiza pero se tiene que ver si es original o es una segunda atencion 

				//Tiene fax/fe y no esta capturado como original y se actualiza a original
				if($scope.esoriginal == 0){

					//tenemos primera atencion
					if($scope.original.tipoDoc == 1){

						//Es fax
						if($scope.esfax == 1){

							if($scope.original.fecha < $scope.fechafax){
								$scope.mensaje = 'La fecha de captura del original no puede ser anterior a la fecha de captura del fax.';
								$scope.tipoalerta = 'alert-danger';
							}else{
								//actualizamos
								$scope.actualizaOriginal();
								//alert('entro actualiza');
							}

						//es factura express	
						}else if($scope.esfe == 1){

							if($scope.original.fecha < $scope.fechafe){
								$scope.mensaje = 'La fecha de captura del original no puede ser anterior a la fecha de captura de la factura express.';
								$scope.tipoalerta = 'alert-danger';
							}else{
								//actualizamos
								$scope.actualizaOriginal();
								//alert('entro actualiza');
							}
						}

					}else{//segunda/tercera atencion agregamos nuevo documento

						$scope.agregaOriginal();
					}


				}else{
				//es segunda o tercera atencion

					//verificamos que no se haya apretado la primera atencion
					if($scope.original.tipoDoc == 1){

						alert('No se puede guardar como primera atencion');
						$('#boton2').button('reset');

					}else{

						//verifica que numero de segunda o tercera atencion es
						find.verificaetapaentrega($scope.original.folio,$scope.original.tipoDoc).success(function (data){

							$scope.original.numentrega = Number(data.total) + 1;

							//Agregamos un nuevo documento de segunda etapa o tercera
							$scope.agregaOriginal();

						});

					}

				}

			}//se cierra donde verificamos si un nuevo registro

		}//se cierra primer if donde ve si es AXA

	}

	//actualiza folio (solo original)
	$scope.actualizaOriginal = function(){

		$http({
			url:'/documento/api/actualizaoriginal',
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:$scope.original
		}).success( function (data){
			
			//console.log(data);	
			$('#boton2').button('reset');
			$scope.mensaje = data.respuesta;
		    $scope.tipoalerta = 'alert-success';
		    $scope.limpiaVariables();
		    $scope.original.folio = '';
		    $('#folioO').focus();
										
		//console.log(data);
		}).error( function (xhr,status,data){

			$('#boton2').button('reset');
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');
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

	//agrega folio (solo original)
	$scope.agregaOriginal = function(){

		$http({
			url:'/documento/api/altafoliooriginal',
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:$scope.original
		}).success( function (data){
			
			//console.log(data);			        	
			$('#boton2').button('reset');
			$scope.mensaje = data.respuesta;
		    $scope.tipoalerta = 'alert-success';
		    $scope.limpiaVariables();
		    $scope.original.folio = '';
		    $('#folioO').focus();
										
		//console.log(data);
		}).error( function (xhr,status,data){

			$('#boton2').button('reset');
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');
		});
	}

	//busquedas

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

	//busca escolaridad
	$scope.escolaridad = function(){

		find.escolaridad().success( function (data) {

			$scope.escolaridades = data;

		 });
	}

	//busca el producto
	$scope.productoOriginal = function(empresa){

		find.producto(empresa).success( function (data) {

			$scope.productos = data;

		 });

	}

	//busqueda de referencias por unidad
	$scope.referencia = function(unidad){

		find.referenciaxunidad(unidad).success(function (data){
			$scope.label1 = data.referencia;
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

	//busqueda de folios por fecha
	$scope.foliosxfecha = function(){

		loading.cargando('Buscando Folio(s)');

		$http({
			url:'/documento/api/recepcionfoliosfecha',
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:{fechaini:$scope.fechaini,fechafin:$scope.fechafin}
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

	// presiona Folio
	$scope.presionaFolio = function(evento){

		//contamos la cadena completa
		var cantidad = $scope.folio.length;

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

	// presiona Lesionado
	$scope.presionaLesionado = function(evento){

		//contamos la cadena completa
		var cantidad = $scope.lesionado.length;

		//Si se da enter o salto de linea ejecuta la funcion verifica folio pasandole que es de tipo fax
		if (evento.keyCode == 13 || evento.keyCode == 9) {

	      	$scope.foliosxlesionado();

	    }
	}

	$scope.verificaFolio = function(){


		if ($scope.folio != '') {

			var totalletras = $scope.folio.length

			var letras = $scope.folio.substr(0,4);
			var numeros = $scope.folio.substr(4,totalletras);

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

			$scope.folio = letras + numeros;
			$scope.folio.toUpperCase();
			$scope.foliosxfolio();
		}	
	}

	//busqueda de folio especiico
	$scope.foliosxfolio = function(){

		loading.cargando('Buscando Folio');

		find.recepcionxfolio($scope.folio).success( function (data){
        	
        
        	if(data.respuesta){

        		loading.mensaje(data.respuesta);
        		loading.despedida();
        		$scope.listado = [];

        	}else{

        		$scope.listado = data;
        		loading.despedida();
        		$scope.quitafiltro();

        	}
			//console.log(data);
		}).error( function (xhr,status,data){

			loading.despedida();
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});
	}

	//busqueda de folios x lesionado
	$scope.foliosxlesionado = function(){

		loading.cargando('Buscando Folio(s)');

		$http.post('/documento/api/recepcionfoliosxlesionado',{lesionado:$scope.lesionado})
		.success( function (data){
        	
        	if(data.respuesta){

        		loading.mensaje(data.respuesta);
        		loading.despedida();
        		$scope.listado = [];

        	}else{

        		$scope.listado = data;
        		loading.despedida();

        	}
			

		}).error( function (xhr,status,data){

			loading.despedida();
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
                    { field:'Folio', width: 120, pinned: true},
                    { field:'Lesionado', width: 320 },
                    { field:'Empresa', width: 90 },
                    { field:'Unidad', width: 220 },
                    { field:'Producto', width: 120 },
		            { field:'Etapa', width: 120 },
		            { field:'Numero', width: 80 },
		            { field:'Fax', width: 80 },
		            { field:'FechaFax', width: 120},
		            { field:'Original', width: 80 },
		            { field:'FechaOriginal', width: 120 },
		            { field:'F.E.', width: 80 },
		            { field:'FechaF.E.', width: 120 },
		            { field:'Situacion', width: 120 },
		            { field:'FechaPago', width: 120 },
		            { field:'FechaCaptura', width: 120 },
		            { field:'Factura', width: 120 },
		            { field:'Remesa', width: 120 },
		            { field:'Escolaridad', width: 120 },
		            { field:'Cancelado', width: 120 }
        ],
        showFooter: true,
        showFilter:false
    };
    
    ///guardamos los archivos que se van filtrando
    $scope.$on('ngGridEventRows', function (newFilterText){

    	//console.log(newFilterText);
    	var filas = newFilterText.targetScope.renderedRows;

    	if ($scope.sinfiltro) {
    		$scope.exportables = $scope.listado;
    	}else{
	    	$scope.exportables = [];

	    	angular.forEach(filas , function(item){
	    		$scope.exportables.push(item.entity);
	    	});
    	}
    	// console.log($scope.exportables);
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

    	if($scope.tipo == 'Fax'){
    		var objeto3 = "Fax:x; ";
    	}else if($scope.tipo == 'Original'){
    		var objeto3 = "Original:x; ";
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

    	if($scope.situacion == undefined || $scope.situacion == 0){
    		var objeto6 = "";
    	}else{
    		var objeto6 = "Situacion:" + $scope.situacion + "; ";
    	}

    	if($scope.etapa == undefined || $scope.etapa == 0){
    		var objeto7 = "";
    	}else{
    		var objeto7 = "Etapa:" + $scope.etapa + "; ";
    	}

    	if($scope.producto){
    		var objeto8 = "Producto:" + $scope.producto + "; ";
    	}else{
    		var objeto8 = "";
    	}

    	var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6 + objeto7 + objeto8;

    	if(filtro){
    		$scope.sinfiltro = false;
    	}else{
    		$scope.sinfiltro = true;
    	}

    	$scope.filterOptions.filterText = filtro;
    	// console.log(filtro);

    }

    $scope.quitafiltro = function(){
    	$scope.filterOptions.filterText = ''; 
    	$scope.unidad = 0; 
    	$scope.cliente = 0;
    	$scope.folio = '';
    	$scope.lesionado = '';
    	$scope.producto = '';
    	$scope.situacion = '';
    	$scope.sinfiltro = true;
    }
 	  
}

function editaTicketCtrl($scope,$rootScope, $http, find, $routeParams){

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

		if ($rootScope.userWeb == undefined){
			$scope.mensaje = 'No tienes usuario para editar ticket solicitalo en el area de sistemas';
			$scope.bloqueado = true;
		};

		$scope.cargar = false;
		$scope.edicion = true;
		$scope.altacategorias();
		$scope.altastatus();
		$scope.empresasWeb();
		$scope.unidadesWeb();

		$scope.muestraticket();

	}

	$scope.ValidaInfo = function(){

		if ($scope.bloqueado) {
			return true;
		}else{
			return $scope.formTicket.$invalid;
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
	
}

//Area de facturacion
function facturacionCtrl($scope, $rootScope, find , loading, $http){

	$scope.inicio = function(){

		$rootScope.area = 5;
		$scope.tituloR = "Facturación";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.recibidos = 0;

		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
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

				if (i == Number($scope.selectos.length) - 1) {

					$('#boton2').button('reset');
					//$scope.mensaje = 'Rechazos con exito';
					//$scope.tipoalerta = 'alert-success';
					$scope.cargaEntrada();
					$scope.quitaselectos();
					//$scope.gridOptions.$gridScope.toggleSelectAll(false);
				
				};

			}catch(err){

				if(err != 1){
					alert(err);
				}

				if (i == Number($scope.selectos.length) - 1) {

					$('#boton2').button('reset');
					//$scope.mensaje = 'Rechazos con exito';
					//$scope.tipoalerta = 'alert-success';
					$scope.cargaEntrada();
					$scope.quitaselectos();
					//$scope.gridOptions.$gridScope.toggleSelectAll(false);
				
				};
				
			}
		} //Termina for

		$('#boton').button('reset');
		$scope.mensaje = 'Termino el Envio';
		// $scope.quitaselectos();
		$scope.cargaEntrada();

	}


	//caso de juego de facturacion
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

        	console.log($scope.recibidos);

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

    	console.log(filtro);

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
	
}


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

}

//carga el historico del folio
function historialCtrl($scope, $rootScope, find ,$routeParams){

	$scope.inicio = function(){

		$scope.tituloTL = "Historial del Folio";
		$scope.cargar = false;
		$scope.numero = false;
		$scope.historial = false;
		$scope.mensaje = '';
		$scope.numeroentregas =  [];
		$scope.folio = $routeParams.folio;
		$scope.tipoDoc = $routeParams.etapa;
		$scope.entrega = $routeParams.entrega;
		$scope.muestrHistorico();
	}

	

	$scope.muestrHistorico = function(){
		//console.log($scope.entrega);
		$scope.cargar = true;
		$scope.mensaje = '';

		find.muestrahistorico($scope.folio, $scope.tipoDoc, $scope.entrega).success(function (data){
			if(data.respuesta){
				$scope.cargar = false;
				$scope.historial = false;
				$scope.mensaje = data.respuesta;

			}else{
				$scope.historias = data;
				$scope.historial = true;
				$scope.cargar = false;
			}
			
		}).error(function (xhr,status,data){
			$scope.historial = true;
			$scope.cargar = false;
		});

	}
		
}

/// Home de la app
function homeCtrl($scope, $rootScope, auth){

	$scope.tituloH = "Sistema MV";
	$scope.area = $rootScope.areaUsuario;

}

/// Home de la app
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

}

//mustra los documentos entregados pendientes de recibir
function listadoEntregasCtrl($scope, $rootScope, $routeParams, find, $http, loading){


	//Carga Configuracion Inicial
	$scope.inicio = function(){

		$scope.tituloLE = 'Listado de Entregas efectuadas'; //+ $routeParams.area;
		$scope.area = $routeParams.area;
		$scope.empresas();
		$scope.folio = '';
		$scope.altaunidades();
		$scope.cargaEntregas();
		$scope.mensaje = '';

	}

	//Carga la lista de archivos a Recibir de otras areas 
	$scope.cargaEntregas = function(){

		loading.cargando('Buscando Folios');

		find.listadoentrega($rootScope.id).success( function (data){
       
        	if(data.respuesta){
        		loading.mensaje(data.respuesta);
        		$scope.listadoEntregas = [];

        	}else{
        		$scope.listadoEntregas = data;
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

	//elimina la seleccion o al que le apretaron
	$scope.elimina = function(dato){

		try{

			$scope.mensaje = '';

			var datos = dato.entity;
			var ruta = '';

			//console.log(datos);
			if($rootScope.area == 4 && datos.FaxOrigianl == 'JF'){
				
				ruta = '/documento/api/eliminaentrega/facturacion/'+ $rootScope.id;

			}else{

				if (datos.FaxOrigianl == 'JF') {
					throw "No tienes permisos para eliminar este item";
				}else{
					ruta = '/documento/api/eliminaentrega/otro/'+ $rootScope.id;
				}
			}

			$http({
				url:ruta,
				method:'POST', 
				contentType: 'application/json', 
				dataType: "json", 
				data:datos
			}).success( function (data){
				
				//console.log(data);
				$scope.mensaje = data.respuesta;
				$scope.tipoalerta = 'alert-success';
				$scope.cargaEntregas();			

			}).error( function (data){

				$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
				$scope.tipoalerta = 'alert-warning';

			});

			//$scope.cargaEntregas();

		}
		catch(err)
		{
			alert(err);
		}

	}


	$scope.eliminaMultiple = function(){

		$('#boton').button('loading');

		for (var i = 0; i < $scope.selectos.length; i++) {

			try{

				$scope.mensaje = '';
				
				var datos = $scope.selectos[i];
				var ruta = '';

				//console.log(datos);
				if($rootScope.area == 4 && datos.FaxOrigianl == 'JF'){
					
					ruta = '/documento/api/eliminaentrega/facturacion/'+ $rootScope.id;

				}else{

					if (datos.FaxOrigianl == 'JF') {
						throw "No tienes permisos para eliminar este folio: " + datos.Folio;
					}else{
						ruta = '/documento/api/eliminaentrega/otro/'+ $rootScope.id;
					}
				}

				$http({
					url:ruta,
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

				if (i == Number($scope.selectos.length) -2) {

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
    				{ field:'PorEntregarA', width: 120 },
                    { field:'Folio', width: 120 },
		            { field:'Etapa', width: 120 },
		            { field:'Cantidad', width: 100 },
		            { field:'Empresa', width: 120 },
		            { field:'Unidad', width: 200 },
		            { field:'FaxOrigianl', width: 120 },
		            { field:'FechaRecepcion', width: 130 },
		            { field:'ROC', width: 100, visible:false },
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

}

//muestra los folios por recibir
function listadoRecepcionCtrl($scope, $rootScope, $routeParams, find, loading , $http){


	//Carga Configuracion Inicial
	$scope.inicio = function(){

		$scope.tituloLR = 'Listado Pendientes de Recibir';
		$scope.area = $routeParams.area;
		$scope.mensaje = '';
		$scope.folio = '';
		$scope.selectosAc = [];
		$scope.empresas();
		$scope.altaunidades();
		$scope.cargaRecepcion();

	}

	//Carga la lista de archivos a Recibir de otras areas 
	$scope.cargaRecepcion = function(){

		loading.cargando('Buscando Folios');

		find.listadorecepcion($rootScope.id).success( function (data){
       
        	if(data.respuesta){
        		loading.mensaje(data.respuesta);
        		$scope.listadoRecepcion = [];

        	}else{
        		$scope.listadoRecepcion = data;
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

	$scope.aceptaEntregas = function(){


		$scope.mensaje = '';
		$('#boton').button('loading');

		var valor = 0;


		for (var i = 0; i < $scope.selectos.length; i++) {
			
			try{

				var documento = $scope.selectos[i];
				
				console.log(documento);

				$http({
					url:'api/aceptaentrega',
					method:'POST', 
					contentType: 'application/json', 
					dataType: "json", 
					data:documento
				}).success( function (data){	

					if (valor == $scope.selectos.length-1 ) {

						$('#boton').button('reset');
						$scope.mensaje = 'Aceptación con exito';
						$scope.tipoalerta = 'alert-success';
						$scope.cargaRecepcion();

						$scope.gridOptions.$gridScope.toggleSelectAll(false);
					
					};

					valor++;

				}).error( function (data){

					throw 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
					

				});

				

			}catch(err){
				alert(err);
			}

		};
		
	}


	$scope.rechazaEntregas = function(){

		$scope.mensaje = '';
		$('#boton2').button('loading');

		var valor = 0;

		for (var i = 0; i < $scope.selectos.length; i++) {
			
			try{

				var documento = $scope.selectos[i];
				documento.USU_rec = $rootScope.id;
				//console.log(documento);


				documento.motivo =  prompt("Escribe motivo de rechazo para el folio " + documento.Folio,"Falto ");
				//console.log(documento);

				$http({
					url:'api/rechazoentrega',
					method:'POST', 
					contentType: 'application/json', 
					dataType: "json", 
					data:documento
				}).success( function (data){
					
					//console.log(data);
					// $scope.mensaje = data.respuesta;
					//$scope.tipoalerta = 'alert-success';

					

					if (valor == $scope.selectos.length-1 ) {

						$('#boton2').button('reset');
						$scope.mensaje = 'Rechazos con exito';
						$scope.tipoalerta = 'alert-success';
						$scope.cargaRecepcion();

						$scope.gridOptions.$gridScope.toggleSelectAll(false);
					
					};

					valor++;	
								

				}).error( function (data){

					throw 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
					

				});

			}catch(err){
				alert(err);
			}

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
    				{ field:'EntregadoPor', width: 120, pinned:true},
                    { field:'Folio', width: 120 },
		            { field:'Etapa', width: 120 },
		            { field:'Cantidad', width: 100 },
		            { field:'Empresa', width: 120 },
		            { field:'Unidad', width: 200 },
		            { field:'FaxOrigianl', width: 120 },
		            { field:'FechaRecepcion', width: 130 },
		            { field:'DocRevision', width: 100 },
		            { field:'DOC_claveint', width: 100, visible:false },
		            { field:'FLD_claveint', width: 100, visible:false },
		            { field:'FLD_AROrec', width: 100, visible:false },
		            { field:'USU_rec', width: 100, visible:false },
		            { field:'USU_recibe', width: 100, visible:false },
		            { field:'motivo', width: 20, visible:false },
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

}

//inicio de sesion
function loginCtrl( $rootScope , $scope , auth){

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

}

//cerrar sesion
function logoutCtrl($scope , $cookies, auth , $rootScope){
 
	$scope.tituloA = 'Vuelve Pronto ' + $cookies.username;
	$rootScope.ruta = '';

	$scope.logout = function (){

		auth.logout();

	}

}


//mapas de google
function mapaCtrl($scope, $rootScope){

	$scope.inicio = function(){
		
		$scope.tituloM = "Google Maps";

            if(!!navigator.geolocation) {
    
		        var map;
		    
		        var mapOptions = {
		            zoom: 15,
		            mapTypeId: google.maps.MapTypeId.ROADMAP
		        };
		        
		        map = new google.maps.Map(document.getElementById('google_canvas'), mapOptions);
		    
		        navigator.geolocation.getCurrentPosition(function(position) {

		  	     	$rootScope.localidad = position;

                    $scope.latitud = $rootScope.localidad.coords.latitude;
				 	$scope.longitud = $rootScope.localidad.coords.longitude;
		        	
		            var geolocate = new google.maps.LatLng($scope.latitud, $scope.longitud);

		            var infowindow = new google.maps.InfoWindow({
		                map: map,
		                position: geolocate,
		                content:
		                    '<h4>Medica Vial</h4>'
		            });
		            
		            map.setCenter(geolocate);
		            
		        });
		        
		    } else {
		        document.getElementById('google_canvas').innerHTML = 'No Geolocation Support.';
		    }


	}

}

//menu de tickets donde se imprimen los generados al dia
function menuticketCtrl($scope, $rootScope, $http, find, loading, $location,$window,$compile,$filter){

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

}


//Area de mesa de control
function mesaControlCtrl($scope, $rootScope, find , loading, $http){

	$scope.inicio = function(){

		$rootScope.area = 4;
		$scope.tituloR = "Mesa de Control";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.recibidos = 0;

		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
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
	$scope.validainfo = function(){

		$scope.mensaje = '';
		$('#boton').button('loading');

		//console.log($scope.selectos);
		for (var i = 0; i < $scope.selectos.length; i++) {

			try{
				var documento = $scope.selectos[i];

				console.log(documento);

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
				if($scope.areaOp == 6 && documento.EnvFac.indexOf('SI') == -1 && documento.Etapa == 1) {

					if(confirm('El documento ' + documento.Folio + ' etapa '+ documento.Etapa + ' # ' + documento.Cantidad + ' no se a enviado a Facturación. ¿Desea proseguir?')){							
						//si es facturacion agrega un juego mas al flujo

						$scope.actualizaFlujo(i);

						throw 1;
					}
					else{

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

				if (i == Number($scope.selectos.length) - 1) {

					$('#boton').button('reset');
					//$scope.mensaje = 'Rechazos con exito';
					//$scope.tipoalerta = 'alert-success';
					$scope.cargaEntrada();
					$scope.quitaselectos();
					//$scope.gridOptions.$gridScope.toggleSelectAll(false);
				
				};

			}catch(err){

				if(err != 1){
					alert(err);
				}

				if (i == Number($scope.selectos.length) - 1) {

					$('#boton').button('reset');
					//$scope.mensaje = 'Rechazos con exito';
					//$scope.tipoalerta = 'alert-success';
					$scope.cargaEntrada();
					$scope.quitaselectos();
					//$scope.gridOptions.$gridScope.toggleSelectAll(false);
				
				};
				
			}
		} //Termina for

		//$('#boton').button('reset');
		//$scope.mensaje = 'Termino el Envio';
		// $scope.quitaselectos();
		//$scope.cargaEntrada();

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
	
}

//mustra los documentos entregados pendientes de recibir
function nopagarCtrl($scope, $rootScope, $routeParams, find, $http, loading){


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

}

//flujo de pagos general
function flujoPagosCtrl($scope,$rootScope, find,loading, $http){

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

}

//Area de pagos
function pagosCtrl($scope, $rootScope, find , loading, $http, barra){

	$scope.inicio = function(){
		//barra.inicia();
		$rootScope.area = 6;
		$scope.tituloR = "Pagos";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.recibidos = 0;

		// $scope.empresas();
		// $scope.Altaunidades();
		// $scope.productos();
		// $scope.fechainiPag = primerdiames;
  //   	$scope.fechafinPag = FechaAct;
  //   	$scope.fechainiRec = FechaAct;
  //   	$scope.fechafinRec = FechaAct;
		// $scope.folio = '';
		// $scope.lesionado = '';
		// $scope.relacion = '';
		// $scope.cargar = false;
		// $scope.buscarXfecha = 0;

		// $scope.foliosXfecha('Pagos');
		// $scope.Altarechazados();
		// $scope.pendientesRecibir();

	}

	// $scope.pendientesRecibir = function(){

	// 	find.listadorecepcion($rootScope.id).success( function (data){
       
 //        	if(data.respuesta){
 //        		$scope.recibidos = 0;
 //        	}else{
 //        		$scope.recibidos = data.length;
 //        	}

 //        	//console.log($scope.recibidos);
 //        	barra.termina();

	// 	});

	// }

	// //Busqueda de folios x area
	// $scope.foliosxarea = function(){

	// 	$('#busca2').button('loading');
	// 	loading.cargando('Buscando Folio');

	// 	find.listadopagos().success( function (data){
        	
 //        	if(data.respuesta){

 //        		$('#busca2').button('reset');
 //        		loading.mensaje(data.respuesta);
 //        		loading.despedida();
 //        		$scope.listado = [];

 //        	}else{

 //        		$('#busca2').button('reset');
 //        		$scope.listado = data;
 //        		$scope.cantidad = data.length -1;
 //        		loading.despedida();
        	
 //        	}
			
	// 		//console.log(data);
	// 	}).error( function (xhr,status,data){

	// 		loading.despedida();
	// 		$('#busca2').button('reset');
	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

	// 	});

	// }


	// $scope.foliosXfecha = function(tipo){

	// 	loading.cargando('Buscando Folio');

	// 	// var fechaini = '';
	// 	// var fechafin = '';

	// 	//valida el campo de fecha en caso de que alguno este lleno y el otro no

	// 	if (tipo == 'Pagos') {

	// 		// if ($scope.fechainiPag == '' && $scope.fechafinPag != '') {
	// 		// 	$scope.fechainiPag = $scope.fechafinPag;
	// 		// }else if ($scope.fechafinPag == '' && $scope.fechafinPag != '') {
	// 		// 	$scope.fechafinPag = $scope.fechainiPag;
	// 		// };

	// 		fechaini = $scope.fechainiPag;
	// 		fechafin = $scope.fechafinPag;

	// 		var url="/documento/api/listapagosfechas"

	// 	}else{

	// 		// if ($scope.fechainiRec == '' && $scope.fechafinRec != '') {
	// 		// 	$scope.fechainiRec = $scope.fechafinRec;
	// 		// }else if ($scope.fechafinRec == '' && $scope.fechafinRec != '') {
	// 		// 	$scope.fechafinRec = $scope.fechainiRec;
	// 		// };

	// 		fechaini = $scope.fechainiRec;
	// 		fechafin = $scope.fechafinRec;

	// 		var url="/documento/api/listapagosfechasrecepcion"

	// 	};

	// 	//armamos los datos a enviar segun tipo de consulta (tipo)
	// 	$scope.datos = {fechaini:fechaini,fechafin:fechafin};
	// 	console.log($scope.datos);

	// 	$http({
	// 		url:url,
	// 		method:'POST', 
	// 		contentType: 'application/json', 
	// 		dataType: "json", 
	// 		data:$scope.datos
	// 	}).success( function (data){
			  
	// 		if(data.respuesta){

        	
 //        		loading.mensaje(data.respuesta);
 //        		loading.despedida();
 //        		$scope.listado = [];

 //        	}else{

  
 //        		$scope.listado = data;
 //        		$scope.cantidad = data.length -1;
 //        		loading.despedida();
 //        		$scope.buscarXfecha = 1;
 //        	}
			
	// 	}).error( function (xhr,status,data){

	// 		loading.despedida();
	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

	// 	});

	// }


	// ///Busquedas 

	// //busca clientes
	// $scope.empresas = function(){

	// 	find.empresas().success( function (data) {

	// 		$scope.clientes = data;

	// 	 }).error( function (xhr,status,data){

	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

	// 	 });
	// }

	// //busca productos
	// $scope.productos = function(){

	// 	find.productos().success( function (data) {

	// 		$scope.productosini = data;

	// 	 }).error( function (xhr,status,data){

	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

	// 	 });
	// }


	// //busca unidades
	// $scope.Altaunidades = function(){

	// 	find.unidades().success( function (data) {

	// 		$scope.unidades = data;

	// 	 }).error( function (xhr,status,data){

	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

	// 	 });
	// }

	// //busca rechazos
	// $scope.Altarechazados = function(){

	// 	find.listadorechazos($rootScope.id).success( function (data) {
			
	// 		console.log(data);
	// 		if(data.respuesta){
 //        		$scope.rechazados = 0;
 //        	}else{
 //        		$scope.rechazados = data.length;
 //        	}

	// 	 }).error( function (xhr,status,data){

	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

	// 	 });
	// }




	// //////LLena el grid y toma filtros

	// ///filtros
	// $scope.selectos = [];

	// $scope.filterOptions = {
	//     filterText: '',
	//     useExternalFilter: false
	// };

	// var csvOpts = { columnOverrides: { obj: function (o) {
	//     return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
	//     } },
	//     iEUrl: 'downloads/download_as_csv'
	// };

 //    ////opciones del grid                 
 //    $scope.gridOptions = { 
 //    	data: 'listado', 
 //    	enableColumnResize:true,
 //    	enablePinning: true, 
 //    	enableRowSelection:true,
 //    	multiSelect:false,
 //    	selectedItems: $scope.selectos, 
 //    	filterOptions: $scope.filterOptions,
 //    	enableCellEdit: true,
 //    	columnDefs: [
 //                    { field:'USUNombre', width: 120, pinned: true},
 //                    { field:'Folio', width: 120, pinned: false},
 //                    { field:'Cliente', width: 100 },
 //                    { field:'Unidad', width: 220 },
 //                    { field:'Lesionado', width: 330 },
 //                    //{ field:'Producto', width: 120 },
	// 	            { field:'Etapa', width: 120 },
	// 	            { field:'Entrega', width: 80 },
	// 	            { field:'FormaRecep', width: 90 },
	// 	            { field:'fechaRecepcion', width: 120},
	// 	            { field:'FechaRecepPag', width: 120,  cellFilter: 'date:\'dd/MM/yyyy\'' },
	// 	            { field:'Relacion', width: 120 },
	// 	            { field:'RelP', width: 120 },
	// 	            { field:'PasC', width: 120 },
	// 	            { field:'FPasCobrado', width: 120 },
	// 	            { field:'Pago', width: 120 },
	// 	            { field:'Reserva', width: 120 },
	// 	            { field:'LNombre', width: 120 },
	// 	            { field:'TNombre', width: 120 },
	// 	            { field:'Pagado', width: 80 },
	// 	            { field:'Cobrado', width: 80 },
	// 	            { field:'FacturaRelacion', width: 80 },
	// 	            { field:'FacturaControl', width: 80 }
 //        ],
 //        showFooter: true,
 //        showFilter:false
 //    };

 //    $scope.$on('ngGridEventRows', function (newFilterText){

 //    	var filas = newFilterText.targetScope.renderedRows;

 //    	$scope.exportables = [];

 //    	angular.forEach(filas , function(item){
 //    		$scope.exportables.push(item.entity);
 //    	});

 //    });

 //    $scope.filtra = function(){

 //    	//$scope.filterOptions.filterText = "";
 //    	//var filtro = "";
 //    	//console.log($scope.relacionado);



 //    	if($scope.unidad == undefined || $scope.unidad == 0){
 //    		var objeto1 = "";
 //    	}else{
 //    		var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
    		
 //    	}
 //    	if($scope.cliente == undefined || $scope.cliente == 0){
 //    		var objeto2 = "";
 //    	}else{
 //    		var objeto2 = "Cliente:" + $scope.cliente.nombre + "; ";
 //    	}

 //    	if($scope.tipo == 'fax'){
 //    		console.log('entro a fax');
 //    		var objeto3 = "FormaRecep:F; ";
 //    	}else if($scope.tipo == 'original'){
 //    		var objeto3 = "FormaRecep:O; ";
 //    	}else{
 //    		var objeto3 = "";
 //    	}

 //    	if($scope.folio.length == 0){
 //    		var objeto4 = "";
 //    	}else{
 //    		var objeto4 = "Folio:" + $scope.folio + "; ";	
 //    	}

 //    	if($scope.lesionado.length == 0){
 //    		var objeto5 = "";
 //    	}else{
 //    		var objeto5 = "Lesionado:" + $scope.lesionado + "; ";	
 //    	}

 //    	if($scope.producto == undefined || $scope.producto == 0){
 //    		var objeto6 = "";
 //    	}else{
 //    		var objeto6 = "Producto:" + $scope.producto.nombre + "; ";
    		
 //    	}

 //    	if($scope.etapa == undefined || $scope.etapa == 0){
 //    		var objeto7 = "";
 //    	}else{
 //    		var objeto7 = "Etapa:" + $scope.etapa + "; ";
    		
 //    	}

 //    	if($scope.relacion.length == 0){
 //    		var objeto8 = "";
 //    	}else{
 //    		var objeto8 = "Relacion:" + $scope.relacion + "; ";	
 //    	}

 //    	if ($scope.relacionado) {
 //    		var objeto9 = "RelP:X ; ";	
 //    	}else{
 //    		var objeto9 = "";
 //    	}

 //    	if ($scope.cobrado) {
 //    		var objeto10 = "Cobrado:1 ; ";	
 //    	}else{
 //    		var objeto10 = "";
 //    	}

 //    	if ($scope.pagado) {
 //    		var objeto11 = "Pagado:1 ; ";	
 //    	}else{
 //    		var objeto11 = "";
 //    	}


 //    	var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6 + objeto7 + objeto8 + objeto9 + objeto10 + objeto11;

 //    	$scope.filterOptions.filterText = filtro;

 //    	console.log(filtro);

 //    }

 //    $scope.quitafiltro = function(){

 //    	$scope.filterOptions.filterText = ''; 
 //    	$scope.unidad = 0; 
 //    	$scope.cliente = 0;
 //    	$scope.tipo = 0;
 //    	$scope.folio = '';
 //    	$scope.fechaini = '';
 //    	$scope.fechafin = '';
 //    	$scope.lesionado = '';
 //    	$scope.lesionado = '';
 //    	$scope.fechainiPag = '';
 //    	$scope.fechafinPag = '';
 //    	$scope.fechainiRec = '';
 //    	$scope.fechainiRec = '';

 //    	console.log($scope.buscarXfecha);

 //    	if ($scope.buscarXfecha == 1) {

 //    		$scope.buscarXfecha = 0;
 //    		$scope.foliosxarea();
 //    	};
    	
    
 //    }

}

///Area recepcion de Documentos
function recepcionCtrl( $scope, $rootScope, $filter, $location, $http, find, loading, barra){


	//Con parametros de inicio
	$scope.inicio = function(){
		// ngProgress.color('#4376F2');
		// ngProgress.start();
		//barra.inicia();
		$rootScope.area = 1;
		$scope.tituloR = "Recepcion de Documentos";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
		$scope.verareaoperativa();
		$scope.datos = {fechaini:FechaAct, fechafin:FechaAct, folio:'', lesionado:'', cliente:'', unidad:''};
		$scope.fechaini = '';
		$scope.fechafin = '';
		$scope.folio = '';
		$scope.lesionado = '';
		$scope.mensaje = '';
		$scope.cargar = false;
		$scope.tipodocumentos = [{id:1,nombre:'Primera atención'},{id:2,nombre:'Subsecuencia'},{id:3,nombre:'Rehabilitación'}];	
		$scope.FaxOriginal = true;
		//$scope.cargaEntrada();
		//$scope.Altarechazados();
		
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

	//muestra Ventan de alta de fax
	$scope.muestraFax = function(){

		$('#myModal').modal();
		$scope.fax = {folio:'', internet: 0, fecha:FechaAct, cliente:'',lesionado:'',unidad:'', producto:'',escolaridad:'', usuario: $rootScope.id};
		$scope.escolaridad();
		$scope.empresas();
		$scope.Altaunidades();
		$scope.cargar = false;
		$scope.valor = false;
		$scope.revisado = 0;
		$scope.mensaje = '';

		//detectamos cuando la ventana se cierra para buscar mas folios
		$('#myModal').on('hidden.bs.modal', function (e) {
		 	$scope.cargaEntrada();
		});

		$('#folioF').focus();

	}

	//muestra Ventan de alta de Original
	$scope.muestraOriginal = function(){

		$('#myModal2').modal();
		$scope.original = {folio:'',documento:0, tipoDoc:'',remesa:'', fecha:FechaAct, cliente:'',lesionado:'',unidad:'', producto:'',escolaridad:'', usuario: $rootScope.id, fechafax: '', fechafe: '' ,internet:1 , original:0, numentrega:1, incompleto:'',factura:'',totalfactura:''};
		$scope.escolaridad();
		$scope.empresas();
		$scope.Altaunidades();
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
		// $('#myModal2').on('hidden.bs.modal', function (e) {
		//  	$scope.cargaEntrada();
		// });

		$('#folioO').focus();
	}

	
	///limpia variables 
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

	$scope.limpiaVariablesF = function(){

		$scope.fax.internet =  1;
		$scope.fax.fecha = FechaAct; 
		$scope.fax.cliente = ''; 
		$scope.fax.lesionado = '';
		$scope.fax.unidad = '';
		$scope.fax.producto = '';
		$scope.fax.escolaridad = '';
		//$scope.mensaje = '';
	}

	/////////Inicia proceso de guardado 

	///Proceso de guardado ya sea de fax u original
	$scope.mandadatos = function(tipo){

		if(tipo == 'Fax'){
			$('#otro').button('loading');
			$scope.verificaInfo($scope.fax.cliente, $scope.fax.producto, $scope.fax.escolaridad, $scope.fax.fecha, $scope.fax.folio, tipo);
		}else{
			$scope.verificaInfo($scope.original.cliente, $scope.original.producto, $scope.original.escolaridad, $scope.original.fecha, $scope.original.folio, tipo);	
		}

	}

	//Guarda los datos de fax
	$scope.guardaFax = function(){

		$scope.mensaje = '';
		

		if($scope.revisado == 1){
					
			//Verificamos que el folio no este dado de alta en documentos
			find.verificafolio($scope.fax.folio, 1).success( function (data){

				if(data.respuesta){

					$('#otro').button('reset');
					$scope.mensaje = data.respuesta;
					$scope.tipoalerta = 'alert-danger';

				}else{
								
					//Segunda validacion para verificar que no esta en la tabla pase
					find.verificafoliopase($scope.fax.folio).success( function (data){

						if(data.respuesta){

							$('#otro').button('reset');
							$scope.mensaje = data.respuesta;
							$scope.tipoalerta = 'alert-danger';

						}else{

							console.log($scope.fax);

							$http({
								url:'/documento/api/altafoliofax',
								method:'POST', 
								contentType: 'application/json', 
								dataType: "json", 
								data:$scope.fax
							}).success( function (data){
								        	
								$('#otro').button('reset');
								$scope.mensaje = data.respuesta;
								$scope.tipoalerta = 'alert-success';
								$scope.limpiaVariablesF();
								$scope.fax.folio = '';
								$('#folioF').focus();


							});
						}
									
					});
				}

			}).error( function (xhr,status,data){

				$('#otro').button('reset');
				alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');
			});

		}

	}

	//Guarda los datos de Original
	$scope.guardaOriginal = function(){


		$scope.original.remesa = $scope.remesa + "-" + $scope.label1;
		$scope.original.unidad = $scope.unidadref;//iguala al valor del select por si hubo cualquier cambio 

		//Verificamos si se asigno escolaridad en caso de ser AXA el cliente

		if($scope.revisado == 1){

			$('#boton2').button('loading');
			$scope.mensaje = '';

			//verificamos si el folio tiene documento registrado
			if($scope.original.documento == 0){

				//Si es primera atencion
				if($scope.original.tipoDoc == 1){

					//console.log($scope.fax);
					//Verificamos que el folio no este dado de alta en documentos

					//como es primera atencion se define como 1 el numero de entrega para la primera etapa (aunque solo debe ser 1 para la primera)
					$scope.original.numentrega = 1;

					find.verificafolio($scope.original.folio, 1).success( function (data){

						if(data.respuesta){

							$('#boton2').button('reset');
							$scope.mensaje = data.respuesta;
							$scope.tipoalerta = 'alert-danger';

						}else{
							
							//Segunda validacion para verificar que no esta en la tabla pase
							find.verificafoliopase($scope.original.folio).success( function (data){

								if(data.respuesta){

									$('#boton2').button('reset');
									$scope.mensaje = data.respuesta;
									$scope.tipoalerta = 'alert-danger';

								}else{

									$scope.agregaOriginal();
									
								}
								
							});
						}
					}).error( function (xhr,status,data){

						$('#boton2').button('reset');
						alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

					});
					


				}else{

					//en caso de que sea segunda atencion o tercera y se haya registrado por primera vez en sql server 
					$('#boton2').button('reset');
					$scope.mensaje = 'No se permite capturar una segunda atencion de un registro nuevo';
					$scope.tipoalerta = 'alert-danger';

				}
				

			}else{
			///Se actualiza pero se tiene que ver si es original o es una segunda atencion 

				//Tiene fax/fe y no esta capturado como original y se actualiza a original
				if($scope.esoriginal == 0){

					//tenemos primera atencion
					if($scope.original.tipoDoc == 1){

						//Es fax
						if($scope.esfax == 1){

							if($scope.original.fecha < $scope.fechafax){
								$scope.mensaje = 'La fecha de captura del original no puede ser anterior a la fecha de captura del fax.';
								$scope.tipoalerta = 'alert-danger';
							}else{
								//actualizamos
								$scope.actualizaOriginal();
								//alert('entro actualiza');
							}

						//es factura express	
						}else if($scope.esfe == 1){

							if($scope.original.fecha < $scope.fechafe){
								$scope.mensaje = 'La fecha de captura del original no puede ser anterior a la fecha de captura de la factura express.';
								$scope.tipoalerta = 'alert-danger';
							}else{
								//actualizamos
								$scope.actualizaOriginal();
								//alert('entro actualiza');
							}
						}

					}else{//segunda/tercera atencion agregamos nuevo documento

						$scope.agregaOriginal();
					}


				}else{
				//es segunda o tercera atencion

					//verificamos que no se haya apretado la primera atencion
					if($scope.original.tipoDoc == 1){

						alert('No se puede guardar como primera atencion');
						$('#boton2').button('reset');

					}else{

						//verifica que numero de segunda o tercera atencion es
						find.verificaetapaentrega($scope.original.folio,$scope.original.tipoDoc).success(function (data){

							$scope.original.numentrega = Number(data.total) + 1;

							//Agregamos un nuevo documento de segunda etapa o tercera
							$scope.agregaOriginal();

						});

					}

				}

			}//se cierra donde verificamos si un nuevo registro

		}//se cierra primer if donde ve si es AXA

	}

	//actualiza folio (solo original)
	$scope.actualizaOriginal = function(){

		$http({
			url:'/documento/api/actualizaoriginal',
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:$scope.original
		}).success( function (data){
			
			//console.log(data);	
			$('#boton2').button('reset');
			$scope.mensaje = data.respuesta;
		    $scope.tipoalerta = 'alert-success';
		    $scope.limpiaVariables();
		    $scope.original.folio = '';
		    $('#folioO').focus();
										
		//console.log(data);
		}).error( function (xhr,status,data){

			$('#boton2').button('reset');
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');
		});

	}

	//agrega folio (solo original)
	$scope.agregaOriginal = function(){

		$http({
			url:'/documento/api/altafoliooriginal',
			method:'POST', 
			contentType: 'application/json', 
			dataType: "json", 
			data:$scope.original
		}).success( function (data){
			
			//console.log(data);			        	
			$('#boton2').button('reset');
			$scope.mensaje = data.respuesta;
		    $scope.tipoalerta = 'alert-success';
		    $scope.limpiaVariables();
		    $scope.original.folio = '';
		    $('#folioO').focus();
										
		//console.log(data);
		}).error( function (xhr,status,data){

			$('#boton2').button('reset');
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');
		});
	}


	/////////Termina proceso de guardado 



	/////////////////Seccion de validaciones

	//Verifica que la fecha no sea mayor a la fecha que se esta capturando
	$scope.validafecha = function(tipo){

		console.log('entro')
		// if(tipo == 'Fax'){

		// 	if($scope.fax.fecha > FechaAct){
		// 		$scope.fax.fecha = FechaAct;
		// 	}

		// }else{
			console.log($scope.original.fecha);
			console.log(FechaAct);
			if($scope.original.fecha > FechaAct){
				$scope.original.fecha = FechaAct;
			}
		// }
		
	}

	//Verificamos si el fiolio esta dado de alta o se tiene que buscar en 
	$scope.validaOriginal = function(folio){

		$scope.limpiaVariables();
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
							$scope.productoOriginal($scope.original.cliente);
							$scope.original.escolaridad = data.escuela;
							$scope.referencia($scope.original.unidad);
							$scope.original.producto = data.producto;
							$scope.original.documento = data.clave;
							$scope.cargar = false;

						}else{

							//Como no ninguna atencion registrada en sql server buscamos en web 
							$scope.folioWeb('Original',folio);
							$scope.original.tipoDoc = 1;
							$scope.esoriginal = 0;

						}


			}).error( function (xhr,status,data){

				$scope.cargar = false;
				alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

			});

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

	//funcion para autocompletar el folio 
	$scope.verificaFolio = function(tipo , folio){

		if (folio != '') {

			var totalletras = folio.length

			var letras = folio.substr(0,4);
			var numeros = folio.substr(4,totalletras);

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

			$scope.cargar = true;

			if(tipo == 'Fax'){

				$scope.fax.folio = letras + numeros;
				$scope.folioWeb('Fax', $scope.fax.folio);

			}else if(tipo == 'Original'){

				$scope.original.folio = letras + numeros;
				$scope.validaOriginal($scope.original.folio);			

			}else{

				$scope.datos.folio = letras + numeros;
				$scope.foliosxfolio();
			}

		}	

	}

	//rellena la remesa de 0 cuando son menos de 6 digitos
	$scope.verificaRemesa = function(){

		//contamos la cadena completa
		var cantidad = $scope.remesa.length;

	      	if(cantidad < 5 ){

				var faltantes = 6 - cantidad;

				for (var i = 0; i < faltantes; i++) {
					
					$scope.remesa = "0" + $scope.remesa;
				}

			}
	}

	//Verificamos la informacion al guardar
	$scope.verificaInfo = function(cliente, producto, escolaridad, fecha, folio, tipo){


		if(cliente == 20 && producto == 2 && (escolaridad == null || escolaridad == -1 || escolaridad == 0) ){

			$scope.mensaje = 'La escolaridad es requerida para AXA AP.';
			$scope.tipoalerta = 'alert-danger';

		}else{

			if (fecha > FechaAct) {

				$scope.mensaje = 'La fecha de captura no debe ser mayor al dia de hoy';
				$scope.tipoalerta = 'alert-danger';

			}else{

				if(producto == -1 || producto == null){

					$scope.mensaje = 'El campo producto es requerido';
					$scope.tipoalerta = 'alert-danger';

				}else{

					find.verificaprefijo(folio.substr(0,4),cliente).success(function (data){

						if(data.valido == 1){

							$scope.revisado = 1; //termina la validacion correctamente
							if(tipo == 'Fax'){
								$scope.guardaFax();
							}else{
								$scope.guardaOriginal();
							}

						}else{

							$scope.mensaje = 'El prefijo del folio no es valido. Favor de verificar';
							$scope.tipoalerta = 'alert-danger';

						}

					});

				}

			}
			
		}
		
	}

	//Verifica como se escribe bien el folio 4letras - 6numeros y detecta la tecla enter
	$scope.presionaFolioFax = function(evento){

		//contamos la cadena completa
		var cantidad = $scope.fax.folio.length;

		//los primero cuatro caracteres NO deben ser numeros
		if(cantidad < 4){
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
			if (evento.keyCode != 8  && evento.keyCode != 46 && evento.keyCode != 9) {

		      	evento.preventDefault();
		    }      	
		}

		//Si se da enter o salto de linea ejecuta la funcion verifica folio pasandole que es de tipo fax
		if (evento.keyCode == 13 || evento.keyCode == 9) {

			$scope.mensaje = '';
	      	$scope.verificaFolio('Fax',  $scope.fax.folio);

	    }

	}
	
	$scope.presionaFolioOriginal = function(evento){

		//contamos la cadena completa
		var cantidad = $scope.original.folio.length;

		//los primero cuatro caracteres NO deben ser numeros
		if(cantidad < 4){
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
			if (evento.keyCode != 8  && evento.keyCode != 46 && evento.keyCode != 9) {

		      	evento.preventDefault();
		    }      	
		}

		//Si se da enter o salto de linea ejecuta la funcion verifica folio pasandole que es de tipo fax
		if (evento.keyCode == 13 || evento.keyCode == 9) {

			$scope.mensaje = '';
	      	$scope.verificaFolio('Original',  $scope.original.folio);

	    }

	}

	$scope.presionaFolio = function(evento){

		//contamos la cadena completa
		var cantidad = $scope.datos.folio.length;

		//los primero cuatro caracteres NO deben ser numeros
		if(cantidad < 4){
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

	      	$scope.verificaFolio('Nada',  $scope.datos.folio);

	    }

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

	

	//aqui termina 

	
	///////////////////Seccion de busquedas

	//Busca folio en la base del portal web 
	$scope.folioWeb = function(tipo,folio){

		if(tipo == 'Fax'){

			$scope.limpiaVariablesF();

			find.folioweb(folio).success( function (data){
				
				$scope.fax.cliente = data[0].CIAClaveMV;
				$scope.fax.lesionado = data[0].Nombre + " " + data[0].Paterno + " " + data[0].Materno;
				$scope.fax.unidad = data[0].UNIClaveMV;
				$scope.productoFax($scope.fax.cliente);
				$scope.fax.producto = data[0].PROClave;
				$scope.fax.escolaridad = data[0].ESCClaveMV;
				$scope.fax.internet = 1;
				$scope.cargar = false;
				
			}).error( function (xhr,status,data){

				//Manda un error por que no se logro conectar a la base web
				$scope.cargar = false;
				$scope.fax.internet = 0;
				$scope.mensaje = 'No es posible conectar con el folio Web. Para reiniciar la conexión favor de notificar al área de sistemas.';
				$scope.tipoalerta = 'alert-danger';

			});

		}else if(tipo == 'Original'){

			find.folioweb(folio).success( function (data){

				//console.log(data);
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
				$scope.cargar = false;
				
			}).error( function (xhr,status,data){

				//Manda un error por que no se logro conectar a la base web
				$scope.original.internet = 0;
				$scope.tipoalerta = 'alert-danger';
				$scope.mensaje ='No es posible conectar con el folio Web. Para reiniciar la conexión favor de notificar al área de sistemas.';
				$scope.cargar = false;

			});
		}
		
	}

	//busca el producto
	$scope.productoFax = function(empresa){

		find.producto(empresa).success( function (data) {

			$scope.productos = data;

		 });

	}

	//busca el producto
	$scope.productoOriginal = function(empresa){

		find.producto(empresa).success( function (data) {

			$scope.productos = data;

		 });

	}

	//busqueda de referencias por unidad
	$scope.referencia = function(unidad){

		find.referenciaxunidad(unidad).success(function (data){
			$scope.label1 = data.referencia;
		});

	}

	//busca escolaridad
	$scope.escolaridad = function(){

		find.escolaridad().success( function (data) {

			$scope.escolaridades = data;

		 });
	}

	//busca clientes
	$scope.empresas = function(){

		find.empresas().success( function (data) {

			$scope.clientes = data;

		 });

	}


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
			
			if(data.respuesta){
        		$scope.rechazados = 0;
        	}else{
        		$scope.rechazados = data.length;
        	}

        	barra.termina();
        	

		 });

	}


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

				if (i == $scope.selectos.length-1) {

					$('#boton').button('reset');
					$scope.mensaje = 'Termino el Envio';
					$scope.quitaselectos();
					$scope.cargaEntrada();
				};

			}catch(err){

				if(err != 1){
					alert(err);
				}
				
			}
		} //Termina for

		
		

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
			// $scope.cargaEntrada();			

		}).error( function (data){

			$scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
			$scope.tipoalerta = 'alert-warning';

		});
	}

	$scope.actualizaFlujo = function(indice){

		//seleccionamos el folio a mandar 
		var documentoEnv = $scope.selectos[indice];
		
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

///Folios rechazados
function rechazosCtrl( $scope, $rootScope, $routeParams, $location, $http, find, loading ){

	//Con parametros de inicio

	$scope.inicio = function(){

		$scope.tituloRC = "Documentos Rechazados";
		$scope.empresas();
		$scope.unidades();
		$scope.verareaoperativa();
		$scope.cargaRechazos();
		$scope.folio = '';
		$scope.mensaje = '';
		$scope.area = $routeParams.area;
	}


	//Carga la lista de archivos a enviar 
	$scope.cargaRechazos = function(){

		loading.cargando('Buscando Folios');

		find.listadorechazos($rootScope.id).success( function (data){
       
        	if(data.respuesta){
        		loading.mensaje(data.respuesta);
        		$scope.listadoRechazos = [];

        	}else{
        		$scope.listadoRechazos = data;
        	}

        	loading.despedida();
        	$scope.gridOptions.$gridScope.toggleSelectAll(false);
			
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
				if( (documento.Tipo.indexOf('O') == -1  && $scope.areaOp == 5) || ($scope.areaOp == 5 && documento.FLD_AROent == 5 && documento.USU_ent != 'null')||($scope.areaOp == 5 && documento.EnvFac == 'SI' && documento.Etapa == 1) ){
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

				if (i == $scope.selectos.length - 1) {

					$('#boton').button('reset');
					$scope.mensaje = 'Termino el Envio';
					$scope.cargaRechazos();

				};

			}catch(err){

				if(err != 1){
					alert(err);
				}
				
			}
		} //Termina for

		
		

	}

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

		console.log(datos);

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
                    
    $scope.gridOptions = { 
    	data: 'listadoRechazos', 
    	enableColumnResize:true,
    	enablePinning: true, 
    	enableRowSelection:true,
    	multiSelect:true,
    	selectedItems: $scope.selectos, 
    	filterOptions: $scope.filterOptions,
    	columnDefs: [
		            { field:'Folio', width: 120 },
		            { field:'UsuarioRechazo', width: 200 },
		            { field:'MotivoRechazo', width: 220 },
		            { field:'Etapa', width: 120 },
		            { field:'Cantidad', width: 100 },
		            { field:'Empresa', width: 120 },
		            { field:'Unidad', width: 200 },
		            { field:'Tipo', width: 120 },
		            { field:'FechaRecepcion', width: 130 },
		            { field:'DocRevision', width: 100 },
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

}

//Area de seguimiento
function seguimientoCtrl($scope, $rootScope, find , loading, $http){

	$scope.inicio = function(){

		$rootScope.area = 8;
		$scope.tituloR = "Seguimiento";
		$scope.push = false;
		$scope.rechazados = 0;
		$scope.recibidos = 0;

		$scope.empresas();
		$scope.Altaunidades();
		$scope.productos();
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

		 }).error( function (xhr,status,data){

			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

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

			 }).error( function (xhr,status,data){

				alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

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

		$('#boton').button('reset');
		$scope.mensaje = 'Termino el Envio';
		$scope.quitaselectos();
		$scope.cargaEntrada();

	}


	//caso de juego de facturacion
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

        	console.log($scope.recibidos);

		}).error( function (xhr,status,data){

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

    	console.log(filtro);

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
	
}

//generacion de tickets
function ticketCtrl($scope,$rootScope, $http, find){

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

	$scope.ValidaInfo = function(){

		if ($scope.bloqueado) {
			return true;
		}else{
			return $scope.formTicket.$invalid;
		}
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
        		$scope.datos.etapa = 1;

        		// find.listaticketsfolio($scope.datos.folioweb).success(function (data){

        		// 	if (data.length > 0 ) {

        		// 		$scope.datos.etapa = 2;
        		// 	}else{
        		// 		$scope.datos.etapa = 1;
        		// 	}
        		// });

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
	
}

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

}
 





