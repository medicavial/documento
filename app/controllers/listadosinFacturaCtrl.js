function listadosinFacturaCtrl($scope, $rootScope, find ,loading,$filter,$location,$http,checkFolios,api,$upload,leexml, OPFactura, FacturaNormal){

    $scope.inicio = function(){

        $rootScope.area = 6;
        $scope.tituloR = "Ordenes de Pago sin Factura";
        $scope.listado = [];


        $scope.datosRegistro = {

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
        $scope.PagoG = [];

        $scope.filtrado = {
            Unidad : '',
            Cliente : '',
            Etapa:'',
            Folio  :''
        };

        $scope.recibe = true;
        $scope.subeFactGlo = false;
        $scope.subeFactInd = false;
        $scope.tipoTramite();
        $scope.borratemporales();
        $scope.borratemporales2();
        $scope.btnOG = 1;

        $scope.PagoG = {

            unidad: '',
            folio: '',
            tipotramite: '',
            concepto: '',
            etapa: '',
            foliofiscal: '',
            subtotal: '',
            descuento: '',
            total: '',
            fechaemision: '',
            observacion: '',
            rfcemisor: '',
            serie:'',
            foliointerno: '',
            emisor: '',
            impuesto: '',
            tasa: '',
            usuarioentrega: '',
            prefactura: ''

        }

        $scope.PagoI = {

            unidad: '',
            folio: '',
            tipotramite: '',
            concepto: '',
            etapa: '',
            foliofiscal: '',
            subtotal: '',
            descuento: '',
            total: '',
            fechaemision: '',
            observacion: '',
            rfcemisor: '',
            serie:'',
            foliointerno: '',
            emisor: '',
            impuesto: '',
            tasa: '',
            usuarioentrega: '',
            prefactura: ''

        }

        $scope.detalles = {

            Subtotal: 0.00,
            Total: 0.00
        }

        $scope.listado ={

            serie: ''
        }

        $scope.archivos = [];

    }

    $scope.borratemporales = function(){

      find.borratemporales($rootScope.user).success(function (data){

      });

    }
    $scope.borratemporales2 = function(){

      find.borratemporales2($rootScope.user).success(function (data){

      });

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

    $scope.calculaSubtotal = function(){

        var suma = 0;
        var suma1 = 0;
        var IVA = 0.16;

      
        for (var i = 0; i < $scope.detalles.length; i++) {
                  
            suma+= parseFloat($scope.detalles[i].Subtotal);
            var mm = suma.toFixed(2);
            $scope.PagoG.SubtotalS = mm;

            var calculoIVA = parseFloat($scope.detalles[i].Subtotal)*parseFloat(IVA);
            $scope.detalles[i].Total= parseFloat($scope.detalles[i].Subtotal)+parseFloat(calculoIVA);
            
            suma1+= parseFloat($scope.detalles[i].Total);
            var mm1 = suma1.toFixed(2);
            $scope.PagoG.TotalS = mm1;


        }

    }

    $scope.fRegistro = function(){

        loading.cargando('Buscando Folio');
        OPFactura.listado($scope.datosRegistro).success(function (data){

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
    $scope.subeFactInd = true;

    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: false
    };

    var csvOpts = { columnOverrides: { obj: function (o) {
        return o.no + '|' + o.timeOfDay + '|' + o.E + '|' + o.S+ '|' + o.I+ '|' + o.pH+ '|' + o.v;
        } },
        iEUrl: 'downloads/download_as_csv'
    };

    var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns  track by $index" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';
    
    $scope.onDblClickRow = function(row){
      // $location.path('/detallerelacion/'+row.entity.relacion);
      console.log(row);

    };

    ////opciones del grid                 
    $scope.gridOptions = {
        data: 'listado',
        enableColumnResize:true,
        enablePinning: true,
        enableRowSelection:true,
        multiSelect:true,
        showFooter: true,
        showFilter:true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
        selectedItems: $scope.selectos,
        filterOptions: $scope.filterOptions,
        // rowTemplate: rowTempl,
        columnDefs: [
                    { field:'', displayName:'Revisar', width: 130,   cellTemplate: '<label class="btn btn-purple" ng-disabled="subeFactInd != 1 || selectos.length == 0">Analizar Prefc <input type="button" style="display: none;" ng-click="verificaPrefactura(row,row.rowIndex)"></label>'},
                    { field:'Folio',  displayName:'Folio', width: 150, cellTemplate: '<label class="btn btn-primary" ng-disabled="subeFactInd != 1 || selectos.length == 0">Sube Factura <input type="file" style="display: none;" ng-file-select="subeXMLInd(row,row.rowIndex,$files)"></label>'},
                    { field:'foliofiscal', displayName:'Folio Fiscal', width: 200 },
                    { field:'total', displayName:'Total', width: 120 },
                    { field:'prefactura', displayName:'Prefactura', width: 120, enableCellEdit : true },
                    { field:'Reserva', displayName:'Reserva', width: 120 }, 
                    { field:'DOC_folio', displayName:'Folio', width: 120},
                    { field:'FLD_etapa', displayName:'Etapa', width: 120 },
                    { field:'FLD_numeroEntrega', displayName:'Entrega', width: 100},
                    { field:'EMP_nombrecorto', displayName:'Empresa', width: 120 },
                    { field:'UNI_nombrecorto', displayName:'Unidad', width: 200 },
                    { field:'Triage', width: 120 },
                    { field:'FLD_fechaent', displayName:'FechaEntrega', width: 100, visible:true },
                    { field:'DOC_claveint', width: 100, visible:false },
                    { field:'FLD_claveint', width: 100, visible:false },
                    { field:'FLD_AROrec', width: 100, visible:false },
                    { field:'USU_rec', width: 100, visible:false },
                    { field:'USU_recibe', width: 100, visible:false },
                    { field:'', displayName:'motivo', width: 20, visible:false },
                    { field:'ARO_porRecibir', width: 100, visible:false },
                    { field:'FLD_AROent', width: 100, visible:false },
                    { field:'USU_ent', width: 100, visible:false },
                    { field:'UNI_claveint', displayName:'claveunidad',width: 100}

        ]
    };
    $scope.$on('ngGridEventRows', function (newFilterText){

        var filas = newFilterText.targetScope.renderedRows;
        $scope.exportables = [];
        allChecked = true;

        // angular.forEach(filas , function(item){
        //     $scope.exportables.push(item.entity);
        // });
        // if (!$scope.gridOptions.$gridScope.checker){ console.log('hola');}
        // $scope.gridOptions.$gridScope.checker = {};
        // $scope.gridOptions.$gridScope.checker.checked = allChecked;

    });


     $scope.verificaPrefactura = function(row, index){

        console.log(row);

        var pref = row.entity.prefactura;

            var ruta = api+'consulta/verificaPrefactura/'+ pref; 
            var ruta2 = api+'consulta/existePrefactura/'+ pref; 


            $http.post(ruta).success(function (data){

                if (data.length == 0) {

                    $scope.mensaje1 = "La prefactura no se encontro, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-danger';
                    $scope.btnagrega = true;

                    $scope.borratemporales();
                    row.entity.importe = '';
                    row.entity.total = '';
                    row.entity.foliofiscal = '';
                    row.entity.fechaemision = '';
                    row.entity.descuento = '';
                    row.entity.emisor = '';
                    row.entity.descuento = '';
                    row.entity.serie = '';
                    row.entity.prefactura = '';
                    row.entity.elimina = false;
                    $scope.btndelete = false;
                
                
                }else if(data[0].cancelado == 'S'){

                    $scope.mensaje1 = "La prefactura esta CANCELADA, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-warning';
                    $scope.btnagrega = true;
                    $scope.borratemporales();
                    row.entity.importe = '';
                    row.entity.total = '';
                    row.entity.foliofiscal = '';
                    row.entity.fechaemision = '';
                    row.entity.descuento = '';
                    row.entity.emisor = '';
                    row.entity.descuento = '';
                    row.entity.serie = '';
                    row.entity.prefactura = '';
                    row.entity.elimina = false;
                    $scope.btndelete = false;


                }else if(data[0].pagado == 'S'){

                    $scope.mensaje1 = "La prefactura esta PAGADA, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-info';
                    $scope.btnagrega = true;

                    $scope.borratemporales();
                    row.entity.importe = '';
                    row.entity.total = '';
                    row.entity.foliofiscal = '';
                    row.entity.fechaemision = '';
                    row.entity.descuento = '';
                    row.entity.emisor = '';
                    row.entity.descuento = '';
                    row.entity.serie = '';
                    row.entity.prefactura = '';
                    row.entity.elimina = false;
                    $scope.btndelete = false;

                }else if (data[0].pagado == 'S'){

                    $scope.mensaje1 = "El Folio no corresponde con la Unidad o Proveedor seleccionado, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-info';
                    $scope.btnagrega = true;

                    $scope.borratemporales();
                    row.entity.importe = '';
                    row.entity.total = '';
                    row.entity.foliofiscal = '';
                    row.entity.fechaemision = '';
                    row.entity.descuento = '';
                    row.entity.emisor = '';
                    row.entity.descuento = '';
                    row.entity.serie = '';
                    row.entity.prefactura = '';
                    row.entity.elimina = false;
                    $scope.btndelete = false;

                }

                else if(data[0].foliomv == '' || data[0].foliomv == null){

                    $scope.mensaje1 = "Los Folios no estan ASOCIADOS, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-purple';
                    $scope.btnagrega = true;

                    $scope.borratemporales();
                    row.entity.importe = '';
                    row.entity.total = '';
                    row.entity.foliofiscal = '';
                    row.entity.fechaemision = '';
                    row.entity.descuento = '';
                    row.entity.emisor = '';
                    row.entity.descuento = '';
                    row.entity.serie = '';
                    row.entity.prefactura = '';
                    row.entity.elimina = false;
                    $scope.btndelete = false;


                }else{


                    $http.post(ruta2).success(function (data){

                    $scope.mensaje1 = "Correcto, Ingresa tu Factura";
                    $scope.tipoalerta = 'alert-success';


                        if (data.length == 1) {


                            $scope.mensaje1 = "Esta prefactura ya Existe en sistema";
                            $scope.tipoalerta = 'alert-pink';

                            $scope.borratemporales();
                            row.entity.importe = '';
                            row.entity.total = '';
                            row.entity.foliofiscal = '';
                            row.entity.fechaemision = '';
                            row.entity.descuento = '';
                            row.entity.emisor = '';
                            row.entity.descuento = '';
                            row.entity.serie = '';
                            row.entity.prefactura = '';
                            row.entity.elimina = false;
                            $scope.btndelete = false;


                        }
                        else{

                            $scope.mensaje1 = "Esta prefactura ya Existe en sistema";
                            $scope.tipoalerta = 'alert-pink';
                            

                    
                        }


                    }).error( function (data){

                        $scope.mensaje1 = "Hubo un error de conexión, Verificalo con el Area de Sistemas";
                        $scope.tipoalerta = 'alert-danger';

                    });

                }


            }).error( function (data){

                alert("Hubo un error de conexión, Verificalo con el Area de Sistemas");


            });
    }


    $scope.verificaPrefacturaGlo = function(index){

        console.log(index);

            var pref = $scope.detalles[index].prefactura;

            var ruta = api+'consulta/verificaPrefactura/'+ pref; 
            var ruta2 = api+'consulta/existePrefactura/'+ pref; 

            $http.post(ruta).success(function (data){

                if (data.length == 0) {

                    $scope.mensaje1 = "La prefactura no se encontro, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-danger';
                    $scope.detalles[index].prefactura = '';

                
                }else if(data[0].cancelado == 'S'){

                    $scope.mensaje1 = "La prefactura esta CANCELADA, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-warning';
                    $scope.detalles[index].prefactura = '';


                }else if(data[0].pagado == 'S'){

                    $scope.mensaje1 = "La prefactura esta PAGADA, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-info';
                    $scope.detalles[index].prefactura = '';


                }else if (data[0].pagado == 'S'){

                    $scope.mensaje1 = "El Folio no corresponde con la Unidad o Proveedor seleccionado, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-info';
                    $scope.detalles[index].prefactura = '';


                }

                else if(data[0].foliomv == '' || data[0].foliomv == null){

                    $scope.mensaje1 = "Los Folios no estan ASOCIADOS, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-purple';
                    $scope.detalles[index].prefactura = '';

                }else{


                    $http.post(ruta2).success(function (data){




                        if (data.length == 1) {


                            $scope.mensaje1 = "Esta prefactura ya Existe en sistema";
                            $scope.tipoalerta = 'alert-pink';
                            $scope.detalles[index].prefactura = '';



                        }
                        else{

                        $scope.mensaje1 = "Correcto, Ingresa tu Factura";
                        $scope.tipoalerta = 'alert-success';

                                    

                    
                        }


                    }).error( function (data){

                        $scope.mensaje1 = "Hubo un error de conexión, Verificalo con el Area de Sistemas";
                        $scope.tipoalerta = 'alert-danger';
                        $scope.detalles[index].prefactura = '';

                    });

                }


            }).error( function (data){

                        $scope.mensaje1 = "Hubo un error de conexión, Verificalo con el Area de Sistemas";
                        $scope.tipoalerta = 'alert-danger';

            });

    }




    $scope.filtra = function(){

        if($scope.unidad == undefined || $scope.unidad == 0){
            var objeto1 = "";
            $scope.filtrado.Unidad = '';
        }else{
            var objeto1 = "claveunidad:" + $scope.unidad.id + "; ";
            $scope.filtrado.Unidad = $scope.unidad.id;

            console.log($scope.filtrado);
            
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

        console.log($scope.filterOptions.filterText);

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

   $scope.IngresaFacturaGlo = function(success){

        console.log($scope.selectos);
        $scope.relaciones = {
            tipofactura: 2

        }

        if ($scope.unidad == '' || $scope.unidad == undefined) {

            alert('Debes Realizar busqueda x Unidad');
            location.reload();
        };

        $scope.recibe = false;
        $scope.subeFactGlo = true;

        $scope.relacionesFol= [];
        for (var i = 0; i < $scope.selectos.length; i++){

             $scope.relacionesFol.push($scope.selectos[i]);

        };

        if ($scope.relacionesFol.length > 0){

            console.log($scope.relacionesFol);

            $scope.iniciorelacion = false;
            $scope.finrelacion = true;
            $scope.tituloFinRelacion = "Relación de Folios";

            console.log($scope.relacionesFol);

            $scope.detalles = $scope.relacionesFol;
            $scope.referencia = $scope.relacionesFol[0].referencia;

    }else{

        swal("Oops...", "No seleccionaste Folios", "error")

    }
// });

    }
$scope.subeXML = function($files){

        var aux = $files[0].name.split('.');

        if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){

         for (var i = 0; i < $files.length; i++){
         var file = $files[i];
         var amt = 0;
          $scope.upload = $upload.upload({
                url: api+'OPFactura/upload/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                method: 'POST',
                data: $scope.PagoG,
                file: file // or list of files ($files) for html5 only
        }).success(function (data){

               leexml.getxmltemporal($rootScope.user,data.archivo).success(function(data){
                var xml = JSON.stringify(x2js.xml_str2json(data));
                var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                var courses =  x2js.json2xml_str($.parseJSON(prueba));
                courses  = x2js.xml_str2json(courses);
                // console.log(prueba);
                console.log(courses);

                FacturaNormal.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){     
                    if (data[0].count > 0){

                          $scope.eliminaxmlGlo();
                          $scope.btnOG = 1;
                          swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                          $scope.archivos = [];
                          // alert('Ya existe una Factura con ese Folio Fiscal');
                                          
                    }else{

                    FacturaNormal.validaUnidad($scope.unidad.id).success(function (data){ 
                        if (data.length > 0){

                            console.log(courses.comprobante.emisor._rfc);

                            $scope.PagoG.rfcemisor = data[0].rfc;
                            $scope.PagoG.unidad = data[0].unidad;

                        if ($scope.PagoG.rfcemisor == courses.comprobante.emisor._rfc){

                            if((courses.comprobante._fecha >= '2018-01-01') && (courses.comprobante._version != '3.3')){

                                swal('Upss','Revisa la versión de tu xml, solo se acepta 3.3 a partir del 2018','error');


                            }else{


                                $scope.PagoG.serie = courses.comprobante._serie;
                                $scope.PagoG.foliointerno = courses.comprobante._folio;

                                var subglobal = courses.comprobante._subtotal;
                                var subglobal1 = parseFloat(subglobal);
                                var subglobal2 = subglobal1.toFixed(2);
                                $scope.PagoG.subtotal = subglobal2;

                                var totalglobal = courses.comprobante._total;
                                var totalglobal1 = parseFloat(totalglobal);
                                var totalglobal2 = totalglobal1.toFixed(2);
                                $scope.PagoG.total = totalglobal2;

                                $scope.PagoG.foliofiscal = courses.comprobante.complemento.timbrefiscaldigital._uuid;
                                $scope.PagoG.fechaemision = courses.comprobante._fecha;
                                // $scope.PagoG.descuento = courses.comprobante._descuento;
                                $scope.PagoG.emisor = courses.comprobante.emisor._nombre;
                                $scope.PagoG.rfcemisor = courses.comprobante.emisor._rfc;
                                if(courses.comprobante.impuestos.traslados == undefined){

                                    $scope.PagoG.iva = '';
                                    $scope.PagoG.importeiva = '';

                                }else{

                                    $scope.PagoG.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                    $scope.PagoG.importeiva = courses.comprobante.impuestos.traslados.traslado._importe;

                                }

                                if (courses.comprobante.impuestos.retenciones == undefined) {

                                    $scope.PagoG.isr = '';
                                    $scope.PagoG.importeisr = '';


                                }else{


                                    $scope.PagoG.isr = courses.comprobante.impuestos.retenciones.retencion._impuesto;
                                    $scope.PagoG.importeisr = courses.comprobante.impuestos.retenciones.retencion._importe;

                                }

                                if (courses.comprobante._descuento == undefined) {

                                    $scope.PagoG.descuento= 0;


                                }else{


                                    $scope.PagoG.descuento= courses.comprobante._descuento;

                                }
                                $scope.PagoG.usuarioentrega = Number($rootScope.id);
                                // $scope.PagoG.areaentrega =Number(areaEntrega);
                                // $scope.PagoG.usuariorecibe =Number(usuarioRecibe);
                                // $scope.PagoG.arearecibe =Number(areaRecibe);
                                // $scope.PagoG.folio = data.Folios;
                                $scope.PagoG.tipoorden = 2;
                                $scope.btndelete = true;
                                $scope.btnOG = 0;



                            }

                        
                        }else{

                            swal('Upss','Tu Factura no coincide con el Emisor','error');

                            // var archivo = $scope.datos.leexml;
                           $scope.eliminaxmlGlo();
                           $scope.btnOG = 0;
                           $scope.archivos = [];

                        }
                    }else{

                      swal("Upss", "El proveedor no se encuentra en el sistema, Solicitalo al area de Sistemas", "error");
                      $scope.eliminaxmlGlo();
                      $scope.archivos = [];

                    }

                });
                    }
                });


            });

            // }

                $scope.archivos.push(data.ruta);


        }).error( function (xhr,status,data){

                  alert('Ocurrio un error');

                });
            }

        }else{

               alert('La extensión debe ser xml');
        }
}

$scope.enviaOrdenPagoGlo = function(){

    $scope.OPago = {

        seleccionados : $scope.detalles,
        archivos : $scope.archivos,
        usucarpeta: $rootScope.user,
        factura: $scope.PagoG,
        subtotaltotal: parseFloat($scope.PagoG.subtotal) - parseFloat($scope.PagoG.descuento),
        // importeiva: $scope.PagoG.importeiva,
        // importeisr: $scope.PagoG.importeisr,
        total: $scope.PagoG.total,
        usuario: $rootScope.id,
        unidad: $scope.PagoG.unidad

    }

    console.log($scope.OPago);

    var valor = $scope.OPago.subtotaltotal;
    var mm = valor.toFixed(2);
    $scope.OPago.subtotaltotal = mm;

// console.log($scope.OPago.subtotaltotal);
// console.log($scope.PagoG.SubtotalS);

    // if ($scope.OPago.subtotaltotal !=  $scope.PagoG.SubtotalS){

    //    swal("Upss","El Monto de los Pagos no Coincide con el Subtotal de la Factura","error");

    // }else

    // if ($scope.OPago.total != $scope.PagoG.TotalS){

    //    swal("Upss","El Monto de los Pagos no Coincide con el Total de la Factura","error");

    // }else{

// console.log($scope.OPago );

        var areaRecibe = 6;
        var areaEntrega = 6;
        var usuarioRecibe = $rootScope.id;

        var ruta = api+'OPFactura/ordenPago';

            $http.post(ruta,$scope.OPago).success(function (data){

                // $scope.borratemporales();
                swal("ok","Se Genero una Orden de Pago","success");
                location.reload();


            }).error( function (data){

                alert('Error, Intentalo de Nuevo');

            });
    // }

}

$scope.eliminaxmlGlo = function(){

    $http.post(api+'OPFactura/eliminaxml',{usuario: $rootScope.user}).success(function (data){

      $scope.PagoG.foliointerno = '';
      $scope.PagoG.serie = '';
      $scope.PagoG.foliofiscal = '';
      $scope.PagoG.emisor = '';
      $scope.PagoG.rfcemisor = '';
      $scope.PagoG.subtotal = '';
      $scope.PagoG.tasa = '';
      $scope.PagoG.total = '';
      $scope.PagoG.fechaemision = '';
      $scope.btnOG = 0;
      $scope.archivos= [];

    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

    });

}


//////////// factura individual //////////////////

$scope.IngresaFacturaInd = function(){

    $scope.subeFactInd = 1;

    $scope.relaciones = {
            tipofactura: 1

    }

    if ($scope.unidad == '' || $scope.unidad == undefined) {

        swal("Upss","Debes Seleccionar una Unidad para subir tu Factura","error");
        $scope.listado = [];
        $scope.subeFactInd = 0;
    };

    // $scope.recibe = false;
    // $scope.subeFactInd = true;
    // $scope.subefactura = true;

    // $scope.detalles = $scope.selectos;

    $scope.relacionesFol= [];
    for (var i = 0; i < $scope.selectos.length; i++){


         $scope.relacionesFol.push($scope.selectos[i]);

    };
        // console.log($scope.relacionesFol[0].claveunidad);
        // find.unidadesref($scope.relacionesFol[0].claveunidad).success( function (data) {

            // var referencia = data.ref;

        if ($scope.relacionesFol.length > 0){



            // console.log($scope.relacionesFol);

            // $scope.iniciorelacion = false;
            // $scope.finrelacion = true;
            // $scope.tituloFinRelacion = "Relación de Folios";

            // console.log($scope.relacionesFol);

            // $scope.detalles = $scope.relacionesFol;
            // $scope.referencia = $scope.relacionesFol[0].referencia;

            // var suma = 0;
            // var suma1 = 0;
            // var suma2 = 0;
            // var suma3 = 0;
            // var suma4 = 0;
            // for (var i = 0; i < $scope.detalles.length; i++){

            //     if ($scope.detalles[i].total != ''){
            //         console.log($scope.detalles[i].total);
            //         var valor2 = $scope.detalles[i].total;
            //         var numero2 = valor2.replace(",",'');
            //         suma2 += parseFloat(numero2);
            //         var sumas2 = suma2.toFixed(2);
            //         $scope.totalimporte= sumas2;
            //     }

            //     if ($scope.detalles[i].subtotal!= ''){
            //         var valor3 = $scope.detalles[i].subtotal;
            //         var numero3 = valor3.replace(",",'');
            //         suma3 += parseFloat(numero3);
            //         var sumas3 = suma3.toFixed(2);
            //         $scope.totalsubtotal= sumas3;
            //     }

            //     if ($scope.detalles[i].tasa!= ''){
            //         var valor4 = $scope.detalles[i].tasa;
            //         var numero4 = valor4.replace(",",'');
            //         suma4 += parseFloat(numero4);
            //         var sumas4 = suma4.toFixed(2);
            //         $scope.totaltasa= sumas4;
            //     }

            // }


            // console.log($scope.detalles[1].tasa);

        //   swal({
        //       title: "",
        //       text:  data[0].ref + "_" + "" + "Ingresa N° Relación",
        //       type: "input",
        //       imageUrl: "images/relacion.png",
        //       closeOnConfirm: false,
        //       animation: "slide-from-top",
        //       inputPlaceholder: "N° Relación" },

        //       function(inputValue){
        //         if (inputValue === false) return false;
        //         if (inputValue === ""){

        //         inputValue = 0;
        //           // swal.showInputError("Ocurrio un Error!!");
        //           // return false
        //         }
        //         $scope.numrelacion = data[0].ref + "_" +inputValue;
        //         swal("OK!", "El N° Relación Factura es: " + data[0].ref + "_" + inputValue, "success");
        //         $('#ventanarelacion').modal('show');


        // });
    }else{

        swal("Oops...", "No seleccionaste Folios", "error")

    }

}

$scope.subeXMLInd = function(row,idx,$files){

    console.log($scope.selectos);

    var aux = $files[0].name.split('.');

    if(aux[aux .length-1] == 'xml' || aux[aux .length-1] == 'XML'){
console.log($files);
                for (var i = 0; i < $files.length; i++){
                 var file = $files[i];
                  var amt = 0;
                  $scope.upload = $upload.upload({
                        url: api+'OPFactura/upload/'+$rootScope.user, //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        data: $scope.datos,
                        file: file // or list of files ($files) for html5 only
                  }).success(function (data){

                    // if(idx == 0){ var id = 0 }else{ id = idx-1}
                    console.log(idx);

                        leexml.getxmltemporal($rootScope.user,data.archivo[0]).success(function(data){
                        var xml = JSON.stringify(x2js.xml_str2json(data));
                        var prueba = xml.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
                        
                        var courses =  x2js.json2xml_str($.parseJSON(prueba));
                        courses  = x2js.xml_str2json(courses);
                        // console.log(prueba);
                        console.log(courses);

                           FacturaNormal.consultaFolioFiscal(courses.comprobante.complemento.timbrefiscaldigital._uuid).success(function (data){
                                 
                                  if (data[0].count != 0){

                                    swal('Upss','Ya existe una Factura con ese Folio Fiscal','error');
                                    $scope.borratemporales();
                                    row.entity.importe = '';
                                    row.entity.total = '';
                                    row.entity.foliofiscal = '';
                                    row.entity.fechaemision = '';
                                    row.entity.descuento = '';
                                    row.entity.emisor = '';
                                    row.entity.descuento = '';
                                    row.entity.serie = '';
                                    row.entity.elimina = false;
                                    $scope.btndelete = false;

                                  }
                            });
                                if ((courses.comprobante._fecha >= '2018-01-01') && (courses.comprobante._version != '3.3')){


                                    swal('Upss','Revisa la versión de tu xml, solo se acepta 3.3 a partir del 2018','error');

                                    // var archivo = $scope.datos.leexml;
                                    row.entity.foliofiscal = '';
                                    row.entity.total = '';


                                    // for (var i = 0; i < $scope.selectos.length; i++){

                                    // var valor1 = $scope.selectos[i].total;
                                    // var numero1 = valor1.replace(",",'');
                                    // suma1 += parseFloat(numero1);
                                    // var sumas1 = suma1.toFixed(2);
                                    // $scope.totalimporte= sumas1;

                                    // console.log($scope.totalimporte);

                                    // }
                                }else{


                                     var suma1 = 0;                                   

                                    if(courses.comprobante._serie == undefined){ row.entity.serie = ''; }else{ row.entity.serie = courses.comprobante._serie };
                                    row.entity.foliointerno = courses.comprobante._folio;
                                    row.entity.subtotal = courses.comprobante._subtotal;
                                    row.entity.total = courses.comprobante._total;
                                    row.entity.foliofiscal = courses.comprobante.complemento.timbrefiscaldigital._uuid;
                                    row.entity.fechaemision = courses.comprobante._fecha;
                                    row.entity.descuento = courses.comprobante._descuento;
                                    row.entity.emisor = courses.comprobante.emisor._nombre;
                                    row.entity.rfcemisor = courses.comprobante.emisor._rfc;
                                    // row.entity.impuesto = courses.comprobante.Impuestos.Traslados.Traslado._impuesto;
                                    // row.entity.tasa = courses.comprobante.Impuestos.Traslados.Traslado._tasa;
                                    row.entity.usuarioentrega = Number($rootScope.id);
                                    row.entity.tipoorden = 2;
                                    if(courses.comprobante.impuestos.traslados == undefined){

                                        row.entity.iva = '';
                                        row.entity.importeiva = '';

                                    }else{

                                        row.entity.iva = courses.comprobante.impuestos.traslados.traslado._impuesto;
                                        row.entity.importeiva = courses.comprobante.impuestos.traslados.traslado._importe;

                                    }

                                    if (courses.comprobante.impuestos.retenciones == undefined) {

                                        row.entity.isr = '';
                                        row.entity.importeisr = '';


                                    }else{


                                        row.entity.isr = courses.comprobante.impuestos.retenciones.retencion._impuesto;
                                        row.entity.importeisr = courses.comprobante.impuestos.retenciones.retencion._importe;

                                    }
                                    row.entity.elimina = true;
                                    $scope.btndelete = true;


                                }
                                
                                

                      });
                   // }
                        $scope.archivos.push(data.archivo);

                    }).error( function (xhr,status,data){

                          alert('Ocurrio un error');

                    });
                }

                }else{

                       alert('La extensión debe ser xml');
                  // return false;

                }

}

$scope.enviaOrdenPagoInd = function(){

    console.log($scope.selectos);

    $scope.OPago = {

        seleccionados : $scope.selectos,
        archivos : $scope.archivos,
        usucarpeta: $rootScope.user,
        factura: $scope.selectos,
        subtotaltotal: $scope.totalsubtotal,
        iva: $scope.totaltasa,
        total: $scope.totalimporte,
        usuario: $rootScope.id,
        unidad: $scope.unidad

    }

        var areaRecibe = 6;
        var areaEntrega = 6;
        var usuarioRecibe = $rootScope.id;

        var ruta = api+'OPFactura/ordenPagoIndividual';

        $http.post(ruta,$scope.OPago).success(function (data){

            $scope.borratemporales();
            swal("ok","Se Genero una Orden de Pago","success");
            location.reload();


        }).error( function (data){

            alert('Error, Intentalo de Nuevo');

        });
}

$scope.eliminaxmlInd = function(idx){

    var archivo = $scope.archivos[idx];
    console.log(archivo);
    console.log(idx);

    $http.post(api+'OPFactura/eliminaxmlInd/' + archivo, {usuario:$rootScope.user}).success(function (data){

        $scope.detalles[idx].importe = '';
        $scope.detalles[idx].total = '';
        $scope.detalles[idx].foliofiscal = '';
        $scope.detalles[idx].fechaemision = '';
        $scope.detalles[idx].descuento = '';
        $scope.detalles[idx].emisor = '';
        $scope.detalles[idx].descuento = '';
        $scope.detalles[idx].serie = '';

    }).error( function (data){

        alert('Ocurrio un error, Intentalo de nuevo');

    });
}


$scope.FoliosinFactura = function(success){

        console.log($scope.selectos);
        $scope.relaciones = {
            tipofactura: 2

        }

        if ($scope.unidad == '' || $scope.unidad == undefined) {

            alert('Debes Realizar busqueda x Unidad');
            location.reload();
        };

        $http.post(api+'OPFactura/subeFolios', {selecionado:$scope.selectos}).success(function (data){

            swal("Oops...", "Tu Folio esta listo para relacionar", "success");


        }).error( function (data){

            alert('Ocurrio un error, Intentalo de nuevo');

        });



    //     if ($scope.relacionesFol.length > 0){

    //         console.log($scope.relacionesFol);

    //         $scope.iniciorelacion = false;
    //         $scope.finrelacion = true;
    //         $scope.tituloFinRelacion = "Relación de Folios";

    //         console.log($scope.relacionesFol);

    //         $scope.detalles = $scope.relacionesFol;
    //         $scope.referencia = $scope.relacionesFol[0].referencia;

    // }else{

    //     swal("Oops...", "No seleccionaste Folios", "error")

    // }
// });

    }

};


listadosinFacturaCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading','$filter','$location','$http','checkFolios','api','$upload','leexml', 'OPFactura','FacturaNormal'];
// flujoPagosCtrl.$inject = ['$scope','$rootScope', 'find','loading', '$http', 'api','datos','$filter'];

app.controller('listadosinFacturaCtrl',listadosinFacturaCtrl);
// app.controller('flujoPagosCtrl',flujoPagosCtrl);
