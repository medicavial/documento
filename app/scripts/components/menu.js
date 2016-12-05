(function(){

	'use strict';

	angular
	.module('app')
	.component('menu',{
		templateUrl:'vistas/menu.html',
		controller: menuCtrl,
		controllerAs:'mn',
		bindings: {
		   usuario: '='
		}
	});

	menuCtrl.$inject = ['$rootScope', 'auth'];

	function menuCtrl($rootScope, auth){
		var mn = this;

		mn.logout = logout;

		function logout(){
	        auth.logout();
	    }
	}

})();