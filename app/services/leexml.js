app.factory('leexml',function($http,xml){

      var factory = [];
      factory.getxmltemporal = function(usuario,archivo){

      		return $http.get(xml+usuario+ '/' +archivo);

      }
        return factory;

});
