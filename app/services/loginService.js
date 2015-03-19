app.factory("auth", function($cookies,$cookieStore,$location, $rootScope, $http){
    return{
        login : function(username, password)
        {
            $('#boton').button('loading');
            $http({
                url:'/documento/api/login',
                method:'POST',
                contentType: 'application/json',
                dataType: "json",
                data:{user:username,psw:password}
            }).success( function (data){

                $('#boton').button('reset');
                if(data.respuesta){
                    $rootScope.mensaje = data.respuesta;
                }else{

                    //creamos la cookie con el nombre que nos han pasado
                    $cookies.username = data[0].nombre;
                    $cookies.id = data[0].clave;
                    $cookies.areaUsuario = data[0].area;
                    $cookies.user = data[0].usuario;
                    $cookies.userWeb = data[0].usuarioweb;

                    $rootScope.username = data[0].nombre;
                    $rootScope.id = data[0].clave;
                    $rootScope.areaUsuario = data[0].area;
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

                }

                //console.log(data);
            }).error( function (xhr,status,data){

                $('#boton').button('reset');
                alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

            });


        },
        logout : function()
        {
            //al hacer logout eliminamos la cookie con $cookieStore.remove y los rootscope
            $cookieStore.remove("username"),
            $cookieStore.remove("areaUsuario");
            $cookieStore.remove("id");
            $cookieStore.remove("user");
            $cookieStore.remove("userWeb");
            $rootScope.id = '';
            $rootScope.areaUsuario = '';
            $rootScope.user = '';
            $rootScope.username = '';
            //mandamos al login
            $location.path("/login");
        },
        checkStatus : function()
        {
            //creamos un array con las rutas que queremos controlar
            var rutasPrivadas = ["/","/login","/Recepcion", "/entregas/:area", "/listadoEntregas/:area", "/listadoRecepcion/:area" ,"/historial", "/Rechazos/:area"];
            if($location.path() != "/login" && typeof($cookies.username) == "undefined")
            {
                $('html').removeClass('lockscreen');
                $location.path("/login");
            }
            //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
            if($location.path() == "/login" && typeof($cookies.username) != "undefined")
            {
                $location.path("/");
            }
        },
        in_array : function(needle, haystack)
        {
            var key = '';
            for(key in haystack)
            {
                if(haystack[key] == needle)
                {
                    return true;
                }
            }
            return false;
        }
    }
});