app.factory('leexml',function($http,xml,xmlFE){

      var factory = [];
      factory.getxmltemporal = function(usuario,archivo){

      		return $http.get(xml+usuario+ '/' +archivo);

      },

      factory.getxmlFE = function(archivo, usuario){
      	
      		return $http.get(xmlFE+usuario+'/'+archivo);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 l 
      },

      factory.getxmltemporal2 = function(usuario,archivo){
      	
      	for (var i = 0; i < archivo.length; i++) {
      		
      		return $http.get(xml+usuario+ '/' +archivo[i]);

      	}

      }
      return factory;

});
