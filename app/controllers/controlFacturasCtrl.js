/// Facturas qualitas
function controlFacturasCtrl($scope, $rootScope,$http, find, loading,api , FacturaUnidades, $location,leexml,DetalleFacturas){

	$scope.inicio = function(){
        $scope.datos = {

            fechaini: FechaAct,
            fechafin: FechaAct,
            observacion: ''
        }

		$scope.tituloFQ = "Factura x Atención";
		$scope.datos.fechaini = FechaAct;
		$scope.datos.fechafin = FechaAct;
		$scope.listado = [];
        $scope.Altaunidades();
        // $scope.listadofacturas();

		// $('#modalEx').on('hidden.bs.modal', function (e){
		// 	$scope.gridOptions.$gridScope.toggleSelectAll(false);
		//  	// $scope.buscafacturas();
		// });
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

        var areaRecibe = $rootScope.area;
        var areaEntrega = $rootScope.area;
        var usuarioRecibe = $rootScope.id;

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
            descuento: 0.00,
            emisor:'',
            usuarioentrega: $rootScope.id,
            areaentrega: areaEntrega,
            usuariorecibe: $rootScope.id,
            arearecibe: areaRecibe,
            serie: '',
            foliointerno: '',
            subtotal: '',
            impuesto: '',
            tasa: 0.00,
            descuento: ''

        }

    if ($scope.selectedRows.length > 0){

        for (a = 0; a < $scope.selectedRows.length; a++){

            FacturaUnidades.enviaFolios({folio: $scope.selectedRows[a].Folio}, $rootScope.userWeb).success(function (data){

                leexml.getxmlFE(data.Nombre,$rootScope.user).success(function(datos){
                courses  = x2js.xml_str2json(datos);

                console.log(courses);

                $scope.xml.serie = courses.Comprobante._serie;
                $scope.xml.foliointerno = courses.Comprobante._folio;

                /////  particionar 2 decimales de xml 
                // $scope.xml.subtotal = courses.Comprobante._subTotal;

                var subglobal = courses.Comprobante._subTotal;
                var subglobal1 = parseFloat(subglobal);
                var subglobal2 = subglobal1.toFixed(2);
                $scope.xml.subtotal = subglobal2;

                var totalglobal = courses.Comprobante._total;
                var totalglobal1 = parseFloat(totalglobal);
                var totalglobal2 = totalglobal1.toFixed(2);
                $scope.xml.total = totalglobal2;


                // $scope.xml.total = courses.Comprobante._total;
                $scope.xml.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                $scope.xml.fechaemision = courses.Comprobante._fecha;
                $scope.xml.descuento = courses.Comprobante._descuento;
                $scope.xml.emisor = courses.Comprobante.Emisor._nombre;
                $scope.xml.rfcemisor = courses.Comprobante.Emisor._rfc;

                if(courses.Comprobante.Impuestos.Traslados == undefined){

                    $scope.xml.iva = '';
                    $scope.xml.importeiva = '';

                }else{

                    $scope.xml.iva = courses.Comprobante.Impuestos.Traslados.Traslado._impuesto;
                    $scope.xml.importeiva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;

                }

                if (courses.Comprobante.Impuestos.Retenciones == undefined) {

                    $scope.xml.isr = '';
                    $scope.xml.importeisr = '';


                }else{


                    $scope.xml.isr = courses.Comprobante.Impuestos.Retenciones.Retencion._impuesto;
                    $scope.xml.importeisr = courses.Comprobante.Impuestos.Retenciones.Retencion._importe;

                }
                $scope.xml.folio = data.Folios;
                $scope.xml.tipoorden = 1;
                $scope.xml.unidad = $scope.unidad;

                // console.log($scope.xml);

                $http.post(ruta,$scope.xml).success(function (data){

                }).error( function (data){

                    alert('Error, Intentalo de Nuevo');

                }); 

                $http.post(ruta2,$scope.xml).success(function (data){

                    // $scope.listadoFact();
                    $scope.borratemporales();
                    $scope.gridOptions.$gridScope.toggleSelectAll(false);
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


$scope.enviaxCorreo = function(){

    $('#boton').button('loading');

        var areaRecibe = 6;

        var archivo =[]; 
        var i;

    if ($scope.selectedRows.length > 0){

        for (a = 0; a < $scope.selectedRows.length; a++){

            DetalleFacturas.imprimeDatos($scope.selectedRows[a].Folio).success( function (data){ 

                console.log(data.archivo);

                $scope.cia_clave=data.respuesta[0].clave;        
                $scope.pro_clave=data.respuesta[0].Pro_clave;        
                $scope.cia=data.respuesta[0].cliente;    
                $scope.uniMed = data.respuesta[0].unidad;
                $scope.poliza = data.respuesta[0].Exp_poliza;
                $scope.sinicestro = data.respuesta[0].Exp_siniestro;
                $scope.reporte =data.respuesta[0].Exp_reporte;
                $scope.riesgo =data.respuesta[0].RIE_nombre;
                $scope.lesionado = data.respuesta[0].nombre;
                $scope.usuario=data.respuesta[0].Usu_registro;
                $scope.registro=data.respuesta[0].Exp_fecreg; 
                $scope.directorio = data.respuesta[0].ruta;
                $scope.claveunidad = data.respuesta[0].claveunidad;
                $scope.folio = data.respuesta[0].folio;


                for (var i = 0; i < data.archivo.length; i++){

                     var jpg = [];

                     var aux = data.archivo[i].split('.');

                if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

                    $scope.xml = 1;
                    $scope.filexml = data.archivo[i];

                }
                if(aux[aux .length-1] == 'pdf' || aux[aux .length-1] == 'PDF'){

                    $scope.pdf = 1;
                    $scope.filepdf = data.archivo[i];

                }


                }

                $('#boton').button('loading');
                $scope.cargando = true;

                $scope.files = {

                    xml:  $scope.filexml,
                    pdf: $scope.filepdf,
                    ruta: $scope.directorio,
                    folio: $scope.folio,
                    unidad: $scope.claveunidad
                }
                $http.post(api+'DetalleFacturas/revisa', $scope.files).success(function (data){
                    $('#boton').button('reset');
                    $scope.cargando = false;
                    $scope.gridOptions.$gridScope.toggleSelectAll(false);
                    swal('Ok',data.respuesta,'success');

                }).error( function (data){

                    swal('Ok','Ocurrio un problema','success');
                    $scope.cargando = false;

                });         
              
            });

        }


    }else{

        alert('No seleccionaste ningun Folio');

    }
}

    $scope.rechazaFactura = function(){

        if ($scope.selectedRows.length > 0){

            for (a = 0; a < $scope.selectedRows.length; a++){

                $scope.folioRechazado = $scope.selectedRows[a].Folio;

                $scope.datos = {folio:$scope.folioRechazado, usuario: $rootScope.userWeb, motivo:'Factura Rechazada'}

                DetalleFacturas.rechazaFactura($scope.datos).success( function (data){ 

                    // loading.cargando('Rechazando Atención');
                    $scope.gridOptions.$gridScope.toggleSelectAll(false);
                    swal("Factura(s) rechazada(s)");
                    $location.path('/controlFacturas');

                });

            }

            // $('#modalEx').modal('hide');

        }else{

        alert('No seleccionaste ningun Folio');

        }

    }


};

controlFacturasCtrl.$inject = ['$scope', '$rootScope','$http', 'find', 'loading', 'api', 'FacturaUnidades', '$location','leexml','DetalleFacturas'];
app.controller('controlFacturasCtrl',controlFacturasCtrl);
