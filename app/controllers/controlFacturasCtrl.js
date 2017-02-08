/// Facturas qualitas
function controlFacturasCtrl($scope, $rootScope,$http, find, loading,api , FacturaUnidades, $location,leexml){

	$scope.inicio = function(){

        $scope.datos = {

            fechaini: FechaAct,
            fechafin: FechaAct
        }

		$scope.tituloFQ = "Factura x Atención";
		$scope.datos.fechaini = FechaAct;
		$scope.datos.fechafin = FechaAct;
		$scope.listado = [];
        $scope.Altaunidades();
        $scope.listadofacturas();


		$('#modalEx').on('hidden.bs.modal', function (e){
			$scope.gridOptions.$gridScope.toggleSelectAll(false);
		 	// $scope.buscafacturas();
		});
	}

    $scope.borratemporales = function(){

      FacturaUnidades.borratemporales().success(function (data){

      });

    }

    $scope.listadofacturasxfecha = function(){

        loading.cargando('Buscando Folios(s)');

        FacturaUnidades.listadofacturasxfecha($scope.datos).then(function (data){ 
            if(data){

                $scope.listado = data.data;
                $scope.cantidad = data.length -1;

            }else{
                $scope.listado = [];
            }       
            loading.despedida();
        });
    }

    $scope.listadofacturas = function(){

        loading.cargando('Buscando Folios(s)');

        FacturaUnidades.listadofacturas().then(function (data){ 
            if(data){

                $scope.listado = data.data;
                $scope.cantidad = data.length -1;

            }else{
                $scope.listado = [];
            }       
            loading.despedida();
        });
    }

	//muestra facturas sin procesar
	$scope.buscafacturas = function(){

		loading.cargando('Buscando Folios(s)');
		//armamos los datos a enviar segun tipo de consulta (tipo)
		$scope.datos = {fechaini:$scope.fechaini,fechafin:$scope.fechafin};

		FacturaUnidades.buscaFolios($scope.datos).then(function (data){	
			if(data){
                console.log(data);

        		$scope.listado = data.data;
        		$scope.cantidad = data.length -1;

        	}else{
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

    var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

    $scope.onDblClickRow = function(row){

      $scope.dfolios = [];

      $scope.dfolios = row.entity.Folio;
      $location.path('/detalleAtencion/'+row.entity.Folio);
      console.log(row.entity);



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
        enableCellEdit: false,
        rowTemplate: rowTempl,
        columnDefs: [
                    { field:'revisado',displayName:'Revisado', width: 120, pinned: true,  cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.bitrevisado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.bitrevisado ==  \'1\'" class="glyphicon glyphicon-tags"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'Unidad',displayName:'Proveedor', width: 120, pinned: true},
                    { field:'Folio', displayName:'Folio' , width: 120 , pinned: true},
                    { field:'Lesionado', width: 330, pinned: true },
                    { field:'Producto', width: 120 },
                    { field:'Cliente', width: 100 },
                    { field:'fechaReg', width: 120,  cellFilter: 'date:\'dd/MM/yyyy\'' },
                    { field:'tiporecepcion', width: 120 },
        ],
        showFooter: true,
        showFilter:false,
    }

$scope.listadoFact = function(){

    loading.cargando('Cargando Folios(s)');
    $scope.datos = '';

    FacturaUnidades.buscalistado($scope.datos).success(function (data){
        if(data){

            $scope.listado = data;
        }else{
            $scope.listado = [];
        }       
        loading.despedida();
    });
}

$scope.enviaFolios = function(){

    $('#boton').button('loading');

        var areaRecibe = 6;
        var areaEntrega = 6;
        var usuarioRecibe = 78;

        var ruta = api+'FacturaUnidades/actualiza';  
        var ruta2 = api+'FacturaUnidades/ordenPago';  
        var folios=[];
        var fol;
        var archivo =[]; 
        var i;

        $scope.xml = {

            total: '',
            foliofiscal: '',
            fechaemision:'',
            descuento: '',
            emisor:'',
            usuarioentrega:'',
            areaentrega:'',
            usuariorecibe:'',
            arearecibe:'',
            serie: '',
            foliointerno: ''

        }

    if ($scope.selectedRows.length > 0){

        for (a = 0; a < $scope.selectedRows.length; a++){

            FacturaUnidades.enviaFolios({folio: $scope.selectedRows[a].Folio}, $rootScope.userWeb).success(function (data){

                leexml.getxmlFE(data.Nombre).success(function(datos){
                courses  = x2js.xml_str2json(datos);

                console.log(courses);


                $scope.xml.serie = courses.Comprobante._serie;
                $scope.xml.foliointerno = courses.Comprobante._folio;
                $scope.xml.subtotal = courses.Comprobante._subtotal;
                $scope.xml.total = courses.Comprobante._total;
                $scope.xml.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                $scope.xml.fechaemision = courses.Comprobante._fecha;
                $scope.xml.descuento = courses.Comprobante._descuento;
                $scope.xml.emisor = courses.Comprobante.Emisor._nombre;
                $scope.xml.rfc_emisor = courses.Comprobante.Emisor._rfc;
                $scope.xml.usuarioentrega = Number($rootScope.id);
                $scope.xml.areaentrega =Number(areaEntrega);
                $scope.xml.usuariorecibe =Number(usuarioRecibe);
                $scope.xml.arearecibe =Number(areaRecibe);
                $scope.xml.folio = data.Folios;
                $scope.xml.tipoorden = 1;

                console.log($scope.xml);

                $http.post(ruta,$scope.xml).success(function (data){

                }).error( function (data){

                    alert('Error, Intentalo de Nuevo');

                }); 

                $http.post(ruta2,$scope.xml).success(function (data){

                        // $scope.listadoFact();
                        $scope.borratemporales();
                        swal("ok","Tus folios se enviaron","success");

                        // $scope.listadofacturas();

                    }).error( function (data){

                        alert('Error, Intentalo de Nuevo');

                    }); 

                                 
           });
        });
        }


    }else{

        alert('No se generó ninguna entrega');

    }
    
}

$scope.Altaunidades = function(){

    FacturaUnidades.unidades().success( function (data) {
        $scope.unidades = data;
        
     });
}

$scope.buscaxUnidad = function(id){

    loading.cargando('Buscando Folios');
    FacturaUnidades.buscaxUnidad(id).success(function (data){

        if(data){
            console.log(data);

            
            $scope.listado = data;
            // $scope.norelacion.referencia = data[0].referencia;

        }else{

            loading.despedida();
            $scope.listado = [];
            // $scope.norelacion.referencia = '';
        }

        if ($scope.listado.length == 0 ) {

            $scope.activaboton = false;

        }else{
            $scope.activaboton = true;
        }

        loading.despedida();

    });

}

// $scope.filterOptions = {
// filterText: ''
// };

// $scope.gridOptions = {
// data: 'listado',
// filterOptions: $scope.filterOptions
// };

$scope.filtrarx = function() {

var filterText = 'revisado:' + $scope.estatus;
if (filterText !== 'revisado:') {
  $scope.filterOptions.filterText = filterText;
} else {
  $scope.filterOptions.filterText = '';
}

}

$scope.tipoxOrden = function(){

    FacturaUnidades.tipoxOrden().success( function (data) {
        $scope.ordenes = data;
        
     });
}

};

controlFacturasCtrl.$inject = ['$scope', '$rootScope','$http', 'find', 'loading', 'api', 'FacturaUnidades', '$location','leexml'];
app.controller('controlFacturasCtrl',controlFacturasCtrl);
