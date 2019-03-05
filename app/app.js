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
    'ngFileUpload',
    'xeditable'

]);

//ip prueba
// app.constant('api','http://172.17.10.58/apimv/public/api/')
// app.constant('publicfiles','http://172.17.10.58/apimv/public/exports/')
// app.constant('xml','http://172.17.10.58/apimv/public/FacturasPagos/')
// app.constant('xmlFE','http://172.17.10.58/apimv/public/FacturasPagos/xmltemporal/')

// app.constant('api','http://localhost/apimv/public/api/');
// app.constant('publicfiles','http://localhost/apimv/public/exports/');
// app.constant('complementos','http://localhost/apimv/public/');
// app.constant('xml','http://localhost/apimv/public/FacturasPagos/');
// app.constant('xmlNC','http://localhost/apimv/public/FacturasPagos/NC/');



//ip produccion
app.constant('api','http://172.17.10.15/apimv/public/api/');
app.constant('publicfiles','http://172.17.10.15/apimv/public/exports/');
app.constant('xml','http://172.17.10.15/apimv/public/FacturasPagos/');
app.constant('complementos','http://172.17.10.15/apimv/public/');
app.constant('xmlNC','http://172.17.10.15/apimv/public/FacturasPagos/NC/');

// var xml = new Firebase("http://www.medicavial.net/registro");

//app.constant('api','http://172.17.10.15/apimv/public/api/')
//app.constant('publicfiles','http://172.17.10.15/apimv/public/exports/');
