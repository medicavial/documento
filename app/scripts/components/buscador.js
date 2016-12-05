(function(){

	'use strict';

	angular
	.module('app')
	.component('buscador',{
		templateUrl:'vistas/buscador.html',
		controller: buscadorCtrl,
		controllerAs:'bs'
	});

	buscadorCtrl.$inject = ['$scope', '$rootScope','$location','find'];

	function buscadorCtrl($scope, $rootScope, $location,find) {

	    $rootScope.folioGlobal = '';
	    $scope.tipo = 'lesionado';
	    $scope.folio = '';

	    $scope.$watch('genieVisible', function(newValue, oldValue) {
	        if (newValue == true) {

	            if ($location.path() == "/login" || $location.path() == "/bloqueo") {
	                $scope.genieVisible = false;
	            }else{
	                $scope.resultados = [];
	                $scope.consulta = '';
	                $scope.accion = false;
	            }
	        };
	    });


	    $scope.verifica = function(event,dato,tipo){

	        if (event.charCode == 13) {

	            $scope.resultados = [];
	            $scope.folio = '';
	            $scope.accion = false;

	            find.buscador(dato,tipo).success( function (data){
	                $scope.resultados = data;  
	                $scope.consulta = '';              
	            });

	        };
	    }

	    $scope.preparaFolio = function(folio){
	        console.log(folio);
	        $scope.folio = folio;
	        $scope.accion = true;
	    }

	    $scope.generaAccion = function(accion){

	        $rootScope.folioGlobal = $scope.folio;

	        if (accion == 'registra') {
	            $('#myModal10').modal();
	        }else if(accion == 'ticket'){

	        }else if(accion == 'seguimiento'){
	            $('#myModal20').modal();
	        }

	        console.log($rootScope.folioGlobal);
	        $scope.genieVisible = false;
	    }

	}

})();