app.factory("operacion",function($http, api){
    return{
    	actualizaDatos: function(datos){
    		return $http.post(api+'operacion/editaDatos', datos);
    	},
    	guardaUser: function(datos){
    		return $http.post(api+'operacion/usuarios', datos);
    	}
    }
});

