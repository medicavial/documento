app.factory("operacion",function($http, api){
    return{
    	guardaUser: function(datos){
    		return $http.post(api+'operacion/usuarios', datos);

    		}
    	}
});