app.factory('leexml',function($http,xml,xmlFE){

      var factory = [];
      factory.getxmltemporal = function(usuario,archivo){

      		return $http.get(xml+usuario+ '/' +archivo);

      },
      factory.getxmlFE = function(archivo, usuario){

      		return $http.get(xmlFE+usuario+'/'+archivo);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 l 
      }
      return factory;

});
