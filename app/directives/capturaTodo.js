app.directive('capturaTodo', capturaTodo);

function capturaTodo() {

    var directive = {
        restrict: 'EA',
        templateUrl: 'vistas/capturaTodo.html',
        controller: controladorTodo,
        bindToController: true // because the scope is isolated
    };

    return directive;

}

controladorTodo.$inject = ['$scope', '$rootScope', '$filter', '$location', '$http', 'find', 'loading', 'checkFolios','carga','api', 'tickets'];;

function controladorTodo($scope, $rootScope, $filter, $location, $http, find, loading, checkFolios, carga, api, tickets) {
    
    // Injecting $scope just for comparison
    //muestra Ventan de alta de Original

    // $rootScope.$watch('folioGlobal', function(newValue, oldValue) {
    //     // console.log(newValue);
    //     if (newValue.length == 10) {
    //         $scope.original.folio = newValue;
    //         $scope.validaOriginalB(newValue);
    //     };
    // });


    $scope.inicio = function(){

        $scope.muestraEsc = false;
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
            npc:0,
            totalfactura:0
        };

        $scope.ticket = {
            folioweb:$scope.original.folio,
            folioIn:'',
            cliente:'',
            unidad:'',
            etapa:'',
            categoria:'',
            subcategoria:'',
            statusa:'',
            asignado:'',
            fechaasignado:'',
            notas:'',
            comunicacion:'',
            fechacomunica:'',
            observaciones:'',
            diagnostico:false,
            firma:false,
            notamedica:false,
            finiquito:false,
            refactura:false,
            pase:false,
            suministro:false,
            identificacion:false,
            verificacion:false,
            notamedicain:false,
            informe:false,
            reverso:false,
            verificapar:false,
            nocoincide:false,
            pasemedico:false,
            nombrein:false,
            folioseg:false,
            sinpase:false,
            fueravigencia:false,
            sinpoliza:false,
            sindeducible:false,
            cedulaT:false,
            cedulaI:false,
            sincuestionario:false,
            firmamedico:false,
            cruce:false,
            usuario:$rootScope.userWeb,
            usuariomv:$rootScope.id
        }

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


        if ($rootScope.userWeb == undefined){
            $scope.mensaje = 'No tienes usuario para dar de alta ticket solicitalo en el area de sistemas';
        };

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
            $scope.altacategorias();
            $scope.altastatus();
            $scope.empresasWeb();
            $scope.unidadesWeb();
        });

    }

    //busca clientes
    $scope.empresasWeb = function(){

        find.empresasweb().success( function (data) {

            $scope.clientesweb = data;

         });

    }
    //busca unidades
    $scope.unidadesWeb = function(){

        find.unidadesweb().success( function (data) {

            $scope.unidadesweb = data;

        });

    }

    $scope.altacategorias = function(){

        find.categorias().success(function (data){
            $scope.categorias = data;
        });
        
    }

    $scope.altasubcategorias = function(id){
        
        find.subcategorias(id).success(function (data){
            $scope.subcategorias = data;
        });
    }

    $scope.altastatus = function(){

        find.statusweb().success(function (data){
            $scope.status = data;
        });
    }


    //Verificamos si el fiolio esta dado de alta o se tiene que buscar en 
    $scope.validaOriginalB = function(folio){

        $scope.limpiaVariables();
        $scope.cargar = true;
        $scope.mensaje = '';
        // console.log(folio);
        //verificamos si tiene primera atencion
        checkFolios.validaFolio(folio, 1)
        .then( function (data){
            
            // console.log(data);
            
            if (data.tipoDoc == 1) {

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
                
                find.folioweb(folio).success( function (data){

                    $scope.ticket.cliente = data[0].Cia_clave;
                    $scope.ticket.unidad = data[0].Uni_clave;
                    $scope.ticket.statusa = 1;
                    $scope.ticket.etapa = '1';

                    find.ultimoticket().success(function (data){
                        $scope.ticket.folioIn = Number(data) + 1; 
                    });

                    $scope.cargar = false;

                }); 
            
            }else{
                $scope.cargar = false;
                alert('Solo puedes registrar etapa 1 si es etapa 2 o mas favor de registrar y registrar ticket por separado');
            }


        })
        .catch(function (err){
            alert(err);
            $scope.cargar = false;
        });
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
        $scope.original.npc = 0;
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
        $scope.ticket = {
            folioweb:$scope.original.folio,
            folioIn:'',
            cliente:'',
            unidad:'',
            etapa:'',
            categoria:'',
            subcategoria:'',
            statusa:'',
            asignado:'',
            fechaasignado:'',
            notas:'',
            comunicacion:'',
            fechacomunica:'',
            observaciones:'',
            diagnostico:false,
            firma:false,
            notamedica:false,
            finiquito:false,
            refactura:false,
            pase:false,
            suministro:false,
            identificacion:false,
            verificacion:false,
            notamedicain:false,
            informe:false,
            reverso:false,
            verificapar:false,
            nocoincide:false,
            pasemedico:false,
            nombrein:false,
            folioseg:false,
            sinpase:false,
            fueravigencia:false,
            sinpoliza:false,
            sindeducible:false,
            cedulaT:false,
            cedulaI:false,
            sincuestionario:false,
            firmamedico:false,
            cruce:false,
            usuario:$rootScope.userWeb,
            usuariomv:$rootScope.id
        }
    }

    /////////Inicia proceso de guardado 

    ///Proceso de guardado ya sea de fax u original
    $scope.guardaDatosB = function(){

        if ($scope.formOriginalTodo.$valid) {

            $('#botonGuardaTodo').button('loading');
            $scope.mensaje = '';
            // console.log($scope.original);
            // Verificamos la informacion antes de guardar
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

                    alta.then(function (data){

                        $('#folioO').focus();

                        // console.log($scope.ticket);
                        tickets.guardar($scope.ticket).success( function (data){
                        
                            $scope.original.folio = '';
                            $scope.mensaje = 'Folio registrado correctamente con el ticket ' + $scope.ticket.folioIn;
                            $scope.tipoalerta = 'alert-success';
                            $('#botonGuardaTodo').button('reset');            
                            $scope.limpiaVariables();

                        }).error( function (data){
                            
                            $scope.original.folio = '';
                            $scope.mensaje = 'El documento se gurado bien pero ocurrio un error al guardar el ticket intenta registrarlo de forma independiente';
                            $scope.tipoalerta = 'alert-warning';
                            $('#botonGuardaTodo').button('reset');
                            $scope.limpiaVariables();

                        });

                    },function (data){

                        $('#botonGuardaTodo').button('reset');
                        alert('Ocurrion Un Problema al guardar el documento intentalo nuevamente');

                    });

                },
                function (error){
                    $scope.mensaje = error.mensaje;
                    $scope.tipoalerta = error.tipoalerta;
                    $('#botonGuardaTodo').button('reset');
                });

            }, function (error) {
                $scope.mensaje = error.mensaje;
                $scope.tipoalerta = error.tipoalerta;
                $('#botonGuardaTodo').button('reset');
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
            

        }else if($scope.bloqueo == true && $scope.original.tipoDoc == 1){

            $scope.unidadref = $scope.original.unidad;
            $scope.bloqueoUni = true;
            $scope.referencia($scope.unidadref);

        }
    }

}