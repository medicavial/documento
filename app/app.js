//creamos la aplicacion
var app = angular.module('app', [
    'ngRoute',
    'angularFileUpload',
    'ngAnimate',
    'ngGrid',
    'ngIdle',
    'ngProgress',
    'webStorageModule',
    'uxGenie',
    'ngJsonExportExcel',
    'angular.filter',
    'ngMessages',
    'ngFileUpload'



]);

//ip prueba
app.constant('api','http://localhost/apimv/public/api/')
app.constant('publicfiles','http://localhost/apimv/public/exports/')
app.constant('xml','http://localhost/apimv/public/FacturasPagos/')


//ip produccion
// app.constant('api','http://172.17.10.15/apimv/public/api/')
// app.constant('publicfiles','http://172.17.10.15/apimv/public/exports/');


// var notificaciones = new Firebase("https://medicavial.firebaseio.com/notificaciones");


