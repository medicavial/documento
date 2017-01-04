function detalleRelacionCtrl($scope, $rootScope, find , loading,datos,$filter,$location,$http,checkFolios,api,$upload,leexml,webStorage,DTOptionsBuilder){

    loading.despedida();

    $scope.inicio = function(){


        $rootScope.area = 6;
        $scope.tituloR = "Folios Relacionados";
        $scope.push = false;
        $scope.factglobal = [];
        $scope.iniciorelacion = true;
        $scope.finrelacion = false;
        $scope.subefactura = false;

        $scope.folio = '';
        $scope.lesionado = '';
        $scope.relacion = '';
        $scope.cargar = false;
        $scope.buscarXfecha = 0;

        // $scope.empresas();
        // $scope.Altaunidades();
        // $scope.productos();
        // $scope.conceptoTramite();
        // $scope.tipoTramite(); 

        $scope.filtrado = {
            Unidad : '',
            Cliente : '',
            Etapa:'',
            Folio  :''

        };

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

    $scope.conceptoTramite = function(){
        find.conceptotramite().success( function (data) {

            $scope.conceptost = data;

        });
    }

    $scope.tipoTramite = function(){
        find.tipotramite().success( function (data) {

            $scope.tipostramites = data;

        });
    }
    $scope.buscaxProveedor = function(id){

        loading.cargando('Buscando Folios');
        find.buscaxProveedor(id).success(function (data){

            if(data){
                
                $scope.listado = data;
                $scope.cantidad = data.length -1;
                $scope.activaboton = true;
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


    $scope.buscar = function(){

        $('#boton').button('loading');
        find.consultadetalleRelacion().success(function (data){
            $scope.listas = data;

            $('#boton').button('reset');
        });
    };

    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withOption('lengthMenu', [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "Todo"] ])
    // .withOption('responsive', true)
    .withPaginationType('full_numbers')
    .withOption('language',{
        paginate: {
            first: "«",
            last: "»",
            next: "→",
            previous: "←"
        },
        search: "Busqueda General:",
        loadingRecords: "Cargando Información....",
        lengthMenu: "    Mostrar _MENU_ entradas",
        processing: "Procesando Información",
        infoEmpty: "No se encontro información",
        emptyTable: "Sin Información disponible",
        info: "Mostrando pagina _PAGE_ de _PAGES_ , Registros encontrados _TOTAL_ ",
        infoFiltered: " - encontrados _MAX_ coincidencias"
    })

    .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function(){
            $scope.$apply(function() {

                // console.log(aData[1]);

                // $scope.detalle(aData[1]);

            });
        });
        return nRow;
    })

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

        alert('prueba');

        // $scope.filterOptions.filterText = ''; 
        $scope.norelacion.unidad = 0;

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

            $scope.iniciorelacion = false;
            $scope.finrelacion = true;
            $scope.tituloFinRelacion = "Relación de Folios";
            
            console.log($scope.relacionesFol);

            $scope.detalles = $scope.relacionesFol;
            $scope.referencia = $scope.relacionesFol[0].referencia;

            var suma = 0;
            var suma1 = 0;
            for (var i = 0; i < $scope.detalles.length; i++){

                var valor = $scope.detalles[i].Reserva;
                var numero = valor.replace(",",'');
                suma += parseFloat(numero);
                var sumas = suma.toFixed(2);
                $scope.resultado= sumas;
                $scope.detalles[i].btn_edit = true;

                var valor1 = $scope.detalles[i].Tabulador;
                var numero1 = valor1.replace(",",'');
                suma1 += parseFloat(numero1);
                var sumas1 = suma1.toFixed(2);
                $scope.totales = sumas1;
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

    $scope.siguiente = function(){

        $scope.btnsiguiente = true;

        $scope.relaciones = {

            seleccionados : $scope.detalles,
            numrelacion : $scope.numreferencia,
            tipofactura : $scope.tipofactura,
            observacion : $scope.observaciones
        }

        console.log($scope.relaciones);

        webStorage.local.add('relacionesData', JSON.stringify($scope.relaciones));

        if($scope.relaciones.tipofactura == 1){

             // $scope.subefacturaglobal = true;

             swal({   
                title: "¿Sera Factura Global?",   
                type: "warning",   
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: "Si",   
                cancelButtonText: "No, Cancelar",   
                closeOnConfirm: false,   
                closeOnCancel: false 
            }, 
            function(isConfirm){   
                if (isConfirm) {     
                    swal("Factura Global", "Folios Relacionado" + $scope.numreferencia, "success");   
                    $scope.editafactura = true;
                    $scope.subefactura = false;
                    $scope.global = true;
                    $scope.subefacturaglo = true;

                } else {    

                    swal("Cancela", "Relación Cancelada", "error"); 
                    $scope.editafactura = false;
                    $scope.subefactura = false;  
                    $scope.global = false;
                } 
            });

        }else{

            // $scope.subefacturaglobal = true;

             swal({   
                title: "¿Sera Factura Individual?",   
                type: "warning",   
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: "Si",   
                cancelButtonText: "No, Cancelar",   
                closeOnConfirm: false,   
                closeOnCancel: false 
            }, 
            function(isConfirm){   
                if (isConfirm) {     
                    swal("Factura Individual", "Folios Relacionado" + $scope.numreferencia, "success");   
                    $scope.editafactura = true;
                    $scope.subefactura = true;
                } else {     
                    swal("Cancela", "Relación Cancelada", "error"); 
                    $scope.editafactura = false; 
                    $scope.subefactura = false; 
                } 
            });
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
                

            }); 

            

        }else{
            alert('No se ha seleccionado ningun documento');
        }
         
    }

    $scope.subeXML = function(idx,$files){

        if ($scope.relaciones.tipofactura == 1){

                var aux = $files[0].name.split('.');

                if(aux[aux .length-1] == 'xml'){

                 for (var i = 0; i < $files.length; i++){
                 var file = $files[i];
                 var amt = 0;
                  $scope.upload = $upload.upload({
                        url: api+'RelacionPagos/upload/'+ idx, //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        //headers: {'header-key': 'header-value'},
                        //withCredentials: true,
                        data: $scope.datos,
                        file: file // or list of files ($files) for html5 only
                }).success(function (data){

                    console.log(data);

                    if (data.respuesta.length > 1){

                        swal("Hay una Factura arriba, borra para subir una nueva")

                    }else{

                        leexml.getxmltemporal(data.respuesta[0]).success(function(data){
                        courses  = x2js.xml_str2json(data);

                        $scope.factura.importe = courses.Comprobante._subTotal;
                        $scope.factura.total = courses.Comprobante._total;
                        $scope.factura.foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                        $scope.factura.fechaemision = courses.Comprobante._fecha;
                        $scope.factura.iva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;
                        $scope.factura.descuento = courses.Comprobante._descuento;
                        $scope.factura.emisor = courses.Comprobante.Emisor._nombre;
                        $scope.factura.descuento = courses.Comprobante._descuento;
                        $scope.factura.elimina = true;
                        $scope.btndelete = true;

                      });


                    }

                }).error( function (xhr,status,data){

                          alert('Ocurrio un error');

                        });
                    }

                }else{

                       alert('La extensión debe ser xml');
                }

        }else{

            var aux = $files[0].name.split('.');

                if(aux[aux .length-1] == 'xml'){

                for (var i = 0; i < $files.length; i++){
                 var file = $files[i];
                  var amt = 0;
                  $scope.upload = $upload.upload({
                        url: api+'RelacionPagos/upload/'+ idx, //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        data: $scope.datos,
                        file: file // or list of files ($files) for html5 only
                  }).success(function (data){

                    for (var ii = 0; ii < data.respuesta.length; ii++) {

                       leexml.getxmltemporal(data.respuesta[ii]).success(function(data){
                       courses  = x2js.xml_str2json(data);

                        $scope.detalles[idx].importe =  courses.Comprobante._subTotal;
                        $scope.detalles[idx].total = courses.Comprobante._total;
                        $scope.detalles[idx].foliofiscal = courses.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                        $scope.detalles[idx].fechaemision = courses.Comprobante._fecha;
                        $scope.detalles[idx].iva = courses.Comprobante.Impuestos.Traslados.Traslado._importe;
                        $scope.detalles[idx].descuento = courses.Comprobante._descuento;
                        $scope.detalles[idx].emisor = courses.Comprobante.Emisor._nombre;
                        $scope.detalles[idx].elimina = true;
                        $scope.btndelete = true;
                        $scope.detalles[idx].btn_edit = false;
                      });
                   }

                    }).error( function (xhr,status,data){

                          alert('Ocurrio un error');

                    });
                }

                }else{

                       alert('La extensión debe ser xml');
                  // return false;

                }

                console.log($scope.detalles);

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

$scope.guardaRelacionInd = function(success){

        $scope.relaciones = {

            seleccionados : $scope.detalles,
            numrelacion : $scope.numreferencia,
            tipofactura : $scope.tipofactura,
            observacion : $scope.observaciones
        }

    $http.post(api+'RelacionPagos/insertaRelacion/'+ $rootScope.id,$scope.relaciones).success(function (data){

        $scope.factguardada = true;
        $scope.detalles.btn_edit = true;
        swal("Tu Relación fue Completada");
        $location.path('/ingresafactura');


    }).error( function (data){

        alert('Error, Intentalo de Nuevo');

    }); 
}

$scope.guardaRelacionGlo = function(success){

        $scope.relaciones = {

            seleccionados : $scope.detalles,
            numrelacion : $scope.numreferencia,
            tipofactura : $scope.tipofactura,
            observacion : $scope.observaciones,
            factura: $scope.factura
        }
    $http.post(api+'RelacionPagos/insertaRelacionGlo/'+ $rootScope.id,$scope.relaciones).success(function (data){

        $scope.factguardada = true;
        $scope.detalles.btn_edit = true;
        swal("Tu Relación fue Completada");
        $location.path('/ingresafactura');

    }).error( function (data){

        alert('Error, Intentalo de Nuevo');

    }); 
}

}

detalleRelacionCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading','datos','$filter','$location','$http','checkFolios','api','$upload','leexml','webStorage','DTOptionsBuilder'];
// flujoPagosCtrl.$inject = ['$scope','$rootScope', 'find','loading', '$http', 'api','datos','$filter'];

app.controller('detalleRelacionCtrl',detalleRelacionCtrl);
// app.controller('flujoPagosCtrl',flujoPagosCtrl);
