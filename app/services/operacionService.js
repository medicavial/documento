app.factory("operacion",function($http, api){
    return{
    	actualizaDatos: function(datos){
    		return $http.post(api+'operacion/editaDatos', datos);
    	},
    	guardaUser: function(datos){
    		return $http.post(api+'operacion/usuarios', datos);
    	},
    	cambiounidad: function(datos){
    		return $http.post(api+'operacion/unidadesRed', datos);
    	}
    }
});

