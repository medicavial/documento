app.factory("operacion",function($http, api){
    return{
    	actualizaDatos: function(datos){
    		return $http.post(api+'operacion/editaDatos', datos);
    	},
    	cambioUnidad: function(unidad,bit,usuario){
    		return $http.get(api+'operacion/estatusUnidad/'+ unidad + '/' + bit + '/' + usuario);
    	},
        guardaUser: function(datos){
            return $http.post(api+'operacion/usuarios', datos);
        },
        edicionUser: function(datos, id){
            return $http.put(api+'operacion/usuarios/'+id, datos);
        },
        guardaImagenes: function(folio){
            $http.get(api+'operacion/guardaImagenes/'+ folio);  
        },
        guardaTramite: function(datos){
            $http.post(api+'operacion/guardaTramite/',datos);  
        }
    }
});

