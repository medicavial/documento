(function(){

    /** Sergio Alcala (2017)
    *Controlador de Factruacion Express Beta
    *Une Facturacion express tradicional con SACE
    *en Fase Beta
    */

    'use strict';

    angular.module('app')
    .controller('facturacionExBetaCtrl',facturacionExBetaCtrl)

    facturacionExBetaCtrl.$inject = ['$scope', '$rootScope', '$filter', 'find', 'loading', 'checkFolios','datos','$timeout','facturacionExpress','webStorage','operacion','tickets'];

    //Area de facturacion
	function facturacionExBetaCtrl($scope, $rootScope, $filter, find , loading, checkFolios,datos,$timeout,facturacionExpress,webStorage,operacion,tickets){
	    
	};    

})();

