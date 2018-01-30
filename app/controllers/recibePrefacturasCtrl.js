function recibePrefacturasCtrl($scope, $rootScope, loading,$filter,$location,$http,checkFolios,api, find, PagoManual){

    loading.despedida();

    $scope.inicio = function(){

        $rootScope.area = 6;
        $scope.Proveedores();
        $scope.listado = [];
        $scope.btnagrega = true;
        $scope.listadoPre();


        $scope.datos = {

            prefactura: '',
            unidad: '',
            proveedor: '',
            foliomv: ''

        }

    }


    $scope.listadoPre = function(){

        find.busquedaPrefacturas().success(function (data){
                
            $scope.listado = data; 
                // $scope.datos = [];

        });
    }

    $scope.Proveedores = function(){

        find.busquedaProveedor().success(function (data){
                
            $scope.proveedores = data; 
                // $scope.datos = [];

        });
    }


    $scope.verificaPrefactura = function(){

        console.log($scope.datos);

            var ruta = api+'consulta/verificaPrefactura/'+ $scope.datos.folioPrefactura; 

            $http.post(ruta).success(function (data){

                if (data.length == 0) {

                    $scope.mensaje = "La prefactura no se encontro, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-danger';
                    $scope.btnagrega = true;
                
                
                }else if(data[0].cancelado == 'S'){

                    $scope.mensaje = "La prefactura esta CANCELADA, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-warning';
                    $scope.btnagrega = true;


                }else if(data[0].pagado == 'S'){

                    $scope.mensaje = "La prefactura esta PAGADA, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-info';
                    $scope.btnagrega = true;

                }else if (data[0].pagado == 'S'){

                    $scope.mensaje = "El Folio no corresponde con la Unidad o Proveedor seleccionado, Verificalo con el Area de Sistemas";
                    $scope.tipoalerta = 'alert-info';
                    $scope.btnagrega = true;



                // }

                // else if(data[0].foliomv == '' || data[0].foliomv == null){

                //     $scope.mensaje = "Los Folios no estan ASOCIADOS, Verificalo con el Area de Sistemas";
                //     $scope.tipoalerta = 'alert-purple';
                //     $scope.btnagrega = true;


                // }

                }else{

                    $scope.datos.totalprefactura  = data[0].importe;
                    $scope.datos.totalprefactura = parseFloat($scope.datos.totalprefactura,2);
                    $scope.datos.aseguradora = data[0].aseguradora;
                    $scope.datos.fechaprefactura = data[0].fechaprefactura;
                    $scope.datos.foliomv = data[0].foliomv;
                    $scope.datos.foliozima = data[0].foliozima;
                    $scope.datos.lesionado = data[0].lesionado;
                    $scope.mensaje = '';
                    $scope.tipoalerta = true;
                    $scope.btnagrega = false;
                    $scope.datos.usuarioRecibe = $rootScope.id;

                }


            }).error( function (data){

                alert("Hubo un error de conexión, Verificalo con el Area de Sistemas");


            });
    }

    // $scope.Agrega = function(){

    //     $scope.listado.unshift($scope.datos);
    //     // $scope.datos = [];
    //     // $scope.btnagrega = true;
    //     console.log($scope.listado);



    // }

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
        enableRowSelection:true,
        multiSelect:true,
        showSelectionCheckbox: false,
        selectWithCheckboxOnly: false,
        enableCellSelection: true,
        selectedItems: $scope.selectos, 
        enableCellEdit: true,
        columnDefs: [
                    { field:'folioprefactura', width: 120 },
                    { field:'foliozima', width: 120 },
                    { field:'foliomv', width: 120 },
                    { field:'importe', width: 120 },
                    { field:'fecharegistro', width: 160 }


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


    $scope.RecibePrefacturas = function(){

        console.log($scope.datos);


        var ruta = api+'PagoManual/insertaPrefacturas'; 


        $http.post(ruta,$scope.datos).success(function (data){

            find.busquedaPrefacturas().success(function (data){

                if(data){
                    
                    $scope.listado = data; 
                    $scope.datos = [];
                    swal("OK...", "Prefacturas Recibidas", "success")


                }

            });


        }).error( function (data){

            alert("Hubo un error de conexión, Verificalo con el Area de Sistemas");


        });
    }


}

recibePrefacturasCtrl.$inject = ['$scope', '$rootScope',  'loading','$filter','$location','$http','checkFolios','api','find', 'PagoManual'];
app.controller('recibePrefacturasCtrl',recibePrefacturasCtrl);
