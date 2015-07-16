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

reportesTicketsCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading', 'datos'];

app.controller('reportesTicketsCtrl',reportesTicketsCtrl);