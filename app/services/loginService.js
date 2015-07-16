app.factory("auth", function($location, $rootScope, $http, webStorage, api){
    return{
        login : function(username, password)
        {
            $('#boton').button('loading');
            $http.post( api + 'login',{user:username,psw:password})
            .success( function (data){

                $('#boton').button('reset');
                //creamos la cookie con el nombre que nos han pasado
                webStorage.session.add('username', data[0].nombre);
                webStorage.session.add('id', data[0].clave);
                webStorage.session.add('areaUsuario', data[0].area);
                webStorage.session.add('user', data[0].usuario);
                webStorage.session.add('userWeb', data[0].usuarioweb);

                $rootScope.username = data[0].nombre;
                $rootScope.id = data[0].clave;
                $rootScope.areaUsuario = data[0].area;
                $rootScope.area = data[0].area;
                $rootScope.user = data[0].usuario;
                $rootScope.userWeb = data[0].usuarioweb;

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

                if (navigator.geolocation) {

                    navigator.geolocation.getCurrentPosition(function (posicion){

                        $rootScope.localidad = posicion;
                        console.log($rootScope.localidad);

                    });

                };

          
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
                $location.path("/home");
            }
        }
    }
});