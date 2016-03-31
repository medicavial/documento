//Area de facturacion
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

reportesTicketsCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading', 'datos'];
reporteFacturasCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading'];



app.controller('reportesTicketsCtrl',reportesTicketsCtrl);
app.controller('reporteFacturasCtrl',reporteFacturasCtrl);