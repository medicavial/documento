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
            Original:'',
            Etapa:'',
            PRO_nombre:'',
            Situacion:''
        };

        $('#myModal10').on('hidden.bs.modal', function (e) {
            $scope.foliosxfecha();
        });
        
	}

    $scope.muestraOriginal = function(){
        $('#myModal10').modal();
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

    	if($scope.folio == undefined  || $scope.folio.length == 0){
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
            Original:'',
            Etapa:'',
            PRO_nombre:'',
            Situacion:''
        };
    
    }


    $scope.exporta = function(){


        $scope.selectos = $filter('filter')($scope.listado, $scope.filtrado);
        // reportes.descargar($scope.selectos);
        // console.log($scope.selectos);
        JSONToCSVConvertor($scope.selectos,'Reporte',true);
        
    }

};

controlDocumentosCtrl.$inject = ['$scope', '$http', 'loading', 'find', 'api', '$filter', 'reportes'];

app.controller('controlDocumentosCtrl',controlDocumentosCtrl);