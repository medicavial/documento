function listadoComplementosCtrl($scope, $rootScope, find ,loading,$filter,$location,$http,relaciones,api){

    $scope.inicio = function(){

        $scope.titulo = "Listado de Complementos";
        $scope.listadosfacturas = [];

        $scope.datosRegistro = {

            fechaini : FechaAct,
            fechafin: FechaAct,
            unidad:'',
            empresa:'',
            folio:''
        }

        $scope.listadoComplemento();

        $scope.filtrado = {
            Unidad : '',
            Cliente : '',
            Etapa:'',
            Folio  :''
        };

        $scope.detalle = {

            rfc: '',
            nombreEmisor: '',
            foliofiscal: '',
            serie: '',
            total: ''
        }
    }
    //busca unidades
    $scope.listadoComplemento = function(){

        loading.cargando('Buscando Folio');

        relaciones.listadoCom().success(function (data){
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

    var rowTempl = '<div ng-click="onDblClickRow(row)" data-toggle="modal" data-target="#myModal" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

    $scope.onDblClickRow = function(row){
        
        /////////// detalle del complemento //////////////////////

        $scope.detalle = {

            rfc: row.entity.CMP_rfcEmisor,
            nombreEmisor: row.entity.CMP_nombreEmisor,
            foliofiscal: row.entity.CMP_foliofiscal,
            total: row.entity.CMP_monto
                 
        }

        //////////  detalle de cada factura dentro del complemento //////////////////////

        relaciones.detalleComp(row.entity.CMP_foliofiscal).success(function (data){

            $scope.listadosfacturas = data.listado;
            $scope.sumaImportes     = data.pagado[0].pagado;



        });

    };
    ////opciones del grid                 
    $scope.gridOptions = {
        data: 'listado',
        enableColumnResize:true,
        enablePinning: true,
        enableRowSelection:true,
        multiSelect:false,
        showFooter: true,
        showFilter:true,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        selectedItems: $scope.selectos,
        filterOptions: $scope.filterOptions,
        rowTemplate: rowTempl,
        columnDefs: [
                    { field:'CMI_foliofiscal',displayName:'CMI_foliofiscal', width: 300, pinned: true},
                    { field:'CMI_rfcEmisor',displayName:'CMI_rfcEmisor', width: 150 , pinned: true, cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'CMI_tipocomprobante',displayName:'CMI_tipocomprobante', width: 150, pinned: true },
                    { field:'CMI_metodopago',displayName:'CMI_metodopago', width: 150 , pinned: true},
                    { field:'CMI_folio',displayName:'CMI_folio', width: 150 },
                    { field:'CMI_serie',displayName:'CMI_serie', width: 150 },
                    { field:'CMI_subtotal',displayName:'CMI_subtotal', width: 150 },
                    { field:'CMI_monto',displayName:'CMI_monto', width: 150 },
                    { field:'CMI_fechaEmision',displayName:'CMI_fechaEmision', width: 150 },
                    { field:'CMI_fechareg',displayName:'CMI_fechareg', width: 150 },
                    { field:'DEE_foliofiscal',displayName:'DEE_foliofiscal', width: 150 },
                    { field:'CME_foliofiscal',displayName:'CME_foliofiscal', width: 150 },
                    { field:'CME_rfcEmisor',displayName:'CME_rfcEmisor', width: 150 },
                    { field:'CME_tipocomprobante',displayName:'CME_tipocomprobante', width: 150 },
                    { field:'CME_metodopago',displayName:'CME_metodopago', width: 150 },
                    { field:'CME_folio',displayName:'CME_folio', width: 150 },
                    { field:'CME_serie',displayName:'CME_serie', width: 150 },
                    { field:'CME_subtotal',displayName:'CME_subtotal', width: 150 },
                    { field:'CME_monto',displayName:'CME_monto', width: 150 },
                    { field:'CME_fechaEmision',displayName:'CME_fechaEmision', width: 150 },
                    { field:'CME_fechareg',displayName:'CME_fechareg', width: 150 },
                    { field:'DEC_foliofiscal',displayName:'DEC_foliofiscal', width: 150 },
                    { field:'DEC_impPagado',displayName:'DEC_impPagado', width: 150 },
                    { field:'DEC_saldoAnte',displayName:'DEC_saldoAnte', width: 150 },
                    { field:'DEC_saldoInsoluto',displayName:'DEC_saldoInsoluto', width: 150 },
                    { field:'DEC_metodoPago',displayName:'DEC_metodoPago', width: 150 },
                    { field:'DEC_moneda',displayName:'DEC_moneda', width: 150 },
                    { field:'DEC_numParcialidad',displayName:'DEC_numParcialidad', width: 150 },
                    { field:'DEC_serie',displayName:'DEC_serie', width: 150 },
                    { field:'DEC_folio',displayName:'DEC_folio', width: 150 },
                    { field:'DEC_foliofiscalRel',displayName:'DEC_foliofiscalRel', width: 150 },


        ],
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

        };

        
    }

    $scope.exporta = function(){

        $scope.selectos = $filter('filter')($scope.listado, $scope.filtrado);
        JSONToCSVConvertor($scope.selectos,'Reporte',true);        
    }

};


listadoComplementosCtrl.$inject = ['$scope', '$rootScope', 'find' , 'loading','$filter','$location','$http','relaciones','api','listadoManual'];
// flujoPagosCtrl.$inject = ['$scope','$rootScope', 'find','loading', '$http', 'api','datos','$filter'];

app.controller('listadoComplementosCtrl',listadoComplementosCtrl);
// app.controller('flujoPagosCtrl',flujoPagosCtrl);
