//declaramos nuestra variable mas importante que es nuestra aplicacion como un modulo
var app = angular.module('app',[]);

app.config(function($routeProvider){

	//declaramos nuestras rutas que tomara el sistema
	$routeProvider.when('/almacen',
	{
		templateUrl: 'almacen.html',
		controller: 'almacenCtrl'
	});

	$routeProvider.when('/buscaProducto',
	{
		templateUrl: 'buscaproducto.html',
		controller: 'buscaProductoCtrl'
	});

	$routeProvider.when('/buscaProvedor',
	{
		templateUrl: 'buscaprovedor.html',
		controller: 'buscaProvedorCtrl'
	});
	
	$routeProvider.when('/entradas/:local/:ruta', 
	{
		templateUrl:'entradas.html',
		controller:'entradasCtrl'
	});

	$routeProvider.when('/home',
	{
		templateUrl: 'home.html',
		controller: 'homeCtrl'
	});

	
	$routeProvider.when('/login',
	{
		templateUrl: 'login.html',
		controller: 'loginCtrl'
	});

	

	$routeProvider.when('/locales',
	{
		templateUrl: 'locales.html',
		controller: 'localesCtrl'
	});

	$routeProvider.when('/notas',
	{
		templateUrl: 'notas.html',
		controller: 'notasCtrl'
	});

	$routeProvider.when('/nuevanota',
	{
		templateUrl: 'creanota.html',
		controller: 'nuevaNotaCtrl'
	});

	$routeProvider.when('/productos',
	{
		templateUrl: 'producto.html',
		controller: 'productoCtrl'
	});

	$routeProvider.when('/provedores',
	{
		templateUrl: 'provedores.html',
		controller: 'provedoresCtrl'
	});
	
	$routeProvider.when('/ventas/:vendedor/:ruta', 
	{
		templateUrl:'ventas.html',
		controller:'ventasCtrl'
	});

	
	
	$routeProvider.otherwise({ redirectTo :'/home'});

});

//   Creamos el filtro que estamos utilizando desde nuestro HTML
//   para la paginacion y la navegación de las paginas
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    }
});

app.directive('datepicker', function() {
   return function(scope, element, attrs) {
       element.datepicker({
           onSelect: function(dateText) {
           		console.log(dateText);
               var modelo = $(this).attr('ng-model');
               modelo.val(dateText);
               scope.$apply();
           }
       });
   }
});


