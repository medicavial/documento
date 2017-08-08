function relacionCtrl($scope, $rootScope, find , loading,datos,$filter,$location,$http,checkFolios,api,$upload,leexml,webStorage,relaciones){

    // console.log(datos);
    loading.despedida();

    $scope.recibidos = datos.recepcion;

    // datos.activos.success(function (data){

    //     $scope.listado = data;
    //     $scope.cantidad = data.length -1;

    // });

    $scope.inicio = function(){

        $rootScope.area = 6;
        $scope.tituloR = "Ordenes Para Relacionar";
        $scope.push = false;
        $scope.factglobal = [];
        $scope.iniciorelacion = true;
        $scope.finrelacion = false;
        $scope.subefactura = false;
        $scope.archivos = [];

        $scope.activaboton = false;

        $scope.datosRecepcion = {

            fechainiRec : primerdiames,
            fechafinRec : FechaAct,
            unidad:'',
            empresa:'',
            folio:''
        }

        $scope.datosEntrega = {

            fechainiEnt : FechaAct,
            fechafinEnt : FechaAct,
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
        $scope.tipoTramite(); 
        $scope.borratemporales();


        $scope.filtrado = {
            Unidad : '',
            Cliente : '',
            Etapa:'',
            Folio  :''

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

        $scope.detalles = {

                importe : '',
                total: '',
                foliofiscal: '',
                fechaemision: '',
                fechaemision: '',
                iva: '',
                descuento: '',
                emisor: '',
                elimina : '',
                tipotramite: '',
                concepto: '',
                tasa: '',
                subtotal: '',
                Reserva: 0.00,
                Tabulador: 0.00


        }

        $scope.datos = {

            rfc : '',
            claveunidad: ''
        }

         $scope.tipoOrden();
         $scope.Proveedores();

         $scope.norelacion = {

            tipoOrden: '',
            unidad: '',
            proveedor: ''

         }

         $scope.NC = {

            SubtotalNC:'',
            IVANC: '',
            folio: '',
            cliente: '',
            unidad: '',
            total: '',
            subtotal: ''

         }

         // $scope.SubtotalNC = '';
         // $scope.IVANC = '';
         // $scope.totalNC = '';



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

        find.unidades().success( function (data){

            $scope.unidades = data;
            
         });
    }

    $scope.Proveedores = function(){

        relaciones.proveedores().success( function (data){

            $scope.proveedores = data;
            
         });
    }

    $scope.subtipotramite = function(idx,tipotramite){

        find.conceptotramite(tipotramite).success( function (data){

            $scope.conceptost = data;

        });
    }

    $scope.tipoTramite = function(){
        find.tipotramite().success( function (data) {

            $scope.tipostramites = data;

        });
    }

    $scope.borratemporales = function(){

      find.borratemporales($rootScope.user).success(function (data){

      });

    }
    $scope.borraxArchivo = function(archivo){

      relaciones.borraxArchivo($rootScope.user,archivo).success(function (data){

      });

    }

    $scope.tipoOrden = function(){

        relaciones.tipoOrden().success( function (data) {

            $scope.ordenes = data;

        });
    }

    $scope.busquedaOrdenes = function(){

        console.log($scope.norelacion);

        if ($scope.norelacion.tipoOrden == '') {

            swal("Oops...", "No seleccionaste Tipo de Facturación", "error")
        };

        loading.cargando('Buscando Folios');
        relaciones.busquedaOrdenes($scope.norelacion).success(function (data){

            if(data){
                
                $scope.listado = data;
                $scope.datos.claveunidad = data[0].claveunidad;
                $scope.datos.claveproveedor = data[0].claveproveedor;
                $scope.datos.rfc = data[0].rfc;
                $scope.cantidad = data.length -1;
                $scope.activaboton = true;
                // $scope.norelacion.referencia = data[0].referencia;

            }else{

                
                $scope.listado = [];
                loading.despedida();
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
    // $scope.fRecepcion = function(){

    //     loading.cargando('Buscando Folio');
    //     find.listaPagosFRecepcion($scope.datosRecepcion).success(function (data){

    //         if(data){

    //             $scope.listado = data;
    //             $scope.cantidad = data.length -1;


    //         }else{

    //             loading.despedida();
    //             $scope.listado = [];
                
    //         }

    //         loading.despedida();

    //     });

    // }
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
                    { field:'',displayName:'', width: 50, pinned: true,  cellTemplate: '<label class="btn btn-link" > NC <input type="button" style="display: none;" ng-click="pedirNC(row)"></label>'},
                    { field:'',displayName:'', width: 100, pinned: true,  cellTemplate: '<label class="btn btn-danger"> Cancela OP <input type="button" style="display: none;" ng-click="cancelaORP(row)"></label>'},
                    { field:'Unidad',displayName:'Unidad', width: 200, pinned: true},
                    { field:'Proveedor',displayName:'Proveedor', width: 200, pinned: true},
                    { field:'Folio', displayName:'Folio' , width: 120 , pinned: true},
                    { field:'total', width: 120, pinned: true  },
                    { field:'Etapa', width: 120, pinned: true },
                    { field:'Entrega', width: 80 , pinned: true},
                    { field:'Factura', width: 80 , pinned: true},
                    { field:'foliofiscal', displayName:'Folio Fiscal', width: 120 },
                    // { field:'Lesionado', width: 330, pinned: true },
                    { field:'nombreOrden', width: 120 },
                    { field:'nombreEmisor', width: 120 },
                    { field:'rfcemisor', width: 120 },
                    { field:'Producto', width: 120 },
                    { field:'Triage', width: 120 },
                    { field:'Cliente', width: 100 },
                    { field:'Unidad', width: 220 },
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
                    { field:'Cobrado', width: 80 },
                    { field:'nombreOrden', width: 80 },
                    { field:'id', width: 80 }
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

    console.log($scope.selectedRows);

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

        // $scope.filterOptions.filterText = ''; 
        $scope.norelacion.unidad = 0;
        // $scope.cliente = 0;
        // $scope.tipo = 0;
        // $scope.folio = '';
        // $scope.fechaini = '';
        // $scope.fechafin = '';
        // $scope.lesionado = '';
        // $scope.fechainiPag = '';
        // $scope.fechafinPag = '';
        // $scope.fechainiRec = '';
        // $scope.fechainiRec = '';

        // $scope.filtrado = {
        //     Unidad : '',
        //     Cliente : '',
        //     Etapa:''
        //     // FormaRecep : '',
        //     // Folio  :'',
        //     // Lesionado  :'',
        //     // Producto:'',
        //     // Relacion:'',
        //     // RelP:'',
        //     // Cobrado:'', 
        //     // Pagado:''
        // };

        // // console.log($scope.buscarXfecha);

        // if ($scope.buscarXfecha == 1){

        //     $scope.buscarXfecha = 0;
        //     $scope.foliosxarea();
        // };
        
    }

    $scope.calculaNC = function(){

        // $scope.total = row.entity.total;

        var m = parseFloat($scope.NC.SubtotalNC) + parseFloat($scope.NC.IVANC);
        var mm = m.toFixed(2);
        $scope.NC.totalNC= mm;


    }

    $scope.pedirNC = function(row){

          $('#exampleModal').modal();   

           console.log(row.entity);

           // $scope.folio = row.entity.Folio;
           // $scope.cliente = row.entity.Cliente;
           // $scope.unidad = row.entity.Unidad;
           // $scope.total = row.entity.total;
           $scope.clave = row.entity.id;
           // console.log($scope.SubtotalNC);

        $scope.NC = {

            // SubtotalNC:$scope.SubtotalNC,
            // IVANC: $scope.IVANC,
            folio: row.entity.Folio,
            cliente: row.entity.Cliente,
            unidad: row.entity.Unidad,
            total: row.entity.total,
            subtotal: row.entity.subtotal,
            importeiva: row.entity.importeiva,
            id: row.rowIndex
            // totalNC: $scope.totalNC

        }

    }

    $scope.guardaNC = function(){

        console.log($scope.NC);

        $http.post(api+'RelacionPagos/guardaNC/'+ $scope.clave,$scope.NC).success(function (data){

            $('#exampleModal').modal('hide'); 

               var index = $scope.NC.id;
               $scope.gridOptions.selectItem(index, false);
               $scope.listado.splice(index, 1);

        }).error( function (data){

            alert('Error, Intentalo de Nuevo');

        }); 


    }

    $scope.cancelaORP = function(row){

        var id = row.entity.id;

        $http.post(api+'RelacionPagos/cancelaORP/'+ id, $scope.norelacion).success(function (data){

               var index = row.rowIndex;
               $scope.gridOptions.selectItem(index, false);
               $scope.listado.splice(index, 1);

        }).error( function (data){

            alert('Error, Intentalo de Nuevo');

        }); 


    }


    $scope.exporta = function(){

        $scope.selectos = $filter('filter')($scope.listado, $scope.filtrado);
        JSONToCSVConvertor($scope.selectos,'Reporte',true);        
    }

    $scope.relacionaFolios = function(success){

        console.log($scope.selectedRows);

        $scope.relacionesFol= [];
        for (var i = 0; i < $scope.selectedRows.length; i++){

             $scope.relacionesFol.push($scope.selectedRows[i]);
             
        };
        // console.log($scope.relacionesFol[0].claveunidad);
        // find.unidadesref($scope.relacionesFol[0].claveunidad).success( function (data) {

            // var referencia = data.ref;
        
        if ($scope.relacionesFol.length > 0){

            console.log($scope.relacionesFol);

            $scope.iniciorelacion = false;
            $scope.finrelacion = true;
            $scope.tituloFinRelacion = "Relación de Folios";
            
            $scope.detalles = $scope.relacionesFol;
            if ($scope.relacionesFol[0].referencia == null) {
                
                $scope.referencia = $scope.relacionesFol[0].ref_proveedor;
                console.log($scope.relacionesFol[0].ref_proveedor);

            }else{

                $scope.referencia = $scope.relacionesFol[0].referencia;
                console.log($scope.relacionesFol[0].referencia);

            }
            console.log($scope.referencia);

            var suma = 0;
            var suma1 = 0;
            var suma2 = 0;
            var suma3 = 0;
            var suma4 = 0;
            var suma5 = 0;
            for (var i = 0; i < $scope.detalles.length; i++){


                if ($scope.detalles[i].total != ''){

                    var valor2 = $scope.detalles[i].total;
                    var numero2 = valor2.replace(",",'');
                    suma2 += parseFloat(numero2);
                    var sumas2 = suma2.toFixed(2);

                    $scope.totalimporte = sumas2;
                    console.log($scope.totalimporte);

                }

                if ($scope.detalles[i].subtotal != ''){

                    var valor3 = $scope.detalles[i].subtotal;
                    var numero3 = valor3.replace(",",'');
                    suma3 += parseFloat(numero3);
                    var sumas3 = suma3.toFixed(2);

                    $scope.totalsubtotal = sumas3;

                }

                // if ($scope.detalles[i].tasa != ''){

                //     var valor4 = $scope.detalles[i].tasa;
                //     var numero4 = valor4.replace(",",'');
                //     suma4 += parseFloat(numero4);
                //     var sumas4 = suma4.toFixed(2);

                //     $scope.totaltasa = sumas4;

                // }

                // if ($scope.detalles[i].retencion != ''){

                //     var valor5 = $scope.detalles[i].retencion;
                //     var numero5 = valor5.replace(",",'');
                //     suma5 += parseFloat(numero5);
                //     var sumas5 = suma5.toFixed(2);

                //     $scope.totalretencion = sumas5;

                // }

            }


    }else{

        swal("Oops...", "No seleccionaste Folios", "error")

    }
// });

    }

    $scope.suma = function(){
      // var numeros = [];
      var suma1 = 0;
      for (var i = 0; i < $scope.detalles.length; i++){

          if ($scope.detalles[i].Tabulador == "NaN"){

              $scope.detalles[i].Tabulador = 0;

          };
          // var numero = $scope.detalles[i].total;
          // console.log(numero);
        var valor1 = $scope.detalles[i].Tabulador;
        var numero1 = valor1.replace(",",'');
        suma1 += parseFloat(numero1);
        var sumas1 = suma1.toFixed(2);
        $scope.totales = sumas1;

      }
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

    $scope.subeXML = function(idx,$files){

        console.log($scope.relaciones.tipofactura);

        if ($scope.relaciones.tipofactura == 1){

                var aux = $files[0].name.split('.');

                if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

                 for (var i = 0; i < $files.length; i++){
                 var file = $files[i];
                 var amt = 0;
                  $scope.upload = $upload.upload({
                        url: api+'RelacionPagos/upload/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        //headers: {'header-key': 'header-value'},
                        //withCredentials: true,
                        data: $scope.datos,
                        file: file // or list of files ($files) for html5 only
                }).success(function (data){

                    leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
                    courses  = x2js.xml_str2json(data);

                        relaciones.consultaFolioFiscal(courses.Comprobante.Complemento.TimbreFiscalDigital._UUID).success(function (data){     
                            if (data[0].count != 0){

                                swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                                $scope.factura.importe = '';
                                $scope.factura.total = '';
                                $scope.factura.foliofiscal = '';
                                $scope.factura.fechaemision = '';
                                $scope.factura.descuento = '';
                                $scope.factura.emisor = '';
                                $scope.factura.descuento = '';
                                $scope.factura.elimina = false;

                            }
                        });
                        // relaciones.validaUnidad(courses.Comprobante.Emisor._rfc).success(function (data){ 
                        //         if (data.length > 0){

                        //             $scope.datos.rfc = data[0].rfc;
                        //             $scope.datos.unidad = data[0].unidad;
                        //             $scope.datos.unidadweb = data[0].unidadweb;
     
                                if ($scope.datos.rfc == courses.Comprobante.Emisor._rfc){

                                    $scope.factura.importe = courses.Comprobante._subTotal;
                                    $scope.factura.total = courses.Comprobante._total;
                                    $scope.factura.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                                    $scope.factura.fechaemision = courses.Comprobante._fecha;
                                    $scope.factura.descuento = courses.Comprobante._descuento;
                                    $scope.factura.emisor = courses.Comprobante.Emisor._nombre;
                                    $scope.factura.descuento = courses.Comprobante._descuento;
                                    $scope.factura.elimina = true;
                                    $scope.btndelete = true;


                                  
                                }else{

                                    swal('Upss','Tu Factura no coincide con el Emisor','error');

                                    // var archivo = $scope.datos.leexml;
                                    // $scope.elimina_ahora(archivo);

                                }
                            // }else{

                            //   swal("Upss", "El proveedor no se encuentra en el sistema, Solicitalo al area de Sistemas", "Error");

                            // }

                        // });



                    });

                        $scope.archivos = data.ruta;



                }).error( function (xhr,status,data){

                          alert('Ocurrio un error');

                        });
                    }

                }else{

                       alert('La extensión debe ser xml');
                }

        }else{

            var aux = $files[0].name.split('.');

                if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

                for (var i = 0; i < $files.length; i++){
                 var file = $files[i];
                  var amt = 0;
                  $scope.upload = $upload.upload({
                        url: api+'RelacionPagos/upload/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        data: $scope.datos,
                        file: file // or list of files ($files) for html5 only
                  }).success(function (data){

                    for (var ii = 0; ii < data.archivo.length; ii++){

                        console.log(data.archivo[ii]);

                        leexml.getxmltemporal($rootScope.user,data.archivo[ii]).success(function(data){
                        courses  = x2js.xml_str2json(data);

                           relaciones.consultaFolioFiscal(courses.Comprobante.Complemento.TimbreFiscalDigital._UUID).success(function (data){                  
                                  if (data[0].count != 0){

                                    swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                                    $scope.detalles[idx].importe =  '';
                                    $scope.detalles[idx].total = '';
                                    $scope.detalles[idx].foliofiscal = '';
                                    $scope.detalles[idx].fechaemision = '';
                                    $scope.detalles[idx].descuento = '';
                                    $scope.detalles[idx].emisor = '';
                                    $scope.detalles[idx].elimina = false;
                                    $scope.btndelete = false;

                                  }
                            });
                                if ($scope.datos.rfc == courses.Comprobante.Emisor._rfc){

                                    var suma1 = 0;

                                    $scope.detalles[idx].importe = courses.Comprobante._subTotal;
                                    $scope.detalles[idx].total = courses.Comprobante._total;
                                    $scope.detalles[idx].foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                                    $scope.detalles[idx].fechaemision = courses.Comprobante._fecha;
                                    $scope.detalles[idx].descuento = courses.Comprobante._descuento;
                                    $scope.detalles[idx].emisor = courses.Comprobante.Emisor._nombre;
                                    $scope.detalles[idx].descuento = courses.Comprobante._descuento;
                                    $scope.detalles[idx].elimina = true;
                                    $scope.btndelete = true;

                                    for (var i = 0; i < $scope.detalles.length; i++){

                                    var valor1 = $scope.detalles[i].total;
                                    var numero1 = valor1.replace(",",'');
                                    suma1 += parseFloat(numero1);
                                    var sumas1 = suma1.toFixed(2);
                                    $scope.totalimporte= sumas1;

                                    console.log($scope.totalimporte);

                                    }
                                }else{

                                    swal('Upss','Tu Factura no coincide con el Emisor','error');

                                    // var archivo = $scope.datos.leexml;
                                    // $scope.elimina_ahora(archivo);
                                    $scope.detalles[idx].importe =  '';
                                    $scope.detalles[idx].total = '';
                                    $scope.detalles[idx].foliofiscal = '';
                                    $scope.detalles[idx].fechaemision = '';
                                    $scope.detalles[idx].descuento = '';
                                    $scope.detalles[idx].emisor = '';
                                    $scope.detalles[idx].elimina = false;
                                    $scope.btndelete = false;

                                }

                      });
                   }
                        $scope.archivos = data.archivo;

                    }).error( function (xhr,status,data){

                          alert('Ocurrio un error');

                    });
                }

                }else{

                       alert('La extensión debe ser xml');
                  // return false;

                }
    }
}

$scope.eliminaxml = function(){

    $http.post(api+'RelacionPagos/eliminaxml').success(function (data){

        $scope.factura = {

           foliofiscal: '', 
           importe : '',
           iva : '',
           descuento : '', 
           total : '', 
           fechaemision : ''
        }

    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

    });

}

$scope.eliminaxmlInd = function(idx){

    $http.post(api+'RelacionPagos/eliminaxmlInd/' + idx).success(function (data){

        $scope.detalles[idx].importe = '';
        $scope.detalles[idx].foliofiscal = '';

    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

    });
}

$scope.guardaRelacion = function(success){


    $scope.relaciones = {

        seleccionados : $scope.detalles,
        numrelacion : $scope.referencia +'_'+$scope.numreferencia,
        // tipofactura : $scope.relaciones.tipofactura,
        observacion : $scope.observaciones,
        archivos : $scope.archivos,
        usucarpeta: $rootScope.user,
        proveedor: $scope.datos.claveproveedor,
        unidad: $scope.datos.claveunidad,
        total:  $scope.totalimporte,
        tasa:  $scope.totaltasa,
        retencion: $scope.totalretencion,
        subtotal:  $scope.totalsubtotal

    }

    console.log($scope.relaciones.numrelacion);

    if ($scope.relaciones.numrelacion == $scope.referencia +'_'+undefined) {

        swal("Debes Asignar un Número de Relación");
    }else{

    $http.post(api+'RelacionPagos/insertaRelacion/'+ $rootScope.id,$scope.relaciones).success(function (data){
        loading.cargando('Buscando Folios');
        $scope.factguardada = true;
        $scope.detalles.btn_edit = true;
        swal("Tu Relación fue Completada");
        $location.path('/relacionNP');

    }).error( function (data){

        alert('Error, Intentalo de Nuevo');

    }); 
}
}

$scope.guardaRelacionGlo = function(success){

    console.log($scope.archivos);

        $scope.relaciones = {

            seleccionados : $scope.detalles,
            numrelacion : $scope.referencia +'_'+$scope.numreferencia,
            tipofactura : $scope.relaciones.tipofactura,
            observacion : $scope.observaciones,
            factura: $scope.factura,
            archivos : $scope.archivos,
            usucarpeta: $rootScope.user,
            unidad: $scope.datos.claveunidad

        }

    $http.post(api+'RelacionPagos/insertaRelacionGlo/'+ $rootScope.id,$scope.relaciones).success(function (data){
        loading.cargando('');
        $scope.factguardada = true;
        $scope.detalles.btn_edit = true;
        swal("Tu Relación fue Completada");
        $location.path('/relacionNP');

    }).error( function (data){

        alert('Error, Intentalo de Nuevo');

    }); 
}

    $scope.verificaReferencia = function(){

        $scope.relaciones = {

            numrelacion : $scope.referencia +'_'+$scope.numreferencia
        }

        if ($scope.numreferencia != ''){

            $('#consecutivo').addClass('loadinggif');

                relaciones.buscaRelacion($scope.relaciones).success( function (data){

                    $('#consecutivo').removeClass('loadinggif');
                    if (data.respuesta != '') {
                        $scope.mensaje = "La Relacion ya existe";
                        $scope.tipoalerta = 'alert-danger';
                        $scope.numreferencia = '';
                    }else{
                        $scope.mensaje = "Relacion Disponible";
                        $scope.tipoalerta = 'alert-success';

                    }

            });   

        }else{

            swal("Upss","Ingresa una Relación","Error");


        }


}
}


relacionCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading','datos','$filter','$location','$http','checkFolios','api','$upload','leexml','webStorage','relaciones'];
// flujoPagosCtrl.$inject = ['$scope','$rootScope', 'find','loading', '$http', 'api','datos','$filter'];

app.controller('relacionCtrl',relacionCtrl);
// app.controller('flujoPagosCtrl',flujoPagosCtrl);
