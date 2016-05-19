app.directive('capturaOriginal', capturaOriginal);

function capturaOriginal() {

    var directive = {
        restrict: 'EA',
        templateUrl: 'vistas/capturaOriginal.html',
        scope:{},
        controller: controladorOriginal
        // bindToController: true // because the scope is isolated
    };

    return directive;

}

controladorOriginal.$inject = ['$scope', '$rootScope', '$filter', '$location', '$http', 'find', 'loading', 'checkFolios','carga','api'];;

function controladorOriginal($scope, $rootScope, $filter, $location, $http, find, loading, checkFolios, carga, api) {
    // Injecting $scope just for comparison
    //muestra Ventan de alta de Original
    $('#myModal10').on('hidden.bs.modal', function (e) {
        $scope.inicio();
    });

    $('#myModal2').on('hidden.bs.modal', function (e) {
        $scope.inicio();
    });

    $rootScope.$watch('folioGlobal', function(newValue, oldValue) {
        // console.log(newValue);
        if (newValue.length == 10) {
            $scope.original.folio = newValue;
            $scope.validaOriginalA(newValue);
        };
    });


    $scope.inicio = function(){

        $scope.muestraEsc = false;
        $scope.captura = {
            unidad:'',
            medico:'',
            fecha:'',
            hora:'',
            tipoRehabilitacion:'',
            escalaDolor:'',
            escalaMejoria:'',
            observaciones:''
        }

        $scope.original = {
            folio:'',
            documento:0,
            tipoDoc:'',
            remesa:0,
            fecha:FechaAct,
            cliente:'',
            lesionado:'',
            unidad:'',
            producto:'',
            escolaridad:'',
            usuario: $rootScope.id,
            fechafax: '',
            fechafe: '' ,
            internet:1 ,
            original:0,
            numentrega:1,
            incompleto:'',
            factura:'',
            propia:'',
            totalfactura:0,
            captura:$scope.captura
        };

        $scope.muestraEntrega = false;
        $scope.consultaSub = false;
        $scope.mensaje = '';
        $scope.remesa = 0;
        $scope.label1 = '';
        $scope.label2 = '';
        $scope.label3 = '';
        $scope.unidadref = '';//referencia para la unidad
        $scope.esfax = 0;
        $scope.esfe = 0;
        $scope.esoriginal = 0;
        $scope.revisado = 0;
        $scope.bloqueo = false;
        $scope.bloqueoUni = false;
        $scope.cargar = false;

        $scope.cargaInfo();

        $('#folioO').focus();
    }

    $scope.cargaInfo = function(){

        carga.informacion().then(function(data){

            // console.log(data);
            $scope.clientes = data.clientes;
            $scope.unidades = data.unidades;
            $scope.productosini = data.productos;
            $scope.productos = data.productos;
            $scope.areas = data.areaOperativa;
            $scope.escolaridades = data.escolaridad;
            $scope.tipodocumentos = [{id:1,nombre:'Primera atención'},{id:2,nombre:'Subsecuencia'},{id:3,nombre:'Rehabilitación'}]; 

        });

    }

    //Verificamos si el fiolio esta dado de alta o se tiene que buscar en 
    $scope.validaOriginalA = function(folio){

        $scope.limpiaVariables();
        $scope.cargar = true;
        $scope.mensaje = '';
        // console.log(folio);
        //verificamos si tiene primera atencion
        checkFolios.validaFolio(folio, 1)
        .then( function (data){

            // console.log(data);
            //verificamos que sea segunda y que sea de propia 
            if (data.tipoDoc == 2) {

                if (data.capturado == 0) {
                    alert('La primera etapa del folio no se encuentra capturada, se guardará como registro normal');
                }else{
                    $scope.muestraEntrega = true;
                    $scope.original.numentrega = '';
                    $scope.original.propia = data.propia;
                }
            };

            $scope.original.tipoDoc = data.tipoDoc;
            $scope.original.documento = data.documento;
            $scope.original.fechafax = data.fechafax;
            $scope.original.fechafe = data.fechafe;
            $scope.original.cliente = data.cliente;
            $scope.original.lesionado = data.lesionado;
            $scope.original.unidad = data.unidad;
            $scope.original.documento = data.documento;

            $scope.productoOriginal($scope.original.cliente);
            $scope.referencia($scope.original.unidad);

            $scope.original.escolaridad = data.escolaridad;
            $scope.original.producto = data.producto;

            $scope.label2 = data.label2;
            $scope.label3 = data.label3;
            $scope.esfax = data.esfax;
            $scope.esfe = data.esfe;
            $scope.escolaridad = data.esoriginal;
            $scope.bloqueo = data.bloqueo;
            $scope.bloqueoUni = data.bloqueoUni;
            $scope.esoriginal = data.esoriginal;
            $scope.unidadref = data.unidadref;
            $scope.cargar = false;

        })
        .catch(function (err){
            alert(err);
            $scope.cargar = false;
        });
    }

    $scope.validaAtencion = function(){
        if ($scope.original.tipoDoc == 2) {
            $scope.validaSubsecuenciaA();
        }else if ($scope.original.tipoDoc == 3) {
            $scope.validaRehabilitacionA();
        }
    }

    //verificamos la subsecuencia 
    $scope.validaSubsecuenciaA = function(){

        if ($scope.original.numentrega != '' && $scope.original.numentrega != undefined) {
            // console.log('consulta web');
            $scope.consultaSub = true;

            //buscamos en subsecuencia de web por folio y numero de entrega
            find.consultaSubsecuencia($scope.original.folio,$scope.original.numentrega).success(function (data){
                // console.log(data);
                //si existe informacion de subsecuencia en web
                if (data) {
                    //si es propia la subsecuencia
                    if (data.propia == 'S') {

                        console.log(data.unidad)

                        $scope.captura.medico = data.medico;
                        $scope.captura.unidad = data.unidad;
                        $scope.captura.fecha = data.fecha;
                        $scope.captura.hora = data.hora;
                        
                        $scope.original.propia = 1;
                        $scope.original.unidad = data.unidad;
                        //se pasa a string por que sql server devuelve los id como string
                        $scope.unidadref = String(data.unidad);
                        $scope.referencia(data.unidad);

                    }else{

                        $scope.muestraEntrega = false;
                        $scope.consultaSub = false;
                        $scope.original.propia = 0;
                        $scope.original.numentrega = 1; 
                        // alert('La subsecuencia corresponde a una unidad de red verificalo en sistemas');
                    }
                //si no verificamos que no sea de propia si es de red dejamos seguir
                }else{
                    if ($scope.original.propia == 1) {
                        alert('La subsecuencia no existe verificalo nuevamente');
                        $scope.original.numentrega = ''; 
                    }else{
                        $scope.muestraEntrega = false;
                        $scope.consultaSub = false;
                        $scope.original.propia = 0;
                        $scope.original.numentrega = 1; 
                    }
                }

                $scope.consultaSub = false;

            }).error(function (data){

                $scope.consultaSub = false;
                if (data.respuesta && $scope.original.propia == 1) {
                    $scope.original.numentrega = ''; 
                    alert(data.respuesta);
                }else if ($scope.original.propia == 0) {
                    // console.log('entro aqui');
                    $scope.muestraEntrega = false;
                    $scope.consultaSub = false;
                    $scope.original.numentrega = 1; 
                }else{
                    alert('Error en la conexion si el problema persiste ve al area de sistemas');
                } 
            })
        };
    }

    $scope.validaRehabilitacionA = function(){

        if ($scope.original.numentrega != '' && $scope.original.numentrega != undefined) {
            // console.log('consulta web');
            $scope.consultaSub = true;

            //buscamos en subsecuencia de web por folio y numero de entrega
            find.consultaRehabilitacion($scope.original.folio,$scope.original.numentrega).success(function (data){
                // console.log(data);
                //si existe informacion de subsecuencia en web
                if (data) {
                    //si es propia la subsecuencia
                    if (data.propia == 'S') {

                        console.log(data.unidad)

                        $scope.captura.medico = data.rehabilitador;
                        $scope.captura.unidad = data.unidad;
                        $scope.captura.fecha = data.fecha;
                        $scope.captura.escalaDolor = data.escalaDolor;
                        $scope.captura.escalaMejoria = data.escalaMejoria;
                        $scope.captura.tipoRehabilitacion = data.tipoRehabilitacion;
                        $scope.captura.observaciones = data.observaciones;
                        
                        $scope.original.propia = 1;
                        $scope.original.unidad = data.unidad;
                        //se pasa a string por que sql server devuelve los id como string
                        $scope.unidadref = String(data.unidad);
                        $scope.referencia(data.unidad);

                    }else{

                        $scope.muestraEntrega = false;
                        $scope.consultaSub = false;
                        $scope.original.propia = 0;
                        $scope.original.numentrega = 1; 
                        // alert('La subsecuencia corresponde a una unidad de red verificalo en sistemas');
                    }
                //si no verificamos que no sea de propia si es de red dejamos seguir
                }else{
                    if ($scope.original.propia == 1) {
                        alert('La subsecuencia no existe verificalo nuevamente');
                        $scope.original.numentrega = ''; 
                    }else{
                        $scope.muestraEntrega = false;
                        $scope.consultaSub = false;
                        $scope.original.propia = 0;
                        $scope.original.numentrega = 1; 
                    }
                }

                $scope.consultaSub = false;

            }).error(function (data){

                $scope.consultaSub = false;
                if (data.respuesta && $scope.original.propia == 1) {
                    $scope.original.numentrega = ''; 
                    alert(data.respuesta);
                }else if ($scope.original.propia == 0) {
                    // console.log('entro aqui');
                    $scope.muestraEntrega = false;
                    $scope.consultaSub = false;
                    $scope.original.numentrega = 1; 
                }else{
                    alert('Error en la conexion si el problema persiste ve al area de sistemas');
                } 
            })
        };
    }

    //busca el producto segun la empresa
    $scope.productoOriginal = function(empresa){

        find.producto(empresa).success( function (data) {

            $scope.productos = data;

            $scope.verificaEscolaridad();

        });
    }

    //busqueda de referencias por unidad
    $scope.referencia = function(unidad){

        $scope.original.unidad = unidad;


        find.referenciaxunidad(unidad).success(function (data){
            $scope.label1 = data[0].referencia;
            $scope.verificaatencion();
        });
    }

    ///limpia variables del modal del original
    $scope.limpiaVariables = function(){

        //$scope.original.folio = '';
        $scope.original.documento = '';
        $scope.original.internet =  1;
        $scope.original.tipoDoc ='';
        $scope.original.remesa =0;
        $scope.remesa = 0;
        $scope.original.fecha =FechaAct;
        $scope.original.cliente ='';
        $scope.original.lesionado ='';
        $scope.original.unidad ='';
        $scope.original.producto ='';
        $scope.original.escolaridad ='';
        $scope.original.fechafax = '';
        $scope.original.fechafe = '';
        $scope.original.factura = '';
        $scope.original.totalfactura = '';
        $scope.esoriginal = 0;
        $scope.unidadref = '';
        $scope.esfax = 0;
        $scope.esfe = 0;
        $scope.bloqueo = false;
        $scope.bloqueoUni = false;
        $scope.muestraEsc = false;
        $scope.consultaSub = false;
    }

    /////////Inicia proceso de guardado 

    ///Proceso de guardado ya sea de fax u original
    $scope.guardaDatosA = function(){

        console.log($scope.original);
        if ($scope.formCapturaOriginal.$valid) {

            $('#botonGuardaDatos').button('loading');
            $scope.mensaje = '';
            //Verificamos la informacion antes de guardar
            checkFolios.verificaInfo($scope.original.cliente, $scope.original.producto, $scope.original.escolaridad, $scope.original.fecha, $scope.original.folio)
            .then(function (data) {

                checkFolios.preparaGuardado($scope.original, $scope.esoriginal, $scope.esfax, $scope.esfe)
                .then(function (data){
                    // console.log(data);
                    //actualiza folio (solo original)
                    if (data.agregaOriginal) {
                        var alta = $http.post(api+'altaoriginal',data.info);
                        //agrega folio (solo original)
                    }else if (data.actualizaOriginal) {
                        var alta = $http.post(api+'actualizaoriginal',data.info);
                    };

                    alta.success(function (data){

                        $scope.mensaje = data.respuesta;
                        $scope.tipoalerta = 'alert-success';
                        $scope.limpiaVariables();
                        $scope.original.folio = '';
                        $('#botonGuardaDatos').button('reset');
                        $('#folioO').focus();

                    })
                    .error(function (data){
                        $('#botonGuardaDatos').button('reset');

                        if (data.respuesta) {
                            alert(data.respuesta);
                        }else{
                            alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');
                        }
                    });

                },
                function (error){
                    $scope.mensaje = error.mensaje;
                    $scope.tipoalerta = error.tipoalerta;
                    $('#botonGuardaDatos').button('reset');
                });

            }, function (error) {
                $scope.mensaje = error.mensaje;
                $scope.tipoalerta = error.tipoalerta;
                $('#botonGuardaDatos').button('reset');
            });

        };
    }

    //Guarda los datos de Original

    /////////Termina proceso de guardado 

    /////////////////Seccion de validaciones

    //Verifica que la fecha no sea mayor a la fecha que se esta capturando
    $scope.validafecha = function(){

        var fecha1 = moment($scope.original.fecha, 'DD/MM/YYYY');
        var fecha2 = moment(FechaAct, 'DD/MM/YYYY');
        
        if(fecha1 > fecha2){
            $scope.original.fecha = FechaAct;
            alert('La fecha no debe ser mayo al dia de hoy');
        }
    }

    //verifica si se tiene que mostrar la escolaridad
    $scope.verificaEscolaridad = function(){

        if ($scope.original.producto) {

            if ($scope.original.producto == 2 && ($scope.original.cliente == 20 || $scope.original.cliente == 42) ) {
                $scope.muestraEsc = true;
            }else{
                $scope.muestraEsc = false;
            }

        };

    }

    //verificamos que tipo de atencion es y si ya tien fax capturado al momento de cambiar el tipo de documento 
    $scope.verificaatencion = function(){

        // console.log($scope.original.tipoDoc);
        // console.log($scope.bloqueoUni);

        if(($scope.original.tipoDoc == 2 || $scope.original.tipoDoc == 3) && $scope.bloqueoUni == false){
    
            $scope.original.unidad = $scope.unidadref;//asignamos el valor de referencia por si queremos regresar al estado anterior
            $scope.bloqueoUni = false;
            $scope.muestraEntrega = true;

        }else if($scope.bloqueo == true && $scope.original.tipoDoc == 1){

            $scope.unidadref = $scope.original.unidad;
            $scope.bloqueoUni = true;
            $scope.referencia($scope.unidadref);

        }
    }

}