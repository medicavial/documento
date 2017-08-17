//Reportes
function reportesTicketsCtrl($scope, $rootScope, find , loading, datos){

	loading.despedida();

	$scope.actualClinicas = datos[0].data.clinicas;
	$scope.actualCategorias = datos[0].data.categorias;
	$scope.periodoClinicas = datos[1].data.clinicas;
	$scope.periodoCategorias = datos[1].data.categorias;

	var chartClinicaActual = AmCharts.makeChart("chartdiv-1",{
                "type": "serial",
                "startDuration": 1,
                "categoryField": "Unidad",
                "graphs": [
                    {
                        "balloonText": "[[category]]<br><b>Tickets: [[value]]</b>",
                        "type": "column",
                        "fillAlphas": 0.9,
                        "labelText": "[[value]] Tickets.",
                        "labelPosition":"top",
	                    "labelOffset":10,
	                    "labelColorField":"#1E1E1E",
	                    "fontSize":16,
	                    "color":"blue",
                        "lineAlpha": 0.2,
                        "valueField": "Cantidad"
                    }
                ],
                "dataProvider": $scope.actualClinicas
            });

	var chartCategoriaActual = AmCharts.makeChart("chartdiv-2",{
                "type": "serial",
                "startDuration": 1,
                "categoryField": "Categoria",
                "graphs": [
                    {
                        "balloonText": "[[category]]<br><b>Tickets: [[value]]</b>",
                        "type": "column",
                        "fillAlphas": 0.9,
                        "labelText": "[[value]] Tickets.",
                        "labelPosition":"top",
	                    "labelOffset":10,
	                    "labelColorField":"#1E1E1E",
	                    "fontSize":16,
	                    "color":"blue",
                        "lineAlpha": 0.2,
                        "valueField": "Cantidad"
                    }
                ],
                "dataProvider": $scope.actualCategorias
            });

	var chartClinicaHistorico = AmCharts.makeChart("chartdiv-3",{
                "type": "serial",
                "startDuration": 1,
                "categoryField": "Unidad",
                "graphs": [
                    {
                        "balloonText": "[[category]]<br><b>Tickets: [[value]]</b>",
                        "type": "column",
                        "fillAlphas": 0.9,
                        "labelText": "[[value]] Tickets.",
                        "labelPosition":"top",
	                    "labelOffset":10,
	                    "labelColorField":"#1E1E1E",
	                    "fontSize":16,
	                    "color":"blue",
                        "lineAlpha": 0.2,
                        "valueField": "Cantidad"
                    }
                ],
                "dataProvider": $scope.periodoClinicas
            });

	var chartCategoriaHistorico = AmCharts.makeChart("chartdiv-4",{
                "type": "serial",
                "startDuration": 1,
                "categoryField": "Categoria",
                "graphs": [
                    {
                        "balloonText": "[[category]]<br><b>Tickets: [[value]]</b>",
                        "type": "column",
                        "fillAlphas": 0.9,
                        "labelText": "[[value]] Tickets.",
                        "labelPosition":"top",
	                    "labelOffset":10,
	                    "labelColorField":"#1E1E1E",
	                    "fontSize":16,
	                    "color":"blue",
                        "lineAlpha": 0.2,
                        "valueField": "Cantidad"
                    }
                ],
                "dataProvider": $scope.periodoCategorias
            });

	$scope.inicio = function(){

		$scope.tituloR = "Reportes de tickets";
        $scope.fecha = FechaAct;

	}

    $scope.buscaxdia = function(){
        find.reporteTicketsDiaEspecifico($scope.fecha).success(function (data){
            // console.log(data);
            $scope.actualClinicas =  data.clinicas;
            $scope.actualCategorias =  data.categorias;

            chartClinicaActual.dataProvider = data.clinicas;
            chartClinicaActual.validateData();

            chartCategoriaActual.dataProvider = data.categorias;
            chartCategoriaActual.validateData();
        });
    }

};

