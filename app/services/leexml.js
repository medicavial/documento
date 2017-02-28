app.factory('leexml',function($http,xml,xmlFE){

      var factory = [];
      factory.getxmltemporal = function(usuario,archivo){

      		return $http.get(xml+usuario+ '/' +archivo);

      },
      factory.getxmlFE = function(archivo, folios){

      		return $http.get(xmlFE+archivo);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 l 
      }
      return factory;

});
