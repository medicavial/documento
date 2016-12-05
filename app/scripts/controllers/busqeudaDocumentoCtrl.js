//buscar un folio en el flujo
function busquedaDocumentoCtrl($scope,$rootScope, find){

	$scope.inicio = function(){

		$scope.tituloCon = "Consulta de Documento(s)";
		$scope.busqueda = false;
		$scope.cargando = false;
		$scope.tipo = 'folio';
		$scope.mensaje = '';
		$scope.criterio = '';
		$('.btn').button();
		$scope.listado = [];
	}


	// presiona Folio
	$scope.presionaFolio = function(evento){

		if($scope.tipo == 'folio'){

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
		}else{

			if (evento.keyCode == 13 || evento.keyCode == 9) {

		      	$scope.foliosxlesionado();

		    }

		}

	}

	$scope.verificaFolio = function(){

		if ($scope.criterio != '') {

			var totalletras = $scope.criterio.length

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

	//busqueda de folio especiico
	$scope.foliosxfolio = function(){

		$('#boton').button('loading');
		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;
		
		find.recepcionxfolio($scope.criterio).success( function (data){
        	
        
        	if(data.respuesta){

        		$('#boton').button('reset');
        		$scope.mensaje  = data.respuesta;

        	}else{

        		$('#boton').button('reset');
        		$scope.listado = data;
        		// console.log(data);

        	}

        	$scope.busqueda = true;
			$scope.cargando = false;
			
			//console.log(data);
		}).error( function (xhr,status,data){

			$('#boton').button('reset');

			$scope.cargando = false;
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});

	}

	//busqueda de folios x lesionado
	$scope.foliosxlesionado = function(){

		$('#boton').button('loading');
		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;

		find.recepcionxlesionado($scope.criterio).success( function (data){
        	
        	if(data.respuesta){

        		$('#boton').button('reset');
        		$scope.mensaje = data.respuesta;

        	}else{

        		$('#boton').button('reset');
        		$scope.listado = data;

        	}

        	$scope.busqueda = true;
			$scope.cargando = false;
			
			//console.log(data);
		}).error( function (xhr,status,data){

			$('#boton').button('reset');
			$scope.cargando = false;
			alert('Existe Un Problema de Conexion Intente Cargar Nuevamente la Pagina');

		});

	}

};

busquedaDocumentoCtrl.$inject = ['$scope','$rootScope', 'find'];

app.controller('busquedaDocumentoCtrl',busquedaDocumentoCtrl);