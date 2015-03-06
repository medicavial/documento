var MuestraColor = function(color){
		switch(color)
			{
			case 'color1':
			  $('body').css({ 'background-color':'#3399CC' });
			  break;
			case 'color2':
			  $('body').css({ 'background-color':'#33CCCC' });
			  break;
			case 'color3':
			  $('body').css({ 'background-color':'#996699' });
			  break;
			case 'color4':
			  $('body').css({ 'background-color':'#C24747' });
			  break;
			case 'color5':
			  $('body').css({ 'background-color':'#e2674a' });
			  break;
			case 'color6':
			  $('body').css({ 'background-color':'#FFCC66' });
			  break;
			case 'color7':
			  $('body').css({ 'background-color':'#99CC99' });
			  break;
			case 'color8':
			  $('body').css({ 'background-color':'#669999' });
			  break;
			case 'color9':
			  $('body').css({ 'background-color':'#CC6699' });
			  break;
			case 'color10':
			  $('body').css({ 'background-color':'#339966' });
			  break;
			case 'color11':
			  $('body').css({ 'background-color':'#666699' });
			  break;

			default:
			  $('body').css({ 'background-color':'#499bea' });
			}
		}

//controlador de almacen
function almacenCtrl($scope, $location){

	$scope.tituloal= "Almacen";

	angular.element('li a:last').on('click',function(datos){
		var color = datos.currentTarget.parentElement.id;
		MuestraColor(color);
	});


}


function buscaProductoCtrl($scope, $location, $http){

	$scope.tituloB = "Busqueda de Productos";
	$scope.pagina = 0;
	$scope.totalProductos = 0;
	$scope.limite = 10;
	$scope.totalpaginas = 0;
	$scope.inicio = 0;
	$scope.fin = 10;


	$http({

		method:'GET',
		url:'http://localhost:8888/exinventario/api/productos'

	 }).success( function (data) {

		$scope.productos = data;
		$scope.totalProductos = data.length;

	 }).error( function (data){

		alert(data);

	 });

	$scope.Paginas = function(){

		$scope.totalpaginas = Math.ceil($scope.totalProductos / $scope.limite);

		return $scope.totalpaginas;

	}
	
	$scope.elimina = function(codigo) {

		if(confirm("¿Quieres Eliminar Este Producto?")) {
			var index = $scope.productos.indexOf(codigo)
      		$scope.productos.splice(index,1);
		}
	     
	
	};
	



}

function buscaProvedorCtrl($scope, $location, $http){

	$scope.tituloBP = "Busqueda de Provedores";
	$scope.pagina = 0;
	$scope.totalProvedores = 0;
	$scope.limite = 10;
	$scope.totalpaginas = 0;
	$scope.inicio = 0;
	$scope.fin = 10;


	$http({

		method:'GET',
		url:'http://localhost:8888/exinventario/api/provedores'

	 }).success( function (data) {

		$scope.provedores = data;
		$scope.totalProvedores = data.length;

	 }).error( function (data){

		alert(data);
		
	 });

	$scope.Paginas = function(){

		$scope.totalpaginas = Math.ceil($scope.totalProvedores / $scope.limite);

		return $scope.totalpaginas;

	}
	
	$scope.elimina = function(codigo) {

	  var index = $scope.provedores.indexOf(codigo)
      $scope.provedores.splice(index,1);   
	
	};
	



}

function entradasCtrl($scope, $routeParams, $location, $http){

	$scope.tituloE = "Entradas de " + $routeParams.local;
	$scope.ruta = $routeParams.ruta;
	$scope.mensaje = '';
	$scope.entrada = { codigo:'', descripcion:'', cantidad:0 , fecha:'' };

	$http({
		method:'get',
		url:'data/productos.json'
	}).success( function (data) {
		$scope.productos = data;
	}).error( function (data){
		alert(data);
	});

	$scope.actualiza = function(){

			$scope.mensaje = 'Entrada Registrada';
			$scope.entrada.fecha = angular.element( "#datepicker" ).val();
			$scope.entrada.cantidad = parseInt($scope.entrada.cantidad) + parseInt($scope.ingresa);
			console.log($scope.entrada);
		

	}

	$scope.muestra = function(codigoIn ,cantidadIn ,descripcionIn){

		$scope.entrada.codigo = codigoIn;
		$scope.entrada.descripcion = descripcionIn;
		$scope.entrada.cantidad = cantidadIn;

		// console.log($scope.entrada);
	}

	


}


function homeCtrl($scope, $location, $rootScope){

	$rootScope.nombre = 'Administrador'
	$scope.titulo= "Bienvenido " + $rootScope.nombre;
	angular.element('li a').on('click',function(datos){
		var color = datos.currentTarget.parentElement.id;
		MuestraColor(color);
	});



}

function localesCtrl ($scope , $location, $http){

	$scope.tituloL = 'Locales Activos';
	$http({
		method:'get',
		url:'data/locales.json'
	}).success( function (data) {
		$scope.locales = data;
	}).error( function (data){
		alert(data);
	});

	angular.element('li a:last').on('click',function(datos){
		var color = datos.currentTarget.parentElement.id;
		MuestraColor(color);
	});

}

