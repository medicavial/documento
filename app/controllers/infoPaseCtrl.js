/// detalle de folios
function infoPaseCtrl($scope, $rootScope, $routeParams, find){

	console.log($routeParams.folio)
	$scope.folioMV = $routeParams.folio;
			
	$scope.inicio = function(){

		//Llamamos a la funcion con los parametros de la ruta
		$scope.muestraDatos($scope.folioMV);
		$scope.observaCuestionario($scope.folioMV);

		$scope.tituloIP = "Info Pase";
		if ($routeParams.folio == undefined) {
			$scope.buscar = true;
		}else{
			$scope.buscar = false;
			$scope.folio = $routeParams.folio;
		}

		$scope.busqueda = false;
		$scope.i = 1;


	}

	// presiona Folio
	$scope.presionaFolio = function(evento){


		//contamos la cadena completa
		var cantidad = $scope.criterio.length;

		//los primero cuatro caracteres NO deben ser numeros
		if(cantidad < 3){
			if (evento.keyCode >= 48 && evento.keyCode <= 57 || evento.keyCode >= 96 && evento.keyCode <= 105) {
		      	evento.preventDefault();
		    }
		}

		//los ultimos 6 NO deben ser letras
		if(cantidad > 3 && cantidad < 9){
			if (evento.keyCode >= 65 && evento.keyCode <= 90) {
		      	evento.preventDefault();
		    }
		}

		//Si son mas de 10 digitos no escribas mas
		if(cantidad > 9){
			if (evento.keyCode != 8  && evento.keyCode != 46 ) {

		      	evento.preventDefault();
		    }      	
		}

		//Si se da enter o salto de linea ejecuta la funcion verifica folio pasandole que es de tipo fax
		if (evento.keyCode == 13 || evento.keyCode == 9) {

	      	$scope.verificaFolio();

	    }


	}

	$scope.verificaFolio = function(){

		if ($scope.criterio != '') {

			var totalletras = $scope.criterio.length;

			var letras = $scope.criterio.substr(0,4);
			var numeros = $scope.criterio.substr(4,totalletras);

			if(letras.length < 4 ){

				var faltantes = 4 - letras.length;

				for (var i = 0; i < faltantes; i++) {

					var letra = letras.charAt(i);
					letras = letras + "0";
				}
			}

			if(numeros.length < 6 ){

				var faltantes = 6 - numeros.length;

				for (var i = 0; i < faltantes; i++) {
					
					numeros = "0" + numeros;
				}
			}

			$scope.criterio = letras + numeros;

			$scope.foliosxfolio();
		}	

	}

	$scope.muestraDatos = function(folio){

		//Recibimos el Json del procedimiento almacenado 
		find.infoPase($scope.folioMV).success( function (data){
		console.log(data[0]);

		if (data) {
            	$scope.informacion  = data;
            }else{
                $scope.mensaje = 'No se encontraron datos';
            }
 
		// //Información del Apartado de Pagos.
		$scope.pagoTab1 = data[0].exp_pagoEt1;
		$scope.pagoTab2 = data[0].exp_pagoet2;
		$scope.pagoTab3 = data[0].exp_pagoet3;
		$scope.pagoET1  = data[0].EXP_PagadoET1;
		$scope.pagoET2  = data[0].EXP_PagadoET2;
		$scope.pagoET3  = data[0].EXP_PagadoET3;
		$scope.pagoChE1 = data[0].EXP_pagadoChET1;
		$scope.pagoChE2 = data[0].EXP_pagadoChET2;
		$scope.pagoChE3 = data[0].EXP_pagadoChET3;
		$scope.pagofechaET1 = data[0].EXP_pagadofechaET1;
		$scope.pagofechaET2 = data[0].EXP_pagadofechaET2;
		$scope.pagofechaET3 = data[0].EXP_pagadofechaET3;
		});		
	}

	$scope.observaCuestionario = function(folio){
		$('#cuestion').modal('show');

		find.infoPaseCuestionario($scope.folioMV).success(function (data){
			console.log(data[0]);

			if (data) {
            	$scope.respuestas  = data;
            }else{
                $scope.mensaje = 'No se encontraron datos';
            }

			$scope.fech_resp = data[0].PCU_fechaRespondio;
			$scope.tel = data[0].PCU_telContacto;
		});
	}

	$scope.modalCtrlDocumentos = function(folio){
		$('#CtrlDoc').modal('show');

		find.listadofolio($scope.folioMV).success( function (data){
			console.log(data[0]);
			console.log(data[1]);

			$scope.usuario  = data[0].Usuario;
			$scope.area     = data[0].ARO_nombre;
			$scope.fecha    = data[0].fac_fechafactura;

			if (data) {
            	$scope.listado  = data;
            }else{
                $scope.mensaje = 'No se encontraron datos';
            }
		});
	}


};

infoPaseCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'find'];
app.controller('infoPaseCtrl',infoPaseCtrl);