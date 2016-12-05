
function decimal(e, field) {
  
  key = e.keyCode ? e.keyCode : e.which
  // backspace
  if (key == 8) return true
  // 0-9
  if (key > 47 && key < 58) {
    if (field.value == "") return true
    regexp = /.[0-9]{2}$/
    return !(regexp.test(field.value))
  }
  // .
  if (key == 46) {
    if (field.value == "") return false
    regexp = /^[0-9]+$/
    return regexp.test(field.value)
  }
  // other key
  return false

}

function utf8_decode(str_data) {


  var tmp_arr = [],
    i = 0,
    ac = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0,
    c4 = 0;

  str_data += '';

  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 <= 191) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if (c1 <= 223) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else if (c1 <= 239) {
      // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      c4 = str_data.charCodeAt(i + 3);
      c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
      c1 -= 0x10000;
      tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
      tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
      i += 4;
    }
  }

  return tmp_arr.join('');

}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    //CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   

    
    //this trick will generate a temp "a" tag
    var link = document.createElement("a");    
    link.id="lnkDwnldLnk";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);

    var csv = CSV;

    blob = new Blob([csv], { type: 'data:application/vnd.ms-excel;charset=utf-8' }); 
    var csvUrl = window.webkitURL.createObjectURL(blob);
    var filename = 'Reporte.csv';
    $("#lnkDwnldLnk")
    .attr({
        'download': filename,
        'href': csvUrl
    }); 

    $('#lnkDwnldLnk')[0].click();    
    document.body.removeChild(link);

}

function JSONToXLSConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    //CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "Reporte_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".xls";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}

//Solo numeros enteros
function entero(e, field) {
  
  key = e.keyCode ? e.keyCode : e.which
  // backspace
  if (key == 8) return true
  // 0-9
  if (key > 47 && key < 58) {
    if (field.value == "") return true
    regexp = /.[0-9]{5}$/
    return !(regexp.test(field.value))
  }
  // other key
  return false

}

//Declaramos fecha actual

// var hoy = new Date();

var hoy = new Date(); 
var dd = hoy.getDate(); 
var mm = hoy.getMonth()+1;//enero es 0! 
if (mm < 10) { mm = '0' + mm; }
if (dd < 10) { dd = '0' + dd; }

var yyyy = hoy.getFullYear();
//armamos fecha para los datepicker
var FechaAct = dd + '/' + mm + '/' + yyyy;
var primerdiames = '01/' + mm + '/' + yyyy;


//bloqueo de sesion
function bloqueoCtrl($scope, webStorage, $rootScope, auth){

	$scope.inicio = function(){

		$scope.usuario = webStorage.session.get('user');
        $scope.nombre = webStorage.session.get('username');;

         webStorage.session.clear();

		$rootScope.username = '';
		$rootScope.mensaje = '';

		$('html').addClass('lockscreen');

	}

	$scope.login = function(){

		
		$rootScope.mensaje = '';
		//console.log($scope.usuario);
        auth.login($scope.usuario, $scope.password);

    }

};


//buscar un folio
function consultaCtrl($scope,$rootScope, find){
	$scope.inicio = function(){

		$scope.tituloCon = "Consulta de Folio(s)";
		$scope.busqueda = false;
		$scope.cargando = false;
		$scope.tipo = 'folio';
		$scope.mensaje = '';
		$scope.folio = '';
        $scope.lesionado = '';
		$('.btn').button();
		$scope.listado = [];
	}

    $scope.verificaBusqueda = function(){
        if ($scope.tipo == 'folio') {
            $scope.foliosxfolio();
        }else{
            $scope.foliosxlesionado();
        }
    }

	//busqueda de folio especiico
	$scope.foliosxfolio = function(){

        // console.log($scope.folio);
		$('#boton').button('loading');
		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;
		
		find.recepcionxfolio($scope.folio).success( function (data){
        	

    		$('#boton').button('reset');
    		$scope.listado = data;
        	$scope.busqueda = true;
			$scope.cargando = false;

		});



	}

	//busqueda de folios x lesionado
	$scope.foliosxlesionado = function(){

		$('#boton').button('loading');
		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;

		find.recepcionxlesionado($scope.lesionado).success( function (data){

    		$('#boton').button('reset');
    		$scope.listado = data;
        	$scope.busqueda = true;
			$scope.cargando = false;
			
		});

	}

};


//carga el historico del folio
function historialCtrl($scope,$routeParams, $rootScope, datos, loading){

    loading.despedida();
    // console.log($routeParams.folio);
    $scope.historias = datos.data;
    $scope.info = datos.data[0];

    // console.log($scope.historias);

	$scope.inicio = function(){

		$scope.tituloTL = "Historial del Folio";
		$scope.cargar = false;
		$scope.numero = false;
		$scope.historial = false;
		$scope.mensaje = '';
	}
	
};


//buscar un folio en el flujo
function consultaFlujoCtrl($scope,$rootScope, find){

	$scope.inicio = function(){

		$scope.tituloCF = "Consulta de Folio en Flujo";
		$scope.busqueda = false;
		$scope.cargando = false;

		$scope.mensaje = '';
        $scope.areaEntrega = '';
        $scope.usuarioEntrega = '';
        $scope.observaciones = '';
		$scope.criterio = '';
		$scope.listado = [];
        $scope.datos = [];

        $scope.buscaarea();

	}

    $scope.altausuariosarea = function(area){

        find.usuariosareatodos(area).success( function (data){

            $scope.usuarios = data;

         });
       
    }

    $scope.buscaarea = function(){
        find.areaoperativa().success(function (data){
            $scope.areas = data;
        });
    }

	//busqueda de folio especiico
	$scope.buscaFlujo = function(){

		$scope.mensaje = '';
		$scope.busqueda = false;
		$scope.cargando = true;
		
		find.listadofolio($scope.criterio).success( function (data){
        	
            if (data) {
            	$scope.listado  = data;
            	$scope.busqueda = true;
    			$scope.cargando = false;
            }else{
                $scope.mensaje = 'No se encontraron datos';
            }

		});

	}

    $scope.preparaEntrega = function(index){
        var folio = $scope.listado[index];
        console.log(folio);
        $('#modalF').modal('show');
    }

    $scope.generaEntrega = function(){
        
    }

};



bloqueoCtrl.$inject = ['$scope', 'webStorage', '$rootScope', 'auth'];
consultaCtrl.$inject = ['$scope','$rootScope', 'find'];
historialCtrl.$inject = ['$scope','$routeParams', '$rootScope', 'datos', 'loading'];
consultaFlujoCtrl.$inject = ['$scope','$rootScope', 'find'];


app.controller('bloqueoCtrl', bloqueoCtrl);
app.controller('consultaCtrl', consultaCtrl);
app.controller('historialCtrl', historialCtrl);
app.controller('consultaFlujoCtrl',consultaFlujoCtrl);

