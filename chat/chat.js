/**
* chat Module
*
* Description
*/
angular.module('chat', ['firebase'])
.directive('chatMv', chatMv);

function chatMv() {

    var directive = {
        scope:{ usuario: '=' },
        restrict: 'EA',
        templateUrl: 'chat/chat.html',
        controller: controlador,
        //aqui esuchamos lo mensajes que se van agregando y para poner simpre el ultimo mensaje visible
        link: function(scope, element) {
            scope.$watchCollection('mensajes', function() {
            var $list = $(element).find('.js-chat-list');
                var scrollHeight = $list.prop('scrollHeight');
                $list.animate({scrollTop: scrollHeight}, 500);              
            });
        }
    };

    return directive;

}

function controlador($scope, $firebaseArray,$firebaseObject,$firebase) {

    
    $scope.detalle = false;
    $scope.chat = false;
    $scope.mensajes = [];


    var ref = new Firebase("https://chatmv.firebaseio.com/clientes");
    var obj = $firebaseObject(ref);

    console.log(obj);

    // to take an action after the data loads, use the $loaded() promise
    obj.$loaded().then(function() {
        $scope.listaUsuarios();
    });

    var unwatch = obj.$watch(function(e) {
        $scope.listaUsuarios();
    });


    $scope.listaUsuarios = function(){

        $scope.usuarios = [];

        angular.forEach(obj, function(value, key) {
          console.log(key);
          $scope.usuarios.push(key);
        });
        
    }

    $scope.iniciaChat = function(user){

        console.log('entro');
        $scope.chat = true;
        var datos = ref.child(user);
        // download the data into a local object
        $scope.mensajes = $firebaseArray(datos);

    }

    $scope.enviaMensaje = function(){

        $scope.mensajes.$add({
            from: $scope.usuario,
            content: $scope.mensaje
        });

        $scope.mensaje = '';
    }

}

