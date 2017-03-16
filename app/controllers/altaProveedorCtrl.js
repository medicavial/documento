function altaProveedorCtrl($scope, $rootScope, loading,$filter,$location,$http,checkFolios,api, proveedores){

    $scope.inicio = function(){

        $scope.tituloPrveedor = "Alta de Proveedores";

        $scope.proveedor = {

            nombre: '',
            rfc: '',
            referencia: '',
            activo: '',
            persona: ''
        }

        $scope.filtrado = {

            nombre : ''
        };

        $scope.listadoproveedor();

    }

    $scope.listadoproveedor = function(){

        proveedores.listadoproveedor().success( function (data){

            $scope.listado = data;

        });

    }

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

    var rowTempl = '<div ng-click="onDblClickRow(row)" data-toggle="modal" data-target="#detProveedor" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

    $scope.onDblClickRow = function(row){

        console.log(row);

        var estatus;

        if (row.entity.activo == 1) {

            estatus = "SI";
        }else{

            estatus = "NO";
        }

        $scope.proveedor = {

            nombre: row.entity.nombre,
            rfc: row.entity.rfc,
            referencia: row.entity.referencia,
            activo: estatus,
            persona: row.entity.persona,
            id: row.entity.id
        }

    };

    ////opciones del grid                 
    $scope.gridOptions = { 
        data: 'listado', 
        enableColumnResize:true,
        enablePinning: true, 
        enableRowSelection:true,
        multiSelect:false,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectedRows, 
        filterOptions: $scope.filterOptions,
        enableCellEdit: false,
        rowTemplate: rowTempl,
        columnDefs: [
                    { field:'nombre',displayName:'Nombre Proveedor', width: 500, pinned: true},
                    { field:'rfc', displayName:'RFC' , width: 150 , pinned: true, cellTemplate: '<div ng-class="{ \'text-danger\': row.entity.penalizado ==  \'1\'}" class="padding-cell"><i ng-if="row.entity.penalizado ==  \'1\'" class="glyphicon glyphicon-warning-sign"></i> {{row.getProperty(col.field)}}</div>'},
                    { field:'referencia', displayName:'Referencia' , width: 150, pinned: true },
                    { field:'persona', displayName:'Persona' , width: 120 , pinned: true},
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

        if($scope.proveedor.nombre == undefined || $scope.proveedor.nombre == 0){
            var objeto1 = "";
            $scope.filtrado.nombre = '';
        }else{
            var objeto1 = "Nombre:" + $scope.proveedor.nombre + "; ";
            $scope.filtrado.nombre = $scope.proveedor.nombre;
            
        }
        var filtro = objeto1;

        $scope.filterOptions.filterText = filtro;

        // console.log(filtro);

    }

    $scope.quitafiltro = function(){

        $scope.proveedor.nombre = '';
        $scope.filterOptions.filterText = '';

        $scope.filtrado = {

            nombre : ''
        }

    }

    $scope.guardaProveedor = function(){

        $http.post(api+'proveedores/guardaProveedor',$scope.proveedor).success(function (data){

            $scope.listadoproveedor();
            swal("ok","Proveedor creado con Exito","success");

        }).error( function (data){

            alert('Error, Intentalo de Nuevo');

        }); 
    }

    $scope.actualizaProveedor = function(){

        $http.post(api+'proveedores/actualizaProveedor',$scope.proveedor).success(function (data){

            $scope.listadoproveedor();
            swal("ok","Proveedor editado con Exito","success");
            $('#detProveedor').modal('hide')

        }).error( function (data){

            alert('Error, Intentalo de Nuevo');

        }); 
    }

}

altaProveedorCtrl.$inject = ['$scope', '$rootScope',  'loading','$filter','$location','$http','checkFolios','api', 'proveedores'];
app.controller('altaProveedorCtrl',altaProveedorCtrl);