function reporteFacturasCtrl($scope, $rootScope, find , loading){

    loading.despedida();

    $scope.inicio = function(){

        $scope.tituloR = "Reportes de tickets";
        $scope.datos = {
            fechaini:'',
            fechafin:''
        };

    }

    $scope.buscaFacturas = function(){

        loading.cargando('Buscando Factura(s)');

        find.reporteFacturas($scope.datos).success(function (data){
            $scope.listado = data;
            loading.despedida();
        })
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
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: false,
        selectedItems: $scope.selectos,
        filterOptions: $scope.filterOptions,
        columnDefs: [
                    { field:'Folio', displayName:'Folio' , width: 120, pinned:true, enableCellEdit: true , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'Cliente', displayName:'Empresa', width: 120 },
                    { field:'Unidad', displayName:'Unidad', width: 100, visible:true },
                    { field:'FFac', displayName:'Fecha Factura', width: 100 },
                    { field:'FFrormaRecep', displayName:'Fecha Recepcion', width: 200 },
                    { field:'FormaRecep', displayName:'FaxOrigianl', width: 120 },
                    { field:'Serie', displayName:'Serie', width: 100, visible:true },
                    { field:'FolioFac', displayName:'Factura', width: 120 },
                    { field:'Importe', displayName:'Importe', width: 130 },
                    { field:'IVA', displayName:'IVA', width: 100, visible:true },
                    { field:'Total', displayName:'Total', width: 100, visible:true },
                    { field:'Pagado', displayName:'Pagado', width: 100, visible:true },
                    { field:'TipoFac', displayName:'Tipo Factura', width: 100, visible:true },
                    { field:'Producto', displayName:'Producto', width: 100, visible:true },
                    { field:'Siniestro', displayName:'Siniestro', width: 100, visible:true },
                    { field:'Lesionado', displayName:'Lesionado', width: 100, visible:true },
                    { field:'Reporte', displayName:'Reporte', width: 100, visible:true },
                    { field:'Localidad', displayName:'Localidad', width: 320, enableCellEdit: true}
        ],
        showFooter: true,
        showFilter:true
    };

    $scope.exportar = function(){

        JSONToCSVConvertor($scope.listado,'Reporte',true);

    }

};

