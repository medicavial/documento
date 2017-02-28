
function pagosCtrl($scope, $rootScope, find , loading,datos,$filter,$location,$http,checkFolios){

    // console.log(datos);
    loading.despedida();

    $scope.recibidos = datos.recepcion;
    datos.activos.success(function (data){
        $scope.listado = data;
        $scope.cantidad = data.length -1;
    });

    $scope.inicio = function(){

        $rootScope.area = 6;
        $scope.tituloR = "Pagos";
        $scope.push = false;
        $scope.factglobal = [];

        $scope.datosPagos = {

            fechainiPag : primerdiames,
            fechafinPag : FechaAct,
            unidad:'',
            empresa:'',
            folio:''
        }

        $scope.datosRecepcion = {

            fechainiRec : FechaAct,
            fechafinRec : FechaAct,
            unidad:'',
            empresa:'',
            folio:''
        }

        $scope.folio = '';
        $scope.lesionado = '';
        $scope.relacion = '';
        $scope.cargar = false;
        $scope.buscarXfecha = 0;

        $scope.empresas();
        $scope.Altaunidades();
        $scope.productos();

        $scope.filtrado = {
            Unidad : '',
            Cliente : '',
            Etapa:'',
            Folio  :''
            // Lesionado  :'',
            // Producto:'',
            // Relacion:'',
            // RelP:'',
            // Cobrado:'', 
            // Pagado:''
        };



    }

    ///Busquedas 

    //busca clientes
    $scope.empresas = function(){

        find.empresas().success( function (data){

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

    $scope.recepcionPagos = function(){

        loading.cargando('Buscando Folio');
        find.listaPagos($scope.datosPagos).success(function (data){

            if(data){

                $scope.listado = data;
                $scope.cantidad = data.length -1;


            }else{

                loading.despedida();
                $scope.listado = [];
                
            }

            loading.despedida();

        });

    }


    $scope.recepcionRec = function(){

        loading.cargando('Buscando Folio');
        find.listaPagosRecepcion($scope.datosRecepcion).success(function (data){

            if(data){

                $scope.listado = data;
                $scope.cantidad = data.length -1;


            }else{

                loading.despedida();
                $scope.listado = [];
                
            }

            loading.despedida();

        });

    }
    //////LLena el grid y toma filtros

    ///filtros
    $scope.selectos = [];
    $scope.selectedRows = [];

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
        allChecked = true;

        angular.forEach(filas , function(item){
            $scope.exportables.push(item.entity);
        });

        // if (!$scope.gridOptions.$gridScope.checker)
        // $scope.gridOptions.$gridScope.checker = {};

        // $scope.gridOptions.$gridScope.checker.checked = allChecked;

    });

    $scope.filtra = function(){

        if($scope.unidad == undefined || $scope.unidad == 0){
            var objeto1 = "";
            $scope.filtrado.Unidad = '';
        }else{
            var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
            $scope.filtrado.Unidad = $scope.unidad.nombre;
            
        }

        if($scope.cliente == undefined || $scope.cliente == 0){
            var objeto2 = "";
            $scope.filtrado.Cliente = '';
        }else{
            var objeto2 = "Cliente:" + $scope.cliente.nombre + "; ";
            $scope.filtrado.Cliente = $scope.cliente.nombre;
        }

        if($scope.tipo == 'fax'){
            var objeto3 = "FormaRecep:F; ";
            // $scope.filtrado.FormaRecep = 'F';
        }else if($scope.tipo == 'original'){
            var objeto3 = "FormaRecep:O; ";
            // $scope.filtrado.FormaRecep = 'O';
        }else{
            var objeto3 = "";
            // $scope.filtrado.FormaRecep = '';
        }


        if($scope.folio.length == 0){
            var objeto4 = "";
            $scope.filtrado.Folio = '';  
        }else{
            var objeto4 = "Folio:" + $scope.folio + "; "; 
            $scope.filtrado.Folio = $scope.folio;  
        }

        if($scope.lesionado.length == 0){
            var objeto5 = "";
            // $scope.filtrado.Lesionado = '';
        }else{
            var objeto5 = "Lesionado:" + $scope.lesionado + "; "; 
            // $scope.filtrado.Lesionado = $scope.lesionado;  
        }

        if($scope.producto == undefined || $scope.producto == 0){
            var objeto6 = "";
            // $scope.filtrado.Producto = '';  
        }else{
            var objeto6 = "Producto:" + $scope.producto.nombre + "; ";
            // $scope.filtrado.Producto = $scope.producto.nombre;  
            
        }

        if($scope.etapa == undefined || $scope.etapa == 0){
            var objeto7 = "";
            $scope.filtrado.Etapa = '';
        }else{
            var objeto7 = "Etapa:" + $scope.etapa + "; ";
            $scope.filtrado.Etapa = $scope.etapa;
        }

        if($scope.relacion.length == 0){
            var objeto8 = "";
            // $scope.filtrado.Relacion = '';
        }else{
            var objeto8 = "Relacion:" + $scope.relacion + "; "; 
            // $scope.filtrado.Relacion = $scope.relacion;
        }

        if ($scope.relacionado) {
            var objeto9 = "RelP:X ; ";  
            // $scope.filtrado.RelP ='X';
        }else{
            var objeto9 = "";
            // $scope.filtrado.RelP = '';
        }

        if ($scope.cobrado) {
            var objeto10 = "Cobrado:1 ; "; 
            // $scope.filtrado.Cobrado = '1'; 
        }else{
            var objeto10 = "";
            // $scope.filtrado.Cobrado = '';
        }

        if ($scope.pagado) {
            var objeto11 = "Pagado:1 ; "; 
            // $scope.filtrado.Pagado = '1';  
        }else{
            var objeto11 = "";
            // $scope.filtrado.Pagado = '';
        }
        var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6 + objeto7 + objeto8 + objeto9 + objeto10 + objeto11;

        
        
        $scope.filterOptions.filterText = filtro;

        // console.log(filtro);

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
        $scope.fechainiPag = '';
        $scope.fechafinPag = '';
        $scope.fechainiRec = '';
        $scope.fechainiRec = '';

        $scope.filtrado = {
            Unidad : '',
            Cliente : '',
            Etapa:''
            // FormaRecep : '',
            // Folio  :'',
            // Lesionado  :'',
            // Producto:'',
            // Relacion:'',
            // RelP:'',
            // Cobrado:'', 
            // Pagado:''
        };

        // console.log($scope.buscarXfecha);

        if ($scope.buscarXfecha == 1){

            $scope.buscarXfecha = 0;
            $scope.foliosxarea();
        };
        
    
    }


    $scope.exporta = function(){

        $scope.selectos = $filter('filter')($scope.listado, $scope.filtrado);
        JSONToCSVConvertor($scope.selectos,'Reporte',true);        
    }

    $scope.global = function(success){

        $scope.factglobal = [];

        for (var i = 0; i < $scope.selectedRows.length; i++){

             $scope.factglobal.push($scope.selectedRows[i]);
             
        };
        checkFolios.globales($scope.factglobal).success(function (data){

        }).error(function (data){
            $scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
            $scope.tipoalerta = 'alert-error';
            $('#boton').button('reset');    
        });

        // if ($scope.selectedRows.length > 0) {

        //     checkFolios.aceptaEntrega($scope.selectedRows)
        //     .success(function (data){

        //         console.log(data);

        //     })
        //     .error(function (data){
        //         $scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
        //         $scope.tipoalerta = 'alert-error';
        //         $('#boton').button('reset');    
        //     });
            
        // };
         
    }

};

//flujo de pagos general
// function flujoPagosCtrl($scope,$rootScope, find,loading, $http, api,datos,$filter){

//     // console.log(datos);
//     // $scope.listado = datos.data;
//     // $scope.cantidad = datos.data.length -1;
//     loading.despedida();
    
//     datos.activos.success(function (data){
//         $scope.listado = data;
//         $scope.cantidad = data.length -1;
//     });

// 	$scope.inicio = function(){

// 		$rootScope.area = 6;
// 		$scope.tituloFP = "Flujo de Pagos";

// 		$scope.fechainiPag = primerdiames;
//     	$scope.fechafinPag = FechaAct;
//     	$scope.fechainiRec = FechaAct;
//     	$scope.fechafinRec = FechaAct;
// 		$scope.folio = '';
// 		$scope.lesionado = '';
// 		$scope.relacion = '';
// 		$scope.cargar = false;
// 		$scope.buscarXfecha = 0;

// 		$scope.empresas();
// 		$scope.Altaunidades();
// 		$scope.productos();


//         $scope.filtrado = {
//             unidad  : 0,
//             cliente :  0,
//             tipo :  0,
//             folio  : '',
//             fechaini  : '',
//             fechafin  : '',
//             lesionado  : '',
//             lesionado  : '',
//             fechainiPag  : '',
//             fechafinPag  : '',
//             fechainiRec  : '',
//             fechainiRec  : ''
//         };


// 	}

// 	//Busqueda de folios x area
// 	// $scope.foliosxarea = function(){

// 	// 	$('#busca2').button('loading');
// 	// 	// loading.cargando('Buscando Folio');

// 	// 	find.listadopagos().success( function (data){
        	
//  //        	if(data.respuesta){

//  //        		$('#busca2').button('reset');
//  //        		loading.mensaje(data.respuesta);
//  //        		loading.despedida();
//  //        		$scope.listado = [];

//  //        	}else{

//  //        		$('#busca2').button('reset');
//  //        		$scope.listado = data;
//  //        		$scope.cantidad = data.length -1;
        		
        	
//  //        	}
			
// 	// 		//console.log(data);
// 	// 	}).error( function (xhr,status,data){

// 	// 		loading.despedida();
// 	// 		$('#busca2').button('reset');
// 	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

// 	// 	});

// 	// }


// 	// $scope.foliosXfecha = function(tipo){

// 	// 	loading.cargando('Buscando Folio');
// 	// 	//valida el campo de fecha en caso de que alguno este lleno y el otro no

// 	// 	if (tipo == 'Pagos') {

// 	// 		fechaini = $scope.fechainiPag;
// 	// 		fechafin = $scope.fechafinPag;

// 	// 		var url = api + "flujopagos/fecharecepcion";

// 	// 	}else{

// 	// 		fechaini = $scope.fechainiRec;
// 	// 		fechafin = $scope.fechafinRec;

// 	// 		var url = api + "flujopagos/fechapagos";

// 	// 	};

// 	// 	//armamos los datos a enviar segun tipo de consulta (tipo)
// 	// 	$scope.datos = {fechaini:fechaini,fechafin:fechafin};
// 	// 	console.log($scope.datos);

// 	// 	$http.post(url,$scope.datos).success( function (data){
			  
// 	// 		if(data){
//  //        		$scope.listado = data;
//  //        		$scope.cantidad = data.length -1;
//  //        		$scope.buscarXfecha = 1;
//  //        	}else{ 
//  //        		$scope.listado = [];
//  //        	}
    		
//  //    		loading.despedida();
			
// 	// 	});

// 	// }


// 	///Busquedas 

// 	//busca clientes
// 	// $scope.empresas = function(){

// 	// 	find.empresas().success( function (data) {

// 	// 		$scope.clientes = data;

// 	// 	 }).error( function (xhr,status,data){

// 	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

// 	// 	 });

// 	// }

// 	// //busca productos
// 	// $scope.productos = function(){

// 	// 	find.productos().success( function (data) {

// 	// 		$scope.productosini = data;

// 	// 	 }).error( function (xhr,status,data){

// 	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

// 	// 	 });

// 	// }


// 	// //busca unidades
// 	// $scope.Altaunidades = function(){

// 	// 	find.unidades().success( function (data) {

// 	// 		$scope.unidades = data;

// 	// 	 }).error( function (xhr,status,data){

// 	// 		alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

// 	// 	 });

// 	// }

// 	//////LLena el grid y toma filtros

// 	///filtros
// 	$scope.selectos = [];

// 	$scope.filterOptions = {
// 	    filterText: '',
// 	    useExternalFilter: false
// 	};

// 	var csvOpts = { columnOverrides: { obj: function (o) {
// 	    return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
// 	    } },
// 	    iEUrl: 'downloads/download_as_csv'
// 	};

//     ////opciones del grid                 
//     $scope.gridOptions = { 
//     	data: 'listado', 
//     	enableColumnResize:true,
//     	enablePinning: true, 
//     	enableRowSelection:true,
//     	multiSelect:false,
//     	selectedItems: $scope.selectos, 
//     	filterOptions: $scope.filterOptions,
//     	enableCellEdit: true,
//     	columnDefs: [
//                     { field:'USUNombre', width: 120, pinned: true},
//                     { field:'Producto', width: 120 },
//                     { field:'Triage', width: 120 },
//                     { field:'Cliente', width: 100 },
//                     { field:'Unidad', width: 220 },
//                     { field:'Folio', width: 120, pinned: false},
//                     { field:'Lesionado', width: 330 },
//                     { field:'Etapa', width: 120 },
//                     { field:'Entrega', width: 80 },
//                     { field:'FAtencion', width: 120},
//                     { field:'FormaRecep', width: 90 },
//                     { field:'fechaRecepcion', width: 120},
//                     { field:'FechaRecepPag', width: 120,  cellFilter: 'date:\'dd/MM/yyyy\'' },
//                     { field:'Tipo', width: 120 },
//                     { field:'Lesion', width: 120 },
//                     { field:'Relacion', width: 120 },
//                     { field:'FRelacion', displayName:'F.relacion', width: 120 },
//                     { field:'FRelPago', displayName:'F.Pago.Rel.', width: 120 },
//                     { field:'FRelPagoReg', displayName:'F.Pago.Rel.Reg.', width: 120 },
//                     { field:'PasC', width: 120 },
//                     { field:'FPasCobrado', width: 120 },
//                     { field:'Pago', width: 120 },
//                     { field:'Reserva', width: 120 },
//                     { field:'FacturaRelacion', width: 80 },
//                     { field:'FacDoc', width: 80 }
//         ],
//         showFooter: true,
//         showFilter:false
//     };

//     $scope.filtra = function(){


//     	if($scope.unidad == undefined || $scope.unidad == 0){
//     		var objeto1 = "";
//             $scope.filtrado.Unidad = '';
//     	}else{
//     		var objeto1 = "Unidad:" + $scope.unidad.nombre + "; ";
//     		$scope.filtrado.Unidad = $scope.unidad.nombre;
//     	}
//     	if($scope.cliente == undefined || $scope.cliente == 0){
//     		var objeto2 = "";
//             $scope.filtrado.Cliente = '';
//     	}else{
//     		var objeto2 = "Cliente:" + $scope.cliente.nombre + "; ";
//             $scope.filtrado.Cliente = $scope.cliente.nombre;
//     	}

//     	if($scope.tipo == 'fax'){
//     		var objeto3 = "FormaRecep:F; ";
//             $scope.filtrado.Fax = 'x';
//     	}else if($scope.tipo == 'original'){
//     		var objeto3 = "FormaRecep:O; ";
//             $scope.filtrado.Original = 'x';
//     	}else{
//     		var objeto3 = "";
//             $scope.filtrado.Original = '';
//     	}

//     	if($scope.folio.length == 0){
//     		var objeto4 = "";
//     	}else{
//     		var objeto4 = "Folio:" + $scope.folio + "; ";	
//     	}

//     	if($scope.lesionado.length == 0){
//     		var objeto5 = "";
//     	}else{
//     		var objeto5 = "Lesionado:" + $scope.lesionado + "; ";	
//     	}

//     	if($scope.producto == undefined || $scope.producto == 0){
//     		var objeto6 = "";
//     	}else{
//     		var objeto6 = "Producto:" + $scope.producto.nombre + "; ";
    		
//     	}

//     	if($scope.etapa == undefined || $scope.etapa == 0){
//     		var objeto7 = "";
//     	}else{
//     		var objeto7 = "Etapa:" + $scope.etapa + "; ";
    		
//     	}

//     	if($scope.relacion.length == 0){
//     		var objeto8 = "";
//     	}else{
//     		var objeto8 = "Relacion:" + $scope.relacion + "; ";	
//     	}

//     	if ($scope.relacionado) {
//     		var objeto9 = "RelP:X ; ";	
//     	}else{
//     		var objeto9 = "";
//     	}

//     	if ($scope.cobrado) {
//     		var objeto10 = "Cobrado:1 ; ";	
//     	}else{
//     		var objeto10 = "";
//     	}

//     	if ($scope.pagado) {
//     		var objeto11 = "Pagado:1 ; ";	
//     	}else{
//     		var objeto11 = "";
//     	}


//     	var filtro = objeto1 + objeto2 + objeto3 + objeto4 + objeto5 + objeto6 + objeto7 + objeto8 + objeto9 + objeto10 + objeto11;

//     	$scope.filterOptions.filterText = filtro;

//     	// console.log(filtro);

//     }

//     $scope.quitafiltro = function(){

//     	$scope.filterOptions.filterText = ''; 
//     	$scope.unidad = 0; 
//     	$scope.cliente = 0;
//     	$scope.tipo = 0;
//     	$scope.folio = '';
//     	$scope.fechaini = '';
//     	$scope.fechafin = '';
//     	$scope.lesionado = '';
//     	$scope.lesionado = '';
//     	$scope.fechainiPag = '';
//     	$scope.fechafinPag = '';
//     	$scope.fechainiRec = '';
//     	$scope.fechainiRec = '';

//     	// console.log($scope.buscarXfecha);

//     	if ($scope.buscarXfecha == 1) {

//     		$scope.buscarXfecha = 0;
//     		$scope.foliosxarea();
//     	};
    	
    
//     }

// };


pagosCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading','datos','$filter','$location','$http','checkFolios'];
// flujoPagosCtrl.$inject = ['$scope','$rootScope', 'find','loading', '$http', 'api','datos','$filter'];

app.controller('pagosCtrl',pagosCtrl);
// app.controller('flujoPagosCtrl',flujoPagosCtrl);
