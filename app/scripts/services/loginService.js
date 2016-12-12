app.factory("auth", function($location, $rootScope, $http, webStorage, api){
    return{
        login : function(username, password)
        {
            $('#boton').button('loading');
            $http.post( api + 'login',{user:username,psw:password})
            .success( function (data){

                // console.log(data);
                var datos = data[0];
                
                $('#boton').button('reset');
                //creamos la cookie con el nombre que nos han pasado
                webStorage.session.set('username', datos.USU_nombre);
                webStorage.session.set('id', datos.USU_claveint);
                webStorage.session.set('areaUsuario', datos.area);
                webStorage.session.set('user', datos.USU_login);
                webStorage.session.set('userWeb', datos.USU_usuarioWeb);

                webStorage.session.set('FacturacionExpress', datos.USU_fexpress);
                webStorage.session.set('FlujoDocumentos', datos.USU_fdocumentos);
                webStorage.session.set('FlujoManual', datos.USU_fmanual);
                webStorage.session.set('FlujoPagos', datos.USU_fpagos);
                webStorage.session.set('FormatoQualitas', datos.USU_fqualitas);
                webStorage.session.set('Reportes', datos.USU_freportes);
                webStorage.session.set('Tickets', datos.USU_ftickets);
                webStorage.session.set('TicketsPagos', datos.USU_fticketPagos);
                webStorage.session.set('ControlDocumentos', datos.USU_fcontrolDocumentos);
                webStorage.session.set('ConsultaIndividual', datos.USU_fconsultaIndividual);
                webStorage.session.set('Captura', datos.USU_fcaptura);
                webStorage.session.set('Usuarios', datos.USU_fusuarios);

                $rootScope.username = datos.USU_nombre;
                $rootScope.id = datos.USU_claveint;
                $rootScope.areaUsuario = datos.area;
                $rootScope.area = datos.area;
                $rootScope.user = datos.USU_login;
                $rootScope.userWeb = datos.USU_usuarioWeb;

                //permisos del usuario                
                $rootScope.FacturacionExpress =  datos.USU_fexpress;
                $rootScope.FlujoDocumentos =  datos.USU_fdocumentos;
                $rootScope.FlujoManual =  datos.USU_fmanual;
                $rootScope.FlujoPagos =  datos.USU_fpagos;
                $rootScope.FormatoQualitas =  datos.USU_fqualitas;
                $rootScope.Reportes =  datos.USU_freportes;
                $rootScope.Tickets =  datos.USU_ftickets;
                $rootScope.TicketsPagos =  datos.USU_fticketPagos;
                $rootScope.ControlDocumentos =  datos.USU_fcontrolDocumentos;
                $rootScope.ConsultaIndividual =  datos.USU_fconsultaIndividual;
                $rootScope.Captura =  datos.USU_fcaptura;
                $rootScope.Usuarios =  datos.USU_fusuarios;

                //mandamos a la home o a la ventana que estaba antes de entrar a bloqueo
                $('html').removeClass('lockscreen');
                if ($rootScope.ruta != undefined){

                    $location.path($rootScope.ruta);
                    $rootScope.ruta = '';

                }else{

                    $location.path("/");

                    if($rootScope.push > 0){
                        $('#myModal5').modal('show');
                    }

                }
          
            }).error( function (error){

                $('#boton').button('reset');
                console.log(error);
                if(error.respuesta){
                    $rootScope.mensaje = error.respuesta;
                }else{
                    alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');
                }
                

            });


        },
        logout : function()
        {
            //al hacer logout eliminamos la cookie con $cookieStore.remove y los rootscope
            webStorage.session.clear();
            webStorage.local.clear();

            $rootScope.id = '';
            $rootScope.areaUsuario = '';
            $rootScope.user = '';
            $rootScope.username = '';

            //mandamos al login
            $location.path("/login");
        },
        checkStatus : function()
        {
            //creamos un array con las rutas que queremos controla
            if($location.path() != "/login" && webStorage.session.get('username') == null)
            {
                $('html').removeClass('lockscreen');   
                $location.path("/login");
            }
            //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
            if($location.path() == "/login" && webStorage.session.get('username') != null)
            {
                $location.path("/");
            }
        },
        block : function()
        {
            $location.path('/bloqueo');
            $rootScope.ruta = $location.path(); //Guardamos

            $('#myModal').modal('hide');
            $('#myModal2').modal('hide');
            $('#myModal3').modal('hide');
            $('#myModal4').modal('hide');
            $('#myModal10').modal('hide');
        }
    }
});