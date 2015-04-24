app.factory("loading", function($rootScope){
    return{
        cargando:function(mensaje){
            $rootScope.cargando=true;
            $rootScope.loading=true;
            $rootScope.label= mensaje;
        },
        mensaje:function(mensaje){
            $rootScope.loading=false;
            $rootScope.label= mensaje;
        },
        despedida:function(){
            $rootScope.cargando=false;
        },
        error:function(mensaje){
            $rootScope.error=true;
            $rootScope.label= mensaje;
        }
    }
});

app.factory("barra", function(ngProgress){
    return{
        inicia:function(){
            ngProgress.color('#4376F2');
            ngProgress.start();
        },
        termina:function(){
            ngProgress.complete();
        }
    }
});

