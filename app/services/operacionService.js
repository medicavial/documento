app.factory("operacion",function($http, api){
    return{
    	actualizaDatos: function(datos){
    		return $http.post(api+'operacion/editaDatos', datos);
    	},
    	guardaUser: function(datos){
    		return $http.post(api+'operacion/usuarios', datos);
    	},
    	cambioUnidad: function(unidad,bit,usuario){
    		return $http.get(api+'operacion/estatusUnidad/'+ unidad + '/' + bit + '/' + usuario);
    	}
    }
});

