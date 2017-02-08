
function relacionNoPagadaCtrl($scope, $rootScope, find ,loading,datos,$filter,$location,$http,checkFolios,api,$upload,leexml){

    // console.log(datos);
    loading.despedida();

    $scope.recibidos = datos.recepcion;

    // datos.activos.success(function (data){

    //     $scope.listado = data;
    //     $scope.cantidad = data.length -1;

    // });

    $scope.inicio = function(){

        $rootScope.area = 6;
        $scope.tituloR = "Relaciones Completas";


        $scope.datosRegistro= {

            fechainiReg : FechaAct,
            fechafinReg : FechaAct,
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

        $scope.factura = {

            foliofiscal : '',
            foliointerno : '',
            importe : '',
            iva : '',
            descuento : '',
            total : '',
            fechaemision : '',
            elimina : false
        }

        $scope.tramite = {

            fecha: FechaAct,
            concepto: '',
            tipo: '',
            obs: '',
            tipofactura: ''

        }

    }

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

    $scope.fRegistro = function(){

        loading.cargando('Buscando Folio');
        find.listaRelacionReg($scope.datosRegistro).success(function (data){

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

    var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

    $scope.onDblClickRow = function(row){
      $location.path('/detallerelacion/'+row.entity.relacion);

    };

    ////opciones del grid                 
    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:true,
        multiSelect:true,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectedRows, 
        filterOptions: $scope.filterOptions,
        enableCellEdit: false,
        rowTemplate: rowTempl,
        columnDefs: [
                    { field:'relacion',displayName:'Relación', width: 120, pinned: true},
                    { field:'subtotal',displayName:'Subtotal', width: 120 },
                    { field:'total',displayName:'Importe', width: 120 },
                    { field:'unidad',displayName:'Unidad', width: 160 },
                    { field:'fecha',displayName:'Fecha Registro', width: 150 },

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

    $scope.relacionaFolios = function(success){

        $scope.relacionesFol= [];
        for (var i = 0; i < $scope.selectedRows.length; i++){

             $scope.relacionesFol.push($scope.selectedRows[i]);
             
        };
        if ($scope.relacionesFol.length > 0){

          swal({   
              title: "",   
              text: "Ingresa N° Relación", 
              type: "input",
              imageUrl: "images/relacion.png",
              closeOnConfirm: false,     
              animation: "slide-from-top",  
              inputPlaceholder: "N° Relación" },

              function(inputValue){   
                if (inputValue === false) return false;      
                if (inputValue === ""){ 
                inputValue = 0;    
                  // swal.showInputError("Ocurrio un Error!!");     
                  // return false  
                } 
                $scope.numrelacion = inputValue;     
                swal("OK!", "El N° Relación Factura es: " + inputValue, "success"); 
                $('#ventanarelacion').modal('show');


        });
    }else{

        swal("Oops...", "No seleccionaste Folios", "error")

    }

    }

    $scope.guardaTramiteRelacion = function(success){

        $scope.relaciones = {

            seleccionado : $scope.relacionesFol,
            numerorelacion : $scope.numrelacion,
            tramite: $scope.tramite
        }

        $http.post(api+'RelacionPagos/insertaRelacion/'+ $rootScope.id,$scope.relaciones).success(function (data){

            $scope.mensajetramite = 'Tramite Insertado';
            $scope.tipoalerta = 'alert-success';

        }).error( function (data){

            $scope.mensajetramite = 'Error, Intenta otra vez';
            $scope.tipoalerta = 'alert-success';

        }); 

    }

    $scope.relacionaFactura = function(success){
        $scope.divglobal = true;
        $scope.factglobal = [];
        for (var i = 0; i < $scope.selectedRows.length; i++){

             $scope.factglobal.push($scope.selectedRows[i]);
             
        };
        if ($scope.factglobal.length > 0){
            $http.post(api+'globales',$scope.factglobal).success(function (data){

                  swal({  
                      title: "¿Tipo de Relación de Factura?",   
                      // type: "success",   
                      showCancelButton: true,   
                      imageUrl: "images/relacion.png",
                      confirmButtonColor: "#3F4C6B",
                      cancelButtonColor: "#3F94E9",   
                      confirmButtonText: "R. Global",   
                      cancelButtonText: "R. Individual",   
                      closeOnConfirm: false,   
                      closeOnCancel: false }, 
                        function(isConfirm){   
                            if (isConfirm) {     

                                swal("Global", "Factura Global", "success");  
                                $scope.mensaje = data.respuesta;
                                $scope.tipoalerta = 'alert-success';
                                $scope.factura.tipofactura = 1;

                            } else {     
                                swal("Individual", "Factura Individual", "success"); 
                                $scope.mensaje = data.respuesta;
                                $scope.tipoalerta = 'alert-success';  
                                $scope.factura.tipofactura = 0;

                        } }); 



            }).error( function (data){
                
                // $scope.mensaje = 'Ocurrio un error de conexion intente nuevamente si persiste el problema comunicate al area de sistemas';
                // $scope.tipoalerta = 'alert-warning';
                // $('#boton2').button('reset');

            }); 

            

        }else{
            alert('No se ha seleccionado ningun documento');
        }
         
    }

    $scope.subeXML = function($files){

        if ($scope.factura.tipofactura == 1){
            $scope.factura.facturanombre = "Glogal";
        }else{
            $scope.factura.facturanombre = "Individual";
        }

      swal({   
          title: "",   
          text: "¿Desea Capturar un N° de Relación de la Factura?", 
          type: "input",
          closeOnConfirm: false,     
          animation: "slide-from-top",  
          inputPlaceholder: "N° Relación Factura" },

          function(inputValue){   
            if (inputValue === false) return false;      
            if (inputValue === ""){ 

            inputValue = 0;    
              // swal.showInputError("Ocurrio un Error!!");     
              // return false  
            }      
               swal("OK!", "El N° Relación Factura es: " + inputValue, "success"); 

                var aux = $files[0].name.split('.');

                 if(aux[aux .length-1] == 'xml'){

                 for (var i = 0; i < $files.length; i++){
                 var file = $files[i];
                  var amt = 0;
                  $scope.upload = $upload.upload({
                        url: api+'upload', //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        //headers: {'header-key': 'header-value'},
                        //withCredentials: true,
                        data: $scope.datos,
                        file: file // or list of files ($files) for html5 only
                  }).success(function (data){

                       leexml.getxmltemporal(data.respuesta).success(function(data){
                       courses  = x2js.xml_str2json(data);

                        $scope.factura.importe = courses.Comprobante._subTotal;
                        $scope.factura.total = courses.Comprobante._total;
                        $scope.factura.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                        $scope.factura.fechaemision = courses.Comprobante._fecha;
                        $scope.factura.iva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;
                        $scope.factura.descuento = courses.Comprobante._descuento;
                        $scope.factura.foliointerno = inputValue;
                        $scope.factura.elimina = true;

                      });

                    }).error( function (xhr,status,data){

                          alert('Ocurrio un error');

                        });
                    }

                     }else{

                       alert('La imagen debe estar en formato JPG, PNG O TIFF');
                  // return false;

  }

    });
 }

$scope.generaReporte = function(success){

    $http.post(api+'RelacionNP/generaReporte', $scope.listado).success(function (data){
        
    }).error( function (data){

        $scope.mensajetramite = 'Error, Intenta otra vez';
        $scope.tipoalerta = 'alert-danger';

    }); 
}

};


relacionNoPagadaCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading','datos','$filter','$location','$http','checkFolios','api','$upload','leexml'];
// flujoPagosCtrl.$inject = ['$scope','$rootScope', 'find','loading', '$http', 'api','datos','$filter'];

app.controller('relacionNoPagadaCtrl',relacionNoPagadaCtrl);
// app.controller('flujoPagosCtrl',flujoPagosCtrl);