function loginCtrl ($scope, $location){

	$scope.titulo = "Bienvenido a Sistema de Inventario"
	$scope.vendedor="Oficina";
	$scope.datos ={ username:'' , password:'' };
	
	$scope.login = function (){
		
		if ($scope.username === 'admin') {

			$location.path('/ventas/'+ $scope.vendedor)

		}else{
			alert('tu no eres administrador');			
		}
			
		
	}

}

//Alta de Notas

function notasCtrl ($scope, $location, $http){

	$scope.tituloN = "Mis Notas"

	$http({
		method:'get',
		url:'data/notas.json'
	 }).success( function (data) {
		$scope.notas = data;
	 }).error( function (data){
		alert(data);
	 });

	 angular.element("li").on('mouseover',function(){

	 		angular.element(".elimina").show('slow');

	 });

	 $scope.regresacolor = function(color){
	 	MuestraColor(color);
	 }

	
	

}

function nuevaNotaCtrl ($scope, $http, $location,$rootScope){

	$scope.tituloN2 = "Nueva Nota";
	$scope.notas = {nota:'',usuario:'administrador'};

	$scope.guardar = function(){


	}

}

//modulo alta de producto

function productoCtrl($scope, $location, $http){
	
	 $scope.tituloP = 'Alta de Producto';
	 $scope.producto = {
	 	codigo:'',
	 	descripcion:'',
	 	precioC:'',
	 	precioV:'',
	 	provedor:'',
	 	fecha:''
	 }
	 $scope.mensaje = '';
	 $scope.muestra = '';

	 $http({
		method:'GET',
		url:'http://localhost:8888/exinventario/api/provedores'
	 }).success( function (data) {
		$scope.provedores = data;
	 }).error( function (data){
		alert(data);
	 });

	$scope.agrega = function(provedor){

		$scope.producto.provedor = provedor;
		$scope.muestra = '';

	}
	$scope.limpiar = function(){

		$scope.mensaje = '';
	}

	$scope.guardar = function(){

	 	// $scope.mensaje = 'Producto Guardado Correctamente';
		$scope.producto.fecha = angular.element( "#datepicker" ).val();
		$http({

			method:'POST',
			url:'http://localhost:8888/exinventario/api/productos',
			contentType: 'application/json',
			dataType: "json",
			data:$scope.producto
			
		}).success( function (data) {

			$scope.mensaje = data.mensaje;

		}).error( function (data){

			$scope.mensaje = data.error;

		});

	 }
	 


}




function provedoresCtrl($scope,$http){

	$scope.tituloPr = "Alata de Provedores";
	$scope.mensaje = '';
	$scope.provedor = {provedor:'',contacto:'', telefono:'', correo:''};

	$scope.guardar = function(){

		$http({

			method:'POST',
			url:'http://localhost:8888/exinventario/api/provedores',
			contentType: 'application/json',
			dataType: "json",
			data:$scope.provedor

		}).success( function (data) {

			
			$scope.mensaje = data.mensaje;

		}).error( function (data){

			$scope.mensaje = data.error;

		});
		
	}

	$scope.limipar = function(){

		$scope.mensaje = '';
		$scope.provedor = {provedor:'',contacto:'', telefono:'', correo:''};

	}
}

function ventasCtrl ($scope, $routeParams, $location, $http){

	$scope.tituloV ="Alta de una Venta en " + $routeParams.vendedor;
	$scope.ruta = $routeParams.ruta;
	$scope.muestra = '';
	$scope.ventas =[];
	$scope.nota ={nota:'',fecha:'',total:0};
	$scope.mensaje = '';
	$scope.alerta = '';

	$http({

		method:'GET',
		url:'http://localhost:8888/exinventario/api/productos'

	 }).success( function (data) {

		$scope.productos = data;

	 }).error( function (data){

		alert(data);

	 });
	
	$scope.rellena = function ( id , cantidad, producto){
	
		$scope.descripcion = producto;
		$scope.precio = cantidad;
		$scope.id = id;
		$scope.total = $scope.cantidad * cantidad;
		$scope.muestra = '';

	
	}
	
	$scope.agrega = function(){
	
		$scope.ventas.push({
			"id":$scope.id,
			"cantidad":$scope.cantidad,
			"descripcion":$scope.descripcion,
			"total":$scope.total
		});
		
		$scope.nota.total += $scope.total;
		$scope.id = '';
		$scope.cantidad ='';
		$scope.descripcion='';
		$scope.total='';
		$scope.precio='';
	}

	$scope.limpiar = function(){
		
		$scope.muestra = '';
		$scope.nota ={nota:'',fecha:'',total:0};
		$scope.ventas =[];
		$scope.cantidad ='';
		$scope.descripcion='';
		$scope.total='';
		$scope.precio='';
		$scope.nota = '';
		$scope.mensaje = '';
		$scope.alerta = '';

	}

	$scope.guardar = function(){

		console.log($scope.ventas)
		console.log($scope.nota)
		$scope.mensaje = 'Venta Registrada Correctamente';
		$scope.alerta = 'si';
	}

	$scope.elimina = function(codigo,dinero) {

		
	  var index = $scope.ventas.indexOf(codigo)
	  $scope.nota.total -= dinero;
      $scope.ventas.splice(index,1);   
	
	};
	
}