app.factory('leexml',function($http,xml,xmlNC){

      var factory = [];
      factory.getxmltemporal = function(usuario,archivo){

      	return $http.get(xml+usuario+ '/' +archivo);

      },

      factory.getxmlNC = function(usuario,archivo){

      	
            return $http.get(xmlNC+usuario+'/'+archivo);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
      },

      factory.getxmltemporal2 = function(usuario,archivo){
      	
      	for (var i = 0; i < archivo.length; i++) {
      		
      		return $http.get(xml+usuario+ '/' +archivo[i]);

      	}

      }
      return factory;

});