function pagoUnidadesCtrl($scope, $rootScope, find , loading){

    loading.despedida();

    $scope.inicio = function(){

        $scope.datos = {
            fechaini:FechaAct,
            fechafin:FechaAct,
            unidad:'',
            proveedor: ''
        };

    }

    $scope.buscaPagos = function(){


        if ($scope.datos.unidad) {
            loading.cargando('Buscando Factura(s)');

            find.pagoUnidades($scope.datos).success(function (data){
                console.log(data);
                $scope.listado = data;
                loading.despedida();
            });

        }else{
            alert('Debes Seleccionar Unidad');
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
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: false,
        selectedItems: $scope.selectos,
        filterOptions: $scope.filterOptions,
        columnDefs: [
                    { field:'Folio', displayName:'Folio' , width: 120, pinned:true, enableCellEdit: true , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'Cliente', displayName:'Empresa', width: 120 },
                    { field:'Etapa', displayName:'Etapa', width: 120 },
                    { field:'UniAtn', displayName:'Unidad Atencion', width: 200, visible:true },
                    { field:'UniPag', displayName:'Unidad Pago', width: 200 },
                    { field:'FAtn', displayName:'Fecha Atención', width: 200 },
                    { field:'FCap', displayName:'Fecha Captura', width: 130 },
                    { field:'FPago', displayName:'Fecha pago', width: 130, visible:true },
                    { field:'FRel', displayName:'Fecha Relación', width: 130 },
                    { field:'Fac', displayName:'Factura', width: 130 },
                    { field:'Lesionado', displayName:'Lesionado', width: 250, visible:true },
                    { field:'Pago', displayName:'Pago', width: 120, visible:true },
                    { field:'Producto', displayName:'Producto', width: 120, visible:true },
                    { field:'Triage', displayName:'Triage', width: 120, visible:true },
                    { field:'Relacion', displayName:'Relacion', width: 120, visible:true }
        ],
        showFooter: true,
        showFilter:true
    };

    $scope.exportar = function(){

        JSONToCSVConvertor($scope.listado,'Reporte',true);

    }

};

function listadoPagosCtrl($scope, $rootScope, find , loading){

    loading.despedida();

    $scope.inicio = function(){

        $scope.datos = {
            fechaini:FechaAct,
            fechafin:FechaAct,
            unidad: 0,
            proveedor: 0
        };

        $scope.Proveedores();

    }

    $scope.Proveedores = function(){

        find.proveedores().success( function (data){

            $scope.proveedores = data;
            
         });
    }

    $scope.buscaPagos = function(){
            loading.cargando('Buscando Factura(s)');
						console.log($scope.datos);
            find.listadoPagos($scope.datos).success(function (data){
                console.log(data);
                $scope.listado = data;
                loading.despedida();
            });
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
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: false,
        selectedItems: $scope.selectos,
        filterOptions: $scope.filterOptions,
        columnDefs: [
								{ field:'PAS_folio', displayName:'Folio' , width: 120, pinned:true, enableCellEdit: true , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
								{ field:'UNI_nombrecorto', displayName:'Empresa', width: 120 },
                                { field:'proveedor', displayName:'Proveedor', width: 120 },
								{ field:'etapa', displayName:'Etapa', width: 120 },
								{ field:'EXP_pagadoET1', displayName:'Pagado', width: 200, visible:true },
								{ field:'EXP_pagadoFactET1', displayName:'Pagado Fac', width: 200 },
								{ field:'EXP_pagadofechaET1', displayName:'Pagado Fecha', width: 200 },
								{ field:'EXP_PagadoRelacionET1', displayName:'Pagado Relación', width: 130 },
								{ field:'EXP_PagadoFechaRelacionET1', displayName:'Pagado Fecha Relación', width: 130, visible:true },
								{ field:'Transf', displayName:'Transferencia', width: 130, visible:true }
        ],
        showFooter: true,
        showFilter:true
    };

    $scope.exportar = function(){

        JSONToCSVConvertor($scope.listado,'Reporte',true);

    }

    $scope.filtra = function(valor){
        if(valor==1){
            $scope.datos.proveedor='';          
        }if(valor==2){
            $scope.datos.unidad='';
        }


        // if($scope.datos.unidad == undefined || $scope.datos.unidad == 0){
        //     var objeto1 = "";
        // }else{
        //     var objeto1 = "UNI_nombrecorto:" + $scope.datos.unidad + "; ";
            
        // }

        // if($scope.datos.proveedor == undefined || $scope.datos.proveedor == 0){
        //     var objeto2 = "";
        // }else{
        //     var objeto2 = "proveedor:" + $scope.datos.proveedor + "; ";
            
        // }
        
        // var filtro = objeto1 + objeto2;

        
        // $scope.filterOptions.filterText = filtro;

    }

};

function listadoSinDocumentacionCtrl($scope, $rootScope, find , loading){

    loading.despedida();

    $scope.inicio = function(){

        $scope.datos = {
            fechaini:'',
            fechafin:'',
            unidad: '',
            tipoUnidad:''           
        };
        $scope.tipoUnidad='';
        find.unidades().success( function (data){
            $scope.unidades = data;            
        });
      
    }

    $scope.generaListadoSD = function(){
        loading.cargando('Buscando Factura(s)');                        
        find.listadoSinDocumentacion($scope.datos).success(function (data){
            console.log(data);
            $scope.listado = data;
            loading.despedida();
        });
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
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: false,
        selectedItems: $scope.selectos,
        filterOptions: $scope.filterOptions,
        columnDefs: [
                { field:'CLINombre', displayName:'Empresa' , width: 120, pinned:true, enableCellEdit: true , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                { field:'UNINombre', displayName:'Unidad', width: 120 },
                { field:'TipoUnidad', displayName:'Tipo Unidad', width: 120 },
                { field:'Folio', displayName:'Folio', width: 120 },
                { field:'Nombre', displayName:'Nombre', width: 200, visible:true },
                { field:'FAtencion', displayName:'Fecha Atención', width: 200 },
                { field:'Poliza', displayName:'Poliza', width: 200 },
                { field:'Siniestro', displayName:'Siniestro', width: 130 },
                { field:'Reporte', displayName:'Reporte', width: 130, visible:true },
                { field:'RegCia', displayName:'Registro Compañia', width: 130, visible:true },
                { field:'FNac', displayName:'Fecha de Nacimiento', width: 130, visible:true },
                { field:'Edad', displayName:'Edad', width: 130, visible:true },
                { field:'Meses', displayName:'Meses', width: 130, visible:true },
                { field:'Sexo', displayName:'Sexo', width: 130, visible:true },
                { field:'Riesgo', displayName:'Riesgo', width: 130, visible:true },
                { field:'Localidad', displayName:'Localidad', width: 130, visible:true },
                { field:'Estado', displayName:'Estado', width: 130, visible:true },
                { field:'Periodo', displayName:'Periodo', width: 130, visible:true }
        ],
        showFooter: true,
        showFilter:true
    };

    $scope.exportar = function(){

        JSONToCSVConvertor($scope.listado,'Reporte',true);

    }

    $scope.filtra = function(){

        if($scope.tipoUnidad == undefined || $scope.tipoUnidad == 0){
            var objeto1 = "";
        }else{
            var objeto1 = "TipoUnidad:" + $scope.tipo + "; ";
            
        }

        // if($scope.datos.proveedor == undefined || $scope.datos.proveedor == 0){
        //     var objeto2 = "";
        // }else{
        //     var objeto2 = "proveedor:" + $scope.datos.proveedor + "; ";
            
        // }
        
        var filtro = objeto1;

        
        $scope.filterOptions.filterText = filtro;

    }

};

function listadoCedulasSinCapturarCtrl($scope, $rootScope, find , loading){

   

    $scope.inicio = function(){

        $scope.datos = {
            fechaini:'',
            fechafin:'',
            unidad: '',
            tipoUnidad:''           
        };
        $scope.tipoUnidad='';
        find.cedulasSinCaptura().success( function (data){
            $scope.listado = data;    
            console.log(data);        
            loading.despedida();
        });

      
    }

    // $scope.generaListadoSD = function(){
    //     loading.cargando('Buscando Factura(s)');                        
    //     find.listadoSinDocumentacion($scope.datos).success(function (data){
    //         console.log(data);
    //         $scope.listado = data;
    //         loading.despedida();
    //     });
    // }

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
        enableRowSelection:false,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: false,
        selectedItems: $scope.selectos,
        filterOptions: $scope.filterOptions,
        columnDefs: [
                { field:'Folio_Autorizacion', displayName:'Folio de Autorizacion' , width: 140, pinned:true, enableCellEdit: true , cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                { field:'Nombre', displayName:'Nombre', width: 270 },
                { field:'Poliza', displayName:'Poliza', width: 120 },
                { field:'Siniestro', displayName:'Siniestro', width: 120 },
                { field:'Reporte', displayName:'Reporte', width: 120, visible:true },
                { field:'Folio_Electronico', displayName:'Folio Electronico', width: 140 },
                { field:'Fecha', displayName:'Fecha', width: 200 },
                
        ],
        showFooter: true,
        showFilter:true
    };

    $scope.exportar = function(){
        loading.cargando('Cargando');       
        find.cedulasSinCapturaExcel().success( function (data){            
            loading.despedida();
        });

    }

    $scope.filtra = function(){

        if($scope.tipoUnidad == undefined || $scope.tipoUnidad == 0){
            var objeto1 = "";
        }else{
            var objeto1 = "TipoUnidad:" + $scope.tipo + "; ";
            
        }

        // if($scope.datos.proveedor == undefined || $scope.datos.proveedor == 0){
        //     var objeto2 = "";
        // }else{
        //     var objeto2 = "proveedor:" + $scope.datos.proveedor + "; ";
            
        // }
        
        var filtro = objeto1;

        
        $scope.filterOptions.filterText = filtro;

    }

};

reportesTicketsCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading', 'datos'];
reporteFacturasCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading'];
pagoUnidadesCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading'];
listadoPagosCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading'];
listadoSinDocumentacionCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading'];
listadoCedulasSinCapturarCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading'];


app.controller('reportesTicketsCtrl',reportesTicketsCtrl);
app.controller('reporteFacturasCtrl',reporteFacturasCtrl);
app.controller('pagoUnidadesCtrl',pagoUnidadesCtrl);
app.controller('listadoPagosCtrl',listadoPagosCtrl);
app.controller('listadoSinDocumentacionCtrl',listadoSinDocumentacionCtrl);
app.controller('listadoCedulasSinCapturarCtrl',listadoCedulasSinCapturarCtrl);
